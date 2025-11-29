// upload-resume.js
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function setupKnowledgeBase() {
  // 1. Create a "Store" (This works like a folder on Google's server)
  const store = await ai.fileSearchStores.create({
    config: { displayName: "My Resume Store" }
  });
  console.log(`Store created. ID: ${store.name}`); // SAVE THIS ID!

  // 2. Upload your resume
  const filePath = 'resume.pdf'; 
  const uploadResult = await ai.fileSearchStores.uploadToFileSearchStore({
    fileSearchStoreName: store.name,
    file: filePath, 
    config: { mimeType: 'application/pdf' } // or 'text/plain', 'application/msword'
  });

  // 3. Wait for Google to process/index the file
  console.log("Uploading and indexing...");
  let operation = await ai.operations.get({ name: uploadResult.name });
  while (operation.metadata?.state === 'PROCESSING') {
    await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds
    operation = await ai.operations.get({ name: uploadResult.name });
  }

  console.log("Done! Your Resume Store ID is:");
  console.log(store.name); 
  console.log("Copy this ID into your backend code.");
}

setupKnowledgeBase();