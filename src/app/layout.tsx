import type { Metadata } from "next";
import { Playfair_Display, Special_Elite } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const specialElite = Special_Elite({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Black Lodge — Sci-Fi Cinema",
  description: "The owls are not what they seem. A cult sci-fi film archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${specialElite.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
