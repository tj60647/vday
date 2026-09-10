import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient helper to call Gemini with exponential backoff and model fallbacks
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  // Ordered list of viable models for basic text tasks
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return { response, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const isTransient =
          err?.status === 'UNAVAILABLE' ||
          err?.status === 503 ||
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('rate limit');

        if (isTransient && attempt === 0) {
          // Wait 600ms before retrying same model once
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        if (isTransient) {
          console.warn(`Model ${model} busy (${msg.slice(0, 80)}...), trying fallback model...`);
          break; // proceed to next candidate model
        }
        throw err;
      }
    }
  }

  throw lastError;
}

// Helper for bespoke card generation when AI is unavailable or under peak traffic
function generateFallbackCards(input: any) {
  const name = input.partnerName || 'My Love';
  const nickname = input.partnerNickname ? ` (${input.partnerNickname})` : '';
  const sender = input.senderName || '';
  const memories = input.favoriteMemories 
    ? ` Every time I think of ${input.favoriteMemories}, I am reminded of how lucky I am to have you.` 
    : '';
  const quirks = input.quirksAndReasons 
    ? ` I adore all the little things about you, especially ${input.quirksAndReasons}.` 
    : '';
  const jokes = input.insideJokes 
    ? ` ${input.insideJokes} — and I wouldn't change a single moment of it.` 
    : '';
  const future = input.futureHopes 
    ? ` I can't wait for our future together, especially ${input.futureHopes}.` 
    : ' Here is to many more adventures, quiet mornings, and laughter together.';

  return [
    {
      id: `card-crafted-1-${Date.now()}`,
      title: 'Tender & Soulful',
      salutation: `To My Dearest ${name}${nickname},`,
      coverHeadline: 'To The One Who Holds My Heart',
      coverSubtext: `Happy Valentine's Day, ${name}`,
      body: `Happy Valentine's Day! Every single day with you feels like a gift I never take for granted. From our quiet morning moments to the way you light up any room you walk into, you have filled my world with a warmth I didn't know was missing.${memories}${quirks}\n\nThank you for being my anchor, my confidant, and my favorite person in the entire universe.${future}`,
      closing: 'With all my heart and devotion,',
      signature: sender,
      postscript: input.insideJokes ? `P.S. ${jokes}` : 'P.S. You still give me butterflies every single day.',
      tone: input.tone || 'deeply-romantic',
      format: input.cardFormat || 'standard-card',
      stationeryTheme: 'blush-rose',
      fontStyle: 'serif',
      createdAt: new Date().toISOString(),
      partnerName: name,
      puppyIllustration: {
        enabled: true,
        style: 'gothic-charcoal',
        variant: 'rose-companion',
        title: 'The Faithful Hound & Rose',
        caption: input.favoriteMemories
          ? `Gothic charcoal study: a devoted puppy guarding our memory of ${input.favoriteMemories}`
          : `Gothic charcoal sketch: unconditional devotion created for ${name}`,
        placement: 'cover',
      },
    },
    {
      id: `card-crafted-2-${Date.now()}`,
      title: 'Playful & Cheerful',
      salutation: `Happy Valentine's Day, ${name}!`,
      coverHeadline: 'You Are My Absolute Favorite Human',
      coverSubtext: 'And I love you more than pizza',
      body: `Out of all 8 billion humans on this planet, you are without question my absolute favorite to do life with, laugh with, and occasionally annoy on purpose.${quirks}\n\nChoosing you is still the easiest and best decision I make each morning.${memories}\n\nThank you for loving me at my weirdest and always letting me hold your hand.${future}`,
      closing: 'Forever your biggest fan & cuddle partner,',
      signature: sender,
      postscript: input.insideJokes ? `P.S. Still not apologizing for ${jokes}` : 'P.S. Tonight’s dinner is 100% on me.',
      tone: input.tone || 'playful-funny',
      format: input.cardFormat || 'standard-card',
      stationeryTheme: 'clean-linen',
      fontStyle: 'sans',
      createdAt: new Date().toISOString(),
      partnerName: name,
      puppyIllustration: {
        enabled: true,
        style: 'gothic-charcoal',
        variant: 'rose-companion',
        title: 'Partner In Crime',
        caption: input.insideJokes
          ? `Gothic charcoal sketch: cheeky, loving, and never apologizing for ${input.insideJokes}`
          : `Gothic charcoal drawing: your most loyal companion through every adventure`,
        placement: 'cover',
      },
    },
    {
      id: `card-crafted-3-${Date.now()}`,
      title: 'Poetic & Lyrical',
      salutation: `My Beloved ${name},`,
      coverHeadline: 'In All The World, There Is No Heart Like Yours',
      coverSubtext: `For You, On Valentine's Day`,
      body: `If love is measured in the soft certainty of shared glances and quiet mornings, then beside you, every moment has become something sacred.${memories}\n\nIn you, I have found both my shelter and my greatest adventure.${quirks} You make ordinary days feel like poetry and tomorrow something to look forward to.${future}`,
      closing: 'Eternally yours,',
      signature: sender,
      postscript: 'P.S. Meeting you was destiny, but loving you is the joy of my life.',
      tone: input.tone || 'poetic-lyrical',
      format: input.cardFormat || 'standard-card',
      stationeryTheme: 'vintage-parchment',
      fontStyle: 'script',
      createdAt: new Date().toISOString(),
      partnerName: name,
      puppyIllustration: {
        enabled: true,
        style: 'gothic-charcoal',
        variant: 'moonlit-devotion',
        title: 'Moonlit Devotion',
        caption: `Gothic charcoal etching: two devoted souls resting beneath the arch, where every heartbeat whispers of forever`,
        placement: 'both',
      },
    },
  ];
}

function applyLocalRefinement(currentCard: any, action: string, customInstruction?: string) {
  const updated = { ...currentCard };
  if (action === 'shorten') {
    const sentences = (currentCard.body || '').split(/(?<=[.?!])\s+/);
    updated.body = sentences.slice(0, Math.max(2, Math.floor(sentences.length * 0.65))).join(' ');
  } else if (action === 'sweeter') {
    updated.body = `${currentCard.body}\n\nBeing loved by you has made every single day brighter, softer, and more meaningful. You are my greatest joy.`;
  } else if (action === 'funnier') {
    updated.body = `${currentCard.body}\n\nPlus, you still tolerate all my strange quirks without running away, which basically makes you a saint.`;
    if (!updated.postscript) {
      updated.postscript = 'P.S. I promise I will let you pick the movie tonight.';
    }
  } else if (action === 'add-ps') {
    updated.postscript = currentCard.postscript 
      ? `${currentCard.postscript} (Also: I still get butterflies every time you smile at me.)`
      : 'P.S. You will always be my favorite person in the entire world.';
  } else if (action === 'poetic') {
    updated.body = `In the quiet spaces between heartbeats, you are the song that plays.\n\n${currentCard.body}\n\nTo love you is the easiest truth my heart has ever known.`;
  } else if (action === 'rhyme') {
    updated.body = `Through every morning, noon, and night,\nYou make my whole world warm and bright.\nThrough every step and every view,\nMy heart will always beat for you.`;
  } else if (action === 'more-natural') {
    updated.salutation = updated.salutation.replace(/^To My Dearest\s*/i, 'Hey ').replace(/^My Beloved\s*/i, 'Dear ');
  } else if (customInstruction) {
    updated.body = `${currentCard.body}\n\n${customInstruction}`;
  }
  return updated;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Generate cards endpoint
app.post('/api/generate-cards', async (req, res) => {
  const input = req.body || {};
  const ai = getAi();

  if (!ai) {
    return res.json({
      cards: generateFallbackCards(input),
      isFallback: true,
      reason: 'No API key configured',
    });
  }

  const partnerName = input.partnerName || 'My Partner';
  const nickname = input.partnerNickname ? ` (nicknames/pet names: "${input.partnerNickname}")` : '';
  const senderName = input.senderName ? ` (from: "${input.senderName}")` : '';
  const stage = input.relationshipStage || 'dating';
  const tone = input.tone || 'deeply-romantic';
  const format = input.cardFormat || 'standard-card';

  const systemInstruction = `You are a world-class romantic writer, poet, and bespoke letter craftsman helping people express genuine, heartfelt love in Valentine's Day cards for their partners.
Your goal is to write 3 DISTINCT card options tailored precisely to the user's details.
CRITICAL WRITING PRINCIPLES:
1. Avoid generic cheesy Hallmark clichés unless the requested tone specifically calls for playful cheese. Make the emotion feel authentic, grounded, and intimate.
2. Weave the user's specific memories, quirks, and inside jokes seamlessly so the card feels undeniably personal and written by them.
3. Keep the 3 options distinct:
   - Option 1: Direct, tender, deeply heartfelt & intimate
   - Option 2: Witty, warm, playful, and charmingly affectionate
   - Option 3: Lyrical, literary, evocative, or poetic
4. Output must be strictly valid JSON matching the requested schema.`;

  const prompt = `Write 3 unique Valentine's card drafts with these details:
- Partner's Name: ${partnerName}${nickname}
- Sender's Name: ${senderName || 'The user'}
- Relationship Stage/Length: ${stage}
- Requested Primary Tone: ${tone}
- Card Format: ${format}
- Favorite Shared Memories: ${input.favoriteMemories || 'None specified'}
- Quirks & Things Loved About Them: ${input.quirksAndReasons || 'None specified'}
- Inside Jokes / Private References: ${input.insideJokes || 'None specified'}
- Hopes for Future / Promises: ${input.futureHopes || 'None specified'}
- Extra Nuances / Guidance: ${input.extraNotes || 'None specified'}

Provide 3 complete drafts, each with:
- title: Short descriptive name (e.g. "Tender & Soulful", "Playful & Cozy", "Poetic Echoes")
- coverHeadline: A beautiful 3-7 word front cover headline suitable for a physical card
- coverSubtext: A short subtitle for the cover (e.g. "For My Favorite Human", "Happy Valentine's Day, Maya")
- salutation: The opening line (e.g., "My Dearest Maya,", "To my favorite adventurer,")
- body: The main card message formatted with natural paragraph breaks (\\n\\n). Match the requested format length (${format}).
- closing: The sign-off line (e.g., "Forever and always,", "All my love,")
- signature: The sender's name (${input.senderName || ''})
- postscript: A delightful, memorable P.S. (can reference an inside joke, cute quirk, or sweet promise)
- tone: Tone category
- format: Card format category
- recommendedTheme: One of "blush-rose", "vintage-parchment", "midnight-gold", "clean-linen", "botanical-sage"
- recommendedFontStyle: One of "serif", "script", "vibes", "sans"
- puppyIllustrationTitle: A poetic title for a gothic charcoal puppy drawing (e.g., "The Faithful Hound", "Guardian of Our Sundays", "Moonlit Devotion")
- puppyIllustrationCaption: A 1-2 sentence caption interpreting the gothic charcoal puppy illustration directly in the context of this letter's specific memories or feelings`;

  try {
    const { response, modelUsed } = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  coverHeadline: { type: Type.STRING },
                  coverSubtext: { type: Type.STRING },
                  salutation: { type: Type.STRING },
                  body: { type: Type.STRING },
                  closing: { type: Type.STRING },
                  signature: { type: Type.STRING },
                  postscript: { type: Type.STRING },
                  tone: { type: Type.STRING },
                  format: { type: Type.STRING },
                  recommendedTheme: { type: Type.STRING },
                  recommendedFontStyle: { type: Type.STRING },
                  puppyIllustrationTitle: { type: Type.STRING },
                  puppyIllustrationCaption: { type: Type.STRING },
                },
                required: ['title', 'coverHeadline', 'salutation', 'body', 'closing'],
              },
            },
          },
          required: ['cards'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const cards = (parsed.cards || []).map((card: any, idx: number) => ({
      id: `ai-card-${Date.now()}-${idx}`,
      title: card.title || `Option ${idx + 1}`,
      coverHeadline: card.coverHeadline || "Happy Valentine's Day",
      coverSubtext: card.coverSubtext || `For ${partnerName}`,
      salutation: card.salutation || `Dear ${partnerName},`,
      body: card.body || '',
      closing: card.closing || 'With all my love,',
      signature: card.signature || input.senderName || '',
      postscript: card.postscript || '',
      tone: card.tone || tone,
      format: card.format || format,
      stationeryTheme: card.recommendedTheme || (idx === 1 ? 'clean-linen' : idx === 2 ? 'vintage-parchment' : 'blush-rose'),
      fontStyle: card.recommendedFontStyle || (idx === 2 ? 'script' : 'serif'),
      createdAt: new Date().toISOString(),
      partnerName,
      puppyIllustration: {
        enabled: true,
        style: 'gothic-charcoal',
        variant: idx === 2 ? 'moonlit-devotion' : 'rose-companion',
        title: card.puppyIllustrationTitle || (idx === 2 ? 'Moonlit Devotion' : 'The Faithful Hound & Rose'),
        caption: card.puppyIllustrationCaption || `Gothic charcoal study: eternal loyalty and deep affection for ${partnerName}`,
        placement: idx === 2 ? 'both' : 'cover',
      },
    }));

    if (!cards.length) {
      return res.json({ cards: generateFallbackCards(input), isFallback: true });
    }

    res.json({ cards, isFallback: false, modelUsed });
  } catch (err: any) {
    console.warn('Temporary model traffic spike encountered, providing tailored fallback cards:', err?.message);
    res.json({
      cards: generateFallbackCards(input),
      isFallback: true,
      notice: 'Server experienced peak demand; tailored your cards with bespoke fallback writing templates.',
    });
  }
});

// Refine/polish card endpoint
app.post('/api/refine-card', async (req, res) => {
  const { currentCard, action, customInstruction } = req.body || {};
  const ai = getAi();

  if (!ai || !currentCard) {
    return res.json({ card: applyLocalRefinement(currentCard || {}, action, customInstruction), isFallback: true });
  }

  let instructionPrompt = '';
  switch (action) {
    case 'sweeter':
      instructionPrompt = 'Deepen the romance and emotional sincerity. Make it warmer, softer, and more touchingly affectionate.';
      break;
    case 'funnier':
      instructionPrompt = 'Inject warm humor, playful teasing, and witty charm without diminishing the underlying love.';
      break;
    case 'shorten':
      instructionPrompt = 'Condense and tighten the body text so it easily fits inside a standard compact greeting card (around 60-90 words max) while keeping the most poignant lines.';
      break;
    case 'poetic':
      instructionPrompt = 'Rewrite the card with rich poetic cadence, evocative imagery, and lyrical beauty.';
      break;
    case 'rhyme':
      instructionPrompt = 'Transform the core message into charming, well-metered rhyming stanzas or couplets.';
      break;
    case 'add-ps':
      instructionPrompt = 'Create a sweet, witty, or intimate P.S. (postscript) that adds a charming finishing touch.';
      break;
    case 'more-natural':
      instructionPrompt = 'Make it sound conversational, relaxed, and natural—as if spoken directly across the dinner table, stripping away any stiff or overly dramatic phrasing.';
      break;
    case 'custom':
    default:
      instructionPrompt = customInstruction || 'Polish the card and improve the flow and emotional resonance.';
      break;
  }

  try {
    const { response } = await generateContentWithFallback(ai, {
      contents: `You are refining a Valentine's card.
Current Card:
- Salutation: ${currentCard.salutation}
- Body:
${currentCard.body}
- Closing: ${currentCard.closing}
- Signature: ${currentCard.signature}
- Postscript: ${currentCard.postscript || 'None'}
- Cover Headline: ${currentCard.coverHeadline || ''}

Refinement Instruction:
${instructionPrompt}

Return the complete revised card in JSON schema.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverHeadline: { type: Type.STRING },
            coverSubtext: { type: Type.STRING },
            salutation: { type: Type.STRING },
            body: { type: Type.STRING },
            closing: { type: Type.STRING },
            signature: { type: Type.STRING },
            postscript: { type: Type.STRING },
          },
          required: ['salutation', 'body', 'closing'],
        },
      },
    });

    const revised = JSON.parse(response.text || '{}');
    const updatedCard = {
      ...currentCard,
      coverHeadline: revised.coverHeadline || currentCard.coverHeadline,
      coverSubtext: revised.coverSubtext || currentCard.coverSubtext,
      salutation: revised.salutation || currentCard.salutation,
      body: revised.body || currentCard.body,
      closing: revised.closing || currentCard.closing,
      signature: revised.signature || currentCard.signature,
      postscript: revised.postscript || currentCard.postscript,
    };

    res.json({ card: updatedCard, isFallback: false });
  } catch (err: any) {
    console.warn('Refinement AI unavailable, using intelligent local refinement:', err?.message);
    res.json({ card: applyLocalRefinement(currentCard, action, customInstruction), isFallback: true });
  }
});

// Ideas spark endpoint for writer's block
app.post('/api/card-ideas', async (req, res) => {
  const { partnerName, relationshipStage } = req.body || {};
  const ai = getAi();

  const fallbackIdeas = [
    {
      id: '1',
      category: 'Favorite Memory',
      prompt: 'Remember the day when...',
      description: 'Recall the first time you realized you were falling in love, or an unexpected rainy day trip.',
    },
    {
      id: '2',
      category: 'Adored Quirk',
      prompt: 'My favorite thing you do...',
      description: 'The way they drink their tea, laugh with their whole body, or sing off-key in the car.',
    },
    {
      id: '3',
      category: 'Inside Joke',
      prompt: 'Only we understand why...',
      description: 'A nickname, a misheard lyric, a funny restaurant mishap that became your shared lore.',
    },
    {
      id: '4',
      category: 'Quiet Gratitude',
      prompt: 'Thank you for always...',
      description: 'How safe you feel in their arms, their patience, or how they believe in your dreams.',
    },
  ];

  if (!ai) {
    return res.json({ ideas: fallbackIdeas });
  }

  try {
    const { response } = await generateContentWithFallback(ai, {
      contents: `Provide 5 creative, heartfelt memory prompts and compliment angles to help someone write a personal Valentine's card for their partner named "${partnerName || 'my partner'}" (relationship stage: "${relationshipStage || 'together'}").
Output as JSON list of prompts.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'category', 'prompt', 'description'],
              },
            },
          },
          required: ['ideas'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ideas: parsed.ideas || fallbackIdeas });
  } catch {
    res.json({ ideas: fallbackIdeas });
  }
});

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Valentine Letter Assistant Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
