import { CardPromptInput } from '../types';

export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  data: CardPromptInput;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'cozy-partners',
    name: 'Cozy & Deeply Loving',
    description: 'Tender, intimate gratitude for everyday life together',
    data: {
      partnerName: 'Maya',
      partnerNickname: 'Little Bear',
      senderName: 'Julian',
      relationshipStage: 'Together 3 years',
      tone: 'deeply-romantic',
      cardFormat: 'standard-card',
      favoriteMemories: 'Our rainy Sunday mornings making blueberry pancakes and listening to old jazz records while the world stays outside',
      quirksAndReasons: 'How you scrunch your nose when you laugh hard, and how you always leave the last bite of dessert for me',
      insideJokes: 'The great garlic bread smoke alarm incident of 2024',
      futureHopes: 'Exploring the coast of Portugal together this autumn',
      extraNotes: 'Make sure it highlights how safe and calm she makes me feel.',
    },
  },
  {
    id: 'playful-banter',
    name: 'Playful & Teasing',
    description: 'Charming humor mixed with undeniable affection',
    data: {
      partnerName: 'Sam',
      partnerNickname: 'Trouble',
      senderName: 'Alex',
      relationshipStage: 'Dating 1 year',
      tone: 'playful-funny',
      cardFormat: 'standard-card',
      favoriteMemories: 'That disastrous mini-golf date where you celebrated a hole-in-one on the wrong hole',
      quirksAndReasons: 'Your ridiculously strong opinions on pizza crusts and how you steal all the blankets every night without remorse',
      insideJokes: 'Code red: someone forgot where they parked again',
      futureHopes: 'Finally beating you at Mario Kart without cheats',
      extraNotes: 'Keep it lighthearted, cheeky, but end on a genuinely sweet note.',
    },
  },
  {
    id: 'long-distance',
    name: 'Long Distance Love',
    description: 'Counting down the days and celebrating deep connection across miles',
    data: {
      partnerName: 'Leo',
      partnerNickname: 'My Sun',
      senderName: 'Elena',
      relationshipStage: 'Long distance (18 months)',
      tone: 'poetic-lyrical',
      cardFormat: 'long-letter',
      favoriteMemories: 'That goodbye at airport terminal 3 where neither of us could let go, and our midnight FaceTime sleep calls',
      quirksAndReasons: 'Your gentle voice right before you fall asleep and how you send me photos of stray dogs you see during your commute',
      insideJokes: 'Flight tracking obsession',
      futureHopes: 'The day we unpack our boxes into our first shared apartment',
      extraNotes: 'Acknowledge the miles between us, but celebrate that our love makes distance feel small.',
    },
  },
  {
    id: 'first-valentines',
    name: 'First Valentine’s Day',
    description: 'Sweet, exciting butterflies of new love',
    data: {
      partnerName: 'Chloe',
      partnerNickname: 'Sunshine',
      senderName: 'Marcus',
      relationshipStage: 'First Valentine’s Day together (6 months)',
      tone: 'short-sweet',
      cardFormat: 'standard-card',
      favoriteMemories: 'Our first date when the café closed and we ended up talking on the park bench until 1 AM in the cold',
      quirksAndReasons: 'Your contagious laugh and the way your eyes light up whenever you talk about your photography',
      insideJokes: 'The cinnamon latte bet',
      futureHopes: 'Our first summer road trip together',
      extraNotes: 'Keep it fresh, sincere, and not overly intense, full of genuine butterflies.',
    },
  },
];
