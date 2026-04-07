import { Bungee, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Bungee({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next.js Oppimisdemo - Kehitysjono",
  description: "Yksinkertainen Next.js + SQLite esimerkki",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
