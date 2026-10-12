
import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 0,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZAYRA.EXE AI server is alive ♡");
});

// Existing speech endpoint — preserved for now
app.post("/api/speech", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "No text was provided.",
      });
    }

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "nova",
      input: text,
      instructions: `
You are ZAYRA.EXE, Zee's personal digital bestie.
Speak in a feminine, bubbly, playful, expressive,
confident, natural, conversational way.
Always call the user Zee, never Zayra.
Do not imitate a real person or celebrity.
`,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    console.error("ZAYRA SPEECH ERROR:", error);

    res.status(500).json({
      error: "ZAYRA couldn't speak right now.",
    });
  }
});

// Existing AI briefing endpoint — preserved
app.post("/api/briefing", async (req, res) => {
  try {
    const {
      todayEvents = [],
      tasks = [],
      goals = [],
      trackers = [],
      balance = 0,
      weather = null,
    } = req.body;

    const prompt = `
You are ZAYRA.EXE — Zee's personal digital bestie and Life OS assistant.

Your personality:
- Girly-pop, feminine, playful, confident, and warm
- Slightly nosy because you genuinely pay attention
- Cute, witty, occasionally sassy, with grown-girl Bratz/Y2K energy
- Encourages Zee without babying her
- Celebrates wins and lovingly calls out procrastination
- Uses casual feminine language naturally
- Uses cute emojis occasionally, not in every sentence
- Never sounds corporate, forced, or overly Gen Z

Always call the user Zee, never Zayra.

Only use the data supplied below. Never invent events,
tasks, goals, tracker activity, finances, weather, or plans.
Skip empty categories.

TODAY'S EVENTS:
${JSON.stringify(todayEvents)}

TASKS:
${JSON.stringify(tasks)}

GOALS:
${JSON.stringify(goals)}

TRACKERS:
${JSON.stringify(trackers)}

CURRENT MONEY BALANCE:
$${Number(balance).toFixed(2)}

WEATHER:
${JSON.stringify(weather)}

Write one cohesive, conversational daily briefing
of around 120–180 words.

Mention relevant events, useful task priorities,
meaningful progress, tomorrow's weather and a practical
outfit suggestion when the supplied data supports them.
Offer useful encouragement and finish with a cute,
funny, slightly sassy ZAYRA.EXE-style note.

Don't create section headings, repeat every data point,
give generic advice, shame Zee, or say "As an AI."
`;

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      input: prompt,
    });

    res.json({
      briefing: response.output_text,
    });
  } catch (error) {
    console.error("ZAYRA AI ERROR:", error);

    res.status(500).json({
      error: "ZAYRA couldn't generate your briefing right now.",
    });
  }
});

// New Live voice session endpoint
app.use(
  "/api/live",
  express.text({ type: "application/sdp" })
);

app.post("/api/live", async (req, res) => {
  try {
    if (typeof req.body !== "string" || !req.body.trim()) {
      return res.status(400).send("Missing WebRTC SDP offer.");
    }

    const instructions = process.env.ZAYRA_LIVE_INSTRUCTIONS;

    if (!instructions) {
      return res.status(500).send(
        "Add ZAYRA_LIVE_INSTRUCTIONS to your server environment."
      );
    }

    const live = await openai.live.create({
      session: {
        model: "gpt-live-1",
        instructions,
        audio: {
          output: {
            voice: "gleam",
          },
        },
      },
      transport: {
        type: "webrtc",
        sdp: req.body,
      },
    });

    res
      .status(200)
      .type("application/sdp")
      .send(live.transport.sdp);
  } catch (error) {
    console.error("ZAYRA LIVE ERROR:", error);

    res.status(500).send(
      "ZAYRA couldn't start a Live session. Check the server terminal."
    );
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`ZAYRA.EXE AI server running on port ${PORT}`);
});