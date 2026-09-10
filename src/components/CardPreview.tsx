import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Edit3, 
  RotateCw, 
  Type, 
  Palette, 
  Eye, 
  PenTool, 
  BookOpen, 
  Heart,
  FileText
} from 'lucide-react';
import { CardDraft, StationeryTheme, CardFontStyle, PuppyIllustration } from '../types';
import { GothicPuppyIllustration } from './GothicPuppyIllustration';

interface CardPreviewProps {
  cards: CardDraft[];
  activeCardIndex: number;
  onSelectCardIndex: (index: number) => void;
  onUpdateCard: (updatedCard: CardDraft) => void;
  onSaveDraft: (card: CardDraft) => void;
  isSaved: boolean;
  onOpenHandwritingHelper: () => void;
}

const THEMES: { id: StationeryTheme; label: string; bgClass: string; borderClass: string; textClass: string; accentClass: string }[] = [
  {
    id: 'blush-rose',
    label: 'Blush & Rose',
    bgClass: 'bg-gradient-to-b from-[#fffbfc] to-[#fff3f6]',
    borderClass: 'border-rose-200/80',
    textClass: 'text-stone-800',
    accentClass: 'text-rose-600',
  },
  {
    id: 'vintage-parchment',
    label: 'Vintage Parchment',
    bgClass: 'bg-[#faf6ee]',
    borderClass: 'border-amber-200/80',
    textClass: 'text-stone-900',
    accentClass: 'text-amber-800',
  },
  {
    id: 'midnight-gold',
    label: 'Midnight Velvet',
    bgClass: 'bg-stone-900 text-stone-100',
    borderClass: 'border-amber-500/40',
    textClass: 'text-stone-100',
    accentClass: 'text-amber-300',
  },
  {
    id: 'clean-linen',
    label: 'Clean Linen',
    bgClass: 'bg-white',
    borderClass: 'border-stone-200',
    textClass: 'text-stone-800',
    accentClass: 'text-stone-600',
  },
  {
    id: 'botanical-sage',
    label: 'Botanical Sage',
    bgClass: 'bg-gradient-to-b from-[#f9faf8] to-[#f0f4ee]',
    borderClass: 'border-emerald-200',
    textClass: 'text-stone-800',
    accentClass: 'text-emerald-700',
  },
];

const FONTS: { id: CardFontStyle; label: string; fontClass: string }[] = [
  { id: 'serif', label: 'Classic Serif', fontClass: 'font-serif-card' },
  { id: 'script', label: 'Cursive Calligraphy', fontClass: 'font-script' },
  { id: 'vibes', label: 'Romantic Script', fontClass: 'font-vibes' },
  { id: 'sans', label: 'Modern Sans', fontClass: 'font-sans-card' },
];

export const CardPreview: React.FC<CardPreviewProps> = ({
  cards,
  activeCardIndex,
  onSelectCardIndex,
  onUpdateCard,
  onSaveDraft,
  isSaved,
  onOpenHandwritingHelper,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'inside' | 'cover' | 'both'>('inside');
  const [isEditingDirectly, setIsEditingDirectly] = useState(false);

  const card = cards[activeCardIndex] || cards[0];

  if (!card) {
    return null;
  }

  const currentTheme = THEMES.find((t) => t.id === card.stationeryTheme) || THEMES[0];
  const currentFont = FONTS.find((f) => f.id === card.fontStyle) || FONTS[0];

  const handleCopy = () => {
    const fullLetter = `${card.salutation}\n\n${card.body}\n\n${card.closing}\n${card.signature}${
      card.postscript ? `\n\n${card.postscript}` : ''
    }`;
    navigator.clipboard.writeText(fullLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const updateField = (field: keyof CardDraft, value: string) => {
    onUpdateCard({
      ...card,
      [field]: value,
    });
  };

  const isDarkTheme = card.stationeryTheme === 'midnight-gold';

  const puppyIll: PuppyIllustration = card.puppyIllustration || {
    enabled: true,
    style: 'gothic-charcoal',
    variant: 'rose-companion',
    title: 'The Faithful Hound',
    caption: `Gothic charcoal study: guarding our love and cherished memories for ${card.partnerName}`,
    placement: 'cover',
  };

  const updatePuppyIllustration = (updates: Partial<PuppyIllustration>) => {
    const current = card.puppyIllustration || {
      enabled: true,
      style: 'gothic-charcoal',
      variant: 'rose-companion',
      title: 'The Faithful Hound',
      caption: `Gothic charcoal study: guarding our love and cherished memories for ${card.partnerName}`,
      placement: 'cover',
    };
    onUpdateCard({
      ...card,
      puppyIllustration: {
        ...current,
        ...updates,
      },
    });
  };

  return (
    <div id="card-preview-container" className="space-y-4">
      {/* Top Options Bar: Switch between Draft 1, 2, 3 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Drafts:
          </span>
          {cards.map((c, idx) => (
            <button
              key={c.id || idx}
              type="button"
              id={`select-draft-btn-${idx}`}
              onClick={() => onSelectCardIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCardIndex === idx
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              Option {idx + 1}: {c.title}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setViewMode('inside')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
              viewMode === 'inside' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3 h-3" />
            Inside Letter
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cover')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
              viewMode === 'cover' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3 h-3" />
            Card Cover
          </button>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
              viewMode === 'both' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Full Card
          </button>
        </div>
      </div>

      {/* Style & Stationery Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 px-4 py-3 shadow-xs space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Stationery Theme */}
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500 font-medium">Stationery:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateField('stationeryTheme', theme.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition-all border ${
                    card.stationeryTheme === theme.id
                      ? 'border-rose-400 bg-rose-50 text-rose-900 font-medium shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500 font-medium">Font:</span>
            <div className="flex items-center gap-1">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => updateField('fontStyle', font.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition-all border ${
                    card.fontStyle === font.id
                      ? 'border-rose-400 bg-rose-50 text-rose-900 font-medium shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gothic Puppy Charcoal Illustration Setting Bar */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="toggle-puppy-illustration-btn"
              onClick={() => updatePuppyIllustration({ enabled: !puppyIll.enabled })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                puppyIll.enabled
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🐾</span>
              <span>Gothic Puppy Charcoal Art</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${puppyIll.enabled ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-600'}`}>
                {puppyIll.enabled ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          {puppyIll.enabled && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Variant choice */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => updatePuppyIllustration({ variant: 'rose-companion' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    puppyIll.variant === 'rose-companion'
                      ? 'bg-white text-stone-900 shadow-2xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Hound & Rose
                </button>
                <button
                  type="button"
                  onClick={() => updatePuppyIllustration({ variant: 'moonlit-devotion' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    puppyIll.variant === 'moonlit-devotion'
                      ? 'bg-white text-stone-900 shadow-2xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Moonlit Duo
                </button>
              </div>

              {/* Placement choice */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => updatePuppyIllustration({ placement: 'cover' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    puppyIll.placement === 'cover'
                      ? 'bg-white text-stone-900 shadow-2xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Cover
                </button>
                <button
                  type="button"
                  onClick={() => updatePuppyIllustration({ placement: 'inside' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    puppyIll.placement === 'inside'
                      ? 'bg-white text-stone-900 shadow-2xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Inside
                </button>
                <button
                  type="button"
                  onClick={() => updatePuppyIllustration({ placement: 'both' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    puppyIll.placement === 'both'
                      ? 'bg-white text-stone-900 shadow-2xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="toggle-edit-mode-btn"
            onClick={() => setIsEditingDirectly(!isEditingDirectly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isEditingDirectly
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            {isEditingDirectly ? 'Finish Editing' : 'Click to Edit Text'}
          </button>

          <button
            type="button"
            id="open-handwriting-assistant-btn"
            onClick={onOpenHandwritingHelper}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <PenTool className="w-3.5 h-3.5 text-rose-500" />
            Handwriting Guide
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="save-draft-btn"
            onClick={() => onSaveDraft(card)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                Saved!
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                Save Card
              </>
            )}
          </button>

          <button
            type="button"
            id="print-card-btn"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            Print / PDF
          </button>

          <button
            type="button"
            id="copy-card-text-btn"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Actual Rendered Card / Stationery Stage */}
      <div className="w-full flex justify-center py-2">
        <div className={`w-full max-w-3xl space-y-6 ${viewMode === 'both' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
          
          {/* Card Front Cover View */}
          {(viewMode === 'cover' || viewMode === 'both') && (
            <div
              id="card-cover-preview"
              className={`card-print-area relative rounded-2xl border ${currentTheme.borderClass} ${currentTheme.bgClass} p-8 sm:p-12 shadow-md transition-all flex flex-col items-center justify-center text-center min-h-[440px] overflow-hidden`}
            >
              {/* Decorative Corner Filigree */}
              <div className="absolute top-4 left-4 text-xs tracking-widest uppercase opacity-30 select-none">
                ✦ ✧ ✦
              </div>
              <div className="absolute top-4 right-4 text-xs tracking-widest uppercase opacity-30 select-none">
                ✦ ✧ ✦
              </div>
              <div className="absolute bottom-4 left-4 text-xs tracking-widest uppercase opacity-30 select-none">
                ✦ ✧ ✦
              </div>
              <div className="absolute bottom-4 right-4 text-xs tracking-widest uppercase opacity-30 select-none">
                ✦ ✧ ✦
              </div>

              {/* Central Illustration or Heart Emblem */}
              {puppyIll.enabled && (puppyIll.placement === 'cover' || puppyIll.placement === 'both') ? (
                <div className="w-full">
                  <GothicPuppyIllustration
                    illustration={puppyIll}
                    context="cover"
                    partnerName={card.partnerName}
                    letterTopic={card.title}
                    isDarkTheme={isDarkTheme}
                    isEditing={isEditingDirectly}
                    onUpdateTitle={(title) => updatePuppyIllustration({ title })}
                    onUpdateCaption={(caption) => updatePuppyIllustration({ caption })}
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-full border border-dashed ${currentTheme.borderClass} flex items-center justify-center mx-auto mb-2`}>
                    <Heart className={`w-7 h-7 fill-current ${currentTheme.accentClass} opacity-80`} />
                  </div>
                </div>
              )}

              {/* Cover Headline */}
              {isEditingDirectly ? (
                <div className="w-full space-y-3">
                  <input
                    type="text"
                    value={card.coverHeadline || ''}
                    onChange={(e) => updateField('coverHeadline', e.target.value)}
                    placeholder="Front Cover Title"
                    className="w-full text-center text-2xl font-bold bg-white/70 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                  <input
                    type="text"
                    value={card.coverSubtext || ''}
                    onChange={(e) => updateField('coverSubtext', e.target.value)}
                    placeholder="Cover subtitle"
                    className="w-full text-center text-sm bg-white/70 border border-stone-300 rounded-lg p-1.5 focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3
                    className={`text-2xl sm:text-3xl font-bold tracking-tight ${currentTheme.textClass} ${
                      card.fontStyle === 'script' || card.fontStyle === 'vibes' ? 'text-4xl sm:text-5xl font-normal' : ''
                    } ${currentFont.fontClass}`}
                  >
                    {card.coverHeadline || "Happy Valentine's Day"}
                  </h3>
                  <p className={`text-sm sm:text-base font-light tracking-wide uppercase opacity-75 ${currentTheme.textClass}`}>
                    {card.coverSubtext || `For ${card.partnerName}`}
                  </p>
                </div>
              )}

              {/* Bottom Card Crest */}
              <div className="mt-12 flex items-center gap-2 opacity-40">
                <div className="w-8 h-px bg-current" />
                <span className="text-xs tracking-widest">VALENTINE’S DAY</span>
                <div className="w-8 h-px bg-current" />
              </div>
            </div>
          )}

          {/* Card Inside Letter View */}
          {(viewMode === 'inside' || viewMode === 'both') && (
            <div
              id="card-inside-preview"
              className={`card-print-area relative rounded-2xl border ${currentTheme.borderClass} ${currentTheme.bgClass} p-8 sm:p-12 shadow-md transition-all flex flex-col justify-between min-h-[460px]`}
            >
              {/* Background watermark icon */}
              <div className="absolute right-6 top-6 opacity-5 pointer-events-none select-none">
                <Heart className="w-32 h-32 fill-current" />
              </div>

              {/* Salutation / Opening */}
              <div className="mb-4">
                {isEditingDirectly ? (
                  <input
                    type="text"
                    value={card.salutation}
                    onChange={(e) => updateField('salutation', e.target.value)}
                    className="w-full text-lg font-semibold bg-white/70 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                ) : (
                  <h4
                    className={`text-xl sm:text-2xl font-semibold ${currentTheme.textClass} ${
                      card.fontStyle === 'script' || card.fontStyle === 'vibes' ? 'text-3xl sm:text-4xl font-normal' : ''
                    } ${currentFont.fontClass}`}
                  >
                    {card.salutation}
                  </h4>
                )}
              </div>

              {/* Inside Vignette Charcoal Illustration */}
              {puppyIll.enabled && (puppyIll.placement === 'inside' || puppyIll.placement === 'both') && (
                <div className="my-2">
                  <GothicPuppyIllustration
                    illustration={puppyIll}
                    context="vignette"
                    partnerName={card.partnerName}
                    letterTopic={card.title}
                    isDarkTheme={isDarkTheme}
                    isEditing={isEditingDirectly}
                    onUpdateTitle={(title) => updatePuppyIllustration({ title })}
                    onUpdateCaption={(caption) => updatePuppyIllustration({ caption })}
                  />
                </div>
              )}

              {/* Letter Body */}
              <div className="space-y-4 my-2 flex-grow">
                {isEditingDirectly ? (
                  <textarea
                    rows={8}
                    value={card.body}
                    onChange={(e) => updateField('body', e.target.value)}
                    className="w-full text-base bg-white/70 border border-stone-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-400 outline-none leading-relaxed"
                  />
                ) : (
                  <div
                    className={`text-base sm:text-lg leading-relaxed whitespace-pre-line ${currentTheme.textClass} ${
                      card.fontStyle === 'script' ? 'text-2xl sm:text-3xl leading-loose font-normal' : ''
                    } ${card.fontStyle === 'vibes' ? 'text-2xl sm:text-3xl leading-loose font-normal' : ''} ${
                      currentFont.fontClass
                    }`}
                  >
                    {card.body}
                  </div>
                )}
              </div>

              {/* Sign-off, Closing & Signature */}
              <div className="mt-8 pt-4 space-y-2">
                {isEditingDirectly ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={card.closing}
                      onChange={(e) => updateField('closing', e.target.value)}
                      placeholder="Closing (e.g. Forever yours,)"
                      className="bg-white/70 border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
                    />
                    <input
                      type="text"
                      value={card.signature}
                      onChange={(e) => updateField('signature', e.target.value)}
                      placeholder="Your signature name"
                      className="bg-white/70 border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div
                      className={`text-base sm:text-lg ${currentTheme.textClass} ${currentFont.fontClass}`}
                    >
                      {card.closing}
                    </div>
                    <div
                      className={`text-lg sm:text-xl font-semibold tracking-wide ${currentTheme.textClass} ${
                        card.fontStyle === 'script' || card.fontStyle === 'vibes' ? 'text-3xl font-normal' : ''
                      } ${currentFont.fontClass}`}
                    >
                      {card.signature || '______________'}
                    </div>
                  </div>
                )}

                {/* Postscript (P.S.) */}
                {(card.postscript || isEditingDirectly) && (
                  <div className="pt-4 mt-4 border-t border-dashed border-stone-300/60">
                    {isEditingDirectly ? (
                      <input
                        type="text"
                        value={card.postscript || ''}
                        onChange={(e) => updateField('postscript', e.target.value)}
                        placeholder="P.S. note (optional)"
                        className="w-full text-xs italic bg-white/70 border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-400 outline-none"
                      />
                    ) : (
                      <p
                        className={`text-xs sm:text-sm italic opacity-85 ${currentTheme.textClass} ${
                          card.fontStyle === 'script' || card.fontStyle === 'vibes' ? 'text-xl not-italic' : ''
                        } ${currentFont.fontClass}`}
                      >
                        {card.postscript}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
