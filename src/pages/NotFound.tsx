import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { content } = useLanguage();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center glass rounded-2xl p-12 max-w-lg mx-6">
        <h1 className="mb-4 text-6xl font-display font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{content.ui.notFound.title}</p>
        <p className="mb-8 text-muted-foreground">{content.ui.notFound.description}</p>
        <Button asChild size="lg" className="rounded-2xl">
          <Link to="/">{content.ui.notFound.cta}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
