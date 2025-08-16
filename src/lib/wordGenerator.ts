// word-generator.ts
import { WORD_DATA, WORD_LIST } from '../constants/words';

export class WordGenerator {
  private static getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[randomIndex];
  }

  private static getRelatedWord(word: string): string {
    const related = WORD_DATA[word];
    if (!related || related.length === 0) return 'Something';
    const randomIndex = Math.floor(Math.random() * related.length);
    return related[randomIndex];
  }

  public static async generateWord(): Promise<{ word: string; firstWord: string }> {
    const word = this.getRandomWord();
    const firstWord = this.getRelatedWord(word);
    return { word, firstWord };
  }

  public static async generateFirstWord(secretWord: string): Promise<string> {
    return this.getRelatedWord(secretWord);
  }

  public static async generateMultipleWords(
    count: number = 5
  ): Promise<{ word: string; firstWord: string }[]> {
    const results: { word: string; firstWord: string }[] = [];
    const used = new Set<string>();

    while (results.length < count && used.size < WORD_LIST.length) {
      const word = this.getRandomWord();
      if (!used.has(word)) {
        used.add(word);
        results.push({ word, firstWord: this.getRelatedWord(word) });
      }
    }
    return results;
  }
}
