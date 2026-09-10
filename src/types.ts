export type CardTone = 
  | 'deeply-romantic'
  | 'playful-funny'
  | 'poetic-lyrical'
  | 'short-sweet'
  | 'tender-nostalgic'
  | 'sweet-cheesy';

export type CardFormat = 
  | 'standard-card'
  | 'mini-love-note'
  | 'long-letter'
  | 'rhyming-poem'
  | 'reasons-why';

export type StationeryTheme = 
  | 'blush-rose'
  | 'vintage-parchment'
  | 'midnight-gold'
  | 'clean-linen'
  | 'botanical-sage';

export type CardFontStyle = 'serif' | 'script' | 'vibes' | 'sans';

export interface CardDraft {
  id: string;
  title: string;
  salutation: string;
  body: string;
  closing: string;
  signature: string;
  postscript?: string;
  tone: CardTone | string;
  format: CardFormat | string;
  coverHeadline?: string;
  coverSubtext?: string;
  stationeryTheme: StationeryTheme;
  fontStyle: CardFontStyle;
  createdAt: string;
  partnerName: string;
}

export interface CardPromptInput {
  partnerName: string;
  partnerNickname?: string;
  senderName?: string;
  relationshipStage: string;
  tone: CardTone;
  cardFormat: CardFormat;
  favoriteMemories?: string;
  quirksAndReasons?: string;
  insideJokes?: string;
  futureHopes?: string;
  extraNotes?: string;
}

export interface RefineCardInput {
  currentCard: CardDraft;
  action: 'sweeter' | 'funnier' | 'shorten' | 'poetic' | 'add-ps' | 'more-natural' | 'rhyme' | 'custom';
  customInstruction?: string;
}

export interface StarterIdea {
  id: string;
  category: string;
  prompt: string;
  description: string;
}
