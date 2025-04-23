'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import InfoIcon from '@/components/ICard/ICard';
import './Report.css';

interface Report {
  _id: string;
  userId: string;
  ticker: string;
  logoURL: string;
  description: string;
  notes: string;
  createdAt?: string;
  summary?: string;
  stockData?: {
    price: number;
    marketCap: number;
    companyName: string;
    beta: number;
    volume: number;
    change: number;
    range: string;
    dividend: number;
    sector: string;
    dcf: number;
  };
}

const ReportPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch the gemini report
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await res.json();
        setReport(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push('/dashboard');
      }
    };

    fetchReport();
  }, [id, router]);

  // logic for market cap units (shown in stock data section)
  const formatMarketCap = (cap: number) => {
    if (cap >= 1_000_000_000_000) {
      return (cap / 1_000_000_000).toFixed(2) + 'T'
    } else if (cap >= 1_000_000_000) {
      return (cap / 1_000_000_000).toFixed(2) + 'B';
    } else if (cap >= 1_000_000) {
      return (cap / 1_000_000).toFixed(2) + 'M';
    }
    return cap.toLocaleString();
  };

  // logic for average volume units (also in stock data section)
  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000) {
      return (volume / 1_000_000).toFixed(2) + 'M';
    } else if (volume >= 1_000) {
      return (volume / 1_000).toFixed(2) + 'K';
    }
    return volume.toString();
  };

  // show loading while report is being created
  if (loading) return <p>Loading report...</p>;
  if (!report) return <p>Report not found.</p>;

  // return the company name & date, then key information (stock FMP data)
  // then return the 10k-summary using SEC EDGAR & Gemini - in this order
  return (
    // title section
    <div className="report-page">
      <h1 className="title">
        <strong>{report.stockData?.companyName || report.ticker}</strong>
        {report.stockData?.companyName && ` (${report.ticker})`}
        <br></br>
        <span className="date">As of {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </h1>

      <div className="report-card">
        <div className="report-logo">
          <Image src={report.logoURL} alt={report.ticker} width={100} height={100} />
        </div>

        <p><strong>Description:</strong> {report.description}</p>
        <p><strong>Notes:</strong> {report.notes}</p>

        <br></br>
        <hr className="hr" />

        {/* Key Information Section (FMP stock data) */}
        {report.stockData && (
          <div className="stock-section">
            <h2 className="section-title"><strong>Key Information</strong></h2>
            <div className="stock-grid">
              <div className="info">
                <InfoIcon text={
                  `The most recent trading price agreed upon by buyers and sellers.`
                } />
                <strong>Price:</strong> ${report.stockData.price.toFixed(2)}{'  '}
                {(() => {
                  const previousPrice = report.stockData.price - report.stockData.change;
                  const percentChange = (report.stockData.change / previousPrice) * 100;
                  const changeColor = percentChange >= 0 ? 'green' : 'red';
                  const formattedChange = percentChange.toFixed(2);

                  return (
                    <span style={{ color: changeColor }}>
                      {percentChange >= 0 && '+'}
                      {report.stockData.change}{'  '}
                      ({formattedChange}%)
                    </span>
                  );
                })()}
              </div>

              {/* return key info & add infocard explaining each metric */}
              <div className="info">
                <InfoIcon text="The total value of a company's outstanding shares of stock." />
                {' '}<strong>Market Cap:</strong> {formatMarketCap(report.stockData.marketCap)}
              </div>

              <div className="info">
                <InfoIcon text="The total number of shares traded during a given period." />
                {' '}<strong>Volume:</strong> {formatVolume(report.stockData.volume)}
              </div>

              <div className="info">
                <InfoIcon text="A measure of a stock's volatility relative to the overall market." />
                {' '}<strong>Beta:</strong> {report.stockData.beta.toFixed(2)}
              </div>

              <div className="info">
                <InfoIcon text="The highest and lowest prices at which a stock has traded during the past year." />
                {' '}<strong>52 Week Range:</strong> {report.stockData.range}
              </div>

              <div className="info">
                <InfoIcon text="The dollar amount of dividends paid per share." />
                {' '}<strong>Div/Share:</strong> ${report.stockData.dividend.toFixed(2)}
              </div>

              <div className="info">
                <InfoIcon text="The broader industry category the company belongs to." />
                {' '}<strong>Sector:</strong> {report.stockData.sector}
              </div>

              <div className="info">
                <InfoIcon text={
                  `The Discounted Cash Flow (DCF) Price represents the value of a company based on its future cash flows.
                    A DCF price lower than the market price may suggest an overvalued stock.
                    A DCF price higher than the market price may suggest an undervalued stock.`
                } />
                {' '}<strong>DCF Price:</strong> ${report.stockData.dcf.toFixed(2)}
              </div>

              <div className="info">
                <InfoIcon text="Dividend yield shows how much a company pays out in dividends each year relative to its stock price." />
                {' '}<strong>Div Yield:</strong> {((report.stockData.dividend / report.stockData.price) * 100).toFixed(2)}%
              </div>

            </div>
          </div>
        )}

        <br></br>
        <hr className="hr" />

        {/* Summary Section */}
        {report.summary && (
          <div className="summary-section">
            <h2 className="section-title"><strong>10-K Summary</strong></h2>
            {(() => {
              const lines = report.summary.split('\n').filter(Boolean);
              const intro = lines[0];
              const points = report.summary.split(/\n\d+\.\s/).slice(1);

              return (
                <>
                  <p style={{ marginBottom: '1rem' }}>{intro}</p>
                  {points.map((point, i) => {
                    const infoMatch = point.match(/\[INFO:(.+?)\]/);
                    const infoText = infoMatch?.[1]?.trim();
                    const mainText = point.replace(/\[INFO:.+?\]/, '').trim();

                    return (
                      <div key={i} style={{ marginBottom: '1rem' }}>
                        <strong>{i + 1}.</strong> {mainText}{' '}
                        {infoText && <InfoIcon text={infoText} />}
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
