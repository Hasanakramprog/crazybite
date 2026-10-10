import type { Metadata, Viewport } from 'next';
import { Outfit, Cairo } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crazy Bites — Digital Menu | Good Food • Bold Flavors • Always Crazy',
  description:
    'Explore Crazy Bites menu: burgers, fajita, philadelphia, charcoal grilled chicken, crispy meals, and shawarma. Order fast on WhatsApp.',
  keywords: ['Crazy Bites', 'Lebanon', 'Burgers', 'Sandwiches', 'Charcoal Chicken', 'Digital Menu'],
  openGraph: {
    title: 'Crazy Bites — Digital Menu',
    description: 'Good Food • Bold Flavors • Always Crazy. Check out our latest menu and prices.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0E0E0E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${outfit.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased bg-[#0E0E0E] text-white selection:bg-[#F5C518] selection:text-black">
        {children}
      </body>
    </html>
  );
}
