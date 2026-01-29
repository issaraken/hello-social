# LINE OA Web Chat

A web chat application built with Next.js that allows you to send and receive messages with a LINE Official Account (LINE OA) through the LINE Messaging API.

## Features

- Send messages from web chat to LINE OA
- Receive messages from LINE OA (via webhook)
- Real-time message updates with polling
- Modern, responsive UI with dark mode support
- TypeScript for type safety

## Prerequisites

Before you begin, you need:

1. **LINE Official Account** - Create one at [LINE Official Account Manager](https://manager.line.biz/)
2. **LINE Messaging API Channel** - Set up at [LINE Developers Console](https://developers.line.biz/console/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/chat-app.git
cd chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your LINE credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
LINE_USER_ID=your_user_id
```

**Where to find these values:**

- **Channel Access Token**: LINE Developers Console → Your Channel → Messaging API → Channel access token (long-lived)
- **Channel Secret**: LINE Developers Console → Your Channel → Basic settings → Channel secret
- **User ID**: LINE Developers Console → Your Channel → Basic settings → Your user ID

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chat interface.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in the Vercel dashboard:
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
   - `LINE_USER_ID`
4. Deploy

### 3. Configure LINE Webhook (Optional - for receiving messages)

After deployment:

1. Go to LINE Developers Console → Your Channel → Messaging API
2. Set Webhook URL to: `https://your-domain.vercel.app/api/webhook`
3. Enable "Use webhook"
4. Disable "Auto-reply messages" if you want to handle messages programmatically

## Project Structure

```
chat-app/
├── app/
│   ├── api/
│   │   ├── send/route.ts       # API to send messages to LINE
│   │   ├── webhook/route.ts    # Receive webhooks from LINE
│   │   └── messages/route.ts   # Get received messages
│   ├── page.tsx                # Main chat page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ChatWindow.tsx          # Chat UI component
├── lib/
│   ├── line.ts                 # LINE API utilities
│   └── messageStore.ts         # In-memory message storage
├── types/
│   └── index.ts                # TypeScript types
└── .env.example                # Example environment variables
```

## API Routes

| Route           | Method | Description                      |
| --------------- | ------ | -------------------------------- |
| `/api/send`     | POST   | Send a message to LINE OA        |
| `/api/webhook`  | POST   | Receive webhook events from LINE |
| `/api/messages` | GET    | Get messages received from LINE  |

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/) - LINE integration

## License

MIT
