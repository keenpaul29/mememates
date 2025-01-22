'use client';

import React, { useState, useEffect } from 'react';
import { ImgflipMemeGenerator, MemeTemplate } from '@/lib/imgflip-meme-generator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export function ImgflipMemeGeneratorComponent() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const memeGenerator = new ImgflipMemeGenerator();
        const fetchedTemplates = await memeGenerator.getMemeTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Failed to fetch meme templates', error);
      }
    }
    fetchTemplates();
  }, []);

  const handleSearch = async () => {
    try {
      const memeGenerator = new ImgflipMemeGenerator();
      const searchResults = await memeGenerator.searchMemeTemplates(searchQuery);
      setTemplates(searchResults);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const generateMeme = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      const memeGenerator = new ImgflipMemeGenerator();
      const memeUrl = await memeGenerator.generateMeme({
        templateId: selectedTemplate.id,
        topText,
        bottomText
      });
      setGeneratedMemeUrl(memeUrl);
    } catch (error) {
      console.error('Meme generation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIMeme = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      const memeGenerator = new ImgflipMemeGenerator();
      const memeUrl = await memeGenerator.generateAIMeme({
        templateId: selectedTemplate.id,
        prompt: aiPrompt
      });
      setGeneratedMemeUrl(memeUrl);
    } catch (error) {
      console.error('AI Meme generation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Imgflip Meme Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Templates */}
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Search meme templates" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`cursor-pointer p-2 border rounded ${
                  selectedTemplate?.id === template.id 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:bg-secondary/20'
                }`}
              >
                <Image 
                  src={template.url} 
                  alt={template.name} 
                  width={200} 
                  height={200} 
                  className="object-contain"
                />
                <p className="text-center text-sm mt-2">{template.name}</p>
              </div>
            ))}
          </div>

          {/* Meme Generation Form */}
          {selectedTemplate && (
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="ai">AI Generated</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <Input 
                  placeholder="Top Text" 
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                />
                <Input 
                  placeholder="Bottom Text" 
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                />
                <Button 
                  onClick={generateMeme} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Generating...' : 'Generate Meme'}
                </Button>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Input 
                  placeholder="Describe your meme idea..." 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button 
                  onClick={generateAIMeme} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Generating with AI...' : 'Generate with AI'}
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {/* Generated Meme */}
          {generatedMemeUrl && (
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Generated Meme</h3>
              <Image 
                src={generatedMemeUrl} 
                alt="Generated Meme" 
                width={400} 
                height={400} 
                className="mx-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
