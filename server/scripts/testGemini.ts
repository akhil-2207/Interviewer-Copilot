import "dotenv/config"
import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY?.trim()

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing. Add it to the project-root .env file.")
}

const ai = new GoogleGenAI({ apiKey })
const response = await ai.models.generateContent({
  model: "gemini-flash-latest",
  contents: 'Reply with JSON containing exactly { "status": "ok" }',
  config: { responseMimeType: "application/json" },
})

const payload = JSON.parse(response.text ?? "") as { status?: unknown }

if (payload.status !== "ok") {
  throw new Error("Gemini returned an unexpected response.")
}

console.log('Gemini connection verified: {"status":"ok"}')
