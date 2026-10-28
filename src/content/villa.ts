export const studyNavigation = [
  { label: 'The villa', href: '/#about' },
  { label: 'Through the seasons', href: '/#seasons' },
  { label: 'A place to stay', href: '/#suites' },
  { label: 'Little stories', href: '/#stories' },
  { label: 'The journal', href: '/#journal' },
  { label: 'Beyond the garden', href: '/#places' },
] as const;

export type StudyMedia = {
  name: 'lake' | 'room' | 'terrace' | 'dining' | 'garden';
  alt: string;
  width: number;
  height: number;
  position?: string;
};
export const media = {
  lake: { name: 'lake', alt: 'The bow of a wooden boat on an alpine lake beneath forested mountains', width: 1920, height: 1280, position: 'center 55%' },
  room: { name: 'room', alt: 'A warmly lit bedroom with timber furnishings and a bed dressed in green and white', width: 1920, height: 1280 },
  terrace: { name: 'terrace', alt: 'Sunlit resort architecture surrounding a blue outdoor pool', width: 1920, height: 1280 },
  dining: { name: 'dining', alt: 'An intimate dining room with carefully set tables and warm lighting', width: 1920, height: 1280 },
  garden: { name: 'garden', alt: 'Layers of green conifers fading into mist', width: 1920, height: 1280 },
} satisfies Record<string, StudyMedia>;
export const suites = [
  { title: 'The Garden House', note: 'A green and peaceful retreat', description: 'An imagined hideaway for slow mornings, open windows and a book left unfinished.', image: media.garden },
  { title: 'The Villa Rooms', note: 'Room for a little daydreaming', description: 'Soft textures, generous light and the simple pleasure of having nowhere to rush.', image: media.room },
  { title: 'The Pool Pavilion', note: 'Life at the water’s edge', description: 'A sun-drenched setting imagined around afternoon swims and long conversations.', image: media.terrace },
] as const;

