import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/ui/navbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClauseVader",
  description: "The Dark Side of Contract Analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <NavBar /> {}
        {children}
      </body>
    </html>
  );
}
