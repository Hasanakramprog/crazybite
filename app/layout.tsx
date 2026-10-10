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
      <head>
        {/* Suppress Netlify HUD / "Powered by Netlify" floating badge */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem('nl-hud:public:v1', 'hidden');
                localStorage.setItem('nl-hud:owner-private:v1', 'hidden');
              } catch (e) {}

              if (typeof MutationObserver !== 'undefined') {
                var nlObserver = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var added = mutations[i].addedNodes;
                    for (var j = 0; j < added.length; j++) {
                      var node = added[j];
                      if (node && node.nodeType === 1) {
                        if (
                          node.id === 'nl-badge-frame' ||
                          node.id === 'nl-hud-frame' ||
                          (node.tagName === 'IFRAME' && ((node.title && /netlify/i.test(node.title)) || (node.id && /^nl-/.test(node.id)))) ||
                          (node.tagName === 'SCRIPT' && ((node.dataset && node.dataset.nfVariant) || (node.src && node.src.indexOf('/hud') !== -1)))
                        ) {
                          node.remove();
                        }
                      }
                    }
                  }
                });
                nlObserver.observe(document.documentElement, { childList: true, subtree: true });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#0E0E0E] text-white selection:bg-[#F5C518] selection:text-black">
        {children}
      </body>
    </html>
  );
}
