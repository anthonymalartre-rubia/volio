import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Lead Generator — Prospection automatisée DOM-TOM',
  description: 'Outil de prospection B2B et copropriété pour les DOM-TOM. Recherche Google Places, enrichissement email automatique, export CSV et Zoho CRM.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#09090b] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
