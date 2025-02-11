import { Logo } from '@/components/ui/Logo';

export function Header() {
  return (
    <header className="bg-brand-primary shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="small" className="mr-4" />
            <h1 className="text-brand-secondary text-xl font-semibold">TopTennis</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/news" className="text-white hover:text-brand-secondary">News</a>
            <a href="/sessions" className="text-white hover:text-brand-secondary">Sessions</a>
            <a href="/availability" className="text-white hover:text-brand-secondary">Availability</a>
          </nav>
        </div>
      </div>
    </header>
  );
} 