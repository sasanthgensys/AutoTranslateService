import express from "express";
import axios from "axios";
import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3555;
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("Missing API_KEY in environment variables.");
    process.exit(1);
}

const app = express();
const groq = new Groq({ apiKey });

// Middleware to parse JSON bodies
app.use(express.json());

// Function to check if a string contains Arabic characters
function containsArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// Function to fetch translation from Google Translate
async function fetchGoogleTranslation(sl, tl, query) {
    const url = `http://translate.google.com/m?hl=en&sl=${sl}&tl=${tl}&ie=UTF-8&prev=_m&q=${query}`;

    try {
        const response = await axios.get(url);
        return extractContent(response.data);
    } catch (error) {
        console.error("Error fetching data from Google Translate:", error);
        throw new Error("Google Translate failed");
    }
}

// Function to extract translated text from HTML response
function extractContent(html) {
    const startTag = "<div class='result-container'>";
    const endTag = "</div>";
    const startIndex = html.indexOf(startTag);
    if (startIndex === -1) return null;

    const endIndex = html.indexOf(endTag, startIndex);
    if (endIndex === -1) return null;

    return html.substring(startIndex + startTag.length, endIndex);
}

// Function to fetch translation from Groq AI
async function fetchGroqTranslation(query) {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an English to Arabic translating service. Reply only with the Arabic translation.",
                },
                {
                    role: "user",
                    content: query,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        console.log(response.choices[0]?.message?.content);
        return response.choices[0]?.message?.content.trim() || "";
    } catch (error) {
        console.error("Error fetching data from Groq AI:", error);
        throw new Error("Groq AI translation failed");
    }
}

// Main translation function
async function translateText(sl, tl, query) {
    try {
        let translatedText = await fetchGoogleTranslation(sl, tl, query);

        // If the text does not contain Arabic, fall back to Groq AI
        if (!containsArabic(translatedText)) {
            translatedText = await fetchGroqTranslation(query);
        }

        return translatedText;
    } catch (error) {
        throw new Error("Translation failed");
    }
}

// GET translation endpoint
app.get("/translate", async (req, res) => {
    const { sl, tl, query } = req.query;

    if (!sl || !tl || !query) {
        return res.status(400).send("Missing required query parameters: sl, tl, query");
    }

    try {
        let translation = await translateText(sl, tl, query);

        if (!translation || translation === "") translation = query;
        res.send(translation);
    } catch (error) {
        res.status(500).send("Error processing translation");
    }
});

// GET translation with delay
app.get("/translate-delay", async (req, res) => {
    const { sl, tl, query } = req.query;

    if (!sl || !tl || !query) {
        return res.status(400).send("Missing required query parameters: sl, tl, query");
    }

    setTimeout(async () => {
        try {
            const translation = await translateText(sl, tl, query);
            res.send(translation);
        } catch (error) {
            res.status(500).send("Error processing translation");
        }
    }, 2000);
});

// POST translation endpoint
app.post("/translate", async (req, res) => {
    const { sl, tl, query } = req.body;

    if (!sl || !tl || !query) {
        return res.status(400).send("Missing required body parameters: sl, tl, query");
    }

    try {
        const translation = await translateText(sl, tl, query);
        res.send(translation);
    } catch (error) {
        res.status(500).send("Error processing translation");
    }
});

// POST translation with delay
app.post("/translate-delay", async (req, res) => {
    const { sl, tl, query } = req.body;

    if (!sl || !tl || !query) {
        return res.status(400).send("Missing required body parameters: sl, tl, query");
    }

    setTimeout(async () => {
        try {
            const translation = await translateText(sl, tl, query);
            res.send(translation);
        } catch (error) {
            res.status(500).send("Error processing translation");
        }
    }, 2000);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
