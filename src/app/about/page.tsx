import logo from '@/assets/boris.png';
import Image from 'next/image';

// About page
export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-100">
            <div className="flex flex-col items-center min-h-screen bg-white px-4">
                <Image src={logo} alt='Boris logo' width={500} height={500} className='h-150 w-auto' />
                <p>
                    Boris is a stock comparator app designed for college students who are new to investing or exploring it for the future. 
                    It simplifies the stock market with an easy-to-use dashboard, real-time data, and clear summaries of reports like 10-Ks and 8-Ks.
                    Our app breaks down financial jargon, explains key terms, and highlights the importance of major market events. 
                </p>
                <br />
                <p>
                    Whether you're ready to invest or just starting to learn, Boris helps you build financial knowledge and confidence, one stock at a time.    
                </p> 
            </div>
        </main>
    );
}