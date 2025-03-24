import { put } from '@vercel/blob';
import { v4 as uuid } from 'uuid';

export async function uploadImage(file: File) {
  try {
    if (!file) return null;
    
    // Generate a unique filename
    const filename = `${uuid()}-${file.name}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}