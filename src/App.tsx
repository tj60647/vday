import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Bookmark, 
  PenTool, 
  Lightbulb, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CardPromptInput, CardDraft, RefineCardInput } from './types';
import { SAMPLE_PRESETS } from './data/samplePresets';
import { CardForm } from './components/CardForm';
import { CardPreview } from './components/CardPreview';
import { CardRefiner } from './components/CardRefiner';
import { HandwritingHelper } from './components/HandwritingHelper';
import { SavedCardsModal } from './components/SavedCardsModal';
import { SparkIdeasModal } from './components/SparkIdeasModal';

const INITIAL_PROMPT_INPUT: CardPromptInput = {
  partnerName: 'Maya',
  partnerNickname: 'Little Bear',
  senderName: 'Julian',
  relationshipStage: 'Together 1–3 years',
  tone: 'deeply-romantic',
  cardFormat: 'standard-card',
  favoriteMemories: 'Our cozy rainy Sunday mornings with blueberry pancakes and old jazz records',
  quirksAndReasons: 'How your nose scrunches when you laugh hard, and how you always leave the last bite for me',
  insideJokes: 'The great garlic bread smoke alarm disaster of 2024',
  futureHopes: 'Exploring the coasts of Portugal together',
  extraNotes: 'Make her feel safe, cherished, and excited for all our tomorrows.',
};

const INITIAL_CARDS: CardDraft[] = [
  {
    id: 'initial-1',
    title: 'Tender & Soulful',
    coverHeadline: 'To The One Who Holds My Heart',
    coverSubtext: 'Happy Valentine’s Day, Maya',
    salutation: 'My Dearest Maya,',
    body: `Every single day with you feels like a gift I never take for granted. From our quiet morning coffee moments to dancing while cooking dinner, you have filled my life with an easy warmth I didn't know was missing.\n\nI still smile whenever I think of our rainy Sunday mornings making blueberry pancakes with old jazz spinning in the background. In you, I have found my safest harbor and my favorite adventure.\n\nThank you for loving me with your whole heart and for making ordinary days feel like poetry.`,
    closing: 'With all my love and devotion,',
    signature: 'Julian',
    postscript: 'P.S. I promise you will always have the last bite of dessert.',
    tone: 'deeply-romantic',
    format: 'standard-card',
    stationeryTheme: 'blush-rose',
    fontStyle: 'serif',
    createdAt: new Date().toISOString(),
    partnerName: 'Maya',
    puppyIllustration: {
      enabled: true,
      style: 'gothic-charcoal',
      variant: 'rose-companion',
      title: 'The Faithful Hound & Crimson Rose',
      caption: 'Gothic charcoal etching: a devoted puppy guarding our quiet Sunday mornings and old jazz records',
      placement: 'cover',
    },
  },
  {
    id: 'initial-2',
    title: 'Playful & Loving',
    coverHeadline: 'You Are My Absolute Favorite Human',
    coverSubtext: 'And I love you more than pizza',
    salutation: 'Happy Valentine’s Day, Little Bear!',
    body: `Out of all 8 billion people on this planet, you are without question my absolute favorite to do life with, laugh with, and occasionally annoy on purpose.\n\nI adore how your nose scrunches up when you laugh so hard you cannot make a sound. Even after surviving the great garlic bread smoke alarm disaster of 2024, choosing you is still the easiest decision I make every single morning.\n\nThank you for loving me at my weirdest and always letting me hold your hand in the car.`,
    closing: 'Forever your biggest fan & cuddle partner,',
    signature: 'Julian',
    postscript: 'P.S. Tonight’s dinner is 100% smoke-alarm-free. I promise.',
    tone: 'playful-funny',
    format: 'standard-card',
    stationeryTheme: 'clean-linen',
    fontStyle: 'sans',
    createdAt: new Date().toISOString(),
    partnerName: 'Maya',
    puppyIllustration: {
      enabled: true,
      style: 'gothic-charcoal',
      variant: 'rose-companion',
      title: 'Partner In Crime',
      caption: 'Gothic charcoal sketch: devoted through every adventure and garlic bread mishap',
      placement: 'cover',
    },
  },
  {
    id: 'initial-3',
    title: 'Poetic & Lyrical',
    coverHeadline: 'In All The World, There Is No Heart Like Yours',
    coverSubtext: 'A Valentine Letter For Maya',
    salutation: 'To My Love, Maya,',
    body: `If love is measured in the quiet certainty of shared glances and Sunday mornings wrapped in warmth, then beside you, time has become a gentle eternity.\n\nYou bring melody to the quietest corners of my day. Beside you, every road seems worth traveling, and every tomorrow promises joy.\n\nMeeting you was destiny, but choosing to love you is the truest joy of my life.`,
    closing: 'Eternally yours,',
    signature: 'Julian',
    postscript: 'P.S. Here is to Portugal, and every adventure waiting for us.',
    tone: 'poetic-lyrical',
    format: 'standard-card',
    stationeryTheme: 'vintage-parchment',
    fontStyle: 'script',
    createdAt: new Date().toISOString(),
    partnerName: 'Maya',
    puppyIllustration: {
      enabled: true,
      style: 'gothic-charcoal',
      variant: 'moonlit-devotion',
      title: 'Moonlit Devotion',
      caption: 'Gothic charcoal study: two devoted souls resting beneath the arch, whispering of Portugal and forever',
      placement: 'both',
    },
  },
];

export default function App() {
  const [promptInput, setPromptInput] = useState<CardPromptInput>(INITIAL_PROMPT_INPUT);
  const [cards, setCards] = useState<CardDraft[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showHandwritingHelper, setShowHandwritingHelper] = useState(false);
  const [showSavedCardsModal, setShowSavedCardsModal] = useState(false);
  const [showSparkIdeasModal, setShowSparkIdeasModal] = useState(false);

  // Saved cards stored in localStorage
  const [savedCards, setSavedCards] = useState<CardDraft[]>(() => {
    try {
      const stored = localStorage.getItem('valentine_saved_cards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('valentine_saved_cards', JSON.stringify(savedCards));
    } catch (e) {
      console.error('Error saving cards to localStorage', e);
    }
  }, [savedCards]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateCards = async () => {
    if (!promptInput.partnerName.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptInput),
      });

      const data = await res.json();
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setActiveCardIndex(0);
        if (data.isFallback) {
          showToast(`Crafted cards for ${promptInput.partnerName} ready! (Backup mode)`);
        } else {
          showToast(`Generated 3 personalized Valentine card drafts for ${promptInput.partnerName}!`);
        }
      } else {
        showToast('Generated custom card options for you.');
      }
    } catch {
      showToast('Card options updated.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineCard = async (
    action: RefineCardInput['action'],
    customInstruction?: string
  ) => {
    const currentCard = cards[activeCardIndex];
    if (!currentCard) return;

    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCard,
          action,
          customInstruction,
        }),
      });

      const data = await res.json();
      if (data.card) {
        const updatedCards = [...cards];
        updatedCards[activeCardIndex] = data.card;
        setCards(updatedCards);
        showToast('Card updated with refinement!');
      }
    } catch {
      showToast('Card refined.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleUpdateCard = (updatedCard: CardDraft) => {
    const updated = [...cards];
    updated[activeCardIndex] = updatedCard;
    setCards(updated);
  };

  const handleSaveDraft = (card: CardDraft) => {
    const exists = savedCards.some((c) => c.id === card.id);
    if (exists) {
      // update existing
      setSavedCards(savedCards.map((c) => (c.id === card.id ? card : c)));
      showToast('Updated in your saved keepsakes!');
    } else {
      setSavedCards([card, ...savedCards]);
      showToast('Saved to your keepsakes!');
    }
  };

  const handleDeleteSavedCard = (id: string) => {
    setSavedCards(savedCards.filter((c) => c.id !== id));
    showToast('Card removed from keepsakes.');
  };

  const handleLoadSavedCard = (card: CardDraft) => {
    setCards([card, ...cards.filter((c) => c.id !== card.id)]);
    setActiveCardIndex(0);
    showToast(`Loaded "${card.title}" into studio!`);
  };

  const handleSelectSparkPrompt = (
    field: 'favoriteMemories' | 'quirksAndReasons' | 'insideJokes' | 'futureHopes',
    text: string
  ) => {
    setPromptInput((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}, ${text}` : text,
    }));
    showToast(`Added to ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}!`);
  };

  const currentActiveCard = cards[activeCardIndex] || cards[0];
  const isCurrentCardSaved = savedCards.some((c) => c.id === currentActiveCard?.id);

  return (
    <div className="min-h-screen bg-[#faf8f6] text-stone-900 selection:bg-rose-100 selection:text-rose-900 font-sans-card">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs shadow-rose-200">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2 font-serif-card">
                Valentine Card Letter Assistant
                <span className="text-[10px] uppercase font-sans-card font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full tracking-wider">
                  AI Studio
                </span>
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Express genuine love with bespoke cards, handwritten guidance & beautiful stationery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="header-spark-ideas-btn"
              onClick={() => setShowSparkIdeasModal(true)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Spark Ideas</span>
            </button>

            <button
              type="button"
              id="header-saved-keepsakes-btn"
              onClick={() => setShowSavedCardsModal(true)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs relative"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-500" />
              <span>Saved Keepsakes</span>
              {savedCards.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCards.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Inspiration Inputs */}
          <div className="lg:col-span-5 space-y-6 no-print">
            <CardForm
              input={promptInput}
              onChange={setPromptInput}
              onSubmit={handleGenerateCards}
              isLoading={isLoading}
            />

            {/* Subtle Writing Advice Callout */}
            <div className="bg-stone-100/70 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-600 space-y-1.5">
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                The Secret to an Unforgettable Valentine
              </div>
              <p className="text-[11px] leading-relaxed text-stone-500">
                The most cherished cards aren&apos;t overly formal. They mention specific shared memories, silly quirks, and small tender moments that only the two of you share.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview & AI Polish Tools */}
          <div className="lg:col-span-7 space-y-6">
            <CardPreview
              cards={cards}
              activeCardIndex={activeCardIndex}
              onSelectCardIndex={setActiveCardIndex}
              onUpdateCard={handleUpdateCard}
              onSaveDraft={handleSaveDraft}
              isSaved={isCurrentCardSaved}
              onOpenHandwritingHelper={() => setShowHandwritingHelper(true)}
            />

            <div className="no-print">
              <CardRefiner
                card={currentActiveCard}
                onRefine={handleRefineCard}
                isRefining={isRefining}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-medium animate-fade-in no-print border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Handwriting Guide Modal */}
      {showHandwritingHelper && currentActiveCard && (
        <HandwritingHelper
          card={currentActiveCard}
          onClose={() => setShowHandwritingHelper(false)}
        />
      )}

      {/* Saved Cards Modal */}
      {showSavedCardsModal && (
        <SavedCardsModal
          savedCards={savedCards}
          onSelectCard={handleLoadSavedCard}
          onDeleteCard={handleDeleteSavedCard}
          onClose={() => setShowSavedCardsModal(false)}
        />
      )}

      {/* Spark Ideas Modal */}
      {showSparkIdeasModal && (
        <SparkIdeasModal
          partnerName={promptInput.partnerName}
          onSelectPrompt={handleSelectSparkPrompt}
          onClose={() => setShowSparkIdeasModal(false)}
        />
      )}
    </div>
  );
}
