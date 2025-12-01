import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";

// 1. Configure the Premium Serif Font (Headings/Brand)
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// 2. Configure the Clean Clinical Sans Font (Body text)
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: "corium.ai | Clinical Intelligence for Your Skin",
  description: "Generate a hyper-personalized skincare protocol based on biometric analysis and dermatological conflict logic.",
  icons: {
    icon: '/icon-192.png',        
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "corium.ai | Clinical Intelligence for Your Skin",
    description: "Generate a hyper-personalized skincare protocol based on biometric analysis and dermatological conflict logic.",
       images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "corium.ai preview",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "corium.ai | Clinical Intelligence for Your Skin",
    description: "Generate a hyper-personalized skincare protocol based on biometric analysis and dermatological conflict logic.",
    images: ['/opengraph-image.png'],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#FAFAF9] text-stone-900 antialiased selection:bg-[#d4a373] selection:text-white">
        {children}
      </body>
    </html>
  );
}