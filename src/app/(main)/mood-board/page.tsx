import MemeSearch from '@/components/MemeSearch';

export default function MoodBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Mood Board
        </h1>
        <MemeSearch />
      </div>
    </div>
  );
}
