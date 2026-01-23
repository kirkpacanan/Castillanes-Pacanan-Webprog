import "./globals.css";

export const metadata = {
  title: "CineSense AI",
  description: "AI-powered movie recommender using OpenAI + OMDb."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
