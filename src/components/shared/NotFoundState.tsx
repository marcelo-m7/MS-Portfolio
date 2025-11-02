import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

interface NotFoundStateProps {
  /**
   * The translated message to display
   */
  message: string;
  /**
   * The path to navigate back to
   */
  backTo: string;
  /**
   * The label for the back button
   */
  backLabel: string;
}

/**
 * Reusable not found state component used across detail pages
 */
export default function NotFoundState({ message, backTo, backLabel }: NotFoundStateProps) {
  const t = useTranslations();
  
  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-display font-bold text-primary">{t.common.notFound}</h1>
        <p className="mt-4 text-muted-foreground">
          {message}
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link to={backTo}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
