#!/usr/bin/env node
import dotenv from "dotenv";
import { Command } from "commander";
import { createSynchronizer, createTranslator } from "../lib/translation";
import { LANGUAGES } from "@/constants/language";
import { loadDictionary, saveDictionary } from "@/lib/translation/loader";
import { LanguageCode } from "@/types/translation";

dotenv.config();

const program = new Command();

program
  .command("add <language>")
  .description("Add translation for a language")
  .action(async (language) => {
    if (!LANGUAGES[language as LanguageCode]) {
      console.error("Invalid language code");
      process.exit(1);
    }

    const translator = createTranslator({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY!,
    });

    const dict = loadDictionary();
    const translated = await translator.translateDictionary(dict, language);
    saveDictionary(translated);
    console.log(
      `Translation to ${LANGUAGES[language as LanguageCode]} completed`
    );
  });

program
  .command("sync")
  .description("Synchronize all translations")
  .action(async () => {
    const synchronizer = createSynchronizer({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY!,
    });

    const dict = loadDictionary();
    const synced = await synchronizer.syncDictionary(dict);
    saveDictionary(synced);
    console.log("Synchronization completed");
  });

program.parse(process.argv);
