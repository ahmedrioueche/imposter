import { model } from './gemini';

// Fallback word list if AI fails
const FALLBACK_WORDS = [
  'Cat',
  'Pizza',
  'Batman',
  'Unicorn',
  'Netflix',
  'Vampire',
  'Ninja',
  'Chocolate',
  'Einstein',
  'Pirate',
  'Zombie',
  'Superhero',
  'Dragon',
  'Mermaid',
  'Robot',
  'Wizard',
  'Dinosaur',
  'Alien',
  'Ghost',
  'Monster',
  'Princess',
  'Knight',
  'Cowboy',
  'Detective',
  'Chef',
  'Doctor',
  'Teacher',
  'Artist',
  'Musician',
  'Athlete',
  'Clown',
  'Magician',
  'Firefighter',
  'Astronaut',
  'Pilot',
  'Farmer',
  'Baker',
  'Barber',
  'Dentist',
  'Librarian',
  'Christmas',
  'Halloween',
  'Birthday',
  'Wedding',
  'Vacation',
  'School',
  'Beach',
  'Mountain',
  'Forest',
  'Desert',
  'Ocean',
  'River',
  'Castle',
  'Playground',
  'Zoo',
  'Circus',
  'Theater',
  'Museum',
  'Park',
  'Mall',
];

export class WordGenerator {
  private static async generateWithAI(): Promise<{ word: string; firstWord: string }> {
    try {
      const prompt = `Generate a word pair for a guessing game. Respond with exactly this format: "WORD|FIRST_WORD"

The main word should be:
- A concrete noun (not abstract)
- Something everyone would know
- Not too easy or too hard
- Suitable for all ages
- One word only

The first word should be:
- Related to the main word
- Something someone might say when discussing the main word
- Not too obvious (don't give it away)
- One word only

Example: "Pizza|Italian" or "Batman|Hero" or "Christmas|December"

Just respond with the format: WORD|FIRST_WORD`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();

      // Parse the response
      const parts = text.split('|');
      if (parts.length === 2) {
        const word = parts[0].trim();
        const firstWord = parts[1].trim();

        if (
          word &&
          firstWord &&
          word.split(' ').length === 1 &&
          firstWord.split(' ').length === 1
        ) {
          return { word, firstWord };
        }
      }

      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('AI word generation failed:', error);
      throw error;
    }
  }

  private static getRandomFallbackWord(): { word: string; firstWord: string } {
    const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
    const word = FALLBACK_WORDS[randomIndex];
    const firstWord = this.generateFirstWordFor(word);
    return { word, firstWord };
  }

  private static generateFirstWordFor(word: string): string {
    // Predefined first words for common fallback words
    const firstWordMap: Record<string, string[]> = {
      Cat: ['Pet', 'Furry', 'Meow', 'Animal'],
      Pizza: ['Italian', 'Cheese', 'Food', 'Hot'],
      Batman: ['Hero', 'Dark', 'Cape', 'Justice'],
      Unicorn: ['Magic', 'Horn', 'Fantasy', 'Rainbow'],
      Netflix: ['Movies', 'Streaming', 'Watch', 'Series'],
      Vampire: ['Blood', 'Night', 'Fangs', 'Dark'],
      Ninja: ['Stealth', 'Black', 'Fast', 'Warrior'],
      Chocolate: ['Sweet', 'Brown', 'Dessert', 'Cocoa'],
      Einstein: ['Smart', 'Science', 'Genius', 'Theory'],
      Pirate: ['Ship', 'Treasure', 'Sea', 'Captain'],
      Christmas: ['Holiday', 'December', 'Gifts', 'Tree'],
      Halloween: ['Costumes', 'Candy', 'Spooky', 'October'],
      Doctor: ['Medical', 'Hospital', 'Healing', 'White'],
      Beach: ['Sand', 'Waves', 'Summer', 'Vacation'],
      School: ['Learning', 'Books', 'Teacher', 'Students'],
    };

    const relatedWords = firstWordMap[word];
    if (relatedWords && relatedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * relatedWords.length);
      return relatedWords[randomIndex];
    }

    // Generic fallback if word not in map
    const genericWords = ['Thing', 'Item', 'Something', 'Object'];
    const randomIndex = Math.floor(Math.random() * genericWords.length);
    return genericWords[randomIndex];
  }

  public static async generateWord(): Promise<{ word: string; firstWord: string }> {
    try {
      // Try AI first
      const aiResult = await this.generateWithAI();
      console.log('Generated word with AI:', aiResult);
      return aiResult;
    } catch (error) {
      // Fallback to predefined list
      const fallbackResult = this.getRandomFallbackWord();
      console.log('Using fallback word:', fallbackResult);
      return fallbackResult;
    }
  }

  public static async generateFirstWord(secretWord: string): Promise<string> {
    try {
      // Try AI first to generate a related word
      const prompt = `Generate a single word that is related to "${secretWord}" but not too obvious. The word should be something someone might say when discussing "${secretWord}" but shouldn't immediately give it away. Just respond with the word, nothing else.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const word = response.text().trim();

      // Validate the response is a single word
      if (word && word.split(' ').length === 1 && word.length > 2) {
        console.log('Generated first word with AI:', word, 'for secret word:', secretWord);
        return word;
      }

      throw new Error('Invalid AI response for first word');
    } catch (error) {
      // Fallback to predefined related words
      const firstWord = this.getRelatedFallbackWord(secretWord);
      console.log('Using fallback first word:', firstWord, 'for secret word:', secretWord);
      return firstWord;
    }
  }

  private static getRelatedFallbackWord(secretWord: string): string {
    // Predefined related words for common secret words
    const relatedWords: Record<string, string[]> = {
      Cat: ['Pet', 'Furry', 'Meow', 'Whiskers', 'Paws'],
      Pizza: ['Italian', 'Cheese', 'Slice', 'Oven', 'Delivery'],
      Batman: ['Hero', 'Cape', 'Dark', 'Justice', 'Gotham'],
      Christmas: ['Holiday', 'December', 'Gifts', 'Tree', 'Snow'],
      Doctor: ['Medical', 'Hospital', 'Stethoscope', 'Healing', 'White'],
      Beach: ['Sand', 'Waves', 'Summer', 'Vacation', 'Sunny'],
      Vampire: ['Night', 'Blood', 'Fangs', 'Pale', 'Immortal'],
      Ninja: ['Stealth', 'Black', 'Silent', 'Warrior', 'Fast'],
      Chocolate: ['Sweet', 'Brown', 'Dessert', 'Cocoa', 'Melting'],
      Dragon: ['Fire', 'Wings', 'Scales', 'Mythical', 'Flying'],
      Wizard: ['Magic', 'Spell', 'Wand', 'Robes', 'Mystical'],
      Pirate: ['Ship', 'Treasure', 'Ocean', 'Adventure', 'Sword'],
      Astronaut: ['Space', 'Rocket', 'Stars', 'Helmet', 'Floating'],
      Firefighter: ['Rescue', 'Water', 'Ladder', 'Emergency', 'Brave'],
      Zoo: ['Animals', 'Cages', 'Wild', 'Visit', 'Educational'],
      School: ['Learning', 'Books', 'Teacher', 'Students', 'Knowledge'],
      Halloween: ['Costumes', 'Candy', 'Spooky', 'October', 'Masks'],
      Wedding: ['Ceremony', 'Dress', 'Rings', 'Celebration', 'Love'],
    };

    const related = relatedWords[secretWord];
    if (related && related.length > 0) {
      const randomIndex = Math.floor(Math.random() * related.length);
      return related[randomIndex];
    }

    // If no specific related words, return a generic starter word
    const genericStarters = ['Thing', 'Item', 'Object', 'Something', 'Stuff'];
    const randomIndex = Math.floor(Math.random() * genericStarters.length);
    return genericStarters[randomIndex];
  }

  public static async generateMultipleWords(
    count: number = 5
  ): Promise<{ word: string; firstWord: string }[]> {
    const wordPairs: { word: string; firstWord: string }[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const wordPair = await this.generateWord();
        if (!wordPairs.some((pair) => pair.word === wordPair.word)) {
          wordPairs.push(wordPair);
        }
      } catch (error) {
        // If we can't generate enough unique words, fill with fallbacks
        const fallback = this.getRandomFallbackWord();
        if (!wordPairs.some((pair) => pair.word === fallback.word)) {
          wordPairs.push(fallback);
        }
      }
    }

    return wordPairs;
  }
}
