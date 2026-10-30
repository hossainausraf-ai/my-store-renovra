'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { defaultProducts, Product } from '@/data/products';
import { defaultSettings } from '@/data/settings';
import { 
  Package, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  X, 
  Search,
  Building2,
  Smartphone,
  QrCode,
  Copy,
  Check,
  TicketPercent,
  Tag,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const pkgId = searchParams.get('pkgId') || '';
  const isFromCartParam = searchParams.get('cart') === 'true';

  const {
    items: cartItems,
    subtotal: cartSubtotal,
    appliedCoupon: cartCoupon,
    discountAmount: cartDiscountAmount,
    finalTotal: cartFinalTotal,
    clearCart
  } = useCart();

  const shouldSelectCartInitially = (isFromCartParam || (!pkgId && cartItems.length > 0)) && cartItems.length > 0;

  const createCartProduct = (items: typeof cartItems, subtotal: number) => {
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      id: 'cart-order',
      product_type: 'subscription',
      name: `Shopping Cart (${totalCount}টি আইটেম)`,
      description: items.map(i => `${i.name} (x${i.quantity})`).join(', '),
      price: subtotal,
      category: 'Shopping Cart',
      validity: '1 Month',
      features: items.map(i => `${i.name} (x${i.quantity}) - ৳${i.price * i.quantity}`),
      image_url: items[0]?.imageUrl || '',
      gallery_images: items.map(i => i.imageUrl).filter(Boolean) as string[],
      color_from: 'from-[#ccff00]/40',
      color_to: 'to-emerald-500/20'
    };
  };

  const [product, setProduct] = useState<any>(
    shouldSelectCartInitially ? createCartProduct(cartItems, cartSubtotal) : null
  );
  const [isLoadingProduct, setIsLoadingProduct] = useState(!shouldSelectCartInitially);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [trxIdInput, setTrxIdInput] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cellfin' | 'bank_transfer' | 'bangla_qr' | 'redotpay'>('bkash');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedTrxId, setSubmittedTrxId] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>(defaultProducts);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    pkgId ? pkgId : (shouldSelectCartInitially ? 'cart-order' : (defaultProducts[0]?.id || ''))
  );
  const [siteSettings, setSiteSettings] = useState<any>(defaultSettings);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>('');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const originalPrice = product ? Number(product.price) || 0 : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : originalPrice;

  useEffect(() => {
    if (product) {
      setSelectedGalleryImg(product.image_url || product.gallery_images?.[0] || '');
    }
  }, [product?.id]);

  const allProductImages = (product ? [
    ...(product.image_url ? [product.image_url] : []),
    ...(Array.isArray(product.gallery_images) ? product.gallery_images : [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx) : []) as string[];

  const currentDisplayImage = selectedGalleryImg || product?.image_url || allProductImages[0] || '';

  // Synchronize cart product if selectedProductId is 'cart-order'
  useEffect(() => {
    if (selectedProductId === 'cart-order' && cartItems.length > 0) {
      setProduct(createCartProduct(cartItems, cartSubtotal));
      setIsLoadingProduct(false);
    }
  }, [cartItems, cartSubtotal, selectedProductId]);

  // When coming with cart=true or without pkgId, activate cart once cartItems arrives
  useEffect(() => {
    if ((isFromCartParam || (!pkgId && cartItems.length > 0)) && cartItems.length > 0 && selectedProductId !== 'cart-order' && !pkgId) {
      setSelectedProductId('cart-order');
      setProduct(createCartProduct(cartItems, cartSubtotal));
      setIsLoadingProduct(false);
    }
  }, [isFromCartParam, pkgId, cartItems.length, selectedProductId]);

  // Auto-apply cart coupon if cart is selected
  useEffect(() => {
    if (selectedProductId === 'cart-order' && cartCoupon && !appliedCoupon) {
      setAppliedCoupon({
        code: cartCoupon.code,
        discountType: cartCoupon.discount_type,
        discountValue: cartCoupon.discount_value,
        discountAmount: cartDiscountAmount,
        finalPrice: cartFinalTotal
      });
      setCouponSuccess(`কুপন কোড ${cartCoupon.code} কার্ট থেকে সফলভাবে যুক্ত হয়েছে!`);
    }
  }, [selectedProductId, cartCoupon, appliedCoupon, cartDiscountAmount, cartFinalTotal]);

  useEffect(() => {
    // Check if user is logged in to pre-fill their info
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.user.name) setCustomerName(data.user.name);
          if (data.user.phone) {
            setPhone(data.user.phone);
            setWhatsappNumber(data.user.phone);
          }
        }
      })
      .catch(() => {});

    // Fetch live settings (bKash/Nagad numbers)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(e => console.warn('Checkout settings load fallback:', e));

    // Fetch live products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const prodList = (data.success && data.products?.length > 0) ? data.products : defaultProducts;
        setAllProducts(prodList);
        if (pkgId) {
          const found = prodList.find((p: any) => p.id === pkgId);
          if (found) {
            setProduct(found);
            setSelectedProductId(found.id);
          } else {
            setProduct(prodList[0]);
            setSelectedProductId(prodList[0]?.id || '');
          }
        } else if (!isFromCartParam && cartItems.length === 0) {
          if (prodList.length > 0) {
            setProduct(prodList[0]);
            setSelectedProductId(prodList[0].id);
          }
        }
      })
      .catch(e => {
        console.warn('Checkout products load fallback:', e);
        if (pkgId) {
          const found = defaultProducts.find((p) => p.id === pkgId);
          if (found) setProduct(found);
        }
      })
      .finally(() => {
        setIsLoadingProduct(false);
      });
  }, [pkgId, isFromCartParam, cartItems.length]);


  const validateCouponCode = async (codeToValidate: string, currentProd: any) => {
    if (!codeToValidate || !codeToValidate.trim()) {
      setCouponError('দয়া করে একটি কুপন কোড লিখুন।');
      return;
    }
    if (!currentProd) return;

    setIsCheckingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToValidate.trim().toUpperCase(),
          productId: currentProd.id,
          productType: currentProd.product_type || 'subscription',
          price: Number(currentProd.price) || 0
        })
      });

      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discount_type,
          discountValue: data.coupon.discount_value,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice
        });
        setCouponSuccess(data.message || `কুপন কোড ${data.coupon.code} সফলভাবে প্রয়োগ হয়েছে!`);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || 'অবৈধ বা অপ্রযোজ্য কুপন কোড।');
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      setCouponError('কুপন যাচাইকরণে ত্রুটি হয়েছে।');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    validateCouponCode(couponInput, product);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProductId(id);
    if (id === 'cart-order') {
      const cartProd = createCartProduct(cartItems, cartSubtotal);
      setProduct(cartProd);
      if (cartCoupon) {
        setAppliedCoupon({
          code: cartCoupon.code,
          discountType: cartCoupon.discount_type,
          discountValue: cartCoupon.discount_value,
          discountAmount: cartDiscountAmount,
          finalPrice: cartFinalTotal
        });
      } else if (appliedCoupon) {
        validateCouponCode(appliedCoupon.code, cartProd);
      }
    } else {
      const found = allProducts.find(p => p.id === id);
      if (found) {
        setProduct(found);
        if (appliedCoupon) {
          validateCouponCode(appliedCoupon.code, found);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!selectedProductId) {
      setError('দয়া করে একটি প্যাকেজ বা পণ্য নির্বাচন করুন।');
      setIsLoading(false);
      return;
    }

    if (!customerName.trim()) {
      setError('দয়া করে আপনার নাম লিখুন।');
      setIsLoading(false);
      return;
    }

    const cleanWhatsapp = (whatsappNumber || phone).trim();
    if (!cleanWhatsapp) {
      setError('দয়া করে আপনার WhatsApp নম্বর দিন।');
      setIsLoading(false);
      return;
    }

    if (finalPrice > 0 && !proofFile) {
      setError('দয়া করে পেমেন্টের স্ক্রিনশট আপলোড করুন।');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('phone', cleanWhatsapp);
      formData.append('whatsapp', cleanWhatsapp);
      formData.append('customerName', customerName.trim());
      formData.append('packageId', selectedProductId);
      
      if (selectedProductId === 'cart-order') {
        const itemNames = cartItems.map(i => `${i.name} (x${i.quantity})`).join(', ');
        formData.append('packageName', `Shopping Cart (${cartItems.length} Tools: ${itemNames})`);
      } else {
        formData.append('packageName', product?.name || 'Product');
      }

      formData.append('price', String(finalPrice));
      formData.append('originalPrice', String(originalPrice));
      if (appliedCoupon) {
        formData.append('couponCode', appliedCoupon.code);
        formData.append('discountAmount', String(discountAmount));
      }
      formData.append('paymentMethod', paymentMethod);
      formData.append('trxId', trxIdInput);
      if (currentUser?.id) formData.append('userId', currentUser.id);
      if (proofFile) formData.append('proof', proofFile);

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSubmittedOrderId(data.orderId);
        setSubmittedTrxId(data.trxId);
        setIsSubmitted(true);
        if (selectedProductId === 'cart-order' || isFromCartParam) {
          clearCart();
        }
      } else {
        setError(data.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      console.error(err);
      setError('নেটওয়ার্ক সমস্যা। দয়া করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    const isCart = selectedProductId === 'cart-order' && cartItems.length > 0;
    const itemsTableRows = isCart
      ? cartItems.map(i => `
          <tr class="item">
            <td>${i.name} (x${i.quantity}) [${i.validity || '1 Month'}]</td>
            <td>৳ ${i.price * i.quantity}</td>
          </tr>
        `).join('')
      : `
          <tr class="item">
            <td>${product?.name}</td>
            <td>৳ ${originalPrice}</td>
          </tr>
        `;

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - ${product?.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; color: #555; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 5px; vertical-align: top; }
            .invoice-box table tr.top table td { padding-bottom: 20px; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.details td { padding-bottom: 20px; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .logo { font-size: 28px; font-weight: bold; color: #000; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">Renovra</div>
              <div>
                Order ID: ${submittedOrderId || 'RNV-PENDING'}<br>
                Date: ${new Date().toLocaleDateString()}<br>
                Status: Pending Verification
              </div>
            </div>
            <table>
              <tr class="details">
                <td colspan="2">
                  ${customerName ? `<strong>Customer Name:</strong> ${customerName}<br>` : ''}
                  <strong>Customer Phone:</strong> ${phone}<br>
                  <strong>WhatsApp:</strong> ${whatsappNumber || phone}<br>
                  <strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}<br>
                  <strong>Transaction ID:</strong> ${submittedTrxId}
                </td>
              </tr>
              <tr class="heading">
                <td>Item</td>
                <td>Price</td>
              </tr>
              ${itemsTableRows}
              ${appliedCoupon ? `
              <tr class="item" style="color: #059669;">
                <td>Coupon Discount (${appliedCoupon.code})</td>
                <td>- ৳ ${discountAmount}</td>
              </tr>
              ` : ''}
              <tr class="total">
                <td></td>
                <td>Total: ৳ ${finalPrice}</td>
              </tr>
            </table>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(invoiceContent);
      win.document.close();
    }
  };

  if (isLoadingProduct || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 py-12 bg-[#111827]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 px-3 py-1 rounded-full mb-3 inline-block">
          Order Submitted Successfully
        </span>

        <h2 className="text-3xl font-extrabold text-white mb-2">ধন্যবাদ! আপনার অর্ডার গৃহীত হয়েছে</h2>
        
        <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
          আমাদের টিম আপনার পেমেন্টটি যাচাই করছে। অর্ডার স্ট্যাটাস এবং অ্যাক্সেস বিস্তারিত জানতে নিচের অপশনগুলো ব্যবহার করুন।
        </p>

        {/* Order Details Card */}
        <div className="bg-[#1F2937]/50 border border-white/5 rounded-2xl p-4 text-left mb-8 max-w-md mx-auto text-sm space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Order ID:</span>
            <span className="text-white font-mono font-bold">{submittedOrderId}</span>
          </div>
          {customerName && (
            <div className="flex justify-between text-gray-400">
              <span>Customer Name:</span>
              <span className="text-white font-bold">{customerName}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-400">
            <span>Product:</span>
            <span className="text-white font-bold">{product?.name}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-emerald-400">
              <span>Applied Coupon:</span>
              <span className="font-mono font-bold">{appliedCoupon.code} (-৳{discountAmount})</span>
            </div>
          )}
          <div className="flex justify-between text-gray-400">
            <span>Amount:</span>
            <span className="text-white font-bold">৳ {finalPrice}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>TrxID:</span>
            <span className="text-white font-mono">{submittedTrxId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md mx-auto">
          <a
            href={`https://wa.me/${(siteSettings?.support_whatsapp || '8801766392692').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello, I just ordered "${product?.name}" (Order ID: ${submittedOrderId}, Name: ${customerName || 'N/A'}, Phone: ${phone}). Please verify my payment.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center py-3.5 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition shadow-lg shadow-[#25D366]/20 text-sm"
          >
            WhatsApp-এ নক দিন
          </a>

          <Link
            href={`/track?q=${encodeURIComponent(phone)}`}
            className="flex-1 inline-flex items-center justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 text-sm gap-2"
          >
            <Search className="w-4 h-4" /> অর্ডার ট্র্যাক করুন
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={handleDownloadInvoice}
            className="text-gray-400 hover:text-white underline transition"
          >
            Download Invoice
          </button>
          <span className="text-gray-600">•</span>
          <Link href="/" className="text-gray-400 hover:text-white underline transition">
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const getPaymentDetails = () => {
    if (paymentMethod === 'bkash') {
      return {
        name: 'bKash Personal',
        number: siteSettings?.bkash_number || defaultSettings.bkash_number,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        type: 'phone',
        instructions: 'bKash অ্যাপ বা *247# থেকে সেন্ড মানি করুন এবং TrxID নিচে লিখুন।'
      };
    }
    if (paymentMethod === 'cellfin') {
      return {
        name: 'CellFin (IBBL)',
        number: siteSettings?.cellfin_number || defaultSettings.cellfin_number,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        type: 'phone',
        instructions: 'CellFin অ্যাপে Send Money ➔ CellFin / Account-এ পাঠিয়ে TrxID নিচে দিন।'
      };
    }
    if (paymentMethod === 'bank_transfer') {
      return {
        name: 'Bank Transfer (ব্যাংক একাউন্ট)',
        number: siteSettings?.bank_transfer_number || defaultSettings.bank_transfer_number,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        type: 'bank',
        instructions: 'ব্যাংক অ্যাপ বা শাখা থেকে ফান্ড ট্রান্সফার করে ট্রানজ্যাকশন আইডি বা রেফারেন্স লিখুন।'
      };
    }
    if (paymentMethod === 'bangla_qr') {
      return {
        name: 'বাংলা কিউআর (Bangla QR)',
        number: siteSettings?.bangla_qr_details || defaultSettings.bangla_qr_details || 'যেকোনো ব্যাংক বা ওয়ালেট অ্যাপ দিয়ে স্ক্যান করে সরাসরি পেমেন্ট করুন।',
        qrUrl: siteSettings?.bangla_qr_url || defaultSettings.bangla_qr_url,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        type: 'qr',
        instructions: 'যেকোনো ব্যাংক বা ওয়ালেট (bKash, CellFin, Citytouch, Astha, Upay) দিয়ে নিচের বাংলা কিউআর স্ক্যান করে পেমেন্ট করুন।'
      };
    }
    return {
      name: 'RedotPay ID',
      number: siteSettings?.redotpay_id || defaultSettings.redotpay_id,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      type: 'phone',
      instructions: 'RedotPay বা Binance Pay দিয়ে পেমেন্ট করে TrxID দিন।'
    };
  };

  const paymentConfig = getPaymentDetails();

  return (
    <div className="max-w-5xl mx-auto mt-6 lg:mt-10 mb-20 px-4">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> হোমে ফিরে যান
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">নিরাপদ চেকআউট (Checkout)</h1>
          <p className="text-gray-400 mt-2">পেমেন্ট সম্পন্ন করে অর্ডারটি কনফার্ম করুন</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
          <ShieldCheck className="w-4 h-4" />
          <span>SSL & Telegram Verified</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
          <div className="bg-[var(--surface)] p-6 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.color_from || 'from-blue-500'} ${product.color_to || 'to-purple-500'}`}></div>

            <h3 className="font-bold text-lg text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" /> Order Summary
            </h3>

            {/* Product Switcher Dropdown */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>পণ্য / প্যাকেজ নির্বাচন করুন</span>
                {selectedProductId === 'cart-order' && (
                  <span className="text-[10px] text-[#ccff00] font-extrabold flex items-center gap-1 bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-full">
                    <ShoppingBag className="w-3 h-3" /> কার্ট সিলেক্টেড
                  </span>
                )}
              </label>
              <select
                value={selectedProductId}
                onChange={handleProductChange}
                className="block w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#ccff00] text-sm cursor-pointer shadow-inner"
              >
                {cartItems.length > 0 && (
                  <option value="cart-order" className="bg-gray-900 text-[#ccff00] font-extrabold">
                    🛒 আপনার কার্ট ({cartItems.length}টি টুলস) — ৳{cartSubtotal}
                  </option>
                )}
                {allProducts.some(p => p.product_type === 'subscription' || !p.product_type) && (
                  <optgroup label="প্যাকেজ ও সাবস্ক্রিপশন" className="bg-gray-900 text-gray-400 font-bold">
                    {allProducts.filter(p => p.product_type === 'subscription' || !p.product_type).map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900 text-white font-normal">
                        {p.name} — ৳{p.price}
                      </option>
                    ))}
                  </optgroup>
                )}
                {allProducts.some(p => p.product_type === 'single_tool') && (
                  <optgroup label="সিঙ্গেল এআই টুলস" className="bg-gray-900 text-gray-400 font-bold">
                    {allProducts.filter(p => p.product_type === 'single_tool').map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900 text-white font-normal">
                        {p.name} — ৳{p.price}
                      </option>
                    ))}
                  </optgroup>
                )}
                {allProducts.some(p => p.product_type === 'digital') && (
                  <optgroup label="ডিজিটাল প্রোডাক্টস" className="bg-gray-900 text-gray-400 font-bold">
                    {allProducts.filter(p => p.product_type === 'digital').map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900 text-white font-normal">
                        {p.name} — ৳{p.price}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Cart Items List or Single Product Display */}
            {selectedProductId === 'cart-order' ? (
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#ccff00]" />
                    কার্টে থাকা পণ্যসমূহ ({cartItems.length}টি)
                  </span>
                  <Link href="/#single-tools" className="text-[11px] text-[#ccff00] hover:underline font-bold">
                    + আরও টুল যোগ করুন
                  </Link>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-xs text-amber-300 font-medium mb-2">আপনার কার্ট বর্তমানে খালি আছে।</p>
                    <Link href="/#single-tools" className="inline-block text-xs font-bold bg-[#ccff00] text-black px-3 py-1.5 rounded-lg">
                      টুলস ব্রাউজ করুন
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <div className="w-full h-full bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] font-black text-xs">
                              {item.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-medium">
                              {item.validity || '1 Month'}
                            </span>
                            <span>পরিমাণ: {item.quantity}টি</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-[#ccff00]">
                            ৳{item.price * item.quantity}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-[9px] text-gray-500">(৳{item.price} each)</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Main Picture Display (Large & Clear) */}
                <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-black/60 border border-white/10 group shadow-2xl flex items-center justify-center mb-3">
                  {currentDisplayImage ? (
                    <img
                      src={currentDisplayImage}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${product.color_from || 'from-gray-800'} ${product.color_to || 'to-black'}`}>
                      <Package className="w-12 h-12 text-white/40 mb-2" />
                      <span className="text-xs text-gray-400 font-bold">{product.name}</span>
                    </div>
                  )}

                  {/* Category Badge overlay on top left */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#ccff00] border border-[#ccff00]/30 px-2.5 py-1 rounded-full shadow-lg">
                      {product.category || 'Package'}
                    </span>
                  </div>

                  {/* Photo counter on top right */}
                  {allProductImages.length > 1 && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="text-[10px] font-bold bg-black/75 backdrop-blur-md text-white/90 border border-white/20 px-2 py-0.5 rounded-full shadow-lg">
                        {Math.max(1, allProductImages.indexOf(currentDisplayImage) + 1)} / {allProductImages.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip (৪-৫ টি ছোট আইকন - Click to change main picture) */}
                {allProductImages.length > 1 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                      {allProductImages.map((imgUrl, idx) => {
                        const isSelected = imgUrl === currentDisplayImage;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedGalleryImg(imgUrl)}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-black/50 shrink-0 cursor-pointer ${
                              isSelected
                                ? 'border-[#B3E600] ring-2 ring-[#B3E600]/40 scale-105 shadow-md shadow-[#B3E600]/25'
                                : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                            }`}
                            title={`ছবি ${idx + 1} দেখুন`}
                          >
                            <img
                              src={imgUrl}
                              alt={`${product.name} thumbnail ${idx + 1}`}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                      <span>💡 যেকোনো ছবিতে ক্লিক করে বড় করে দেখুন</span>
                    </p>
                  </div>
                )}

                {/* Product Title & Info */}
                <div className="mb-4 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {product.name}
                  </h4>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.validity && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                      <span>মেয়াদ: {product.validity}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Coupon Code Input & Applied State */}
            <div className="border-t border-white/10 pt-4 pb-2">
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <TicketPercent className="w-4 h-4 text-blue-400" />
                  ডিসকাউন্ট কুপন (Coupon)
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    প্রযুক্ত হয়েছে
                  </span>
                )}
              </label>

              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="কুপন কোড (যেমন: WELCOME10)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                          setCouponError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            validateCouponCode(couponInput, product);
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isCheckingCoupon || !couponInput.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCheckingCoupon ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>যাচাই হচ্ছে...</span>
                        </>
                      ) : (
                        <span>প্রয়োগ করুন</span>
                      )}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                      <X className="w-3 h-3 shrink-0" /> {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{appliedCoupon.code}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `৳${appliedCoupon.discountValue} OFF`}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80">
                      আপনি ৳{discountAmount} ছাড় পেয়েছেন!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
                    title="কুপন মুছুন"
                  >
                    <X className="w-4 h-4" />
                    <span>মুছুন</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6 border-t border-white/10 pt-4">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Subtotal</span>
                <span>৳ {originalPrice}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon ({appliedCoupon.code})
                  </span>
                  <span>- ৳ {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-green-400 text-sm">
                <span>Delivery Fee</span>
                <span>FREE (Instant)</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-gray-400 font-medium">সর্বমোট প্রদেয় মূল্য</span>
              <div className="text-right">
                {appliedCoupon && (
                  <span className="text-sm line-through text-gray-500 block mr-1">৳ {originalPrice}</span>
                )}
                <span className="text-3xl font-extrabold text-white">৳ {finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {finalPrice > 0 && (
            <div className="bg-[var(--surface)] p-6 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> পেমেন্ট নির্দেশিকা
              </h3>
              <ul className="text-sm text-gray-400 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>আপনার পেমেন্ট মেথড নির্বাচন করুন (bKash / Bank Transfer / CellFin / Bangla QR)।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>প্রদত্ত নম্বরে <strong>৳ {finalPrice}</strong> সেন্ড মানি করুন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>পেমেন্ট সফল হলে স্ক্রিনশট নিন অথবা TrxID কপি করুন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span>ফর্মটি পূরণ করে "Verify & Complete Order"-এ ক্লিক করুন।</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
            {finalPrice > 0 && (
              <>
                <h3 className="font-bold text-xl text-white mb-4">পেমেন্ট মেথড বেছে নিন</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
                  {/* bKash */}
                  <label className={`cursor-pointer rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.25)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="bkash" className="hidden" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                    <span className="font-bold text-sm mb-0.5">bKash</span>
                    <span className="text-[10px] opacity-70">Personal</span>
                  </label>

                  {/* CellFin */}
                  <label className={`cursor-pointer rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'cellfin' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="cellfin" className="hidden" checked={paymentMethod === 'cellfin'} onChange={() => setPaymentMethod('cellfin')} />
                    <span className="font-bold text-sm mb-0.5">CellFin</span>
                    <span className="text-[10px] opacity-70">IBBL</span>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`cursor-pointer rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="bank_transfer" className="hidden" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                    <span className="font-bold text-sm mb-0.5">Bank</span>
                    <span className="text-[10px] opacity-70">Transfer</span>
                  </label>

                  {/* Bangla QR */}
                  <label className={`cursor-pointer rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bangla_qr' ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="bangla_qr" className="hidden" checked={paymentMethod === 'bangla_qr'} onChange={() => setPaymentMethod('bangla_qr')} />
                    <span className="font-bold text-sm mb-0.5">Bangla QR</span>
                    <span className="text-[10px] opacity-70">Any App</span>
                  </label>
                </div>

                {/* Account Number / QR Details Box */}
                <div className={`p-5 rounded-2xl border ${paymentConfig.border} ${paymentConfig.bg} mb-6 transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-bold text-sm ${paymentConfig.color} flex items-center gap-1.5`}>
                      {paymentMethod === 'bkash' && <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>}
                      {paymentMethod === 'cellfin' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                      {paymentMethod === 'bank_transfer' && <Building2 className="w-4 h-4 text-blue-400" />}
                      {paymentMethod === 'bangla_qr' && <QrCode className="w-4 h-4 text-purple-400" />}
                      {paymentConfig.name}
                    </span>
                    <div className="text-xs font-bold text-white/90 bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                      টাকার পরিমাণ: <span className="text-[#ccff00] font-mono">৳ {finalPrice}</span>
                    </div>
                  </div>

                  {/* If Bangla QR */}
                  {paymentConfig.type === 'qr' && (
                    <div className="flex flex-col sm:flex-row items-center gap-5 pt-2 pb-2">
                      <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-white p-3 shadow-2xl border border-white/20 flex items-center justify-center shrink-0">
                        {paymentConfig.qrUrl ? (
                          <img 
                            src={paymentConfig.qrUrl} 
                            alt="Bangla QR Code" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500 text-center p-2">
                            <QrCode className="w-12 h-12 mb-1 text-purple-600" />
                            <span className="text-[11px] font-semibold">বাংলা কিউআর</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2.5 text-center sm:text-left">
                        <p className="text-sm font-bold text-white">কিউআর কোড স্ক্যান করে পেমেন্ট করুন</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{paymentConfig.instructions}</p>
                        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                          {['bKash', 'CellFin', 'City Touch', 'Astha', 'Upay'].map(app => (
                            <span key={app} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If Bank Transfer */}
                  {paymentConfig.type === 'bank' && (
                    <div className="space-y-3 pt-1">
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-200 font-mono leading-relaxed whitespace-pre-wrap select-all">
                        {paymentConfig.number}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">{paymentConfig.instructions}</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.number)}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors shrink-0"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If bKash or CellFin */}
                  {paymentConfig.type === 'phone' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-2.5">
                        <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider select-all">{paymentConfig.number}</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.number)}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{paymentConfig.instructions}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="space-y-5">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  আপনার নাম <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 text-sm"
                />
              </div>

              {/* WhatsApp Number (Primary contact number) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>আপনার WhatsApp নম্বর</span>
                    <span className="text-red-400 font-bold">*</span>
                  </span>
                  <span className="text-[11px] text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">বাধ্যতামূলক</span>
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value);
                    setPhone(e.target.value);
                  }}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600 text-sm font-mono"
                />
                <p className="text-[11px] text-green-400/90 mt-1.5 flex items-center gap-1">
                  <span>💬 অর্ডার ভেরিফাই হওয়া মাত্র এই WhatsApp নম্বরে টুলসের লগইন ও এক্সেস পাঠিয়ে দেওয়া হবে।</span>
                </p>
              </div>

              {/* Optional Transaction ID */}
              {finalPrice > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>Transaction ID (TrxID)</span>
                    <span className="text-xs text-gray-400 font-normal bg-white/5 px-2 py-0.5 rounded-full border border-white/10">ঐচ্ছিক (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={trxIdInput}
                    onChange={(e) => setTrxIdInput(e.target.value)}
                    placeholder="যেমন: BLG987654 (না থাকলে ফাঁকা রাখুন)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 text-sm font-mono"
                  />
                </div>
              )}

              {/* Screenshot Upload - Mandatory */}
              {finalPrice > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>পেমেন্টের স্ক্রিনশট আপলোড করুন</span>
                      <span className="text-red-400 font-bold">*</span>
                    </span>
                    <span className="text-[11px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">বাধ্যতামূলক</span>
                  </label>
                  {!proofPreview ? (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 transition-all ${!proofFile ? 'border-amber-500/40 hover:border-amber-400' : 'border-white/10'}`}>
                      <div className="flex flex-col items-center justify-center pt-3 pb-3 text-center px-4">
                        <Upload className="w-6 h-6 text-amber-400 mb-1.5 animate-bounce" />
                        <p className="text-xs text-gray-200">
                          <span className="font-bold text-amber-300">পেমেন্ট সফল হওয়ার স্ক্রিনশট দিন</span> বা ফাইল ড্রপ করুন
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG বা WebP ইমেজ</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProofFile(file);
                            setProofPreview(URL.createObjectURL(file));
                            setError('');
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-36 rounded-xl border border-green-500/30 overflow-hidden group bg-black/40">
                      <img src={proofPreview} alt="Payment Proof" className="w-full h-full object-contain" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded-lg p-1.5 flex items-center gap-2">
                        <span className="text-[11px] text-green-400 font-bold px-1.5 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-green-400" /> স্ক্রিনশট যুক্ত হয়েছে
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setProofFile(null);
                            setProofPreview(null);
                          }}
                          className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition"
                          title="ছবি মুছুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-4 px-6 mt-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-wait text-sm sm:text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    অর্ডার প্রসেস হচ্ছে...
                  </span>
                ) : (
                  finalPrice === 0 ? 'ফ্রি অর্ডার সম্পন্ন করুন' : 'পেমেন্ট ভেরিফাই ও অর্ডার সাবমিট করুন'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      }>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
