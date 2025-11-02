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
  home: {
    explorePortfolio: string;
    getInTouch: string;
    viewAllProjects: string;
    recentProjects: string;
    recentThoughts: string;
  };
  portfolio: {
    filterAll: string;
    filterDigitalArt: string;
    filterCreativeSeries: string;
    pageSubtitle: string;
  };
  projectDetail: {
    stack: string;
    technologies: string;
    tools: string;
    objective: string;
    solution: string;
    results: string;
    visitSite: string;
    viewSource: string;
  };
  artDetail: {
    materials: string;
    dimensions: string;
    year: string;
    description: string;
  };
  seriesDetail: {
    works: string;
    totalWorks: string;
    period: string;
    description: string;
  };
  about: {
    experience: string;
    skills: string;
    education: string;
    certifications: string;
  };
  thoughts: {
    publishedOn: string;
    lastUpdate: string;
    backToThoughts: string;
    readingTime: string;
    minutesRead: string;
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
    home: {
      explorePortfolio: 'Explorar Portfolio',
      getInTouch: 'Entre em Contato',
      viewAllProjects: 'Ver Todos os Projetos',
      recentProjects: 'Projetos Recentes',
      recentThoughts: 'Pensamentos Recentes',
    },
    portfolio: {
      filterAll: 'Todos',
      filterDigitalArt: 'Arte Digital',
      filterCreativeSeries: 'Série Criativa',
      pageSubtitle: 'Projetos, arte digital e séries criativas do ecossistema Monynha',
    },
    projectDetail: {
      stack: 'Stack',
      technologies: 'Tecnologias',
      tools: 'Ferramentas',
      objective: 'Objetivo',
      solution: 'Solução',
      results: 'Resultados',
      visitSite: 'Visitar Site',
      viewSource: 'Ver Código',
    },
    artDetail: {
      materials: 'Materiais',
      dimensions: 'Dimensões',
      year: 'Ano',
      description: 'Descrição',
    },
    seriesDetail: {
      works: 'Obras',
      totalWorks: 'Total de Obras',
      period: 'Período',
      description: 'Descrição',
    },
    about: {
      experience: 'Experiência',
      skills: 'Habilidades',
      education: 'Formação',
      certifications: 'Certificações',
    },
    thoughts: {
      publishedOn: 'Publicado em',
      lastUpdate: 'Última atualização',
      backToThoughts: 'Voltar aos Pensamentos',
      readingTime: 'Tempo de leitura',
      minutesRead: 'min de leitura',
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
    home: {
      explorePortfolio: 'Explore Portfolio',
      getInTouch: 'Get in Touch',
      viewAllProjects: 'View All Projects',
      recentProjects: 'Recent Projects',
      recentThoughts: 'Recent Thoughts',
    },
    portfolio: {
      filterAll: 'All',
      filterDigitalArt: 'Digital Art',
      filterCreativeSeries: 'Creative Series',
      pageSubtitle: 'Projects, digital art and creative series from the Monynha ecosystem',
    },
    projectDetail: {
      stack: 'Stack',
      technologies: 'Technologies',
      tools: 'Tools',
      objective: 'Objective',
      solution: 'Solution',
      results: 'Results',
      visitSite: 'Visit Site',
      viewSource: 'View Source',
    },
    artDetail: {
      materials: 'Materials',
      dimensions: 'Dimensions',
      year: 'Year',
      description: 'Description',
    },
    seriesDetail: {
      works: 'Works',
      totalWorks: 'Total Works',
      period: 'Period',
      description: 'Description',
    },
    about: {
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      certifications: 'Certifications',
    },
    thoughts: {
      publishedOn: 'Published on',
      lastUpdate: 'Last update',
      backToThoughts: 'Back to Thoughts',
      readingTime: 'Reading time',
      minutesRead: 'min read',
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
    home: {
      explorePortfolio: 'Explorar Portfolio',
      getInTouch: 'Ponerse en contacto',
      viewAllProjects: 'Ver Todos los Proyectos',
      recentProjects: 'Proyectos Recientes',
      recentThoughts: 'Pensamientos Recientes',
    },
    portfolio: {
      filterAll: 'Todos',
      filterDigitalArt: 'Arte Digital',
      filterCreativeSeries: 'Serie Creativa',
      pageSubtitle: 'Proyectos, arte digital y series creativas del ecosistema Monynha',
    },
    projectDetail: {
      stack: 'Stack',
      technologies: 'Tecnologías',
      tools: 'Herramientas',
      objective: 'Objetivo',
      solution: 'Solución',
      results: 'Resultados',
      visitSite: 'Visitar Sitio',
      viewSource: 'Ver Código',
    },
    artDetail: {
      materials: 'Materiales',
      dimensions: 'Dimensiones',
      year: 'Año',
      description: 'Descripción',
    },
    seriesDetail: {
      works: 'Obras',
      totalWorks: 'Total de Obras',
      period: 'Período',
      description: 'Descripción',
    },
    about: {
      experience: 'Experiencia',
      skills: 'Habilidades',
      education: 'Educación',
      certifications: 'Certificaciones',
    },
    thoughts: {
      publishedOn: 'Publicado el',
      lastUpdate: 'Última actualización',
      backToThoughts: 'Volver a Pensamientos',
      readingTime: 'Tiempo de lectura',
      minutesRead: 'min de lectura',
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
    home: {
      explorePortfolio: 'Explorer le Portfolio',
      getInTouch: 'Entrer en Contact',
      viewAllProjects: 'Voir Tous les Projets',
      recentProjects: 'Projets Récents',
      recentThoughts: 'Réflexions Récentes',
    },
    portfolio: {
      filterAll: 'Tous',
      filterDigitalArt: 'Art Numérique',
      filterCreativeSeries: 'Série Créative',
      pageSubtitle: 'Projets, art numérique et séries créatives de l\'écosystème Monynha',
    },
    projectDetail: {
      stack: 'Stack',
      technologies: 'Technologies',
      tools: 'Outils',
      objective: 'Objectif',
      solution: 'Solution',
      results: 'Résultats',
      visitSite: 'Visiter le Site',
      viewSource: 'Voir le Code',
    },
    artDetail: {
      materials: 'Matériaux',
      dimensions: 'Dimensions',
      year: 'Année',
      description: 'Description',
    },
    seriesDetail: {
      works: 'Œuvres',
      totalWorks: 'Total des Œuvres',
      period: 'Période',
      description: 'Description',
    },
    about: {
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Formation',
      certifications: 'Certifications',
    },
    thoughts: {
      publishedOn: 'Publié le',
      lastUpdate: 'Dernière mise à jour',
      backToThoughts: 'Retour aux Réflexions',
      readingTime: 'Temps de lecture',
      minutesRead: 'min de lecture',
    },
  },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage): Translations {
  return translations[language] || translations.pt;
}
