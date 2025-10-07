import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { content } = useLanguage();
  const { contact, links, ui } = content;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    message: '',
  });
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

      toast.success(contact.successMessage);
      setFormData({ name: '', email: '', company: '', project: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      toast.error(contact.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">{ui.contact.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{ui.contact.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold mb-6">{ui.contact.infoTitle}</h2>

              <div className="space-y-6">
                <a
                  href={links.email}
                  className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{ui.contact.emailLabel}</p>
                    <p className="font-medium">{contact.email}</p>
                  </div>
                </a>

                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Github className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{ui.contact.githubLabel}</p>
                    <p className="font-medium">@marcelo-m7</p>
                  </div>
                </a>

                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground hover:text-secondary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Linkedin className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">{ui.contact.linkedinLabel}</p>
                    <p className="font-medium">Marcelo Santos</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="font-display font-bold mb-3">{ui.contact.availabilityTitle}</h3>
              <p className="text-muted-foreground">{contact.availability}</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold mb-6">{ui.contact.formTitle}</h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {ui.contact.nameLabel}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="rounded-xl"
                      placeholder={ui.contact.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      {ui.contact.companyLabel} <span className="text-muted-foreground">{ui.contact.companyOptional}</span>
                    </label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="rounded-xl"
                      placeholder={ui.contact.companyPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {ui.contact.emailLabelForm}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="rounded-xl"
                      placeholder={ui.contact.emailPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium mb-2">
                      {ui.contact.projectLabel}
                    </label>
                    <Input
                      id="project"
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="rounded-xl"
                      placeholder={ui.contact.projectPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {ui.contact.messageLabel}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="rounded-xl"
                    rows={6}
                    placeholder={ui.contact.messagePlaceholder}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-6 rounded-2xl" size="lg" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? ui.contact.submitting : ui.contact.submit}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
