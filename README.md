# Boris
Boris is a stock comparator app designed for college students who are new to investing or exploring it for the future. 
It simplifies the stock market with an easy-to-use dashboard, real-time data, and clear summaries of reports like 10-Ks and 8-Ks.
Our app breaks down financial jargon, explains key terms, and highlights the importance of major market events. 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## External Resources
External Resources Used:

* Gemini API (model 2.0 flash)
    * Used to summarize company filings from the SEC.
* SEC API
    * Used to retrieve company filings based on stock symbol.
* BCrypt
    * Used to hash passwords.
* Cheerio
    * Used to parse the HTML received from the SEC.
* Mongoose
    * Library used to establish schema-based model for use with MongoDB.