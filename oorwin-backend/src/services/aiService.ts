import OpenAI from 'openai';
const pdfParse = require('pdf-parse'); 

const openai = new OpenAI(); 

export const aiService = {
  parseResumeWithAI: async (pdfBuffer: Buffer) => {
    try {
      // 1. We moved this INSIDE the safety net! 
      console.log("📄 Attempting to read PDF file...");
      const pdfData = await pdfParse(pdfBuffer);
      const resumeText = pdfData.text;

      if (!resumeText || resumeText.trim() === "") {
        throw new Error("PDF was completely blank or unreadable by the parser.");
      }

      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("dummy")) {
        throw new Error("No real OpenAI key found, switching to fallback.");
      }

      console.log("🧠 Sending resume text to OpenAI...");

      // 2. Ask ChatGPT to read it and return a perfect JSON object
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
          { 
            role: "system", 
            content: `You are an expert HR Artificial Intelligence. Read the provided resume text and extract the candidate's details. 
            You MUST respond with a valid JSON object containing exactly these keys:
            - "name": string (The candidate's full name)
            - "email": string (The candidate's email address)
            - "phone": string (The candidate's phone number, or "Not Provided")
            - "currentJobTitle": string (Their most recent or most prominent job title)
            - "experienceYears": number (Calculate their total years of professional working experience as an integer number)`
          },
          { role: "user", content: resumeText }
        ],
        response_format: { type: "json_object" }
      });

      console.log("✅ OpenAI successfully extracted the data!");
      return JSON.parse(response.choices[0]?.message?.content || "{}");

    } catch (error: any) {
      console.error("⚠️ AI Parsing or PDF Reading Failed:", error.message);
      
      // SMART FALLBACK (If the PDF reader fails, or OpenAI fails, we still return safe data instead of crashing!)
      return {
        name: "Fallback Candidate",
        email: `fallback_${Date.now()}@example.com`,
        phone: "Not Provided",
        currentJobTitle: "Unable to parse PDF text",
        experienceYears: 0 
      };
    }
  },

  generateJobDescription: async (title: string, keywords: string[]) => {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("dummy")) {
        return `We are looking for a ${title}. Key requirements: ${keywords.join(", ")}.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert technical recruiter." },
          { role: "user", content: `Write a professional short job description for a ${title}. Keywords to include: ${keywords.join(", ")}.` }
        ]
      });

      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.error("⚠️ AI Job Description Generation Failed:", error.message);
      return `We are looking for a ${title}. Key requirements: ${keywords.join(", ")}.`;
    }
  }
};