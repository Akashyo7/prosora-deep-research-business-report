# Prosora Deep Research Business Report

This project is a multi-step research agent that uses the Motia framework to conduct research and generate a business report.

## Prerequisites

- Node.js (v20.x or higher)
- npm

## Installation

1.  Install Motia CLI globally:

    ```bash
    npm install -g motia
    ```

2.  Install project dependencies:

    ```bash
    npm install
    ```

## Running the Application

1.  Start the development server:

    ```bash
    motia dev
    ```

2.  The server will start on port 3000. You can access the Motia workbench at `http://localhost:3000`.

## API Endpoints

-   `POST /research`

    Starts a new research task.

    **Request Body:**

    ```json
    {
      "query": "Your research query",
      "depth": "basic"
    }
    ```

    -   `depth` can be one of `"basic"`, `"detailed"`, or `"comprehensive"`.

    **Response:**

    ```json
    {
      "requestId": "a-unique-request-id"
    }
    ```

-   `GET /research/status?requestId=<requestId>`

    Checks the status of a research task.

-   `GET /research/report?requestId=<requestId>`

    Retrieves the generated report.

## Vercel Serverless Prototype (Groq)

This repository includes a minimal serverless API under the `api/` directory for rapid prototyping on Vercel using Groq (OpenAI-compatible API):

- `api/research.ts` — POST endpoint that synchronously generates a compact business research report via Groq and returns `{ requestId, status: "completed", report }`.
- `api/status.ts` — GET endpoint that returns `completed` for the given `requestId` in this synchronous prototype.
- `api/report.ts` — GET endpoint included for completeness; returns 404 because reports are not persisted in this prototype.

### Default Model and Overrides

- Default model used by the serverless API: `llama-3.3-70b-versatile`.
- You can override via environment variable: set `GROQ_MODEL` (e.g., `llama-3.1-8b-instant` for lower cost/latency).
- Groq models may be deprecated over time; check the deprecations page and update `GROQ_MODEL` accordingly.

Reference: Groq deprecations and recommended replacements [0].

### Environment Variables

- `GROQ_API_KEY` — Your Groq API key. Set this in Vercel Project → Settings → Environment Variables.
 - `GROQ_MODEL` — Optional. Overrides the default model used by `src/services/groq.service.ts`.

### Local Dev with Vercel

```bash
npm install
npx vercel dev
```

Test the prototype:

```bash
curl -X POST http://localhost:3000/api/research \
  -H 'Content-Type: application/json' \
  -d '{"query":"Market analysis for AI agents in SMBs","depth":2}'
```

### Deploy to Vercel

```bash
npx vercel
```

### Notes

- This is a synchronous prototype intended for quick validation. For production-grade multi-step research with progress tracking, use a job queue and persistent storage (e.g., Vercel Queues plus KV/Postgres) and split start/status/report endpoints.
 - If you encounter `model_decommissioned` errors, switch to a supported model (e.g., `llama-3.3-70b-versatile` or `llama-3.1-8b-instant`) and redeploy.

## Frontend UI

- A minimal UI is available at the root (`/`) using TailwindCSS.
- Enter a topic and depth, click “Generate Report”.
- Reports render as markdown with headings, lists, and links.
- Actions: Copy to clipboard, Download as `.md` file.

## Troubleshooting

- `401 Unauthorized`: Ensure `GROQ_API_KEY` is set for Preview/Production.
- `model_decommissioned`: Set `GROQ_MODEL` to a supported ID and redeploy.
- `404 on root`: Root now serves `index.html`. If you still see 404, confirm the file exists and is committed.
- Local dev not starting: Update Vercel CLI (`npm i -g vercel@latest`) and run `npx vercel dev` from the project root.

### GitHub Setup (for Vercel)

1. Initialize git locally (if not already):
   ```bash
   git init
   git add -A
   git commit -m "chore: init repo and add Groq prototype"
   git branch -M main
   ```
2. Create a GitHub repo (via web UI) and copy the HTTPS URL (e.g., `https://github.com/<your-user>/<repo>.git`).
3. Add the remote and push:
   ```bash
   git remote add origin <your-https-url>
   git push -u origin main
   ```
4. In Vercel, import the GitHub repo, set `GROQ_API_KEY` in Environment Variables, and deploy.