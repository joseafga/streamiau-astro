import { atom, computed } from "nanostores";
import type { Phrases } from "@/components/phrases/types";

function readPhrases(): Phrases | undefined {
  const data = document.getElementById("phrases-data")?.textContent;

  if (!data) return undefined;

  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}

export const $phrases = atom<Phrases | undefined>(undefined);
export const $categories = computed($phrases, (phrases) => Object.keys(phrases?.categories ?? {}));

// The table and the command builder are separate React roots, so each hydrates
// the store on mount; the guard keeps the document from being parsed twice.
export function loadPhrases(newPhrases?: Phrases) {
  if (newPhrases) {
    $phrases.set(newPhrases);
  } else {
    if ($phrases.get()) return;

    $phrases.set(readPhrases());
  }
}

export function removePhrase(category: string, index: number) {
  const phrases = $phrases.get();
  const phrasesOfCategory = phrases?.categories[category];

  if (!phrases || !phrasesOfCategory) return;

  $phrases.set({
    ...phrases,
    categories: {
      ...phrases.categories,
      [category]: {
        ...phrasesOfCategory,
        phrases: phrasesOfCategory.phrases.filter((_, phraseIndex) => phraseIndex !== index),
      },
    },
  });
}
