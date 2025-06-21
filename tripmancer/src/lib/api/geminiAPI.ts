import { GEMINI_API_KEY, API_URL } from './geminiConfig';

async function makeGeminiRequest(prompt: string) {
  const maxRetries = 3;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();

      if (data.error) {
        // If it's a 503, retry
        if (data.error.code === 503) {
          console.warn(`Gemini model overloaded (attempt ${attempt + 1}/${maxRetries}). Retrying...`);
          if (attempt < maxRetries - 1) {
            await delay(1000 * (attempt + 1)); // exponential backoff
            continue;
          }
        }

        console.error('Gemini API error:', data.error);
        throw new Error(data.error.message || 'Failed to generate content');
      }

      const content = data.candidates[0].content.parts[0].text;
      console.log("Gemini API raw response:", content);

      const cleanedContent = content.replace(/```json|```/g, '').trim();

      try {
        return JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Received content:', content);
        throw new Error('Failed to parse response data');
      }
    } catch (error: any) {
      if (attempt === maxRetries - 1 || error.message.includes('503')) {
        console.error('Error making Gemini request:', error);
        throw error;
      }
      await delay(1000 * (attempt + 1)); // retry on network or transient errors
    }
  }
}

export default makeGeminiRequest;
