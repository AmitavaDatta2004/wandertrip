const defaultImages = [
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
  "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e",
  "https://images.unsplash.com/photo-1564760055775-d63b17a55c44"
];

export async function getImageForQuery(query: string, index: number = 0): Promise<string> {
  console.log(`Getting fallback image for: "${query}" (index: ${index})`);
  return defaultImages[index % defaultImages.length];
}

export async function getDestinationImages(destinationName: string, count: number = 5): Promise<string[]> {
  console.log(`Getting ${count} fallback images for ${destinationName}`);
  
  const images: string[] = [];
  
  for (let i = 0; i < count; i++) {
    images.push(defaultImages[i % defaultImages.length]);
  }
  
  return images;
}