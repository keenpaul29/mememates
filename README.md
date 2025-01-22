# MemeMates

MemeMates is an innovative dating app that combines memes, music, and mood boards to foster meaningful connections. Find your perfect match through shared interests, humor, and aesthetic vibes!

## Features

- **Meme Sharing**: Express yourself through the universal language of memes
- **Music Integration**: Connect through shared music taste and create your unique anthem
- **Mood Boards**: Show your aesthetic and personality through curated visuals
- **Smart Matching**: AI-powered matching based on shared interests and interaction patterns
- **Interactive Chat**: Communicate through memes and music snippets
- **Premium Features**: Enhanced visibility, custom anthems, and exclusive meme templates

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Headless UI, Framer Motion
- **Authentication**: NextAuth.js
- **API Integration**: TanStack Query (React Query)
- **Database**: PostgreSQL
- **Backend**: Node.js with Express

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mememates.git
cd mememates
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=your-database-url
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication routes
│   ├── dashboard/      # User dashboard
│   └── api/            # API routes
├── components/         # Reusable components
├── lib/                # Utility functions and configurations
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
