import { Button } from "@/components/ui/button";
import { ShieldAlert, Flame, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Welcome to <span className="text-red-600 drop-shadow-lg">ClauseVader</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            The Dark Side of contract analysis. Uncover red flags. Rewrite with precision. Dominate the legal galaxy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-4 shadow-md shadow-red-500/30">
              <Flame className="mr-2 h-5 w-5" /> Enter the Dark Side
            </Button>
            <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-900 text-lg px-6 py-4">
              <ShieldAlert className="mr-2 h-5 w-5" /> Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-red-900 text-sm text-red-500 bg-black">
        &copy; {new Date().getFullYear()} ClauseVader. Forged in the shadows of Coruscant.
      </footer>
    </div>
  );
}
