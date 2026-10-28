import Link from 'next/link';

interface DigitalProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function DigitalProductCard({ product }: { product: DigitalProductProps }) {
  return (
    <div className="bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">

      {/* Product Image Cover */}
      <div className="h-64 w-full bg-[#111] relative overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-600 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image mb-2 opacity-50">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-bold tracking-wider uppercase text-blue-400 mb-1">{product.category}</p>
        <h3 className="text-lg font-bold leading-tight text-white mb-2 flex-1">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black tracking-tight text-white">৳ {product.price}</span>

          <Link
            href={`/checkout?pkgId=${product.id}`}
            className="bg-[#B3E600] text-black hover:bg-[#9cbd00] px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_5px_15px_rgba(179,230,0,0.2)]"
          >
            Add
          </Link>
        </div>
      </div>
    </div>
  );
}
