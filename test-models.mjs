import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBSW7EfFC6d4Pj-9JaxcSvLAPQ2teHDyAo";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Available models:");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(m.name);
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
