import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Feather, 
  Clock, 
  BookOpen, 
  ListOrdered, 
  Lightbulb, 
  Wand2, 
  MessageSquareHeart,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { CardPromptInput, CardTone, CardFormat } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface CardFormProps {
  input: CardPromptInput;
  onChange: (input: CardPromptInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const TONES: { id: CardTone; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'deeply-romantic',
    label: 'Deep & Romantic',
    desc: 'Intimate, soulful, and devoted',
    icon: <Heart className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'playful-funny',
    label: 'Playful & Witty',
    desc: 'Cute banter, affectionate teasing',
    icon: <Smile className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'poetic-lyrical',
    label: 'Poetic & Lyrical',
    desc: 'Literary rhythm, evocative imagery',
    icon: <Feather className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'short-sweet',
    label: 'Short & Sweet',
    desc: 'Punchy, warm, no extra fluff',
    icon: <Clock className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'tender-nostalgic',
    label: 'Tender & Nostalgic',
    desc: 'Cherishing your shared history',
    icon: <BookOpen className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sweet-cheesy',
    label: 'Sweetly Cheesy',
    desc: 'Unapologetically cute & romantic',
    icon: <Sparkles className="w-4 h-4 text-pink-500" />,
  },
];

const FORMATS: { id: CardFormat; label: string; lengthText: string; icon: React.ReactNode }[] = [
  {
    id: 'standard-card',
    label: 'Classic Folded Card',
    lengthText: '2–3 intimate paragraphs',
    icon: <BookOpen className="w-4 h-4 text-stone-600" />,
  },
  {
    id: 'mini-love-note',
    label: 'Pocket Note / Tag',
    lengthText: '3–5 punchy sweet lines',
    icon: <Clock className="w-4 h-4 text-stone-600" />,
  },
  {
    id: 'long-letter',
    label: 'Full Love Letter',
    lengthText: 'Deep & expansive keepsake',
    icon: <Feather className="w-4 h-4 text-stone-600" />,
  },
  {
    id: 'rhyming-poem',
    label: 'Rhyming Stanzas',
    lengthText: 'Rhythmic romantic verse',
    icon: <Sparkles className="w-4 h-4 text-stone-600" />,
  },
  {
    id: 'reasons-why',
    label: '5 Reasons I Love You',
    lengthText: 'Numbered heartfelt list',
    icon: <ListOrdered className="w-4 h-4 text-stone-600" />,
  },
];

const STAGES = [
  "First Valentine's together",
  "Dating (< 1 year)",
  "Together 1–3 years",
  "Long-term partners (4+ years)",
  "Engaged / Soon to wed",
  "Happily Married",
  "Long Distance Love",
  "Decades together",
];

export const CardForm: React.FC<CardFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [showPersonalDetails, setShowPersonalDetails] = useState(true);
  const [showInspirationMenu, setShowInspirationMenu] = useState(false);

  const handleFieldChange = (field: keyof CardPromptInput, value: any) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const loadPreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange(found.data);
    }
  };

  const resetForm = () => {
    onChange({
      partnerName: '',
      partnerNickname: '',
      senderName: '',
      relationshipStage: "Together 1–3 years",
      tone: 'deeply-romantic',
      cardFormat: 'standard-card',
      favoriteMemories: '',
      quirksAndReasons: '',
      insideJokes: '',
      futureHopes: '',
      extraNotes: '',
    });
  };

  return (
    <div id="valentine-card-form" className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header & Quick presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-rose-500" />
            Tell Us About Your Love
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            We will craft 3 custom card drafts tailored to your partner and story.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              id="inspiration-preset-btn"
              onClick={() => setShowInspirationMenu(!showInspirationMenu)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Load Sample Story</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showInspirationMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-30 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Quick Starter Stories
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      loadPreset(preset.id);
                      setShowInspirationMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-50 text-xs text-stone-700 hover:text-rose-900 transition-colors"
                  >
                    <div className="font-medium text-stone-900">{preset.name}</div>
                    <div className="text-[11px] text-stone-500 leading-tight">{preset.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={resetForm}
            title="Reset form"
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Partner Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="partner-name-input" className="block text-xs font-medium text-stone-700 mb-1.5">
            Partner’s Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="partner-name-input"
            type="text"
            required
            placeholder="e.g. Maya, Alex, Jordan"
            value={input.partnerName}
            onChange={(e) => handleFieldChange('partnerName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all placeholder:text-stone-400"
          />
        </div>

        <div>
          <label htmlFor="partner-nickname-input" className="block text-xs font-medium text-stone-700 mb-1.5">
            Pet Name / Nickname <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="partner-nickname-input"
            type="text"
            placeholder="e.g. Honey, Sunshine, Trouble, Mon Chéri"
            value={input.partnerNickname || ''}
            onChange={(e) => handleFieldChange('partnerNickname', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all placeholder:text-stone-400"
          />
        </div>

        <div>
          <label htmlFor="sender-name-input" className="block text-xs font-medium text-stone-700 mb-1.5">
            Your Name <span className="text-stone-400 font-normal">(for the card sign-off)</span>
          </label>
          <input
            id="sender-name-input"
            type="text"
            placeholder="e.g. Liam, or leave blank to handwrite"
            value={input.senderName || ''}
            onChange={(e) => handleFieldChange('senderName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all placeholder:text-stone-400"
          />
        </div>

        <div>
          <label htmlFor="relationship-stage-select" className="block text-xs font-medium text-stone-700 mb-1.5">
            Relationship Journey
          </label>
          <select
            id="relationship-stage-select"
            value={input.relationshipStage}
            onChange={(e) => handleFieldChange('relationshipStage', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-stone-700">
          Card Tone & Vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TONES.map((t) => {
            const isSelected = input.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                id={`tone-btn-${t.id}`}
                onClick={() => handleFieldChange('tone', t.id)}
                className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/60 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {t.icon}
                  <span className={`text-xs font-semibold ${isSelected ? 'text-rose-950' : 'text-stone-800'}`}>
                    {t.label}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 leading-snug">
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-stone-700">
          Card Format & Length
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {FORMATS.map((f) => {
            const isSelected = input.cardFormat === f.id;
            return (
              <button
                key={f.id}
                type="button"
                id={`format-btn-${f.id}`}
                onClick={() => handleFieldChange('cardFormat', f.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {f.icon}
                  <div>
                    <div className={`text-xs font-medium ${isSelected ? 'text-rose-950' : 'text-stone-800'}`}>
                      {f.label}
                    </div>
                    <div className="text-[10px] text-stone-500">{f.lengthText}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Memories & Story Details (Collapsible / Expandable) */}
      <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/30">
        <button
          type="button"
          onClick={() => setShowPersonalDetails(!showPersonalDetails)}
          className="w-full px-4 py-3 bg-stone-50/70 hover:bg-stone-100/60 flex items-center justify-between text-left transition-colors border-b border-stone-100"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-stone-800">
              Personal Touches (The Magic Secret Sauce)
            </span>
            <span className="text-[11px] bg-rose-100 text-rose-700 font-medium px-2 py-0.5 rounded-full">
              Makes it truly yours
            </span>
          </div>
          {showPersonalDetails ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {showPersonalDetails && (
          <div className="p-4 space-y-3.5 bg-white">
            <p className="text-xs text-stone-500 leading-relaxed">
              Add any memories or inside jokes below. Even a single quick phrase turns an AI card into an authentic, unforgettable keepsake.
            </p>

            <div>
              <label htmlFor="memories-input" className="block text-[11px] font-medium text-stone-700 mb-1">
                Favorite Shared Memory or Moment
              </label>
              <input
                id="memories-input"
                type="text"
                placeholder="e.g. Our rainy cabin trip, dancing in the kitchen, when we first met at the bookstore"
                value={input.favoriteMemories || ''}
                onChange={(e) => handleFieldChange('favoriteMemories', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="quirks-input" className="block text-[11px] font-medium text-stone-700 mb-1">
                  Quirks & Things You Adore About Them
                </label>
                <input
                  id="quirks-input"
                  type="text"
                  placeholder="e.g. The face you make when tasting dessert, how you sing in the shower"
                  value={input.quirksAndReasons || ''}
                  onChange={(e) => handleFieldChange('quirksAndReasons', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none"
                />
              </div>

              <div>
                <label htmlFor="jokes-input" className="block text-[11px] font-medium text-stone-700 mb-1">
                  Inside Jokes or Nicknames
                </label>
                <input
                  id="jokes-input"
                  type="text"
                  placeholder="e.g. Always stealing the aux cord, the burnt pizza disaster"
                  value={input.insideJokes || ''}
                  onChange={(e) => handleFieldChange('insideJokes', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="future-input" className="block text-[11px] font-medium text-stone-700 mb-1">
                  Future Hopes or Sweet Promises
                </label>
                <input
                  id="future-input"
                  type="text"
                  placeholder="e.g. That trip to Italy, adopting a puppy together, growing old together"
                  value={input.futureHopes || ''}
                  onChange={(e) => handleFieldChange('futureHopes', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none"
                />
              </div>

              <div>
                <label htmlFor="extra-input" className="block text-[11px] font-medium text-stone-700 mb-1">
                  Any Other Nuances or Specific Wishes
                </label>
                <input
                  id="extra-input"
                  type="text"
                  placeholder="e.g. Mention how supportive they were during my exam; keep it grounded"
                  value={input.extraNotes || ''}
                  onChange={(e) => handleFieldChange('extraNotes', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Action Button */}
      <div>
        <button
          type="button"
          id="generate-cards-submit-btn"
          disabled={isLoading || !input.partnerName.trim()}
          onClick={onSubmit}
          className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isLoading || !input.partnerName.trim()
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-200 hover:shadow-md cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Weaving Your Valentine Cards...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>
                {input.partnerName.trim()
                  ? `Generate 3 Valentine Cards for ${input.partnerName}`
                  : 'Enter Partner Name to Generate'}
              </span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-stone-400 mt-2">
          Gemini AI will craft 3 distinctive card drafts with custom covers, letters & postscripts.
        </p>
      </div>
    </div>
  );
};
