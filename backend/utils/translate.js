const { LingoDotDevEngine } = require("lingo.dev/sdk");

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
});

exports.translateText = async (text, targetLang = "en") => {
  try {
    if (!text) return text;

    const translated = await lingo.localizeText(text, {
      sourceLocale: null,      // auto-detect
      targetLocale: targetLang // "en"
    });

    return translated || text;
  } catch (error) {
    console.error("Lingo Translation Error:", error.message);
    return text; // fallback (never break report creation)
  }
};
