import React from 'react';
import { Sparkles, X, Plus, Heart, MessageCircle, Smile } from 'lucide-react';

interface SparkIdeasModalProps {
  onSelectPrompt: (targetField: 'favoriteMemories' | 'quirksAndReasons' | 'insideJokes' | 'futureHopes', text: string) => void;
  onClose: () => void;
  partnerName: string;
}

const INSPIRATION_CARDS = [
  {
    category: 'favoriteMemories' as const,
    title: 'Cherished Memories',
    icon: <Heart className="w-4 h-4 text-rose-500" />,
    items: [
      'That spontaneous road trip when we got lost and didn’t care',
      'The first night we stayed up talking until the sun started rising',
      'Dancing together in the kitchen while cooking dinner',
      'Our rainy Sunday morning under the covers with warm tea',
      'When you surprised me when I was having an exhausting day',
    ],
  },
  {
    category: 'quirksAndReasons' as const,
    title: 'Adored Quirks & Habits',
    icon: <Smile className="w-4 h-4 text-amber-500" />,
    items: [
      'The adorable way your nose scrunches whenever you laugh hard',
      'How you passionately defend movies or books you love',
      'The quiet little hum you do when you are enjoying good food',
      'How you always save the best bite of dessert for me',
      'Your sleepy morning voice before your first sip of coffee',
    ],
  },
  {
    category: 'insideJokes' as const,
    title: 'Inside Jokes & Shared Lore',
    icon: <MessageCircle className="w-4 h-4 text-purple-500" />,
    items: [
      'The ridiculous burnt meal disaster we still laugh about',
      'Our secret code phrase when we want to leave a party',
      'The ongoing championship debate about pizza toppings',
      'How we both secretly know you steal all the blankets at night',
    ],
  },
  {
    category: 'futureHopes' as const,
    title: 'Future Dreams & Promises',
    icon: <Sparkles className="w-4 h-4 text-pink-500" />,
    items: [
      'Finally taking that dreamy dream trip across Europe or Japan',
      'Adopting our dream pet and making a cozy home together',
      'A lifetime of kissing you good morning and good night',
      'Growing delightfully old, weird, and happy together',
    ],
  },
];

export const SparkIdeasModal: React.FC<SparkIdeasModalProps> = ({
  onSelectPrompt,
  onClose,
  partnerName,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                Spark Ideas & Memory Prompts
              </h3>
              <p className="text-[11px] text-stone-500">
                Click any idea to add it straight into your card builder
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
          {INSPIRATION_CARDS.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.items.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectPrompt(section.category, item);
                      onClose();
                    }}
                    className="p-3 text-left rounded-xl border border-stone-200 hover:border-rose-300 bg-stone-50/40 hover:bg-rose-50/40 transition-all text-xs text-stone-700 flex items-start justify-between group"
                  >
                    <span>{item}</span>
                    <Plus className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-500 shrink-0 mt-0.5 ml-1.5 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
