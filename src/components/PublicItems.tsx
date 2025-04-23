'use client';
import { useEffect, useState } from 'react';
import Item from './Item';
import './Items.css';

// report interface
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
  stockData: {
    price: number;
    change: number;
    companyName: string;
  };
}

// public items (static data)
const PublicItems = () => {
  const [stockItems, setStockItems] = useState<Report[]>([
    {
      _id: "68059eb95708b9bda9d2c721",
      userId: "67fa749334b6e4c31c059706",
      ticker: "GOOG",
      description: "This is a sample description for GOOG.",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png",
      notes: "Add your personal notes here...",
      reportType: "10-K",
      stockData: {
        price: 153.36,
        change: -2.14,
        companyName: "Alphabet Inc.",
      },
      createdAt: "2025-04-20T18:06:17.737Z",
      summary: "This is a summary of GOOG's 10-K filing.", 
    },
    {
      _id: "68059e0a5708b9bda9d2c70f",
      userId: "67fa749334b6e4c31c059706",
      ticker: "WMT",
      description: "This is a sample description for WMT.",
      logoURL: "https://i5.walmartimages.com/dfw/ecf648a-237c/k2-_6d66b486-7502-401d-939d-c9c1f6f22e11.v1.png",
      notes: "Add your personal notes here...",
      reportType: "10-K",
      stockData: {
        price: 93.22,
        change: 2.03,
        companyName: "Walmart Inc."
      },
      createdAt: "2025-04-20T17:43:22.698Z",
      summary: "This is a summary of WMT's 10-K filing"
    },
    {
      _id: "68059ea85708b9bda9d2c71c",
      userId: "67fa749334b6e4c31c059706",
      ticker: "NVDA",
      description: "This is a sample description for NVDA.",
      logoURL: "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/01-nvidia-logo-vert-500x200-2c50-p.png",
      notes: "Add your personal notes here...",
      reportType: "10-K",
      stockData: {
        price: 101.425,
        change: -3.065,
        companyName: "NVIDIA Corporation"
      },
      createdAt: "2025-04-20T17:46:00.979Z",
      summary: "This is a summary of NVDA's 10-K filing."
    }
    
  ]);
    
    

  // return static/public items
  return (
    <section className="items-section">
      <div className="items-container">
        {stockItems.length === 0 ? (
          <p>No stocks available.</p>
        ) : (
          <div className="items-grid">
            {stockItems.map((item) => (
              <Item
                key={item._id}
                item={item}
                onDelete={() => {
                  setStockItems((prevItems) => prevItems.filter((i) => i._id !== item._id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicItems;
