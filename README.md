# PrepXL Assignment - Audio Visualizer & Transcription

A React application featuring a circular audio frequency visualizer and real-time speech transcription using the Google Gemini Live API.

## Features

- **Frontend**: Circular Audio Equalizer using Web Audio API and HTML5 Canvas.
- **Backend/AI**: Real-time bi-directional streaming with Gemini Multimodal Live API.
- **UX Audit**: A mock audit report page for the assignment.

## Prerequisites

- Node.js (v18 or later)
- A Google Gemini API Key (Paid tier required for Live API or use valid preview models)

## Setup & Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Set API Key**:
    Create a `.env` file in the root directory (optional, or enter it in the UI):
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```
    *Note: The app checks `process.env.API_KEY` (mapped to `VITE_API_KEY` in Vite) or allows manual entry in the UI.*

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS (via CDN for simplicity)
- @google/genai SDK
