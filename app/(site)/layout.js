import Header from "../components/Header";
import Footer from "../components/Footer";
import MoodColorWrapper from "../components/MoodColorWrapper";

export default function SiteLayout({ children }) {
  return (
    <MoodColorWrapper>
      <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </MoodColorWrapper>
  );
}
