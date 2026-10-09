import "dotenv/config"
import express from "express"
import { guideRouter } from "./routes/guide.js"

const app = express()

app.disable("x-powered-by")
app.use(express.json({ limit: "1mb" }))

app.get("/api/health", (_request, response) => {
  response.json({ success: true, service: "interviewer-copilot-api" })
})

app.use("/api", guideRouter)

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ success: false, error: "Request body must be valid JSON." })
    return
  }
  response.status(500).json({ success: false, error: "The server could not process this request." })
})

export default app
