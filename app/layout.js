import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { MoodGlowProvider } from "./context/MoodGlowContext";

export const metadata = {
  title: "Feelvie",
  description: "AI-powered movie recommender using OpenAI + OMDb.",
  icons: {
    icon: "/feelvie-logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Inder&family=Inria+Sans:ital,wght@0,400;0,700;1,400&family=Inclusive+Sans:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-slate-100 antialiased">
<AuthProvider>
        <WatchlistProvider>
          <MoodGlowProvider>{children}</MoodGlowProvider>
        </WatchlistProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
