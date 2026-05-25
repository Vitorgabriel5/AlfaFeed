import { normalizeUsername, formatUsername } from '../utils/profileRoutes';

export const TRENDING = ['#SemanaDeProvas', '#TechNaUnialfa', '#GrupoDeEstudos', '#CinemaNoCampus', '#Estagio2026'];

export const getProfileByUsername = (username) => SOCIAL_PROFILES[normalizeUsername(username)] ?? null;
