import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "NEXUS // Sci-Fi Movie Finder",
  description: "Search and discover sci-fi movies powered by TMDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${shareTechMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
