import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </>
  );
}
