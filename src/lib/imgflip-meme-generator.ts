import axios from 'axios';

// Define interfaces for type safety
export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

export interface MemeGenerationParams {
  templateId: string;
  topText: string;
  bottomText: string;
  username?: string;
  password?: string;
}

export interface AIMemeGenerationParams {
  templateId: string;
  prompt: string;
  username?: string;
  password?: string;
}

export class ImgflipMemeGenerator {
  private static BASE_URL = 'https://api.imgflip.com';
  private username: string;
  private password: string;

  constructor(username?: string, password?: string) {
    // Use environment variables for credentials
    this.username = username || process.env.IMGFLIP_USERNAME || '';
    this.password = password || process.env.IMGFLIP_PASSWORD || '';
  }

  // Fetch available meme templates
  async getMemeTemplates(): Promise<MemeTemplate[]> {
    try {
      const response = await axios.get(`${ImgflipMemeGenerator.BASE_URL}/get_memes`);
      
      if (response.data.success) {
        return response.data.data.memes;
      } else {
        throw new Error('Failed to fetch meme templates');
      }
    } catch (error) {
      console.error('Error fetching meme templates:', error);
      throw error;
    }
  }

  // Generate a meme
  async generateMeme(params: MemeGenerationParams): Promise<string> {
    try {
      // Validate required parameters
      if (!params.templateId || !params.topText || !params.bottomText) {
        throw new Error('Template ID, top text, and bottom text are required');
      }

      // Prepare form data for Imgflip API
      const formData = new FormData();
      formData.append('template_id', params.templateId);
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('text0', params.topText);
      formData.append('text1', params.bottomText);

      // Make API request
      const response = await axios.post(
        `${ImgflipMemeGenerator.BASE_URL}/caption_image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Check API response
      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.error_message || 'Meme generation failed');
      }
    } catch (error) {
      console.error('Error generating meme:', error);
      throw error;
    }
  }

  // Generate a meme using AI
  async generateAIMeme(params: AIMemeGenerationParams): Promise<string> {
    try {
      // Validate required parameters
      if (!params.templateId || !params.prompt) {
        throw new Error('Template ID and prompt are required');
      }

      // Prepare form data for Imgflip API
      const formData = new FormData();
      formData.append('template_id', params.templateId);
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('prompt', params.prompt);
      formData.append('ai', '1'); // Enable AI generation

      // Make API request
      const response = await axios.post(
        `${ImgflipMemeGenerator.BASE_URL}/caption_image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Check API response
      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.error_message || 'AI Meme generation failed');
      }
    } catch (error) {
      console.error('Error generating AI meme:', error);
      throw error;
    }
  }

  // Search meme templates by name
  async searchMemeTemplates(query: string): Promise<MemeTemplate[]> {
    const templates = await this.getMemeTemplates();
    return templates.filter(template => 
      template.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Example usage
async function exampleMemeGeneration() {
  try {
    const memeGenerator = new ImgflipMemeGenerator();
    
    // Get all templates
    const templates = await memeGenerator.getMemeTemplates();
    console.log('Total Templates:', templates.length);

    // Search for specific templates
    const drakeTemplates = await memeGenerator.searchMemeTemplates('drake');
    console.log('Drake Templates:', drakeTemplates);

    // Generate a meme (Drake meme example)
    if (drakeTemplates.length > 0) {
      const memeUrl = await memeGenerator.generateMeme({
        templateId: drakeTemplates[0].id,
        topText: 'Boring Meme Generation',
        bottomText: 'Imgflip API Meme Generation'
      });
      console.log('Generated Meme URL:', memeUrl);
    }
  } catch (error) {
    console.error('Meme Generation Error:', error);
  }
}

// Uncomment to test
// exampleMemeGeneration();
