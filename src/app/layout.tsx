import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BCA Department | PSMO College (Autonomous), Tirurangadi',
  description: 'Official portal for the Department of Computer Applications (BCA), PSMO College (Autonomous), Tirurangadi. Program scheduling, student galleries, and departmental information.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bca-theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-slate-100 flex flex-col selection:bg-blue-700 selection:text-white`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 bg-black">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
