import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-[#0a0a0a] dark:text-slate-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
