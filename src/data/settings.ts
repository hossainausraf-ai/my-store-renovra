export interface SiteSettings {
  site_name: string;
  logo_url: string;
  support_whatsapp: string;
  support_phone: string;
  bkash_number: string;
  bank_transfer_number: string;
  cellfin_number: string;
  bangla_qr_url: string;
  bangla_qr_details?: string;
  redotpay_id?: string;
  telegram_channel?: string;
}

export const defaultSettings: SiteSettings = {
  site_name: 'Renovra',
  logo_url: '',
  support_whatsapp: '8801766392692',
  support_phone: '01766392692',
  bkash_number: '01766392692 (Personal / Send Money)',
  bank_transfer_number: 'ব্যাংক: City Bank / Islami Bank | হিসাবের নাম: Md Nayem Hossain | একাউন্ট নম্বর: 2201928384001 | শাখা: Dhaka | রাউটিং: 225272648',
  cellfin_number: '01766392692 (CellFin / IBBL)',
  bangla_qr_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
  bangla_qr_details: 'যেকোনো ব্যাংক অ্যাপ বা ওয়ালেট (bKash, CellFin, City Touch, Astha, Upay) দিয়ে এই বাংলা কিউআর (Bangla QR) স্ক্যান করে পেমেন্ট করুন।',
  redotpay_id: '12345678 (RedotPay ID)',
  telegram_channel: '@renovra'
};
