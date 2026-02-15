import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Feelvie",
  description: "AI-powered movie recommender using OpenAI + OMDb."
};

function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('feelvie_theme');
        var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored === 'light' || stored === 'dark' ? stored : (dark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Inder&family=Inria+Sans:ital,wght@0,400;0,700;1,400&family=Inclusive+Sans:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased dark:bg-[#0a0a0a] dark:text-slate-100">
        <ThemeScript />
        <ThemeProvider>
          <AuthProvider>
            <WatchlistProvider>{children}</WatchlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
