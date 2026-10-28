'use client';

import { defaultSettings } from '@/data/settings';
import { Settings as SettingsIcon, Phone, CreditCard, Send, ShieldCheck, FileCode } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">সাইট ও পেমেন্ট সেটিংস</h1>
        <p className="text-gray-400 text-sm">
          আপনার ফ্রি ইকোসিস্টেমের বর্তমান সেটিংস ও পেমেন্ট নম্বর তালিকা।
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">কীভাবে পেমেন্ট নম্বর বা সেটিংস পরিবর্তন করবেন?</p>
          <p className="text-gray-300 leading-relaxed">
            কোনো ডাটাবেজ চার্জ বা লিমিটেশন ছাড়া চালানোর জন্য আপনার সমস্ত সেটিংস 
            <code className="text-white bg-black/40 px-2 py-0.5 rounded mx-1 font-mono">src/data/settings.ts</code> 
            ফাইলে রাখা হয়েছে। নম্বর বা তথ্য পরিবর্তন করতে ফাইলটিতে এডিট করে GitHub-এ পুশ করলেই তা স্বয়ংক্রিয়ভাবে লাইভ হয়ে যাবে।
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Numbers */}
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <CreditCard className="w-5 h-5 text-pink-400" /> বর্তমান পেমেন্ট নম্বরসমূহ
          </h2>

          <div className="space-y-4 text-sm">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-pink-400 font-bold uppercase tracking-wider block mb-1">bKash Personal</span>
              <p className="text-lg font-mono font-bold text-white">{defaultSettings.bkash_number}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider block mb-1">Nagad Personal</span>
              <p className="text-lg font-mono font-bold text-white">{defaultSettings.nagad_number}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-1">Bank Transfer</span>
              <p className="text-sm font-medium text-white">{defaultSettings.bank_transfer_number}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider block mb-1">RedotPay ID</span>
              <p className="text-lg font-mono font-bold text-white">{defaultSettings.redotpay_id}</p>
            </div>
          </div>
        </div>

        {/* Telegram & Support Config */}
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Send className="w-5 h-5 text-blue-400" /> Telegram ও সাপোর্ট সেটিংস
          </h2>

          <div className="space-y-4 text-sm">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-1">Telegram Bot Status</span>
              <p className="text-sm text-gray-300">
                অর্ডার আসার সাথে সাথে আপনার টেলিগ্রাম বটের মাধ্যমে মোবাইলে ইনস্ট্যান্ট নোটিফিকেশন পৌঁছে যায়।
              </p>
              <div className="mt-2 text-xs text-gray-400 font-mono">
                Environment: TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-green-400 font-bold uppercase tracking-wider block mb-1">Support WhatsApp</span>
              <p className="text-lg font-mono font-bold text-white">+{defaultSettings.support_whatsapp}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block mb-1">Admin Security</span>
              <p className="text-sm text-gray-300">
                অ্যাডমিন লগইন পাসওয়ার্ড পরিবর্তন করতে <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">ADMIN_PASSWORD</code> পরিবেশ ভ্যারিয়েবলটি ব্যবহার করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
