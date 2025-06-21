
import { createClient } from 'pexels';

const client = createClient('GYxgmkB7WVnqvUtgDDw4th9dALxWaPYBb4qhSGLbKRay09kSeosuq65a');

export async function getImageForQuery(query: string): Promise<string> {
  const defaultImage = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21";
  
  try {
    const result = await client.photos.search({ 
      query, 
      per_page: 1,
      orientation: 'landscape'
    });
    
    if (result && 'photos' in result && result.photos.length > 0) {
      return result.photos[0].src.large2x;
    }
    
    return defaultImage;
  } catch (error) {
    console.error('Error fetching image:', error);
    return defaultImage;
  }
}
