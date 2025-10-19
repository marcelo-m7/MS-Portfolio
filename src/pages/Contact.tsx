import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import { useCvData } from '@/hooks/useCvData';
import { supabase } from '@/lib/supabaseClient';

const createInitialFormState = () => ({
  name: '',
  email: '',
  company: '',
  project: '',
  message: '',
});

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslations();
  const cvData = useCvData();
  const [formData, setFormData] = useState(createInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured.');
      }

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to: 'hello@monynha.com',
        },
      });

      if (error) {
        throw error;
      }

      toast.success(cvData.contact.successMessage);
      setFormData(createInitialFormState());
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao enviar mensagem de contato:', error);
      }
      toast.error(cvData.contact.errorMessage);
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
            {t('Contact.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {cvData.contact.note}
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
            <div className="glass rounded-[var(--radius)] p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                {t('Contact.info.title')}
              </h2>

              <div className="space-y-6">
                <motion.a
                  href={cvData.links.email}
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{t('Contact.info.labels.email')}</p>
                    <p className="font-medium">{cvData.contact.email}</p>
                  </div>
                </motion.a>

                <motion.a
                  href={cvData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Github className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{t('Contact.info.labels.github')}</p>
                    <p className="font-medium">@marcelo-m7</p>
                  </div>
                </motion.a>

                <motion.a
                  href={cvData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
                  whileHover={prefersReducedMotion ? undefined : { x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Linkedin className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{t('Contact.info.labels.linkedin')}</p>
                    <p className="font-medium">Marcelo Santos</p>
                  </div>
                </motion.a>
              </div>
            </div>

            <div className="glass rounded-[var(--radius)] p-8">
              <h3 className="font-display font-bold mb-3">{t('Contact.availability.title')}</h3>
              <p className="text-muted-foreground">
                {cvData.contact.availability}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-[var(--radius)] p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                {t('Contact.form.title')}
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('Contact.form.name.label')}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      className="rounded-xl"
                      placeholder={t('Contact.form.name.placeholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      {t('Contact.form.company.label')}{' '}
                      <span className="text-muted-foreground">{t('Contact.form.company.optional')}</span>
                    </label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="rounded-xl"
                      placeholder={t('Contact.form.company.placeholder')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('Contact.form.email.label')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                      className="rounded-xl"
                      placeholder={t('Contact.form.email.placeholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium mb-2">
                      {t('Contact.form.project.label')}{' '}
                      <span className="text-muted-foreground">{t('Contact.form.project.optional')}</span>
                    </label>
                    <Input
                      id="project"
                      type="text"
                      value={formData.project}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, project: e.target.value }))
                      }
                      className="rounded-xl"
                      placeholder={t('Contact.form.project.placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('Contact.form.message.label')}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    required
                    rows={6}
                    className="rounded-xl resize-none"
                    placeholder={t('Contact.form.message.placeholder')}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl py-6 text-lg bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    t('Contact.form.submitting')
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      {t('Contact.form.submit')}
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