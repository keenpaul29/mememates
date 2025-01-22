export async function debugFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Log response details
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text before parsing
    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    try {
      // Attempt to parse as JSON
      const jsonData = JSON.parse(responseText);
      return jsonData;
    } catch (jsonError) {
      console.error('JSON Parsing Error:', jsonError);
      throw new Error(`Invalid JSON: ${responseText}`);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
