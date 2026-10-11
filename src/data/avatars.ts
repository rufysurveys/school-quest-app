export interface GameAvatar {
  id: string;
  name: string;
  title: string;
  element: string;
  specialMove: string;
  color: string;
  accentBg: string;
  icon: string;
}

export const STREET_FIGHTER_AVATARS: GameAvatar[] = [
  {
    id: 'ryu',
    name: 'Ryu',
    title: 'The Master of Focus',
    element: 'Wind & Energy',
    specialMove: 'Hadoken ☄️',
    color: '#ef4444',
    accentBg: 'from-red-500/20 to-slate-900',
    icon: '🥋'
  },
  {
    id: 'ken',
    name: 'Ken Masters',
    title: 'The Fiery Striker',
    element: 'Fire & Passion',
    specialMove: 'Shoryuken 🔥',
    color: '#f97316',
    accentBg: 'from-orange-500/20 to-slate-900',
    icon: '🥊'
  },
  {
    id: 'chun-li',
    name: 'Chun-Li',
    title: 'The Lightning Kick',
    element: 'Speed & Justice',
    specialMove: 'Hyakuretsukyaku ⚡',
    color: '#06b6d4',
    accentBg: 'from-cyan-500/20 to-slate-900',
    icon: '👠'
  },
  {
    id: 'guile',
    name: 'Guile',
    title: 'The Sonic Vanguard',
    element: 'Precision & Tactics',
    specialMove: 'Sonic Boom 💥',
    color: '#10b981',
    accentBg: 'from-emerald-500/20 to-slate-900',
    icon: '🎖️'
  },
  {
    id: 'akuma',
    name: 'Akuma',
    title: 'The Raging Scholar',
    element: 'Pure Power',
    specialMove: 'Shun Goku Satsu 👹',
    color: '#8b5cf6',
    accentBg: 'from-purple-500/20 to-slate-900',
    icon: '👺'
  },
  {
    id: 'cammy',
    name: 'Cammy',
    title: 'The Delta Specialist',
    element: 'Agility & Reflexes',
    specialMove: 'Spiral Arrow 🌪️',
    color: '#14b8a6',
    accentBg: 'from-teal-500/20 to-slate-900',
    icon: '🎯'
  },
  {
    id: 'zangief',
    name: 'Zangief',
    title: 'The Iron Titan',
    element: 'Strength & Grit',
    specialMove: 'Spinning Piledriver 🌪️',
    color: '#dc2626',
    accentBg: 'from-red-600/20 to-slate-900',
    icon: '🤼'
  },
  {
    id: 'dhalsim',
    name: 'Dhalsim',
    title: 'The Mind Sage',
    element: 'Wisdom & Flexibility',
    specialMove: 'Yoga Flame 🧘',
    color: '#eab308',
    accentBg: 'from-yellow-500/20 to-slate-900',
    icon: '🧘'
  },
  {
    id: 'm-bison',
    name: 'M. Bison',
    title: 'The Psycho Overlord',
    element: 'Dominance & Strategy',
    specialMove: 'Psycho Crusher 🔮',
    color: '#9333ea',
    accentBg: 'from-fuchsia-500/20 to-slate-900',
    icon: '👑'
  },
  {
    id: 'blanka',
    name: 'Blanka',
    title: 'The Electric Dynamo',
    element: 'Wild Instincts',
    specialMove: 'Electric Thunder ⚡',
    color: '#84cc16',
    accentBg: 'from-lime-500/20 to-slate-900',
    icon: '🔋'
  }
];

export function getAvatarById(id: string): GameAvatar {
  return STREET_FIGHTER_AVATARS.find(a => a.id === id) || STREET_FIGHTER_AVATARS[0];
}
