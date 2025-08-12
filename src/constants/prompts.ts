// src/constants/prompts.ts
export const TRANSLATION_PROMPT = `
Please translate the following UI key into {LANGUAGE}.
Key: "{KEY}"
Provide only the translated text for {LANGUAGE}.
`.trim();

export const SYNCHRONIZATION_PROMPT = `
Please synchronize the translations from the reference language (en) with {LANGUAGE}.
Existing translation: "{EXISTING}"
New reference text: "{REFERENCE}"
Provide only the synchronized translation for {LANGUAGE}.
`.trim();
