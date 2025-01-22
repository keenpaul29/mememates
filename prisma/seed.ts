import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MOODS = ['Happy', 'Sad', 'Angry', 'Excited', 'Calm', 'Nostalgic', 'Romantic', 'Funny'];
const STYLES = ['Meme', 'GIF', 'Comic', 'Reaction', 'Wholesome', 'Dark Humor'];

async function createUser(email: string, name: string) {
  const hashedPassword = await bcrypt.hash('password123', 10);
  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      image: `https://i.pravatar.cc/150?u=${email}`,
    }
  });
}

async function createMeme(creator: { id: string }, index: number) {
  const mood = MOODS[index % MOODS.length];
  const style = STYLES[index % STYLES.length];

  return prisma.meme.create({
    data: {
      creatorId: creator.id,
      prompt: `Create a ${mood} ${style} meme`,
      style,
      imageUrl: `https://picsum.photos/seed/meme${index}/800/600`,
      generatedBy: 'DALL-E',
      metadata: {
        mood,
        tags: ['Trending', 'Viral']
      }
    }
  });
}

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.memeReaction.deleteMany();
  await prisma.meme.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    createUser('user1@example.com', 'John Doe'),
    createUser('user2@example.com', 'Jane Smith'),
    createUser('user3@example.com', 'Alice Johnson'),
    createUser('user4@example.com', 'Bob Williams'),
    createUser('user5@example.com', 'Emma Brown')
  ]);

  // Create memes for each user
  const memePromises = users.flatMap((user, userIndex) => 
    Array.from({ length: 10 }, (_, memeIndex) => 
      createMeme(user, userIndex * 10 + memeIndex)
    )
  );

  await Promise.all(memePromises);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
export {};
