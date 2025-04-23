'use client';

import './Dash.css';
import Items from '@/components/Items';
import { useSession } from 'next-auth/react';


export default function PublicDash() {
  const { data: session, status } = useSession();
  console.log(session?.user);

  if (status === 'loading') {
    return <p>Loading dashboard...</p>;
  }

  return (
    <main>
      <div className="publicdash-container">
        <h1 className="publicdash-title">Welcome to the Stock Dashboard</h1>
        <p className="publicdash-p">  Welcome, { session?.user?.username || 'Userrr'}.
        </p>
        <Items />
      </div>
    </main>
  );
}
