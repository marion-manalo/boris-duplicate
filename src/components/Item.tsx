'use client';
import Image from "next/image";
import Card from "./Card";
import { useState } from "react";
import { useSession } from "next-auth/react";
import "./Item.css";

// ItemProps interface
interface ItemProps {
  item: {
    _id: string;
    userId: string;
    ticker: string;
    logoURL: string;
    description: string;
    notes: string;
    reportType: '10-K' | '8-K';
    createdAt?: string;
    stockData?: {
      price: number;
      change: number;
      companyName: string;
    };
  };
  onDelete: (id: string) => void;
}

const Item = ({ item, onDelete }: ItemProps) => {
  const { data: session } = useSession();
  const [logoURL, setLogoURL] = useState(item.logoURL);
  const [notes, setNotes] = useState(item.notes);
  const [stockData] = useState(item.stockData || null);

  // handle edit/update
  const handleUpdate = async (updates: { logoURL: string; notes: string }) => {
    if (!session) {
      alert("Please log in to update items.");
      return;
    }

    try {
      const res = await fetch(`/api/report/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`Failed to update. Status: ${res.status}`);
      }

      const updated = await res.json();
      setLogoURL(updated.logoURL);
      setNotes(updated.notes);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  // handle delete
  const handleDelete = async () => {
    if (!session) {
      alert("Please log in to delete items.");
      return;
    }

    try {
      const res = await fetch(`/api/report/${item._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete. Status: ${res.status}`);
      }

      onDelete(item._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Card
      className="item-card"
      logoURL={logoURL}
      notes={notes}
      reportId={item._id}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    >
      <div className="item-image-container">
        <Image src={logoURL} alt={item.ticker} fill className="item-image" />
      </div>
      <h2 className="item-ticker">
        <strong>{stockData?.companyName}</strong> ({item.ticker})
      </h2>

      {stockData && (
        <p className="item-stock-price">
          Price: ${stockData.price.toFixed(2)}{' '}
          {(() => {
            const previousPrice = stockData.price - stockData.change;
            const percentChange = (stockData.change / previousPrice) * 100;
            const changeColor = percentChange >= 0 ? 'green' : 'red';
            const formattedChange = percentChange.toFixed(2);

            return (
              <span style={{ color: changeColor }}>
                {percentChange >= 0 && '+'}
                {stockData.change.toFixed(2)} ({formattedChange}%)
              </span>
            );
          })()}
        </p>
      )}

      <p className="item-description"><strong>Notes:</strong> {notes}</p>
    </Card>
  );
};

export default Item;
