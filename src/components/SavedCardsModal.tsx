import React from 'react';
import { 
  X, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Bookmark, 
  Calendar, 
  Heart,
  Check
} from 'lucide-react';
import { CardDraft } from '../types';

interface SavedCardsModalProps {
  savedCards: CardDraft[];
  onSelectCard: (card: CardDraft) => void;
  onDeleteCard: (id: string) => void;
  onClose: () => void;
}

export const SavedCardsModal: React.FC<SavedCardsModalProps> = ({
  savedCards,
  onSelectCard,
  onDeleteCard,
  onClose,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyText = (card: CardDraft) => {
    const text = `${card.salutation}\n\n${card.body}\n\n${card.closing}\n${card.signature}${
      card.postscript ? `\n\n${card.postscript}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                Saved Cards & Keepsakes
              </h3>
              <p className="text-[11px] text-stone-500">
                {savedCards.length} saved {savedCards.length === 1 ? 'card' : 'cards'} in your browser
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

        {/* List of Cards */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-grow">
          {savedCards.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-700">No saved cards yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Generate a card you love and click &quot;Save Card&quot; to keep it handy for future reference!
              </p>
            </div>
          ) : (
            savedCards.map((card) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-rose-200 bg-stone-50/40 hover:bg-white transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">
                      {card.title} <span className="text-stone-400 font-normal">for {card.partnerName}</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{card.tone.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Copy text"
                      onClick={() => copyText(card)}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors text-xs flex items-center gap-1"
                    >
                      {copiedId === card.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      title="Load into Studio"
                      onClick={() => {
                        onSelectCard(card);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Load</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDeleteCard(card.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 italic font-serif-card">
                  &ldquo;{card.body.slice(0, 140)}...&rdquo;
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
