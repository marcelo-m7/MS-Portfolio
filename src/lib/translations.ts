/**
 * Translations for the portfolio application
 * Minimal implementation supporting Portuguese and English
 */

export type SupportedLanguage = 'pt' | 'en';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['pt', 'en'] as const;

export interface Translations {
  nav: {
    home: string;
    portfolio: string;
    about: string;
    thoughts: string;
    contact: string;
    menu: string;
    closeMenu: string;
    openMenu: string;
  };
  common: {
    loading: string;
    error: string;
    notFound: string;
    backToHome: string;
    readMore: string;
    viewProject: string;
    seeMore: string;
  };
  contact: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    companyPlaceholder: string;
    projectPlaceholder: string;
    messagePlaceholder: string;
    sendButton: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    quickLinks: string;
    rights: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  pt: {
    nav: {
      home: 'Início',
      portfolio: 'Portfolio',
      about: 'Sobre',
      thoughts: 'Pensamentos',
      contact: 'Contato',
      menu: 'Menu',
      closeMenu: 'Fechar menu',
      openMenu: 'Abrir menu',
    },
    common: {
      loading: 'Carregando…',
      error: 'Erro ao carregar',
      notFound: 'Não encontrado',
      backToHome: 'Voltar ao início',
      readMore: 'Ler mais',
      viewProject: 'Ver projeto',
      seeMore: 'Ver mais',
    },
    contact: {
      title: 'Vamos Conversar',
      subtitle: 'Entre em contato e vamos criar algo incrível juntos.',
      namePlaceholder: 'Seu nome',
      emailPlaceholder: 'Seu email',
      companyPlaceholder: 'Sua empresa (opcional)',
      projectPlaceholder: 'Tipo de projeto (opcional)',
      messagePlaceholder: 'Conte-me sobre seu projeto...',
      sendButton: 'Enviar Mensagem',
      sending: 'Enviando...',
      successMessage: 'Mensagem enviada com sucesso!',
      errorMessage: 'Não foi possível enviar sua mensagem. Tente novamente.',
    },
    footer: {
      quickLinks: 'Links Rápidos',
      rights: 'Todos os direitos reservados.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      thoughts: 'Thoughts',
      contact: 'Contact',
      menu: 'Menu',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
    },
    common: {
      loading: 'Loading…',
      error: 'Error loading',
      notFound: 'Not found',
      backToHome: 'Back to home',
      readMore: 'Read more',
      viewProject: 'View project',
      seeMore: 'See more',
    },
    contact: {
      title: 'Let\'s Talk',
      subtitle: 'Get in touch and let\'s create something amazing together.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Your email',
      companyPlaceholder: 'Your company (optional)',
      projectPlaceholder: 'Project type (optional)',
      messagePlaceholder: 'Tell me about your project...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      successMessage: 'Message sent successfully!',
      errorMessage: 'Could not send your message. Please try again.',
    },
    footer: {
      quickLinks: 'Quick Links',
      rights: 'All rights reserved.',
    },
  },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage): Translations {
  return translations[language] || translations.pt;
}
