import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Contract Audit Scanner',
  description: 'A comprehensive tool for auditing smart contracts and assessing token risks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <BackgroundWrapper>
          <div className="flex flex-col min-h-screen">
            {children}
            <Footer />
          </div>
        </BackgroundWrapper>
      </body>
    </html>
  );
} 