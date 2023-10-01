# chat-with-epub

Very Simple script that I wrote to play around with langchain. It allows me to interact with epub files.

## Prerequisites

- bun
- OpenAI API key

## Environment setup

To setup environment:

1. Create `.env.local file`

```bash
touch .env.local
```

2. Add `OPENAI_API_KEY` as env var to `.env.local`

```env
OPEN_AI_API_KEY=sk-...
```

## Commands

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts <path-to-epub-file>
```

## Demo

https://github.com/meronogbai/chat-with-epub/assets/22526062/0663767a-f48e-4167-b3e3-317793529d0e

## Limitation

Currently, this is only good for asking targeted questions and not summarization due OpenAI's to token size limit.
