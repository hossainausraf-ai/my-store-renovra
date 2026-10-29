import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import LiveSalesNotification from '@/components/ui/LiveSalesNotification';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTopButton />
      <LiveSalesNotification />
      <CartDrawer />
    </CartProvider>
  );
}
