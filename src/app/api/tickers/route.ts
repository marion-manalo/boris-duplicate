import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Request tickers
export async function GET(request: NextRequest) {
  try {
    const filePath = path.resolve(process.cwd(), 'tickers.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const tickers = JSON.parse(raw);
    return NextResponse.json(Object.values(tickers), { status: 200 });
  } catch (error) {
    console.error('Error reading tickers.json:', error);
    return NextResponse.json({ error: 'Unable to load tickers' }, { status: 500 });
  }
}
