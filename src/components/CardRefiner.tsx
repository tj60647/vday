import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Smile, 
  Minimize2, 
  Feather, 
  Music, 
  MessageSquarePlus, 
  UserCheck, 
  Send, 
  Wand2 
} from 'lucide-react';
import { CardDraft, RefineCardInput } from '../types';

interface CardRefinerProps {
  card: CardDraft;
  onRefine: (action: RefineCardInput['action'], customInstruction?: string) => void;
  isRefining: boolean;
}

export const CardRefiner: React.FC<CardRefinerProps> = ({
  card,
  onRefine,
  isRefining,
}) => {
  const [customText, setCustomText] = useState('');

  const quickActions: { action: RefineCardInput['action']; label: string; icon: React.ReactNode }[] = [
    { action: 'sweeter', label: 'More Romantic & Tender', icon: <Heart className="w-3.5 h-3.5 text-rose-500" /> },
    { action: 'funnier', label: 'Add Playful Humor', icon: <Smile className="w-3.5 h-3.5 text-amber-500" /> },
    { action: 'shorten', label: 'Shorten for Small Card', icon: <Minimize2 className="w-3.5 h-3.5 text-blue-500" /> },
    { action: 'poetic', label: 'More Poetic & Lyrical', icon: <Feather className="w-3.5 h-3.5 text-purple-500" /> },
    { action: 'rhyme', label: 'Turn into Rhyme', icon: <Music className="w-3.5 h-3.5 text-pink-500" /> },
    { action: 'more-natural', label: 'More Natural & Conversational', icon: <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> },
    { action: 'add-ps', label: 'Add / Refresh P.S.', icon: <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-500" /> },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || isRefining) return;
    onRefine('custom', customText.trim());
    setCustomText('');
  };

  return (
    <div id="ai-card-refiner" className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
            <Wand2 className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">AI Polish & Refine Studio</h3>
            <p className="text-[11px] text-stone-500">Fine-tune the tone, length, or details in seconds</p>
          </div>
        </div>

        {isRefining && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-full">
            <div className="w-3 h-3 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
            <span>Polishing letter...</span>
          </div>
        )}
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((qa) => (
          <button
            key={qa.action}
            type="button"
            disabled={isRefining}
            onClick={() => onRefine(qa.action)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 hover:border-stone-300 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {qa.icon}
            <span>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Refinement Input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask AI for any custom tweak (e.g., 'Mention how much I loved our beach walk', 'Make the opening simpler')"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          disabled={isRefining}
          className="flex-grow px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isRefining || !customText.trim()}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3 h-3" />
          <span>Refine</span>
        </button>
      </form>
    </div>
  );
};
