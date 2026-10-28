import React from 'react';

const REVIEWS = [
  {
    id: 1,
    name: 'Anik Rahman',
    role: 'Digital Marketer, Dhaka',
    review: 'Renovra থেকে ChatGPT Plus আর Canva Pro নিয়েছি। অর্ডার করার ৫ মিনিটের মাথায় এক্সেস পেয়েছি। প্রতি মাসে হাজার হাজার টাকা বেঁচে যাচ্ছে!',
    rating: 5,
    initials: 'AR',
    color: 'bg-[#ccff00] text-black',
  },
  {
    id: 2,
    name: 'Tanvir Ahmed',
    role: 'Freelance Designer, Chittagong',
    review: 'Envato Elements আর ডিজাইন এসেটস সার্ভিসটা অসাধারণ! কোনো লগইন প্রবলেম হলে WhatsApp-এ সাথে সাথে রেসপন্স পাওয়া যায়।',
    rating: 5,
    initials: 'TA',
    color: 'bg-emerald-500 text-white',
  },
  {
    id: 3,
    name: 'Nusrat Jahan',
    role: 'Content Creator, Sylhet',
    review: 'Monica AI Pro আর AI রাইটিং বান্ডেলটা আমার ডেইলি কনটেন্ট ক্রিয়েশনে লাইফসেভার। ১০০% জেনুইন ও ট্রাস্টেড সার্ভিস!',
    rating: 5,
    initials: 'NJ',
    color: 'bg-cyan-500 text-white',
  },
  {
    id: 4,
    name: 'Sabbir Hossain',
    role: 'SEO Specialist, Rajshahi',
    review: 'এসইও এবং প্রিমিয়াম টুলসের জন্য সেরা ও সাশ্রয়ী প্ল্যাটফর্ম। bKash আর বাংলা কিউআর দিয়ে পেমেন্ট করাও অনেক সহজ।',
    rating: 5,
    initials: 'SH',
    color: 'bg-purple-500 text-white',
  },
  {
    id: 5,
    name: 'Farhana Akter',
    role: 'UI/UX Designer, Dhaka',
    review: 'কুইক ভিউ ফিচার আর ইনস্ট্যান্ট এক্টিভেশন দারুণ। প্রিমিয়াম টুলস এত কম খরচে পাওয়ার সুবিধা সত্যি প্রশংসনীয়।',
    rating: 5,
    initials: 'FA',
    color: 'bg-pink-500 text-white',
  }
];

export default function UserReviews() {
  // Duplicate reviews to create a seamless infinite scrolling loop
  const displayReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-20 px-4 bg-transparent border-t border-white/5 relative overflow-hidden">

      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Hear From Our Happy Users</h2>
        <p className="text-gray-400 text-lg">
          See what developers, students, and creators are saying about their experience with our platform.
        </p>
      </div>

      {/* Scrolling Container */}
      <div className="max-w-4xl mx-auto h-[600px] overflow-hidden relative" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>

        <div className="flex flex-col gap-6 animate-marquee-vertical hover:[animation-play-state:paused]">
          {displayReviews.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-[var(--surface)] backdrop-blur-sm border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>
                  {item.initials}
                </div>

                <div className="flex-1">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-300 mb-4 text-lg">"{item.review}"</p>

                  {/* User Info */}
                  <div>
                    <h4 className="text-white font-bold">{item.name}</h4>
                    <p className="text-gray-500 text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
