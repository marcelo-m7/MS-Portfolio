import type { ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es' | 'fr';

type NavLabels = {
  home: string;
  portfolio: string;
  about: string;
  thoughts: string;
  contact: string;
};

type HomeCopy = {
  featuredTitle: string;
  featuredSubtitle: string;
  exploreCta: string;
  contactCta: string;
  viewAll: string;
};

type PortfolioCopy = {
  title: string;
  subtitle: string;
  viewProject: string;
  filters: {
    all: string;
  };
  empty: string;
};

type AboutCopy = {
  title: string;
  subtitle: string;
  experience: string;
  skills: string;
};

type ThoughtsCopy = {
  title: string;
  subtitle: string;
  back: string;
  readingTime: string;
  year: string;
};

type ContactCopy = {
  title: string;
  subtitle: string;
  infoTitle: string;
  availabilityTitle: string;
  formTitle: string;
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  companyLabel: string;
  companyOptional: string;
  companyPlaceholder: string;
  emailLabelForm: string;
  emailPlaceholder: string;
  projectLabel: string;
  projectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
};

type NotFoundCopy = {
  title: string;
  description: string;
  cta: string;
};

type UIContent = {
  nav: NavLabels;
  home: HomeCopy;
  portfolio: PortfolioCopy;
  about: AboutCopy;
  thoughts: ThoughtsCopy;
  contact: ContactCopy;
  notFound: NotFoundCopy;
};

type ProjectCategoryKey = 'website' | 'platform' | 'education' | 'app' | 'portfolio' | 'ai';

type Project = {
  key: string;
  name: string;
  summary: string;
  stack: string[];
  url: string;
  thumbnail: string;
  category: {
    key: ProjectCategoryKey;
    label: string;
  };
  year: number;
};

type Experience = {
  role: string;
  org: string;
  start: string;
  end: string | null;
  location: string;
  highlights: string[];
};

type Skill = {
  name: string;
  category: string;
  level: string;
};

type Series = {
  slug: string;
  title: string;
  description: string;
  year: number;
  works: string[];
};

type Artwork = {
  slug: string;
  title: string;
  media: string[];
  year: number;
  materials: string[];
  description: string;
  url3d: string;
};

type Thought = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
};

type ContactInfo = {
  email: string;
  availability: string;
  note: string;
  successMessage: string;
  errorMessage: string;
};

type Profile = {
  name: string;
  headline: string;
  location: string;
  bio: string;
  avatar: string;
};

type Links = {
  github: string;
  org: string;
  site: string;
  linkedin: string;
  email: string;
};

export type Content = {
  lang: Language;
  profile: Profile;
  links: Links;
  ui: UIContent;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  series: Series[];
  artworks: Artwork[];
  thoughts: Thought[];
  contact: ContactInfo;
};

export const defaultLanguage: Language = 'pt';

export const supportedLanguages: ReadonlyArray<{
  code: Language;
  name: string;
  flag: ReactNode;
}> = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const sharedLinks: Links = {
  github: 'https://github.com/marcelo-m7',
  org: 'https://github.com/Monynha-Softwares',
  site: 'https://monynha.com',
  linkedin: 'https://www.linkedin.com/in/marcelo-m7',
  email: 'mailto:geral@monynha.com',
};

const sharedProjectsBase = [
  { key: 'monynha-com', url: 'https://monynha.com', thumbnail: '/images/monynha-com.jpg', stack: ['Next.js', 'TailwindCSS', 'Payload CMS', 'Supabase'], category: 'website', year: 2024 },
  { key: 'monynha-tech', url: 'https://monynha.tech', thumbnail: '/images/monynha-tech.jpg', stack: ['Next.js', 'Supabase', 'CI/CD', 'Markdown'], category: 'platform', year: 2025 },
  { key: 'facodi', url: 'https://facodi.pt', thumbnail: '/images/facodi.jpg', stack: ['Next.js', 'Supabase', 'Payload CMS'], category: 'education', year: 2025 },
  { key: 'boteco-pro', url: 'https://boteco.monynha.online', thumbnail: '/images/botecopro.jpg', stack: ['Flutter', 'Supabase', 'PostgreSQL'], category: 'app', year: 2025 },
  { key: 'art-leo', url: 'https://artleo.monynha.com', thumbnail: '/images/artleo.jpg', stack: ['Next.js', 'react-three-fiber', 'Supabase'], category: 'portfolio', year: 2025 },
  { key: 'monagent', url: 'https://github.com/Monynha-Softwares/Monagent', thumbnail: '/images/monagent.jpg', stack: ['Python', 'FastAPI', 'n8n', 'Supabase'], category: 'ai', year: 2025 },
] as const;

const buildProjects = (
  language: Language,
  translations: Record<(typeof sharedProjectsBase)[number]['key'], { name: string; summary: string; category: string }>,
): Project[] =>
  sharedProjectsBase.map((project) => ({
    key: project.key,
    url: project.url,
    thumbnail: project.thumbnail,
    stack: project.stack,
    year: project.year,
    name: translations[project.key].name,
    summary: translations[project.key].summary,
    category: {
      key: project.category,
      label: translations[project.key].category,
    },
  }));

const sharedExperienceBase = [
  {
    key: 'monynha-softwares',
    org: 'Monynha Softwares',
    start: '2022-01',
    end: null,
  },
  {
    key: 'university-algarve',
    org: 'Universidade do Algarve (LESTI)',
    start: '2021-09',
    end: '2025-07',
  },
] as const;

const buildExperience = (
  translations: Record<(typeof sharedExperienceBase)[number]['key'], {
    role: string;
    location: string;
    highlights: string[];
  }>,
): Experience[] =>
  sharedExperienceBase.map((exp) => ({
    role: translations[exp.key].role,
    org: exp.org,
    start: exp.start,
    end: exp.end ?? null,
    location: translations[exp.key].location,
    highlights: translations[exp.key].highlights,
  }));

const sharedSkills = [
  { key: 'nextjs', category: { pt: 'Frontend', en: 'Frontend', es: 'Frontend', fr: 'Frontend' }, levels: { pt: 'Avançado', en: 'Advanced', es: 'Avanzado', fr: 'Avancé' } },
  { key: 'supabase', category: { pt: 'Backend / DB', en: 'Backend / DB', es: 'Backend / BD', fr: 'Backend / BD' }, levels: { pt: 'Avançado', en: 'Advanced', es: 'Avanzado', fr: 'Avancé' } },
  { key: 'flutter', category: { pt: 'Mobile', en: 'Mobile', es: 'Móvil', fr: 'Mobile' }, levels: { pt: 'Intermédio', en: 'Intermediate', es: 'Intermedio', fr: 'Intermédiaire' } },
  { key: 'docker', category: { pt: 'DevOps', en: 'DevOps', es: 'DevOps', fr: 'DevOps' }, levels: { pt: 'Avançado', en: 'Advanced', es: 'Avanzado', fr: 'Avancé' } },
  { key: 'payload', category: { pt: 'CMS', en: 'CMS', es: 'CMS', fr: 'CMS' }, levels: { pt: 'Intermédio', en: 'Intermediate', es: 'Intermedio', fr: 'Intermédiaire' } },
  { key: 'cicd', category: { pt: 'DevOps', en: 'DevOps', es: 'DevOps', fr: 'DevOps' }, levels: { pt: 'Avançado', en: 'Advanced', es: 'Avanzado', fr: 'Avancé' }, name: { pt: 'CI/CD (Coolify + GitHub Actions)', en: 'CI/CD (Coolify + GitHub Actions)', es: 'CI/CD (Coolify + GitHub Actions)', fr: 'CI/CD (Coolify + GitHub Actions)' } },
  { key: 'framer', category: { pt: 'Animações / UI', en: 'Animations / UI', es: 'Animaciones / UI', fr: 'Animations / UI' }, levels: { pt: 'Intermédio', en: 'Intermediate', es: 'Intermedio', fr: 'Intermédiaire' } },
  { key: 'r3f', category: { pt: '3D / WebGL', en: '3D / WebGL', es: '3D / WebGL', fr: '3D / WebGL' }, levels: { pt: 'Intermédio', en: 'Intermediate', es: 'Intermedio', fr: 'Intermédiaire' } },
] as const;

const buildSkills = (language: Language, translations: Record<typeof sharedSkills[number]['key'], { name: string }>): Skill[] =>
  sharedSkills.map((skill) => ({
    name: translations[skill.key].name,
    category: (skill.category as Record<Language, string>)[language],
    level: (skill.levels as Record<Language, string>)[language],
  }));

const sharedSeriesBase = [
  { key: 'creative-systems', slug: 'creative-systems', works: ['artleo', 'monagent'], year: 2024 },
] as const;

const buildSeries = (translations: Record<(typeof sharedSeriesBase)[number]['key'], { title: string; description: string }>): Series[] =>
  sharedSeriesBase.map((serie) => ({
    slug: serie.slug,
    year: serie.year,
    works: serie.works,
    title: translations[serie.key].title,
    description: translations[serie.key].description,
  }));

const sharedArtworksBase = [
  {
    key: 'artleo',
    slug: 'artleo',
    media: ['/images/artleo-hero.jpg', '/images/artleo-3d.glb'],
    year: 2025,
    materials: ['WebGL', '3D Animation', 'Digital Sculpture'],
    url3d: 'https://artleo.monynha.com',
  },
] as const;

const buildArtworks = (translations: Record<(typeof sharedArtworksBase)[number]['key'], { title: string; description: string; materials: string[] }>): Artwork[] =>
  sharedArtworksBase.map((artwork) => ({
    slug: artwork.slug,
    media: artwork.media,
    year: artwork.year,
    url3d: artwork.url3d,
    title: translations[artwork.key].title,
    description: translations[artwork.key].description,
    materials: translations[artwork.key].materials,
  }));

const sharedThoughtsBase = [
  { key: 'inclusive-design', slug: 'design-tecnologia-inclusiva' },
  { key: 'behind-monynha', slug: 'por-tras-da-monynha' },
] as const;

const buildThoughts = (translations: Record<(typeof sharedThoughtsBase)[number]['key'], { title: string; excerpt: string; body: string }>): Thought[] =>
  sharedThoughtsBase.map((thought) => ({
    slug: thought.slug,
    title: translations[thought.key].title,
    excerpt: translations[thought.key].excerpt,
    body: translations[thought.key].body,
  }));

export const contentByLanguage: Record<Language, Content> = {
  pt: {
    lang: 'pt',
    profile: {
      name: 'Marcelo Santos',
      headline: 'Software Engineer & Founder @ Monynha Softwares',
      location: 'Faro, Portugal',
      bio: 'Engenheiro de software com foco em produtos digitais, automação e DevOps. Apaixonado por acessibilidade, open-source e design inclusivo. Fundador da Monynha Softwares — um laboratório criativo que une tecnologia, diversidade e arte digital.',
      avatar: '/avatar.jpg',
    },
    links: sharedLinks,
    ui: {
      nav: {
        home: 'Home',
        portfolio: 'Portfolio',
        about: 'Sobre',
        thoughts: 'Pensamentos',
        contact: 'Contato',
      },
      home: {
        featuredTitle: 'Projetos em Destaque',
        featuredSubtitle: 'Seleção dos melhores trabalhos do ecossistema Monynha',
        exploreCta: 'Explorar Portfolio',
        contactCta: 'Entre em Contato',
        viewAll: 'Ver Todos os Projetos',
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Projetos e trabalhos desenvolvidos no ecossistema Monynha',
        viewProject: 'Ver Projeto',
        filters: {
          all: 'Todos',
        },
        empty: 'Nenhum projeto encontrado nesta categoria.',
      },
      about: {
        title: 'Sobre Mim',
        subtitle: 'Conheça a história e experiência',
        experience: 'Experiência',
        skills: 'Competências',
      },
      thoughts: {
        title: 'Pensamentos',
        subtitle: 'Reflexões sobre tecnologia, design e acessibilidade',
        back: 'Voltar',
        readingTime: 'Leitura de 3 min',
        year: '2025',
      },
      contact: {
        title: 'Vamos Conversar',
        subtitle: 'Entre em contato para projetos, parcerias ou ideias fora da caixa!',
        infoTitle: 'Informações de Contato',
        availabilityTitle: 'Disponibilidade',
        formTitle: 'Enviar Mensagem',
        emailLabel: 'Email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        nameLabel: 'Nome',
        namePlaceholder: 'Seu nome',
        companyLabel: 'Empresa',
        companyOptional: '(opcional)',
        companyPlaceholder: 'Onde você trabalha',
        emailLabelForm: 'Email',
        emailPlaceholder: 'seu@email.com',
        projectLabel: 'Projeto',
        projectPlaceholder: 'Conte sobre o projeto (opcional)',
        messageLabel: 'Mensagem',
        messagePlaceholder: 'Olá Marcelo, vamos criar algo incrível...',
        submit: 'Enviar Mensagem',
        submitting: 'Enviando...',
      },
      notFound: {
        title: 'Página não encontrada',
        description: 'Oops! O conteúdo que você procura não existe ou foi movido.',
        cta: 'Voltar para Home',
      },
    },
    projects: buildProjects('pt', {
      'monynha-com': {
        name: 'Monynha.com',
        summary: 'Website institucional da Monynha Softwares — vitrine de produtos, valores e visão da marca.',
        category: 'Website',
      },
      'monynha-tech': {
        name: 'Monynha Tech',
        summary: 'Blog técnico e central de documentação dos projetos Monynha. Plataforma voltada para desenvolvedores e estudantes.',
        category: 'Plataforma',
      },
      facodi: {
        name: 'FACODI',
        summary: 'Faculdade Comunitária Digital — portal gratuito de ensino superior aberto e colaborativo, alimentado por currículos oficiais e conteúdo público.',
        category: 'Educação',
      },
      'boteco-pro': {
        name: 'Boteco Pro',
        summary: 'Aplicativo de gestão para bares e restaurantes, desenvolvido em Flutter e Supabase.',
        category: 'App',
      },
      'art-leo': {
        name: 'Art Leo',
        summary: 'Website 3D imersivo para o artista Leonardo Silva, explorando arte, animação e interação digital.',
        category: 'Portfólio',
      },
      monagent: {
        name: 'Monagent',
        summary: 'Framework modular em Python para criação de agentes de IA e integração com automações (n8n, APIs, ferramentas de dados).',
        category: 'IA',
      },
    }),
    experience: buildExperience({
      'monynha-softwares': {
        role: 'Founder & Software Engineer',
        location: 'Faro, Portugal',
        highlights: [
          'Criação e manutenção do ecossistema Monynha (sites, apps e automações).',
          'Desenvolvimento full-stack com Next.js, Supabase, Flutter e Payload CMS.',
          'Gestão de pipelines CI/CD (Coolify, GitHub Actions) e infraestrutura Docker.',
          'Integração entre arte, tecnologia e IA aplicada a produtos digitais.',
        ],
      },
      'university-algarve': {
        role: 'Estudante de Engenharia de Software',
        location: 'Faro, Portugal',
        highlights: [
          'Licenciatura em Engenharia de Software e Tecnologias de Informação.',
          'Projetos práticos em IA, desenvolvimento web e visualização de informação.',
          'Participação em iniciativas open-source e pesquisa aplicada.',
        ],
      },
    }),
    skills: buildSkills('pt', {
      nextjs: { name: 'Next.js' },
      supabase: { name: 'Supabase' },
      flutter: { name: 'Flutter' },
      docker: { name: 'Docker' },
      payload: { name: 'Payload CMS' },
      cicd: { name: 'CI/CD (Coolify + GitHub Actions)' },
      framer: { name: 'Framer Motion' },
      r3f: { name: 'React Three Fiber' },
    }),
    series: buildSeries({
      'creative-systems': {
        title: 'Creative Systems',
        description: 'Coleção de projetos experimentais que exploram a intersecção entre arte generativa, UX e automação inteligente.',
      },
    }),
    artworks: buildArtworks({
      artleo: {
        title: 'Art Leo Creative Spaces',
        description: 'Experiência imersiva criada em Next.js e React Three Fiber para o artista Leonardo Silva, destacando arte interativa e ambiente 3D.',
        materials: ['WebGL', 'Animação 3D', 'Escultura Digital'],
      },
    }),
    thoughts: buildThoughts({
      'inclusive-design': {
        title: 'Design e Tecnologia Inclusiva',
        excerpt: 'A tecnologia é mais humana quando é acessível.',
        body: 'Acredito que design e acessibilidade não são opostos, mas aliados. No ecossistema Monynha, cada interface nasce com empatia: contraste adequado, navegação por teclado e respeito ao prefers-reduced-motion fazem parte do nosso DNA digital.',
      },
      'behind-monynha': {
        title: 'Por trás da Monynha',
        excerpt: 'Mais do que software, é movimento.',
        body: 'Monynha Softwares nasceu da vontade de unir diversidade e tecnologia em um só propósito: criar ferramentas que empoderem pessoas e transformem ideias em experiências digitais acessíveis, criativas e babadeiras 💅.',
      },
    }),
    contact: {
      email: 'geral@monynha.com',
      availability: 'Disponível para colaborações e oportunidades criativas.',
      note: 'Entre em contato para projetos, parcerias ou ideias fora da caixa!',
      successMessage: 'Mensagem enviada com sucesso! Entrarei em contato em breve 🌈',
      errorMessage: 'Ops! Algo deu errado. Tenta novamente mais tarde 💜',
    },
  },
  en: {
    lang: 'en',
    profile: {
      name: 'Marcelo Santos',
      headline: 'Software Engineer & Founder @ Monynha Softwares',
      location: 'Faro, Portugal',
      bio: 'Software engineer focused on digital products, automation, and DevOps. Passionate about accessibility, open source, and inclusive design. Founder of Monynha Softwares — a creative lab that blends technology, diversity, and digital art.',
      avatar: '/avatar.jpg',
    },
    links: sharedLinks,
    ui: {
      nav: {
        home: 'Home',
        portfolio: 'Portfolio',
        about: 'About',
        thoughts: 'Thoughts',
        contact: 'Contact',
      },
      home: {
        featuredTitle: 'Featured Projects',
        featuredSubtitle: 'A selection of the best work from the Monynha ecosystem',
        exploreCta: 'Explore Portfolio',
        contactCta: 'Get in Touch',
        viewAll: 'View All Projects',
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Projects and products crafted inside the Monynha ecosystem',
        viewProject: 'View Project',
        filters: {
          all: 'All',
        },
        empty: 'No project found in this category.',
      },
      about: {
        title: 'About Me',
        subtitle: 'Learn more about my story and experience',
        experience: 'Experience',
        skills: 'Skills',
      },
      thoughts: {
        title: 'Thoughts',
        subtitle: 'Reflections on technology, design, and accessibility',
        back: 'Back',
        readingTime: '3 min read',
        year: '2025',
      },
      contact: {
        title: 'Let’s Talk',
        subtitle: 'Reach out for projects, partnerships, or bold ideas!',
        infoTitle: 'Contact Information',
        availabilityTitle: 'Availability',
        formTitle: 'Send a Message',
        emailLabel: 'Email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        companyLabel: 'Company',
        companyOptional: '(optional)',
        companyPlaceholder: 'Where you work',
        emailLabelForm: 'Email',
        emailPlaceholder: 'you@email.com',
        projectLabel: 'Project',
        projectPlaceholder: 'Tell me about the project (optional)',
        messageLabel: 'Message',
        messagePlaceholder: 'Hi Marcelo, let’s build something amazing...',
        submit: 'Send Message',
        submitting: 'Sending...',
      },
      notFound: {
        title: 'Page not found',
        description: 'Oops! The content you are looking for does not exist or was moved.',
        cta: 'Back to Home',
      },
    },
    projects: buildProjects('en', {
      'monynha-com': {
        name: 'Monynha.com',
        summary: 'Institutional website for Monynha Softwares — a showcase for products, values, and brand vision.',
        category: 'Website',
      },
      'monynha-tech': {
        name: 'Monynha Tech',
        summary: 'Technical blog and documentation hub for Monynha projects. A platform for developers and students.',
        category: 'Platform',
      },
      facodi: {
        name: 'FACODI',
        summary: 'Digital Community College — free and collaborative higher education portal powered by official curricula and public content.',
        category: 'Education',
      },
      'boteco-pro': {
        name: 'Boteco Pro',
        summary: 'Management app for bars and restaurants, built with Flutter and Supabase.',
        category: 'App',
      },
      'art-leo': {
        name: 'Art Leo',
        summary: 'Immersive 3D website for artist Leonardo Silva, exploring art, animation, and digital interaction.',
        category: 'Portfolio',
      },
      monagent: {
        name: 'Monagent',
        summary: 'Modular Python framework for building AI agents and integrating automations (n8n, APIs, data tools).',
        category: 'AI',
      },
    }),
    experience: buildExperience({
      'monynha-softwares': {
        role: 'Founder & Software Engineer',
        location: 'Faro, Portugal',
        highlights: [
          'Created and maintain the Monynha ecosystem (websites, apps, and automations).',
          'Full-stack development with Next.js, Supabase, Flutter, and Payload CMS.',
          'Manage CI/CD pipelines (Coolify, GitHub Actions) and Docker infrastructure.',
          'Blend art, technology, and AI to deliver inclusive digital products.',
        ],
      },
      'university-algarve': {
        role: 'Software Engineering Student',
        location: 'Faro, Portugal',
        highlights: [
          'Bachelor’s degree in Software Engineering and Information Technologies.',
          'Hands-on projects in AI, web development, and information visualization.',
          'Active participation in open-source initiatives and applied research.',
        ],
      },
    }),
    skills: buildSkills('en', {
      nextjs: { name: 'Next.js' },
      supabase: { name: 'Supabase' },
      flutter: { name: 'Flutter' },
      docker: { name: 'Docker' },
      payload: { name: 'Payload CMS' },
      cicd: { name: 'CI/CD (Coolify + GitHub Actions)' },
      framer: { name: 'Framer Motion' },
      r3f: { name: 'React Three Fiber' },
    }),
    series: buildSeries({
      'creative-systems': {
        title: 'Creative Systems',
        description: 'Collection of experimental projects exploring the intersection of generative art, UX, and intelligent automation.',
      },
    }),
    artworks: buildArtworks({
      artleo: {
        title: 'Art Leo Creative Spaces',
        description: 'Immersive experience built with Next.js and React Three Fiber for artist Leonardo Silva, highlighting interactive art and 3D environments.',
        materials: ['WebGL', '3D Animation', 'Digital Sculpture'],
      },
    }),
    thoughts: buildThoughts({
      'inclusive-design': {
        title: 'Inclusive Design & Technology',
        excerpt: 'Technology is more human when it is accessible.',
        body: 'I believe design and accessibility are not opposites but allies. Within the Monynha ecosystem, every interface is born with empathy: proper contrast, keyboard navigation, and respect for prefers-reduced-motion are part of our digital DNA.',
      },
      'behind-monynha': {
        title: 'Behind Monynha',
        excerpt: 'More than software, it is a movement.',
        body: 'Monynha Softwares was born from the desire to connect diversity and technology into a single purpose: create tools that empower people and transform ideas into accessible, creative, and fabulous digital experiences 💅.',
      },
    }),
    contact: {
      email: 'geral@monynha.com',
      availability: 'Open to collaborations and creative opportunities.',
      note: 'Reach out for projects, partnerships, or bold ideas!',
      successMessage: 'Message sent successfully! I will get back to you soon 🌈',
      errorMessage: 'Oops! Something went wrong. Please try again later 💜',
    },
  },
  es: {
    lang: 'es',
    profile: {
      name: 'Marcelo Santos',
      headline: 'Ingeniero de Software y Fundador @ Monynha Softwares',
      location: 'Faro, Portugal',
      bio: 'Ingeniero de software enfocado en productos digitales, automatización y DevOps. Apasionado por la accesibilidad, el open source y el diseño inclusivo. Fundador de Monynha Softwares — un laboratorio creativo que une tecnología, diversidad y arte digital.',
      avatar: '/avatar.jpg',
    },
    links: sharedLinks,
    ui: {
      nav: {
        home: 'Inicio',
        portfolio: 'Portfolio',
        about: 'Sobre mí',
        thoughts: 'Pensamientos',
        contact: 'Contacto',
      },
      home: {
        featuredTitle: 'Proyectos Destacados',
        featuredSubtitle: 'Selección de los mejores trabajos del ecosistema Monynha',
        exploreCta: 'Explorar Portfolio',
        contactCta: 'Hablemos',
        viewAll: 'Ver Todos los Proyectos',
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Proyectos y trabajos desarrollados en el ecosistema Monynha',
        viewProject: 'Ver Proyecto',
        filters: {
          all: 'Todos',
        },
        empty: 'No se encontraron proyectos en esta categoría.',
      },
      about: {
        title: 'Sobre mí',
        subtitle: 'Conoce mi historia y experiencia',
        experience: 'Experiencia',
        skills: 'Competencias',
      },
      thoughts: {
        title: 'Pensamientos',
        subtitle: 'Reflexiones sobre tecnología, diseño y accesibilidad',
        back: 'Volver',
        readingTime: 'Lectura de 3 min',
        year: '2025',
      },
      contact: {
        title: 'Conversemos',
        subtitle: 'Escríbeme para proyectos, colaboraciones o ideas atrevidas.',
        infoTitle: 'Información de Contacto',
        availabilityTitle: 'Disponibilidad',
        formTitle: 'Enviar Mensaje',
        emailLabel: 'Email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        nameLabel: 'Nombre',
        namePlaceholder: 'Tu nombre',
        companyLabel: 'Empresa',
        companyOptional: '(opcional)',
        companyPlaceholder: 'Dónde trabajas',
        emailLabelForm: 'Email',
        emailPlaceholder: 'tu@email.com',
        projectLabel: 'Proyecto',
        projectPlaceholder: 'Cuéntame sobre el proyecto (opcional)',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Hola Marcelo, construyamos algo increíble...',
        submit: 'Enviar Mensaje',
        submitting: 'Enviando...',
      },
      notFound: {
        title: 'Página no encontrada',
        description: 'Oops! El contenido que buscas no existe o fue movido.',
        cta: 'Volver al Inicio',
      },
    },
    projects: buildProjects('es', {
      'monynha-com': {
        name: 'Monynha.com',
        summary: 'Sitio institucional de Monynha Softwares — vitrina de productos, valores y visión de la marca.',
        category: 'Sitio web',
      },
      'monynha-tech': {
        name: 'Monynha Tech',
        summary: 'Blog técnico y centro de documentación de los proyectos Monynha. Plataforma orientada a desarrolladores y estudiantes.',
        category: 'Plataforma',
      },
      facodi: {
        name: 'FACODI',
        summary: 'Facultad Comunitaria Digital — portal gratuito de educación superior abierta y colaborativa, alimentado por currículos oficiales y contenido público.',
        category: 'Educación',
      },
      'boteco-pro': {
        name: 'Boteco Pro',
        summary: 'Aplicación de gestión para bares y restaurantes, desarrollada con Flutter y Supabase.',
        category: 'Aplicación',
      },
      'art-leo': {
        name: 'Art Leo',
        summary: 'Sitio web 3D inmersivo para el artista Leonardo Silva, explorando arte, animación e interacción digital.',
        category: 'Portafolio',
      },
      monagent: {
        name: 'Monagent',
        summary: 'Framework modular en Python para crear agentes de IA e integrar automatizaciones (n8n, APIs, herramientas de datos).',
        category: 'IA',
      },
    }),
    experience: buildExperience({
      'monynha-softwares': {
        role: 'Fundador e Ingeniero de Software',
        location: 'Faro, Portugal',
        highlights: [
          'Creación y mantenimiento del ecosistema Monynha (sitios, apps y automatizaciones).',
          'Desarrollo full stack con Next.js, Supabase, Flutter y Payload CMS.',
          'Gestión de pipelines CI/CD (Coolify, GitHub Actions) e infraestructura Docker.',
          'Integración entre arte, tecnología e IA aplicada a productos digitales.',
        ],
      },
      'university-algarve': {
        role: 'Estudiante de Ingeniería de Software',
        location: 'Faro, Portugal',
        highlights: [
          'Licenciatura en Ingeniería de Software y Tecnologías de la Información.',
          'Proyectos prácticos en IA, desarrollo web y visualización de información.',
          'Participación en iniciativas de código abierto e investigación aplicada.',
        ],
      },
    }),
    skills: buildSkills('es', {
      nextjs: { name: 'Next.js' },
      supabase: { name: 'Supabase' },
      flutter: { name: 'Flutter' },
      docker: { name: 'Docker' },
      payload: { name: 'Payload CMS' },
      cicd: { name: 'CI/CD (Coolify + GitHub Actions)' },
      framer: { name: 'Framer Motion' },
      r3f: { name: 'React Three Fiber' },
    }),
    series: buildSeries({
      'creative-systems': {
        title: 'Creative Systems',
        description: 'Colección de proyectos experimentales que exploran la intersección entre arte generativo, UX y automatización inteligente.',
      },
    }),
    artworks: buildArtworks({
      artleo: {
        title: 'Art Leo Creative Spaces',
        description: 'Experiencia inmersiva creada con Next.js y React Three Fiber para el artista Leonardo Silva, destacando arte interactivo y entornos 3D.',
        materials: ['WebGL', 'Animación 3D', 'Escultura Digital'],
      },
    }),
    thoughts: buildThoughts({
      'inclusive-design': {
        title: 'Diseño y Tecnología Inclusiva',
        excerpt: 'La tecnología es más humana cuando es accesible.',
        body: 'Creo que el diseño y la accesibilidad no son opuestos, sino aliados. En el ecosistema Monynha, cada interfaz nace con empatía: contraste adecuado, navegación por teclado y respeto al prefers-reduced-motion forman parte de nuestro ADN digital.',
      },
      'behind-monynha': {
        title: 'Detrás de Monynha',
        excerpt: 'Más que software, es un movimiento.',
        body: 'Monynha Softwares nació del deseo de unir diversidad y tecnología en un solo propósito: crear herramientas que empoderen a las personas y transformen ideas en experiencias digitales accesibles, creativas y fabulosas 💅.',
      },
    }),
    contact: {
      email: 'geral@monynha.com',
      availability: 'Disponible para colaboraciones y oportunidades creativas.',
      note: 'Escríbeme para proyectos, colaboraciones o ideas atrevidas.',
      successMessage: '¡Mensaje enviado con éxito! Me pondré en contacto pronto 🌈',
      errorMessage: '¡Ups! Algo salió mal. Intenta nuevamente más tarde 💜',
    },
  },
  fr: {
    lang: 'fr',
    profile: {
      name: 'Marcelo Santos',
      headline: 'Ingénieur Logiciel & Fondateur @ Monynha Softwares',
      location: 'Faro, Portugal',
      bio: 'Ingénieur logiciel spécialisé dans les produits numériques, l’automatisation et le DevOps. Passionné par l’accessibilité, l’open source et le design inclusif. Fondateur de Monynha Softwares — un laboratoire créatif qui relie technologie, diversité et art numérique.',
      avatar: '/avatar.jpg',
    },
    links: sharedLinks,
    ui: {
      nav: {
        home: 'Accueil',
        portfolio: 'Portfolio',
        about: 'À propos',
        thoughts: 'Réflexions',
        contact: 'Contact',
      },
      home: {
        featuredTitle: 'Projets à la Une',
        featuredSubtitle: 'Sélection des meilleurs travaux de l’écosystème Monynha',
        exploreCta: 'Explorer le Portfolio',
        contactCta: 'Entrer en contact',
        viewAll: 'Voir tous les projets',
      },
      portfolio: {
        title: 'Portfolio',
        subtitle: 'Projets et réalisations développés dans l’écosystème Monynha',
        viewProject: 'Voir le projet',
        filters: {
          all: 'Tous',
        },
        empty: 'Aucun projet trouvé dans cette catégorie.',
      },
      about: {
        title: 'À propos de moi',
        subtitle: 'Découvrez mon parcours et mon expérience',
        experience: 'Expérience',
        skills: 'Compétences',
      },
      thoughts: {
        title: 'Réflexions',
        subtitle: 'Réflexions sur la technologie, le design et l’accessibilité',
        back: 'Retour',
        readingTime: 'Lecture de 3 min',
        year: '2025',
      },
      contact: {
        title: 'Discutons',
        subtitle: 'Contactez-moi pour des projets, des partenariats ou des idées audacieuses !',
        infoTitle: 'Informations de contact',
        availabilityTitle: 'Disponibilité',
        formTitle: 'Envoyer un message',
        emailLabel: 'Email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        nameLabel: 'Nom',
        namePlaceholder: 'Votre nom',
        companyLabel: 'Entreprise',
        companyOptional: '(optionnel)',
        companyPlaceholder: 'Où vous travaillez',
        emailLabelForm: 'Email',
        emailPlaceholder: 'vous@email.com',
        projectLabel: 'Projet',
        projectPlaceholder: 'Parlez-moi du projet (optionnel)',
        messageLabel: 'Message',
        messagePlaceholder: 'Bonjour Marcelo, créons quelque chose de génial...',
        submit: 'Envoyer le message',
        submitting: 'Envoi...',
      },
      notFound: {
        title: 'Page introuvable',
        description: 'Oops ! Le contenu que vous cherchez n’existe pas ou a été déplacé.',
        cta: 'Retour à l’accueil',
      },
    },
    projects: buildProjects('fr', {
      'monynha-com': {
        name: 'Monynha.com',
        summary: 'Site institutionnel de Monynha Softwares — vitrine des produits, valeurs et vision de la marque.',
        category: 'Site web',
      },
      'monynha-tech': {
        name: 'Monynha Tech',
        summary: 'Blog technique et centre de documentation des projets Monynha. Plateforme destinée aux développeurs et aux étudiants.',
        category: 'Plateforme',
      },
      facodi: {
        name: 'FACODI',
        summary: 'Faculté Communautaire Digitale — portail gratuit d’enseignement supérieur ouvert et collaboratif, alimenté par des programmes officiels et du contenu public.',
        category: 'Éducation',
      },
      'boteco-pro': {
        name: 'Boteco Pro',
        summary: 'Application de gestion pour bars et restaurants, développée avec Flutter et Supabase.',
        category: 'Application',
      },
      'art-leo': {
        name: 'Art Leo',
        summary: 'Site web 3D immersif pour l’artiste Leonardo Silva, explorant l’art, l’animation et l’interaction numérique.',
        category: 'Portfolio',
      },
      monagent: {
        name: 'Monagent',
        summary: 'Framework modulaire en Python pour créer des agents IA et intégrer des automatisations (n8n, APIs, outils de données).',
        category: 'IA',
      },
    }),
    experience: buildExperience({
      'monynha-softwares': {
        role: 'Fondateur & Ingénieur Logiciel',
        location: 'Faro, Portugal',
        highlights: [
          'Création et maintenance de l’écosystème Monynha (sites, applications et automatisations).',
          'Développement full-stack avec Next.js, Supabase, Flutter et Payload CMS.',
          'Gestion des pipelines CI/CD (Coolify, GitHub Actions) et de l’infrastructure Docker.',
          'Association de l’art, de la technologie et de l’IA pour créer des produits numériques inclusifs.',
        ],
      },
      'university-algarve': {
        role: 'Étudiant en Ingénierie Logicielle',
        location: 'Faro, Portugal',
        highlights: [
          'Licence en Ingénierie Logicielle et Technologies de l’Information.',
          'Projets pratiques en IA, développement web et visualisation de l’information.',
          'Participation à des initiatives open source et à la recherche appliquée.',
        ],
      },
    }),
    skills: buildSkills('fr', {
      nextjs: { name: 'Next.js' },
      supabase: { name: 'Supabase' },
      flutter: { name: 'Flutter' },
      docker: { name: 'Docker' },
      payload: { name: 'Payload CMS' },
      cicd: { name: 'CI/CD (Coolify + GitHub Actions)' },
      framer: { name: 'Framer Motion' },
      r3f: { name: 'React Three Fiber' },
    }),
    series: buildSeries({
      'creative-systems': {
        title: 'Creative Systems',
        description: 'Collection de projets expérimentaux explorant l’intersection entre art génératif, UX et automatisation intelligente.',
      },
    }),
    artworks: buildArtworks({
      artleo: {
        title: 'Art Leo Creative Spaces',
        description: 'Expérience immersive réalisée avec Next.js et React Three Fiber pour l’artiste Leonardo Silva, mettant en avant l’art interactif et un environnement 3D.',
        materials: ['WebGL', 'Animation 3D', 'Sculpture Numérique'],
      },
    }),
    thoughts: buildThoughts({
      'inclusive-design': {
        title: 'Design et Technologie Inclusifs',
        excerpt: 'La technologie est plus humaine lorsqu’elle est accessible.',
        body: 'Je crois que design et accessibilité ne sont pas opposés mais alliés. Dans l’écosystème Monynha, chaque interface naît avec empathie : contraste adéquat, navigation au clavier et respect du prefers-reduced-motion font partie de notre ADN numérique.',
      },
      'behind-monynha': {
        title: 'Dans les coulisses de Monynha',
        excerpt: 'Plus que du logiciel, c’est un mouvement.',
        body: 'Monynha Softwares est né de l’envie d’unir diversité et technologie dans un même objectif : créer des outils qui autonomisent les personnes et transforment les idées en expériences numériques accessibles, créatives et flamboyantes 💅.',
      },
    }),
    contact: {
      email: 'geral@monynha.com',
      availability: 'Disponible pour des collaborations et des opportunités créatives.',
      note: 'Contactez-moi pour des projets, des partenariats ou des idées audacieuses !',
      successMessage: 'Message envoyé avec succès ! Je vous répondrai bientôt 🌈',
      errorMessage: 'Oups ! Une erreur est survenue. Réessayez plus tard 💜',
    },
  },
};

