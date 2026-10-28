import StarBorder from '@/components/ui/StarBorder';

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center pt-32 pb-24 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Contact Us</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Have questions or need support? We're here to help. Reach out to us via WhatsApp or Email.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--surface)] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">WhatsApp</h2>
            <p className="text-gray-400 mb-6 text-sm">Fastest way to get support</p>
            <StarBorder
              as="a"
              href="https://wa.me/8801766392692?text=Hello"
              target="_blank"
              color="cyan"
              speed="5s"
              backgroundColor="#25D366"
              borderColor="rgba(255,255,255,0.1)"
              thickness={2}
              className="w-full hover:scale-105 active:scale-95 transition-all"
            >
              Chat on WhatsApp
            </StarBorder>
          </div>

          <div className="bg-[var(--surface)] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M12 14l9-7-9 7-9-7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email</h2>
            <p className="text-gray-400 mb-6 text-sm">For business inquiries</p>
            <StarBorder
              as="a"
              href="mailto:support@renovra.com"
              color="purple"
              speed="5s"
              backgroundColor="#9333EA"
              borderColor="rgba(255,255,255,0.1)"
              thickness={2}
              className="w-full hover:scale-105 active:scale-95 transition-all"
            >
              Send an Email
            </StarBorder>
          </div>
        </div>
      </div>
    </main>
  );
}
