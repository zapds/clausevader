import "./globals.css";
import NavBar from "@/components/ui/navbar"; 
import { getCurrentSession } from "@/lib/server/session";

export const metadata = {
  title: "ClauseVader",
  description: "The Dark Side of Contract Analysis",
};

export default async function RootLayout({ children }) {
  const { user } = await getCurrentSession();
  return (
    <html lang="en">
      <body
        className={`antialiased bg-black text-white`}
      >
        <NavBar user={user} /> {}
        {children}
      </body>
    </html>
  );
}
