import Link from 'next/link';

interface PackageProps {
  id: string;
  badge: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  colorFrom: string;
  colorTo: string;
  isPopular?: boolean;
}

export default function PackageCard({ pkg }: { pkg: PackageProps }) {
  return (
    <div className={`relative rounded-2xl border bg-[var(--surface)] p-6 flex flex-col transition-all hover:-translate-y-1 ${pkg.isPopular ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40' : 'border-white/10 hover:border-blue-500/40'}`}>

      {pkg.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
          Most Popular
        </div>
      )}

      <div className={`h-1 w-12 rounded-full bg-gradient-to-r mb-4 ${pkg.colorFrom} ${pkg.colorTo}`}></div>
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-500 mb-2">{pkg.badge}</p>
      <h3 className="text-lg font-bold leading-tight min-h-[3rem] text-white">{pkg.name}</h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-black tracking-tight text-white">৳ {pkg.price}</span>
        <span className="text-sm text-gray-400">/{pkg.period}</span>
      </div>

      <Link
        href={`/checkout?pkgId=${pkg.id}`}
        className={`mt-5 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm transition-all ${pkg.isPopular ? 'bg-[#B3E600] text-black shadow-[0_0_15px_rgba(179,230,0,0.4)] hover:bg-[#9cbd00]' : 'bg-transparent border border-blue-500/40 text-blue-500 hover:bg-blue-500/10'}`}
      >
        Get Started
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>

      <div className="mt-6 pt-5 border-t border-white/10 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Plan includes</p>
        <ul className="space-y-2.5">
          {pkg.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check text-blue-500 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
