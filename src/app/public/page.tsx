'use client';

import './PublicDash.css';
import PublicItems from '@/components/PublicItems';
import { useSession } from 'next-auth/react';


export default function PublicDash() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading dashboard...</p>;
  }

  // return public page
  return (
    <main>
      <div className="publicdash-container">
        <h1 className="publicdash-title">Welcome to the Stock Dashboard</h1>
        <p className="publicdash-p">  Log in to start building your own portfolio.
        </p>
        <PublicItems />
      </div>
    </main>
  );
}
