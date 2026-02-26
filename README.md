# goBlink Telegram Mini App

Cross-chain token transfer app running as a Telegram Mini App.

## Stack

- Vite 6 + React 19 + TypeScript (strict)
- Tailwind CSS 3
- Telegram Mini App SDK
- Wallet stack: AppKit (EVM/Solana), Sui dapp-kit, NEAR connect, Aptos, Starknet, TRON
- Zustand state management
- React Router 7

## Setup

```bash
cp .env.example .env
# Fill in your env vars
npm install --legacy-peer-deps
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (default: https://goblink.io) |
| `VITE_BOT_USERNAME` | Telegram bot username (default: goBlinkBot) |
| `VITE_REOWN_PROJECT_ID` | Reown (WalletConnect) project ID |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## Development

```bash
npm run dev
```

Opens at http://localhost:5173. For TMA testing, use [@BotFather](https://t.me/BotFather) to set the web app URL.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy

Deploy `dist/` to telegram.goblink.io. Configure the Telegram bot's web app URL to point there.

## Supported Chains

Aptos, Arbitrum, Base, BNB Chain, Ethereum, NEAR, Optimism, Polygon, Solana, Starknet, Sui, TRON
