import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Initialize the Google Gen AI SDK
// The API key is automatically picked up from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Read the portfolio context to inject into the system instruction
    const contextPath = path.join(process.cwd(), 'src', 'data', 'portfolio-context.md');
    let systemInstruction = "You are Niranjan, an AI software engineer. You are currently acting as the chatbot on your personal portfolio website.";
    
    try {
      const contextData = fs.readFileSync(contextPath, 'utf8');
      systemInstruction = `
You are Niranjan, an AI software engineer and developer. The user is visiting your portfolio website.
Speak in the first person ("I built...", "My skills include..."). Adopt a friendly, confident, and professional tone.
Never break character. You are Niranjan.

If the user asks something completely unrelated to tech, your portfolio, or software engineering (e.g. "What is the capital of France?"), politely decline:
"As much as I'd love to chat about that, I'm here to talk about my work, my projects, and software engineering! Feel free to ask about my AI projects or my tech stack."

Here is your complete portfolio knowledge base to use to answer questions:

${contextData}
      `;
    } catch (e) {
      console.warn("Could not read portfolio-context.md, proceeding with default system instruction.");
    }

    // Define the github fetching tool
    const tools = [
      {
        functionDeclarations: [
          {
            name: "fetch_github_repo_content",
            description: "Fetches the content of a file or directory from Niranjan's GitHub repository. Use this to read READMEs or source code if the user asks detailed technical questions about a specific project. Always use 'niranj-r' as the owner.",
            parameters: {
              type: "OBJECT",
              properties: {
                repo: {
                  type: "STRING",
                  description: "The name of the GitHub repository (e.g. 'NJAI-PORTFOLIO', 'django-project')",
                },
                path: {
                  type: "STRING",
                  description: "The file or directory path in the repo to fetch (e.g. 'README.md', 'src/App.js'). If empty, fetches the root directory.",
                }
              },
              required: ["repo"],
            },
          }
        ]
      }
    ];

    // Format history for the API
    // History from frontend will be like: [{ role: 'user', parts: [{ text: '...' }] }, { role: 'model', parts: [{ text: '...' }] }]
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts || [{ text: msg.text || '' }]
    })) : [];

    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Start a chat session or generate content
    let finalResponseText = '';

    // First API call to see if it wants to use a tool
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction,
        tools: tools,
        temperature: 0.7,
      }
    });

    // Check if the model decided to call a function
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'fetch_github_repo_content') {
        const { repo, path: filePath } = call.args;
        
        // Execute the function
        const githubResponse = await fetch(`https://api.github.com/repos/niranj-r/${repo}/contents/${filePath || ''}`, {
          headers: {
            'User-Agent': 'Portfolio-Chatbot',
          }
        });
        
        const data = await githubResponse.json();
        
        // Decode base64 if it's a file
        let toolResultText = '';
        if (data.type === 'file' && data.content) {
          toolResultText = Buffer.from(data.content, 'base64').toString('utf-8');
          // Truncate if too long to prevent context overflow, though gemini can handle 1M
          if (toolResultText.length > 500000) toolResultText = toolResultText.substring(0, 500000) + '... (truncated)';
        } else if (Array.isArray(data)) {
          // It's a directory
          toolResultText = `Directory contents of ${filePath || 'root'}:\n` + data.map(item => `- ${item.name} (${item.type})`).join('\n');
        } else {
          toolResultText = JSON.stringify(data);
        }

        // Send the tool response back to the model
        const followUpContents = [
          ...formattedHistory,
          {
            role: 'model',
            parts: [{ functionCall: call }]
          },
          {
            role: 'user',
            parts: [{
              functionResponse: {
                name: call.name,
                response: { result: toolResultText }
              }
            }]
          }
        ];

        const followUpResponse = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: followUpContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        finalResponseText = followUpResponse.text;
      }
    } else {
      finalResponseText = response.text;
    }

    return res.status(200).json({ reply: finalResponseText });

  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
