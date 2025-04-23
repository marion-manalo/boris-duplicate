import Navbar from "../components/Navbar";
import "./globals.css";
import {SessionProvider } from 'next-auth/react';

// root
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <Navbar/>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
