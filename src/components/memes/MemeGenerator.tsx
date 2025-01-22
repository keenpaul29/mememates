import React, { useState } from 'react';
import { useAIContent } from '@/hooks/useAIContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const memeStyles = [
  { value: 'funny', label: 'Funny' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'wholesome', label: 'Wholesome' },
  { value: 'dank', label: 'Dank' },
  { value: 'relatable', label: 'Relatable' },
];

interface MemeGeneratorProps {
  onGenerate?: (meme: any) => void;
  context?: any;
  className?: string;
}

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({
  onGenerate,
  context = {},
  className = '',
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('funny');
  const [generatedMeme, setGeneratedMeme] = useState<any>(null);
  const { loading, generateMeme } = useAIContent({
    onSuccess: (data) => {
      setGeneratedMeme(data);
      onGenerate?.(data);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    try {
      await generateMeme(prompt, style, context);
    } catch (error) {
      console.error('Error generating meme:', error);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="prompt"
            className="text-sm font-medium text-gray-700"
          >
            Describe your meme
          </label>
          <Textarea
            id="prompt"
            placeholder="What kind of meme do you want to create?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="style"
            className="text-sm font-medium text-gray-700"
          >
            Meme Style
          </label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {memeStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading || !prompt}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Meme'
          )}
        </Button>
      </form>

      {generatedMeme && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={generatedMeme.imageUrl}
                alt="Generated meme"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(generatedMeme.imageUrl)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Open Full Size
              </Button>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(generatedMeme.imageUrl)
                }
              >
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
