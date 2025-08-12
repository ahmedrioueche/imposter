#!/usr/bin/env node
import dotenv from "dotenv";
import { createTranslator, createWatcher } from "../lib/translation";

dotenv.config();

async function main() {
  const translator = createTranslator({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY!,
  });

  const watcher = createWatcher(translator);
  await watcher.watch();
}

main().catch(console.error);
