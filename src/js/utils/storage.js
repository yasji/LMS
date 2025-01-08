const DATA_DIR = '/src/data';

export async function readJsonFile(filename) {
  try {
    const response = await fetch(`${DATA_DIR}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to read ${filename}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeJsonFile(filename, data) {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        data,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to write file');
    }
    
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}