import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
if (!API_KEY) {
  console.error('API key is missing!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
