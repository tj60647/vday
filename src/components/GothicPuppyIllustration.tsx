import React from 'react';
import { PuppyIllustration } from '../types';

interface GothicPuppyIllustrationProps {
  illustration: PuppyIllustration;
  context: 'cover' | 'vignette' | 'standalone';
  letterTopic?: string;
  partnerName?: string;
  isDarkTheme?: boolean;
  isEditing?: boolean;
  onUpdateCaption?: (caption: string) => void;
  onUpdateTitle?: (title: string) => void;
}

export const GothicPuppyIllustration: React.FC<GothicPuppyIllustrationProps> = ({
  illustration,
  context,
  letterTopic,
  partnerName,
  isDarkTheme = false,
  isEditing = false,
  onUpdateCaption,
  onUpdateTitle,
}) => {
  if (!illustration.enabled) {
    return null;
  }

  const imageSrc =
    illustration.variant === 'moonlit-devotion'
      ? '/assets/gothic_puppy_moon.svg'
      : '/assets/gothic_puppy_charcoal.svg';

  const defaultTitle =
    illustration.variant === 'moonlit-devotion'
      ? 'Eternal Companions'
      : 'The Faithful Hound';

  const displayTitle = illustration.title || defaultTitle;
  const displayCaption =
    illustration.caption ||
    (letterTopic
      ? `Gothic charcoal study: guarding our love and cherished memories of ${letterTopic}`
      : `Fine charcoal sketch of eternal devotion, created for ${partnerName || 'my love'}`);

  if (context === 'vignette') {
    return (
      <div className="my-4 flex flex-col items-center text-center">
        <div className="relative group max-w-[210px] w-full mx-auto">
          {/* Gothic charcoal antique frame */}
          <div
            className={`p-2 rounded-xl border ${
              isDarkTheme
                ? 'border-stone-700 bg-stone-950/80 shadow-stone-950'
                : 'border-stone-300 bg-[#f7f4ed] shadow-stone-300/40'
            } shadow-lg transition-transform`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-square border border-stone-800/20">
              <img
                src={imageSrc}
                alt="Gothic charcoal puppy drawing"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-105"
              />
              {/* Charcoal vignette shading ring */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] rounded-lg" />
            </div>

            {/* Micro Caption */}
            <div className="mt-2 px-1">
              <div
                className={`text-[10px] uppercase font-serif-card font-semibold tracking-wider ${
                  isDarkTheme ? 'text-amber-200/80' : 'text-stone-800'
                }`}
              >
                ✦ {displayTitle} ✦
              </div>
              <p
                className={`text-[9px] italic line-clamp-2 mt-0.5 leading-tight ${
                  isDarkTheme ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {displayCaption}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default / Cover Presentation: Ornate Gothic Charcoal Plate
  return (
    <div className="my-6 w-full max-w-sm mx-auto flex flex-col items-center">
      <div
        className={`relative p-3.5 rounded-2xl border-2 transition-all ${
          isDarkTheme
            ? 'border-stone-700/80 bg-stone-950/90 shadow-2xl shadow-black/80'
            : 'border-stone-300/90 bg-[#f7f3eb] shadow-xl shadow-stone-800/15'
        }`}
      >
        {/* Gothic corner markers */}
        <div className="absolute -top-2 -left-2 text-stone-500 text-xs">✠</div>
        <div className="absolute -top-2 -right-2 text-stone-500 text-xs">✠</div>
        <div className="absolute -bottom-2 -left-2 text-stone-500 text-xs">✠</div>
        <div className="absolute -bottom-2 -right-2 text-stone-500 text-xs">✠</div>

        {/* The Charcoal Drawing Frame */}
        <div className="relative overflow-hidden rounded-xl border border-stone-900/40 bg-stone-900 aspect-square max-w-[280px] sm:max-w-[300px] mx-auto">
          <img
            src={imageSrc}
            alt="Gothic style charcoal drawing of a devoted puppy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-110"
          />
          {/* Inner atmospheric charcoal shadow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_35px_rgba(0,0,0,0.7)]" />
        </div>

        {/* Title and Caption Scroll */}
        <div className="mt-3 text-center px-2 space-y-1">
          {isEditing ? (
            <div className="space-y-1.5">
              <input
                type="text"
                value={illustration.title}
                onChange={(e) => onUpdateTitle?.(e.target.value)}
                placeholder="Charcoal Drawing Title"
                className="w-full text-center text-xs font-serif-card font-semibold bg-white/70 border border-stone-300 rounded p-1"
              />
              <textarea
                rows={2}
                value={illustration.caption}
                onChange={(e) => onUpdateCaption?.(e.target.value)}
                placeholder="Illustration caption based on letter topic..."
                className="w-full text-center text-[10px] italic bg-white/70 border border-stone-300 rounded p-1"
              />
            </div>
          ) : (
            <>
              <div
                className={`font-serif-card tracking-widest text-xs sm:text-sm uppercase font-semibold flex items-center justify-center gap-1.5 ${
                  isDarkTheme ? 'text-amber-200' : 'text-stone-900'
                }`}
              >
                <span>✦</span>
                <span>{displayTitle}</span>
                <span>✦</span>
              </div>
              <p
                className={`text-[10px] sm:text-[11px] font-serif-card italic leading-relaxed px-2 ${
                  isDarkTheme ? 'text-stone-300/80' : 'text-stone-700'
                }`}
              >
                &ldquo;{displayCaption}&rdquo;
              </p>
              <div className="pt-1 flex items-center justify-center gap-2 opacity-50">
                <span className="text-[9px] uppercase tracking-widest font-sans-card text-stone-500">
                  Gothic Charcoal Etching
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
