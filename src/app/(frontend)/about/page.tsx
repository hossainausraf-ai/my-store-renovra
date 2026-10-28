export default function AboutPage() {
  return (
    <main className="flex flex-col items-center pt-32 pb-24 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">About Us</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Welcome to Renovra, your ultimate destination for premium digital tools, software subscriptions, and creative resources. 
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p>
                At Renovra, our mission is to empower creators, developers, and businesses by providing affordable access to world-class digital tools. We believe that premium software shouldn't be a luxury, but an accessible utility for everyone who wants to build something great.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Premium Subscriptions:</strong> Access to a wide variety of software tools at a fraction of the cost.</li>
                <li><strong>Digital Products:</strong> High-quality templates, resources, and e-books for your projects.</li>
                <li><strong>Reliable Support:</strong> Our dedicated team is always here to help you get the most out of your tools.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
              <p>
                We prioritize instant delivery, secure payments, and a seamless user experience. When you choose Renovra, you are choosing a partner dedicated to your digital success.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
