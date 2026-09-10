import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  PenTool, 
  X, 
  Info, 
  Clock, 
  AlignLeft, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { CardDraft } from '../types';

interface HandwritingHelperProps {
  card: CardDraft;
  onClose: () => void;
}

export const HandwritingHelper: React.FC<HandwritingHelperProps> = ({ card, onClose }) => {
  // Break body into sentences/segments
  const segments = React.useMemo(() => {
    const list: string[] = [];
    if (card.salutation) list.push(card.salutation);

    // Split body by double newlines first, then sentences
    const paragraphs = card.body.split('\n\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const sentences = p.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [p];
      sentences.forEach((s) => {
        const trimmed = s.trim();
        if (trimmed) list.push(trimmed);
      });
    });

    if (card.closing) {
      list.push(`${card.closing} ${card.signature || ''}`.trim());
    }
    if (card.postscript) {
      list.push(card.postscript);
    }

    return list;
  }, [card]);

  const [checkedIndices, setCheckedIndices] = useState<Record<number, boolean>>({});
  const [largeText, setLargeText] = useState(true);

  const toggleCheck = (idx: number) => {
    setCheckedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const wordCount = React.useMemo(() => {
    const full = `${card.salutation} ${card.body} ${card.closing} ${card.signature} ${card.postscript || ''}`;
    return full.trim().split(/\s+/).filter(Boolean).length;
  }, [card]);

  // Rough estimation: average person writes 15-20 words per minute
  const estMinutes = Math.max(1, Math.ceil(wordCount / 18));

  // Physical card space estimation
  const cardFitAdvice = React.useMemo(() => {
    if (wordCount <= 60) {
      return {
        label: 'Compact Card Fit',
        desc: 'Comfortably fits standard small cards, gift tags, or pocket love notes with plenty of blank margin.',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    } else if (wordCount <= 130) {
      return {
        label: 'Ideal 5x7 Folded Card Fit',
        desc: 'The sweet spot for standard Hallmark/Papyrus cards. Fills the right inside page beautifully.',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    } else {
      return {
        label: 'Longer Letter Format',
        desc: 'Best written across both inside panels of the card, or on a folded linen stationery sheet tucked inside.',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
      };
    }
  }, [wordCount]);

  const progressPercent = Math.round(
    (Object.values(checkedIndices).filter(Boolean).length / Math.max(1, segments.length)) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                Handwriting & Transcription Companion
              </h3>
              <p className="text-[11px] text-stone-500">
                Follow along line-by-line as you pen your real card with ink
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-stone-600">
            <div className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-stone-400" />
              <span><strong>{wordCount}</strong> words</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>~{estMinutes} min to write</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLargeText(!largeText)}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors"
            >
              {largeText ? 'Standard Text' : 'Extra Large Reading Text'}
            </button>
          </div>
        </div>

        {/* Card Fit Tip */}
        <div className="px-6 pt-4">
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${cardFitAdvice.color}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{cardFitAdvice.label}</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{cardFitAdvice.desc}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-3">
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span>Transcribing progress</span>
            <span>{progressPercent}% completed</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Segments Checklist Body */}
        <div className="p-6 overflow-y-auto space-y-3 flex-grow divide-y divide-stone-100">
          {segments.map((seg, idx) => {
            const isDone = Boolean(checkedIndices[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`pt-3 first:pt-0 flex items-start gap-3.5 cursor-pointer select-none rounded-xl p-2 transition-colors ${
                  isDone ? 'bg-stone-50 opacity-60' : 'hover:bg-rose-50/40'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                    Step {idx + 1}
                  </div>
                  <p
                    className={`leading-relaxed transition-all ${
                      largeText ? 'text-lg sm:text-xl font-medium' : 'text-sm sm:text-base'
                    } ${isDone ? 'line-through text-stone-400 font-normal' : 'text-stone-900 font-serif-card'}`}
                  >
                    {seg}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCheckedIndices({})}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            Reset checkmarks
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Done Handwriting
          </button>
        </div>
      </div>
    </div>
  );
};
