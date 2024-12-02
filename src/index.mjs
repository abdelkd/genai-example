import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";

import { readFileSync } from 'node:fs';

async function filesCreateImage() {
  // [START files_create_image]
  // Make sure to include these imports:
  // import { GoogleAIFileManager } from "@google/generative-ai/server";
  // import { GoogleGenerativeAI } from "@google/generative-ai";
  const fileManager = new GoogleAIFileManager(process.env.API_KEY);

  const imageFileBuffer = readFileSync('./jetpack.jpg');
  const uploadResult = await fileManager.uploadFile(
    imageFileBuffer,
    {
      mimeType: "image/jpeg",
      displayName: "Jetpack drawing",
    },
  );
  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Tell me about this image.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
  console.log(result.response.text());
  // [END files_create_image]
}

filesCreateImage()
