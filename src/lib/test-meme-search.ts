import { PrismaClient } from '@prisma/client';

async function testMemeSearch() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting Meme Search Test...');

    // Test 1: Basic Search
    console.log('\nTest 1: Basic Search');
    const basicSearch = await prisma.meme.findMany({
      where: {
        OR: [
          { prompt: { contains: 'happy', mode: 'insensitive' } },
          { style: { contains: 'meme', mode: 'insensitive' } }
        ]
      },
      select: { imageUrl: true },
      take: 5
    });
    console.log('Basic Search Results:', basicSearch.length);
    basicSearch.forEach((meme, index) => {
      console.log(`Meme ${index + 1} URL:`, meme.imageUrl);
    });

    // Test 2: Pagination
    console.log('\nTest 2: Pagination');
    const paginatedSearch = await prisma.meme.findMany({
      skip: 0,
      take: 10,
      select: { 
        id: true, 
        imageUrl: true, 
        prompt: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('Paginated Results:', paginatedSearch.length);
    paginatedSearch.forEach((meme, index) => {
      console.log(`Meme ${index + 1}:`, {
        id: meme.id,
        prompt: meme.prompt,
        imageUrl: meme.imageUrl
      });
    });

    // Test 3: Style-based Search
    console.log('\nTest 3: Style-based Search');
    const styleSearch = await prisma.meme.findMany({
      where: { 
        style: { contains: 'gif', mode: 'insensitive' } 
      },
      select: { imageUrl: true, style: true },
      take: 5
    });
    console.log('Style Search Results:', styleSearch.length);
    styleSearch.forEach((meme, index) => {
      console.log(`Meme ${index + 1} Style:`, meme.style);
      console.log(`Meme ${index + 1} URL:`, meme.imageUrl);
    });

    // Test 4: Total Meme Count
    console.log('\nTest 4: Total Meme Count');
    const totalMemes = await prisma.meme.count();
    console.log('Total Memes in Database:', totalMemes);

  } catch (error) {
    console.error('Meme Search Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testMemeSearch()
  .then(() => console.log('\nMeme Search Test Completed Successfully'))
  .catch(console.error);

export {};
