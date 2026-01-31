const axios = require("axios");

const LINGO_API_URL = "https://api.lingo.dev/v1/translate";

exports.translateText = async (text, from, to) => {
  if (!text || from === to) {
    return text;
  }

  try {
    const response = await axios.post(
      LINGO_API_URL,
      {
        text,
        source_language: from,
        target_language: to,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINGO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.translated_text || text;
  } catch (error) {
    console.error("Translation failed:", error.message);
    return text; // fallback
  }
};
