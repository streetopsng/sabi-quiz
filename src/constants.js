export const VEHICLES = [
  { name: 'Wrangler', icon: '🚙' }, { name: 'Hilux', icon: '🛻' }, { name: 'Corolla', icon: '🚗' },
  { name: 'Mustang', icon: '🏎️' }, { name: 'Phantom', icon: '🚘' }, { name: 'G-Wagon', icon: '🚐' },
  { name: 'Veyron', icon: '⚡' },
];

export const COLORS = [
  '#3B82F6', '#F97316', '#8B5CF6', '#22C55E',
  '#EF4444', '#EC4899', '#14B8A6', '#F59E0B',
  '#6366F1', '#10B981', '#F43F5E', '#84CC16',
  '#0EA5E9', '#A855F7', '#FF6B35', '#06B6D4',
];

export const QUESTIONS = [
  { q: 'What is the capital city of Nigeria?', type: 'mc', opts: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], answer: 1 },
  { q: 'The Great Wall of China is visible from space with the naked eye.', type: 'tf', opts: ['True', 'False'], answer: 1 },
  { q: 'How many continents are there on Earth?', type: 'mc', opts: ['5', '6', '7', '8'], answer: 2 },
  { q: 'Water boils at 100°C at sea level.', type: 'tf', opts: ['True', 'False'], answer: 0 },
  { q: 'Which planet is known as the Red Planet?', type: 'mc', opts: ['Venus', 'Jupiter', 'Saturn', 'Mars'], answer: 3 },
  { q: 'The Amazon River is the longest river in the world.', type: 'tf', opts: ['True', 'False'], answer: 1 },
  { q: 'Which country has the largest population in the world as of 2024?', type: 'mc', opts: ['India', 'USA', 'China', 'Indonesia'], answer: 0 },
  { q: 'A group of lions is called a pride.', type: 'tf', opts: ['True', 'False'], answer: 0 },
  { q: 'What is the chemical symbol for gold?', type: 'mc', opts: ['Go', 'Gd', 'Au', 'Ag'], answer: 2 },
  { q: 'The human body has 206 bones.', type: 'tf', opts: ['True', 'False'], answer: 0 },
  { q: 'Which ocean is the largest in the world?', type: 'mc', opts: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
  { q: 'Shakespeare was born in London.', type: 'tf', opts: ['True', 'False'], answer: 1 },
  { q: 'What is the hardest natural substance on Earth?', type: 'mc', opts: ['Gold', 'Diamond', 'Platinum', 'Quartz'], answer: 1 },
  { q: 'Bats are completely blind.', type: 'tf', opts: ['True', 'False'], answer: 1 },
  { q: 'How many strings does a standard guitar have?', type: 'mc', opts: ['4', '5', '6', '7'], answer: 2 },
  { q: 'The Sun is a star.', type: 'tf', opts: ['True', 'False'], answer: 0 },
  { q: 'Which gas do plants absorb during photosynthesis?', type: 'mc', opts: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2 },
  { q: 'Mount Everest is located in Africa.', type: 'tf', opts: ['True', 'False'], answer: 1 },
  { q: 'How many players are on a standard soccer team on the pitch?', type: 'mc', opts: ['9', '10', '11', '12'], answer: 2 },
  { q: 'Dolphins are mammals.', type: 'tf', opts: ['True', 'False'], answer: 0 },
];

export const LETTERS = ['A', 'B', 'C', 'D'];

export const INITIAL_OPPONENTS = [
  { name: 'Phantom', vehicle: '🚘', color: '#8B5CF6', banter: 'Quietly dangerous.', score: 0, streak: 0 },
  { name: 'Wrangler', vehicle: '🚙', color: '#22C55E', banter: 'May the best driver win.', score: 0, streak: 0 },
  { name: 'Mustang', vehicle: '🏎️', color: '#EF4444', banter: 'I came here to win.', score: 0, streak: 0 },
  { name: 'Hilux', vehicle: '🛻', color: '#3B82F6', banter: 'Underestimate me — please.', score: 0, streak: 0 },
];

export const INITIAL_PLAYER = {
  name: 'You',
  vehicle: '🚗',
  color: '#F59E0B',
  banter: '',
  score: 0,
  streak: 0
};
