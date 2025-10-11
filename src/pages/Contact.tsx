import { useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import cvData from '../../public/data/cv.json';
import { supabase } from '@/lib/supabaseClient';
import { MotionDiv } from '@/components/MotionDiv'; // Import MotionDiv
import { AnimatedLink } from '@/components/AnimatedLink'; // Import AnimatedLink
import { AnimatedButton } from '@/components/AnimatedButton'; // Import AnimatedButton

const createInitialFormState = () => ({
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
        <MotionDiv
          delay={0}
          duration={0.6}
          yOffset={20}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Vamos Conversar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {cvData.contact.note}
          </p>
        </MotionDiv>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <MotionDiv
            delay={0.2}
            duration={0.6}
            xOffset={-20}
            className="space-y-8"
          >
            <div className="glass rounded-[var(--radius)] p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                Informações de Contato
              </h2>

              <div className="space-y-6">
                <AnimatedLink
                  as="a"
                  href={cvData.links.email}
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary group"
                  whileHover={{ x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  hoverScale={1}
                  tapScale={0.98}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">Email</p>
                    <p className="font-medium">{cvData.contact.email}</p>
                  </div>
                </AnimatedLink>

                <AnimatedLink
                  as="a"
                  href={cvData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-primary group"
                  whileHover={{ x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  hoverScale={1}
                  tapScale={0.98}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Github className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">GitHub</p>
                    <p className="font-medium">@marcelo-m7</p>
                  </div>
                </AnimatedLink>

                <AnimatedLink
                  as="a"
                  href={cvData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-secondary group"
                  whileHover={{ x: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  hoverScale={1}
                  tapScale={0.98}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Linkedin className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground/60">LinkedIn</p>
                    <p className="font-medium">Marcelo Santos</p>
                  </div>
                </AnimatedLink>
              </div>
            </div>

            <div className="glass rounded-[var(--radius)] p-8">
              <h3 className="font-display font-bold mb-3">Disponibilidade</h3>
              <p className="text-muted-foreground">
                {cvData.contact.availability}
              </p>
            </div>
          </MotionDiv>

          {/* Contact Form */}
          <MotionDiv
            delay={0.4}
            duration={0.6}
            xOffset={20}
          >
            <form onSubmit={handleSubmit} className="glass rounded-[var(--radius)] p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                Enviar Mensagem
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome
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
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Empresa <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="rounded-xl"
                      placeholder="Onde você trabalha"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
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
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium mb-2">
                      Projeto <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <Input
                      id="project"
                      type="text"
                      value={formData.project}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, project: e.target.value }))
                      }
                      className="rounded-xl"
                      placeholder="Sobre o que vamos falar?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem
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
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl py-6 text-lg bg-primary hover:bg-primary/90"
                  hoverScale={1.02}
                  tapScale={0.98}
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      Enviar Mensagem
                    </>
                  )}
                </AnimatedButton>
              </div>
            </form>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}