import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Floating pins decoration */}
        <div className="relative mb-8">
          <div className="absolute -top-8 -left-12 text-3xl opacity-40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            {'\u{1F4DA}'}
          </div>
          <div className="absolute -top-4 left-16 text-2xl opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
            {'\u{1F3C0}'}
          </div>
          <div className="absolute top-2 -right-14 text-3xl opacity-40 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }}>
            {'\u{1F3B5}'}
          </div>

          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-3xl font-bold shadow-lg shadow-accent/20">
            3
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-4 max-w-lg">
          Find Your{' '}
          <span className="text-accent">Third Place</span>
        </h1>

        <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-md mb-3">
          Drop a pin. Make a friend.
        </p>

        <p className="text-text-muted text-sm sm:text-base max-w-sm mb-10 leading-relaxed">
          See what&apos;s happening around campus right now. Join a study session, a pickup game,
          or just find someone to grab coffee with.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/auth/login"
            className="flex-1 bg-accent text-white font-semibold py-3.5 px-6 rounded-xl text-center hover:bg-accent-hover transition-colors active:scale-[0.98]"
          >
            Get Started
          </Link>
          <Link
            href="/map"
            className="flex-1 bg-bg-card border border-border text-text-secondary font-medium py-3.5 px-6 rounded-xl text-center hover:text-text-primary transition-colors"
          >
            Explore Map
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['#FF6B6B', '#4ECDC4', '#818CF8', '#F97316'].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-bg-primary flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {['A', 'K', 'M', 'J'][i]}
              </div>
            ))}
          </div>
          <p className="text-text-muted text-sm">
            Join students connecting right now
          </p>
        </div>
      </main>

      {/* Bottom features */}
      <footer className="px-6 pb-10">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4">
          {[
            { emoji: '\u{1F4CD}', label: 'Drop Pins', desc: 'Share what you\'re up to' },
            { emoji: '\u{26A1}', label: 'Real-time', desc: 'See activity as it happens' },
            { emoji: '\u{23F3}', label: 'Ephemeral', desc: 'Pins fade, moments don\'t' },
          ].map((feature) => (
            <div key={feature.label} className="text-center">
              <div className="text-2xl mb-2">{feature.emoji}</div>
              <div className="text-xs font-medium text-text-primary">{feature.label}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{feature.desc}</div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
