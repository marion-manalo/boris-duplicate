'use client';

import './Welcome.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// welcome page
const Welcome = () => {
  const router = useRouter();
  const { status } = useSession();

  const isLoggedIn = status === 'authenticated';

  const handleRedirect = () => {
    router.push(isLoggedIn ? '/dashboard' : '/public');
  };

  // return welcome container
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">
        Need help with investing?
      </h1>
      <p className="welcome-description">
        Get current insights on any stock using the power of AI.
      </p>
      <h6 className="welcome-subtitle">
        {isLoggedIn ? "Get started!" : "Give Boris a sneak peak!"}
      </h6>

      <button className="welcome-button" onClick={handleRedirect}>
        {isLoggedIn ? "View Dashboard" : "Continue"}
      </button>
    </div>
  );
};

export default Welcome;
