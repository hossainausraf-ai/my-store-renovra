'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle, HelpCircle, X, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'ভুল ইমেইল বা পাসওয়ার্ড!');
      }
    } catch {
      setError('সার্ভারে সংযোগ করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#111111]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.3)] mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard Login</h1>
          <p className="text-xs text-gray-400">আপনার অ্যাডমিন Gmail ও সিকিউর পাসওয়ার্ড দিন</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
              অ্যাডমিন Gmail / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="renovrait@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                পাসওয়ার্ড
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                placeholder="আপনার অ্যাডমিন পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                অ্যাডমিন প্যানেলে প্রবেশ করুন
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← মূল ওয়েবসাইটে ফিরে যান
          </Link>
        </div>

      </div>

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111827] border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                অ্যাডমিন পাসওয়ার্ড কীভাবে রিসেট করবেন?
              </h3>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl space-y-1.5">
                <p className="font-bold text-blue-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  ১. লোকাল কম্পিউটারে রিসেট করার উপায়:
                </p>
                <p className="text-gray-400 pl-5">
                  আপনার প্রোজেক্ট ফোল্ডারের <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">.env.local</code> ফাইলে যান এবং <code className="text-yellow-300 bg-black/40 px-1 py-0.5 rounded">ADMIN_PASSWORD=নতুন_পাসওয়ার্ড</code> লিখে সেভ করুন।
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-xl space-y-1.5">
                <p className="font-bold text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  ২. লাইভ সাইটে (Vercel) রিসেট করার উপায়:
                </p>
                <p className="text-gray-400 pl-5">
                  আপনার <b>Vercel ড্যাশবোর্ড</b> ➔ <b>Settings</b> ➔ <b>Environment Variables</b>-এ যান। সেখানে <code className="text-yellow-300 bg-black/40 px-1 py-0.5 rounded">ADMIN_PASSWORD</code> পরিবর্তন করে সেভ করলেই সাথে সাথে পাসওয়ার্ড রিসেট হয়ে যাবে!
                </p>
              </div>

              <p className="text-[11px] text-gray-400 text-center pt-2">
                যেহেতু এই অ্যাক্সেস শুধুমাত্র প্রজেক্টের মালিকের কাছে থাকে, তাই কেউ কখনো আপনার সাইট হ্যাক বা লক করতে পারবে না।
              </p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              বুঝেছি (Close)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
