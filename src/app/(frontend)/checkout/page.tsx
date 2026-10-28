'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { defaultProducts, Product } from '@/data/products';
import { defaultSettings } from '@/data/settings';
import { Package, ShieldCheck, CreditCard, ArrowLeft, CheckCircle2, Upload, X, Search } from 'lucide-react';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const pkgId = searchParams.get('pkgId') || '';
  
  const [product, setProduct] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [trxIdInput, setTrxIdInput] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedTrxId, setSubmittedTrxId] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  const [allProducts, setAllProducts] = useState<any[]>(defaultProducts);
  const [selectedProductId, setSelectedProductId] = useState<string>(pkgId || defaultProducts[0]?.id || '');
  const [siteSettings, setSiteSettings] = useState<any>(defaultSettings);

  useEffect(() => {
    setAllProducts(defaultProducts);
    setSiteSettings(defaultSettings);

    if (pkgId) {
      const found = defaultProducts.find((p) => p.id === pkgId);
      if (found) {
        setProduct(found);
        setSelectedProductId(found.id);
      } else {
        setProduct(defaultProducts[0]);
        setSelectedProductId(defaultProducts[0]?.id || '');
      }
    } else if (defaultProducts.length > 0) {
      setProduct(defaultProducts[0]);
      setSelectedProductId(defaultProducts[0].id);
    }

    setIsLoadingProduct(false);
  }, [pkgId]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProductId(id);
    const found = allProducts.find(p => p.id === id);
    if (found) setProduct(found);
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

    if (!phone) {
      setError('দয়া করে আপনার ফোন নম্বর দিন।');
      setIsLoading(false);
      return;
    }

    if (product && product.price > 0 && !proofFile && !trxIdInput) {
      setError('দয়া করে পেমেন্টের স্ক্রিনশট আপলোড করুন অথবা TrxID লিখুন।');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('whatsapp', whatsappNumber || phone);
      formData.append('customerName', customerName);
      formData.append('packageId', selectedProductId);
      formData.append('packageName', product?.name || 'Product');
      formData.append('price', String(product?.price || 0));
      formData.append('paymentMethod', paymentMethod);
      formData.append('trxId', trxIdInput);
      if (user?.id) formData.append('userId', user.id);
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
              <tr class="item">
                <td>${product?.name}</td>
                <td>৳ ${product?.price}</td>
              </tr>
              <tr class="total">
                <td></td>
                <td>Total: ৳ ${product?.price}</td>
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
          <div className="flex justify-between text-gray-400">
            <span>Product:</span>
            <span className="text-white font-bold">{product?.name}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Amount:</span>
            <span className="text-white font-bold">৳ {product?.price}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>TrxID:</span>
            <span className="text-white font-mono">{submittedTrxId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md mx-auto">
          <a
            href={`https://wa.me/8801766392692?text=${encodeURIComponent(
              `Hello, I just ordered "${product?.name}" (Order ID: ${submittedOrderId}, Phone: ${phone}). Please verify my payment.`
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
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
      };
    }
    if (paymentMethod === 'bank_transfer') {
      return {
        name: 'Bank Transfer',
        number: siteSettings?.bank_transfer_number || defaultSettings.bank_transfer_number,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
      };
    }
    if (paymentMethod === 'redotpay') {
      return {
        name: 'RedotPay ID',
        number: siteSettings?.redotpay_id || defaultSettings.redotpay_id,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
      };
    }
    return {
      name: 'Nagad Personal',
      number: siteSettings?.nagad_number || defaultSettings.nagad_number,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
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

            <div className="flex items-start gap-4 mb-6">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-xl shadow-lg border border-white/10" />
              ) : (
                <div className={`w-20 h-20 rounded-xl shadow-lg border border-white/10 flex items-center justify-center bg-gradient-to-br ${product.color_from || 'from-gray-800'} ${product.color_to || 'to-black'}`}>
                  <Package className="w-8 h-8 text-white/50" />
                </div>
              )}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded mb-2 inline-block">
                  {product.category || 'Package'}
                </span>

                {allProducts.length > 0 && (
                  <select
                    value={selectedProductId}
                    onChange={handleProductChange}
                    className="block w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold mb-2 focus:outline-none focus:border-blue-500 text-sm appearance-none cursor-pointer"
                  >
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900">
                        {p.name} - ৳{p.price}
                      </option>
                    ))}
                  </select>
                )}

                <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 border-t border-white/10 pt-6">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Subtotal</span>
                <span>৳ {product.price}</span>
              </div>
              <div className="flex justify-between text-green-400 text-sm">
                <span>Delivery Fee</span>
                <span>FREE (Instant)</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-6">
              <span className="text-gray-400 font-medium">সর্বমোট মূল্য</span>
              <span className="text-3xl font-extrabold text-white">৳ {product.price}</span>
            </div>
          </div>

          {/* Payment Instructions */}
          {product.price > 0 && (
            <div className="bg-[var(--surface)] p-6 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> পেমেন্ট নির্দেশিকা
              </h3>
              <ul className="text-sm text-gray-400 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>আপনার পেমেন্ট মেথড নির্বাচন করুন (bKash / Nagad / Bank / RedotPay)।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>প্রদত্ত নম্বরে <strong>৳ {product.price}</strong> সেন্ড মানি করুন।</span>
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
            {product.price > 0 && (
              <>
                <h3 className="font-bold text-xl text-white mb-4">পেমেন্ট মেথড বেছে নিন</h3>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                  <label className={`cursor-pointer rounded-2xl border-2 p-3.5 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-500/10 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="bkash" className="hidden" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                    <div className="font-bold mb-0.5">bKash</div>
                    <div className="text-[10px] opacity-70">Personal</div>
                  </label>

                  <label className={`cursor-pointer rounded-2xl border-2 p-3.5 flex flex-col items-center justify-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="bank_transfer" className="hidden" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                    <div className="font-bold mb-0.5 text-center">Bank</div>
                    <div className="text-[10px] opacity-70">Transfer</div>
                  </label>

                  <label className={`cursor-pointer rounded-2xl border-2 p-3.5 flex flex-col items-center justify-center transition-all ${paymentMethod === 'redotpay' ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/5 hover:border-white/20 text-gray-400 bg-black/20'}`}>
                    <input type="radio" name="method" value="redotpay" className="hidden" checked={paymentMethod === 'redotpay'} onChange={() => setPaymentMethod('redotpay')} />
                    <div className="font-bold mb-0.5">RedotPay</div>
                    <div className="text-[10px] opacity-70">Wallet</div>
                  </label>
                </div>

                {/* Account Number Box */}
                <div className={`p-5 rounded-2xl border ${paymentConfig.border} ${paymentConfig.bg} mb-6 transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-sm ${paymentConfig.color}`}>Send Money to {paymentConfig.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider select-all">{paymentConfig.number}</p>
                    <div className="text-sm font-medium text-white/70 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 self-start sm:self-auto">
                      টাকার পরিমাণ: <span className="text-white font-bold">৳ {product.price}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-5">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  আপনার মোবাইল নম্বর <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 text-sm"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  WhatsApp নম্বর <span className="text-xs text-gray-500 font-normal">(ঐচ্ছিক - ফোন নম্বর এক হলে খালি রাখতে পারেন)</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600 text-sm"
                />
                <p className="text-[11px] text-green-400/90 mt-1.5">
                  অর্ডার কনফার্ম হওয়ার সাথে সাথে এই নম্বরে WhatsApp-এ টুলস এক্সেস ও নোটিফিকেশন পৌঁছে যাবে।
                </p>
              </div>

              {/* Optional Transaction ID */}
              {product.price > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Transaction ID (TrxID) <span className="text-xs text-gray-500 font-normal">(স্ক্রিনশট দিলে ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={trxIdInput}
                    onChange={(e) => setTrxIdInput(e.target.value)}
                    placeholder="যেমন: BLG987654"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 text-sm font-mono"
                  />
                </div>
              )}

              {/* Screenshot Upload */}
              {product.price > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">পেমেন্টের স্ক্রিনশট আপলোড করুন</label>
                  {!proofPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 hover:border-blue-500/50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                        <p className="text-xs text-gray-300"><span className="font-semibold text-blue-400">স্ক্রিনশট বাছাই করুন</span> বা এখানে ড্রপ করুন</p>
                        <p className="text-[10px] text-gray-500">PNG, JPG বা JPEG</p>
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
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 rounded-xl border border-white/10 overflow-hidden group">
                      <img src={proofPreview} alt="Payment Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setProofFile(null);
                            setProofPreview(null);
                          }}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <X className="w-5 h-5" />
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
                  product.price === 0 ? 'ফ্রি অর্ডার সম্পন্ন করুন' : 'পেমেন্ট ভেরিফাই ও অর্ডার সাবমিট করুন'
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
