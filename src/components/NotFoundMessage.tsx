import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';

interface NotFoundMessageProps {
  message: string;
  backTo: string;
  backLabel?: string;
}

export default function NotFoundMessage({ message, backTo, backLabel }: NotFoundMessageProps) {
  const t = useTranslations();
  const translatedMessage = useTranslatedText(message);
  
  return (
    <div className="py-0 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-display font-bold text-primary">{t.common.notFound}</h1>
        <p className="mt-4 text-muted-foreground">
          {translatedMessage}
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link to={backTo}>{backLabel ?? t.nav.portfolio}</Link>
        </Button>
      </div>
    </div>
  );
}
