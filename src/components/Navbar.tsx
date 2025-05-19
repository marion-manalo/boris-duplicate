'use client';

import Image from 'next/image';
import { useState } from 'react';
import logo from '@/assets/boris.png';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

// navbar declare states
const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      router.push('/login');
    }
  };

  const handleDashboardClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // return navbar setup and styled
  return (
    <nav className='bg-[#E2E6EA] border-b border-gray-400'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className='md:hidden p-2 text-gray-700 hover:bg-gray-300 rounded-md'
          >
            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-16 6h16' />
            </svg>
          </button>

          {/* Logo and Title */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <Image src={logo} alt='Boris logo' width={40} height={40} className='h-10 w-auto' />
              <span className='ml-2 text-xl font-bold text-gray-700'>Boris</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex flex-1 ml-8'>
            <div className='flex space-x-4'>
              <Link href='/' className='text-gray-700 hover:text-gray-900'>Home</Link>
              <Link href='/about' className='text-gray-700 hover:text-gray-900'>About</Link>
              <Link href='/contact' className='text-gray-700 hover:text-gray-900'>Contact</Link>
              <button onClick={handleDashboardClick}>
                Dashboard
              </button>
            </div>
          </div>

          {/* Auth Button with Welcome Message */}
          <div className='hidden md:flex items-center space-x-4'>
            {session && (
              <p className='text-gray-700'>
                Welcome, {session.user?.username || 'User'}
              </p>
            )}
            <button
              onClick={handleAuthClick}
              className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
            >
              {session ? 'Logout' : 'Login/Sign up'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-[#E2E6EA] p-4'>
          <Link href='/' className='block text-gray-700 py-2'>Home</Link>
          <Link href='/about' className='block text-gray-700 py-2'>About</Link>
          <Link href='/contact' className='block text-gray-700 py-2'>Contact</Link>
          <button onClick={handleDashboardClick}>Dashboard</button>
          <button
            onClick={handleAuthClick}
            className='w-full bg-gray-500 text-white mt-2 py-2 rounded-md hover:bg-gray-600'
          >
            {session ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
