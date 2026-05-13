import { normalizeUsername, formatUsername } from '../utils/profileRoutes';

export const TRENDING = ['#SemanaDeProvas', '#TechNaUnialfa', '#GrupoDeEstudos', '#CinemaNoCampus', '#Estagio2026'];

export const INITIAL_POSTS = [
  {
    id: 1,
    name: 'Beatriz Ferreira',
    username: '@biaads',
    avatar: 'https://i.pravatar.cc/120?img=47',
    text: 'Primeira semana de provas chegando e meu foco está 100% em Matemática Discreta 📚💻',
    time: 'há 12 min',
    likes: 18,
    comments: 4,
    shares: 2,
  },
  {
    id: 2,
    name: 'Lucas Matos',
    username: '@lucasmdev',
    avatar: 'https://i.pravatar.cc/120?img=59',
    text: 'Fechamos o grupo de estudos de Psicologia Social! Quem quiser entrar manda DM 🙌',
    time: 'há 32 min',
    likes: 27,
    comments: 9,
    shares: 3,
  },
  {
    id: 3,
    name: 'Marina Costa',
    username: '@marinac',
    avatar: 'https://i.pravatar.cc/120?img=5',
    text: 'Acabei de publicar um mini artigo sobre IA aplicada na educação. Feedbacks são super bem-vindos ❤️',
    time: 'há 1h',
    likes: 43,
    comments: 12,
    shares: 8,
  },
];

export const SUGGESTIONS = [
  { id: 1, name: 'Rafaela Lima', username: '@rafa_lima', course: 'Psicologia', avatar: 'https://i.pravatar.cc/120?img=25' },
  { id: 2, name: 'Pedro Souza', username: '@pedrosz', course: 'Sistemas de Informação', avatar: 'https://i.pravatar.cc/120?img=14' },
  { id: 3, name: 'Ana Clara', username: '@anaclara', course: 'Publicidade', avatar: 'https://i.pravatar.cc/120?img=32' },
];

export const DEFAULT_CURRENT_USER = {
  name: 'Aluno Alfa',
  username: '@alunoalfa',
  avatar: 'https://i.pravatar.cc/120?img=11',
  bio: 'Estudante da Unialfa, sempre em busca de networking e conhecimento.',
  course: 'Sistemas de Informação',
  interests: ['Tecnologia', 'Programação', 'Carreira'],
};

const BASE_PROFILES = [
  {
    name: 'Beatriz Ferreira',
    username: '@biaads',
    avatar: 'https://i.pravatar.cc/120?img=47',
    bio: 'Apaixonada por publicidade, séries e projetos criativos.',
    course: 'Publicidade e Propaganda',
    interests: ['Arte', 'Cinema', 'Empreendedorismo'],
  },
  {
    name: 'Lucas Matos',
    username: '@lucasmdev',
    avatar: 'https://i.pravatar.cc/120?img=59',
    bio: 'Dev em formação, líder de grupo de estudos e fã de IA.',
    course: 'Sistemas de Informação',
    interests: ['Programação', 'Tecnologia', 'Estudos'],
  },
  {
    name: 'Marina Costa',
    username: '@marinac',
    avatar: 'https://i.pravatar.cc/120?img=5',
    bio: 'Pesquisando IA aplicada à educação e psicologia do aprendizado.',
    course: 'Psicologia',
    interests: ['Psicologia', 'Tecnologia', 'Livros'],
  },
  {
    name: 'Rafaela Lima',
    username: '@rafa_lima',
    avatar: 'https://i.pravatar.cc/120?img=25',
    bio: 'Amo compartilhar dicas de organização para vida acadêmica.',
    course: 'Psicologia',
    interests: ['Estudos', 'Música', 'Carreira'],
  },
  {
    name: 'Pedro Souza',
    username: '@pedrosz',
    avatar: 'https://i.pravatar.cc/120?img=14',
    bio: 'Curioso por tudo que envolve dados, backend e produto.',
    course: 'Sistemas de Informação',
    interests: ['Programação', 'Tecnologia', 'Empreendedorismo'],
  },
  {
    name: 'Ana Clara',
    username: '@anaclara',
    avatar: 'https://i.pravatar.cc/120?img=32',
    bio: 'Criatividade e comunicação em cada projeto.',
    course: 'Publicidade',
    interests: ['Arte', 'Fotografia', 'Música'],
  },
];

export const SOCIAL_PROFILES = BASE_PROFILES.reduce((acc, profile) => {
  acc[normalizeUsername(profile.username)] = {
    ...profile,
    username: formatUsername(profile.username),
  };
  return acc;
}, {});

export const getProfileByUsername = (username) => SOCIAL_PROFILES[normalizeUsername(username)] ?? null;
