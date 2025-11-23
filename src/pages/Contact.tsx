import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useContact } from '@/hooks/usePortfolioData';
import { LINKS } from '../lib/siteLinks';
import { submitContact } from '@/lib/contactService'; // Import submitContact
import { logger } from '@/lib/logger';
import type { ContactFormData } from '@/lib/contactService'; // Use ContactFormData
import { useTranslations } from '@/hooks/useTranslations';
import { useTranslatedText } from '@/hooks/useTranslatedContent';

const createInitialFormState = (): ContactFormData => ({
  name: '',
  email: '',
  company: '',
  project: '',
  message: '',
});

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState(createInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: contactInfo } = useContact();
  const t = useTranslations();
  const translatedNote = useTranslatedText((contactInfo?.note as string) ?? '');
  const translatedAvailability = useTranslatedText((contactInfo?.availability as string) ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContact(formData); // Use submitContact directly

      toast.success(
        result.status === 'stored'
          ? (contactInfo?.success_message || t.contact.successMessage)
          : t.contact.emailFallbackMessage,
      );
      setFormData(createInitialFormState());
    } catch (error) {
      logger.error('Erro ao processar mensagem de contato', { component: 'Contact' }, error);
      toast.error(contactInfo?.error_message || t.contact.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            {t.contact.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {translatedNote || t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                {t.contact.contactInfo}
              </h2>

              <div className="space-y-6">
                <motion.a
                  href={`mailto:${contactInfo?.email || LINKS.email.replace('mailto:','')}`}
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{t.contact.emailLabel}</p>
                    <p className="font-medium">{contactInfo?.email || LINKS.email.replace('mailto:','')}</p>
                  </div>
                </motion.a>

                <motion.a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Github className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">GitHub</p>
                    <p className="font-medium">@marcelo-m7</p>
                  </div>
                </motion.a>

                <motion.a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                    <Linkedin className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">LinkedIn</p>
                    <p className="font-medium">Marcelo Santos</p>
                  </div>
                </motion.a>
              </div>
            </div>

            <div className="glass p-8">
              <h3 className="font-display font-bold mb-3">{t.contact.availability}</h3>
              <p className="text-muted-foreground">
                {translatedAvailability || t.contact.availabilityDefault}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                {t.contact.sendMessage}
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t.contact.nameLabel}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      className="rounded-2xl"
                      placeholder={t.contact.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      {t.contact.companyLabel} <span className="text-muted-foreground">({t.contact.optional})</span>
                    </label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="rounded-2xl"
                      placeholder={t.contact.companyPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t.contact.emailLabel}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                      className="rounded-2xl"
                      placeholder={t.contact.emailPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium mb-2">
                      {t.contact.projectLabel} <span className="text-muted-foreground">({t.contact.optional})</span>
                    </label>
                    <Input
                      id="project"
                      type="text"
                      value={formData.project}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, project: e.target.value }))
                      }
                      className="rounded-2xl"
                      placeholder={t.contact.projectPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t.contact.messageLabel}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    required
                    rows={6}
                    className="rounded-2xl resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-primary py-6 text-lg hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    t.contact.sending
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      {t.contact.sendButton}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}