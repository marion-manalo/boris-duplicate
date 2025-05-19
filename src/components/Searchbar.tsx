'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './Searchbar.css';

interface Report {
  _id: string;
  userId: string;
  ticker: string;
  logoURL: string;
  description: string;
  notes: string;
  reportType: '10-K' | '8-K';
  createdAt?: string;
  summary?: string;
}

interface SearchbarProps {
  handleSearch: (item: Report) => void;
}
const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

const Searchbar = ({ handleSearch }: SearchbarProps) => {
  const [ticker, setTicker] = useState('');
  const [reportType, setReportType] = useState<'10-K' | '8-K'>('10-K');
  const { data: session } = useSession();
  const router = useRouter();


  const onSearchClick = async () => {
    if (!ticker.trim()) return;
  
    // all searches will be typed uppercase (as stock tickers are professionally)
    const tickerToCheck = ticker.toUpperCase(); 
  
    // try to fetch the ticker data
    interface TickerEntry {
      ticker: string;
      [key: string]: unknown;
    }

    try {
      const tickersRes = await fetch('/api/tickers');
      const tickersList: TickerEntry[] = await tickersRes.json();
      const valid = tickersList.some((entry: TickerEntry) => entry.ticker === tickerToCheck);

      if (!valid) {
        alert(`${tickerToCheck} is not a recognized stock ticker.`);
        return;
      }
    } catch (err) {
      console.error('Error validating ticker:', err);
      alert('There was an error checking the ticker list.');
      return;
    }
  
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }
  
    let stockData = null;
    try {
      const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${tickerToCheck}?apikey=${apiKey}`);
      const data = await res.json();
      const profile = data[0];
  
      // FMP api stock data
      stockData = {
        price: profile.price,
        marketCap: profile.mktCap,
        companyName: profile.companyName,
        beta: profile.beta,
        volume: profile.volAvg,
        change: profile.changes,
        range: profile.range,
        dividend: profile.lastDiv,
        sector: profile.sector,
        dcf: profile.dcf,
      };
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Could not fetch stock data. Please try again.');
      return;
    }
  
    const newItem = {
      userId: session.user.id,
      ticker: tickerToCheck,
      logoURL: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      description: `This is a sample description for ${tickerToCheck}.`,
      notes: 'Add your personal notes here...',
      reportType,
      stockData,
    };
  
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to save report. Status: ${res.status}`);
      }
  
      const savedReport: Report = await res.json();
      console.log('Saved report:', savedReport);
  
      const summaryRes = await fetch(
        `/api/summary?ticker=${savedReport.ticker}&formType=${savedReport.reportType}`
      );
  
      if (!summaryRes.ok) {
        console.warn('Summary generation failed or is unavailable.');
        handleSearch(savedReport);
        setTicker('');
        return;
      }
  
      const { summary } = await summaryRes.json();
  
      const updateRes = await fetch(`/api/report/${savedReport._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });
  
      const updatedReport = await updateRes.json();
      handleSearch(updatedReport);
      setTicker('');
    } catch (err) {
      console.error('Error during report creation:', err);
    }
  };
  
  
  // return search bar
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Enter stock ticker..."
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        className="searchbar-input"
      />

      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value as '10-K' | '8-K')}
        className="searchbar-dropdown"
      > {/* alloq drop down for 10-k or 8-k */}
        <option value="10-K">10-K</option>
        <option value="8-K">8-K</option>
      </select>

      <button onClick={onSearchClick} className="searchbar-button">
        Add
      </button>
    </div>
  );
};

export default Searchbar;
