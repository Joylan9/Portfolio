import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com/'),
  title: "Joylan Dsouza ✌️",
  description: "Full-Stack Developer & AI Enthusiast. B.E. in Computer Science & Engineering graduate building scalable web applications and AI-powered solutions.",
  keywords: "Joylan Dsouza, Full-Stack Developer, React Developer, Node.js, Express.js, MongoDB, FastAPI, Python, AI Developer, Three.js, Web Development, TypeScript, Portfolio",
  authors: [{ name: "Joylan Dsouza" }],
  creator: "Joylan Dsouza",
  publisher: "Joylan Dsouza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Joylan Dsouza - Full-Stack Developer",
    description: "Full-Stack Developer & AI Enthusiast. Building scalable web applications and AI-powered solutions.",
    siteName: "Joylan Dsouza's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joylan Dsouza - Developer",
    description: "Full-Stack Developer & AI Enthusiast. Building scalable web applications and AI-powered solutions.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
    </html>
  );
}
