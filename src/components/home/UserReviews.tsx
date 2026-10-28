import React from 'react';

const REVIEWS = [
  {
    id: 1,
    name: 'Rohan Verma',
    role: 'Android Developer, Indore',
    review: 'Maine AI App Development course liya, aur sach mein confidence badh gaya! Step-by-step guide is awesome.',
    rating: 5,
    initials: 'RV',
    color: 'bg-purple-500',
  },
  {
    id: 2,
    name: 'Neha Singh',
    role: 'Beginner Coder, Lucknow',
    review: 'Support team bohot helpful hai. Instant response and friendly behaviour! Thanks You B Tech.',
    rating: 5,
    initials: 'NS',
    color: 'bg-blue-500',
  },
  {
    id: 3,
    name: 'Arjun Patel',
    role: 'Software Trainee, Surat',
    review: 'Course ka exam system genuine hai. Certification worth it hai boss!',
    rating: 5,
    initials: 'AP',
    color: 'bg-orange-500',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'UI/UX Designer, Mumbai',
    review: 'The design assets and prompts provided are top-notch. It saves me hours of work every day. Highly recommended!',
    rating: 5,
    initials: 'PS',
    color: 'bg-pink-500',
  },
  {
    id: 5,
    name: 'Rahul Das',
    role: 'Freelance Developer, Kolkata',
    review: 'ChatGPT prompts bundle is a lifesaver. I use it for almost all my freelance projects now. Great value for money.',
    rating: 5,
    initials: 'RD',
    color: 'bg-green-500',
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
