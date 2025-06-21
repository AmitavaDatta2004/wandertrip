
import { createClient } from 'pexels';

const client = createClient('GYxgmkB7WVnqvUtgDDw4th9dALxWaPYBb4qhSGLbKRay09kSeosuq65a');

export async function getImageForQuery(query: string, index: number = 0): Promise<string> {
  const defaultImages = [
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828"
  ];
  
  try {
    // Create more specific and varied search queries based on destination
    const destinationSpecificQueries = [
      `${query} famous landmark tourist attraction`,
      `${query} city skyline downtown architecture`,
      `${query} travel destination beautiful scenery`,
      `${query} tourism vacation spot landscape`,
      `${query} cultural heritage historic site`,
      `${query} nature scenic view mountains`,
      `${query} beach ocean coastline`,
      `${query} street photography local culture`,
      `${query} sunset sunrise golden hour`,
      `${query} aerial drone view panoramic`
    ];
    
    // Use different query based on index to ensure variety
    const searchQuery = destinationSpecificQueries[index % destinationSpecificQueries.length];
    
    console.log(`Searching Pexels for: "${searchQuery}" (index: ${index})`);
    
    const result = await client.photos.search({ 
      query: searchQuery, 
      per_page: 15, // Get more results to choose from
      orientation: 'landscape',
      page: Math.floor(index / 10) + 1, // Vary the page based on index
      size: 'large'
    });
    
    if (result && 'photos' in result && result.photos.length > 0) {
      // Select different image based on index to ensure variety
      const imageIndex = (index * 3 + Math.floor(Math.random() * 3)) % result.photos.length;
      const selectedPhoto = result.photos[imageIndex];
      console.log(`Selected image: ${selectedPhoto.alt} from photographer ${selectedPhoto.photographer}`);
      return selectedPhoto.src.large2x;
    }
    
    console.log('No photos found, using default image');
    return defaultImages[index % defaultImages.length];
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return defaultImages[index % defaultImages.length];
  }
}

export async function getDestinationImages(destinationName: string, count: number = 5): Promise<string[]> {
  const images: string[] = [];
  
  try {
    // Clean destination name for better search results
    const cleanDestination = destinationName.replace(/[,&]/g, '').trim();
    
    // Create diverse search queries for better image variety
    const searchQueries = [
      `${cleanDestination} landmark famous building`,
      `${cleanDestination} skyline cityscape view`,
      `${cleanDestination} street local culture people`,
      `${cleanDestination} food cuisine restaurant market`,
      `${cleanDestination} nature landscape scenic`,
      `${cleanDestination} sunset sunrise golden hour`,
      `${cleanDestination} architecture historic building`,
      `${cleanDestination} tourism travel destination`,
      `${cleanDestination} aerial drone panoramic view`,
      `${cleanDestination} beach ocean coastline water`
    ];
    
    // Fetch images with different queries for variety
    for (let i = 0; i < count; i++) {
      const queryIndex = i % searchQueries.length;
      const baseQuery = searchQueries[queryIndex];
      
      // Add slight variations to prevent duplicate results
      const variations = ['', ' beautiful', ' stunning', ' amazing', ' incredible'];
      const variation = variations[Math.floor(i / searchQueries.length) % variations.length];
      const finalQuery = baseQuery + variation;
      
      console.log(`Fetching image ${i + 1}/${count} for ${destinationName}: "${finalQuery}"`);
      
      try {
        const result = await client.photos.search({ 
          query: finalQuery, 
          per_page: 10,
          orientation: 'landscape',
          page: Math.floor(i / 5) + 1,
          size: 'large'
        });
        
        if (result && 'photos' in result && result.photos.length > 0) {
          // Use different image from results to ensure variety
          const imageIndex = (i * 2) % result.photos.length;
          const selectedPhoto = result.photos[imageIndex];
          images.push(selectedPhoto.src.large2x);
          console.log(`✓ Found relevant image: ${selectedPhoto.alt}`);
        } else {
          // Fallback to a default image with index variation
          const fallbackImages = [
            "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e",
            "https://images.unsplash.com/photo-1564760055775-d63b17a55c44"
          ];
          images.push(fallbackImages[i % fallbackImages.length]);
          console.log(`⚠ No results found, using fallback image ${i + 1}`);
        }
      } catch (imageError) {
        console.error(`Error fetching image ${i + 1}:`, imageError);
        const fallbackImages = [
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
          "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e",
          "https://images.unsplash.com/photo-1564760055775-d63b17a55c44"
        ];
        images.push(fallbackImages[i % fallbackImages.length]);
      }
      
      // Add small delay between requests to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return images;
  } catch (error) {
    console.error('Error fetching destination images:', error);
    // Return fallback images
    return Array(count).fill(0).map((_, index) => {
      const fallbackImages = [
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e",
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44"
      ];
      return fallbackImages[index % fallbackImages.length];
    });
  }
}
