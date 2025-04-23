import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const headers = {
  'User-Agent': 'FilingViewer/1.0 (my@gmail.com)',
  'Accept': 'application/json'
};

interface TickerEntry {
  ticker: string;
  cik_str: string | number;
  title?: string;
}

// Load ticker-to-CIK map from tickers.json
const getCIK = (ticker: string): string | null => {
  const filePath = path.resolve(process.cwd(), 'tickers.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const tickers: Record<string, TickerEntry> = JSON.parse(raw);
  const item = Object.values(tickers).find(
    (entry) => entry.ticker.toUpperCase() === ticker.toUpperCase()
  );

  return item?.cik_str ? String(item.cik_str).padStart(10, '0') : null;
};

const fetchFilings = async (cik: string) => {
  const url = `https://data.sec.gov/submissions/CIK${cik}.json`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch filings');
  return res.json();
};

// generate Gemini API request using SEC EDGAR filings
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ticker = searchParams.get('ticker');
  const formType = searchParams.get('formType');

  if (!ticker || !formType) {
    return NextResponse.json({ error: 'Missing ticker or formType' }, { status: 400 });
  }

  try {
    const cik = getCIK(ticker);
    console.log('Resolved CIK:', cik);

    if (!cik) {
      return NextResponse.json({ error: 'CIK not found' }, { status: 404 });
    }

    const data = await fetchFilings(cik);
    console.log('Fetched SEC data:', JSON.stringify(data?.filings?.recent?.form?.slice(0, 5), null, 2));

    const filings = data.filings.recent;
    const index = filings.form.findIndex(
      (f: string) => f.toUpperCase() === formType.toUpperCase()
    );
    console.log('Form index found at:', index);


    if (index === -1) {
      return NextResponse.json({ error: `${formType} filing not found` }, { status: 404 });
    }

    const accession = filings.accessionNumber[index];
    const doc = filings.primaryDocument[index];
    const accNoPlain = accession.replace(/-/g, '');
    const filingUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${accNoPlain}/${doc}`;

    const html = await (await fetch(filingUrl, { headers })).text();
    const $ = cheerio.load(html);
    const report = $('body').text();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give me a short, concise, numbered, human-friendly summary of the following ${formType} SEC filing. For each numbered point, include an [INFO: explanation of why this point matters or what the implications are], directly after the point. Do not use asterisks or Markdown formatting. Do not include the word "Implication" or "Explanation" — just the [INFO: ...] bracket with the content. Start with: "This is a summary of ${ticker}'s ${formType} filing." \n\n ${report}`
    });

    return NextResponse.json({ summary: response.text }, { status: 200 });
  } catch (err) {
    console.error('Error generating summary:', err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
