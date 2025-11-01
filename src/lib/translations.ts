/**
 * Translations for the portfolio application
 * Minimal implementation supporting Portuguese and English
 */

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['pt', 'en', 'es', 'fr'] as const;

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
  es: {
    nav: {
      home: 'Inicio',
      portfolio: 'Portfolio',
      about: 'Acerca de',
      thoughts: 'Pensamientos',
      contact: 'Contacto',
      menu: 'Menú',
      closeMenu: 'Cerrar menú',
      openMenu: 'Abrir menú',
    },
    common: {
      loading: 'Cargando…',
      error: 'Error al cargar',
      notFound: 'No encontrado',
      backToHome: 'Volver al inicio',
      readMore: 'Leer más',
      viewProject: 'Ver proyecto',
      seeMore: 'Ver más',
    },
    contact: {
      title: 'Hablemos',
      subtitle: 'Ponte en contacto y creemos algo increíble juntos.',
      namePlaceholder: 'Tu nombre',
      emailPlaceholder: 'Tu email',
      companyPlaceholder: 'Tu empresa (opcional)',
      projectPlaceholder: 'Tipo de proyecto (opcional)',
      messagePlaceholder: 'Cuéntame sobre tu proyecto...',
      sendButton: 'Enviar Mensaje',
      sending: 'Enviando...',
      successMessage: '¡Mensaje enviado con éxito!',
      errorMessage: 'No se pudo enviar tu mensaje. Inténtalo de nuevo.',
    },
    footer: {
      quickLinks: 'Enlaces Rápidos',
      rights: 'Todos los derechos reservados.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      portfolio: 'Portfolio',
      about: 'À propos',
      thoughts: 'Réflexions',
      contact: 'Contact',
      menu: 'Menu',
      closeMenu: 'Fermer le menu',
      openMenu: 'Ouvrir le menu',
    },
    common: {
      loading: 'Chargement…',
      error: 'Erreur de chargement',
      notFound: 'Non trouvé',
      backToHome: 'Retour à l\'accueil',
      readMore: 'Lire plus',
      viewProject: 'Voir le projet',
      seeMore: 'Voir plus',
    },
    contact: {
      title: 'Parlons-en',
      subtitle: 'Contactez-moi et créons quelque chose d\'incroyable ensemble.',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'Votre email',
      companyPlaceholder: 'Votre entreprise (facultatif)',
      projectPlaceholder: 'Type de projet (facultatif)',
      messagePlaceholder: 'Parlez-moi de votre projet...',
      sendButton: 'Envoyer le Message',
      sending: 'Envoi en cours...',
      successMessage: 'Message envoyé avec succès !',
      errorMessage: 'Impossible d\'envoyer votre message. Veuillez réessayer.',
    },
    footer: {
      quickLinks: 'Liens Rapides',
      rights: 'Tous droits réservés.',
    },
  },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage): Translations {
  return translations[language] || translations.pt;
}
