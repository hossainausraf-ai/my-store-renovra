export interface SiteSettings {
  site_name: string;
  logo_url: string;
  support_whatsapp: string;
  support_phone: string;
  bkash_number: string;
  nagad_number: string;
  bank_transfer_number: string;
  redotpay_id: string;
  telegram_channel?: string;
}

export const defaultSettings: SiteSettings = {
  site_name: 'Renovra',
  logo_url: '',
  support_whatsapp: '8801766392692',
  support_phone: '01766392692',
  bkash_number: '01766392692 (Personal)',
  nagad_number: '01766392692 (Personal)',
  bank_transfer_number: 'Islami Bank Bangladesh / City Bank (Contact WhatsApp for Account details)',
  redotpay_id: '12345678 (RedotPay ID)',
  telegram_channel: '@renovra'
};
