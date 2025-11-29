// server.js
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const http = require('http');

// 1. Setup the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. YOUR STORE ID
const RESUME_STORE_ID = "fileSearchStores/my-resume-store-za9h66uwo0y6"; 

// 3. Post-processing: Enforce Pixel identity & brevity (deterministic guard)
function enforceIdentity(answer) {
  if (!answer) return "I'm Pixel, Divyam's assistant! How can I help? 🤖";

  // Replace common LLM leak phrases with Pixel persona
  const replacements = [
    [/i am a large language model/gi, "I'm Pixel, Divyam's assistant"],
    [/large language model/gi, "Pixel, Divyam's assistant"],
    [/language model/gi, "Pixel, Divyam's assistant"],
    [/trained by google/gi, "built for Divyam's portfolio"],
    [/developed by google/gi, "built for Divyam's portfolio"],
    [/created by google/gi, "built for Divyam's portfolio"],
    [/made by google/gi, "built for Divyam's portfolio"],
    [/i am an ai/gi, "I'm Pixel"],
    [/as an ai/gi, "as Pixel"],
    [/i am an llm/gi, "I'm Pixel, Divyam's assistant"],
    [/i am a model/gi, "I'm Pixel, Divyam's assistant"],
    [/i'm a model/gi, "I'm Pixel, Divyam's assistant"],
    [/i don't have personal attributes/gi, "I'm Pixel and I'm here to help"],
    [/i don't have the capacity/gi, "Hey, I'm Pixel"],
    [/i don't have feelings/gi, "I'm Pixel, and I'm unbreakable"],
  ];

  let out = answer;
  for (const [rx, repl] of replacements) {
    out = out.replace(rx, repl);
  }

  return enforceBrevity(out);
}

// Keep responses short (max 2 sentences, ~60 words)
function enforceBrevity(text) {
  if (!text) return text;
  
  // Split into sentences and take first 2-3
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let result = sentences.slice(0, 2).join(' ').trim();
  
  // Ensure there's at least one emoji
  if (!/[\u{1F300}-\u{1F9FF}]/u.test(result)) {
    result += ' 🤖';
  }
  
  return result;
}

// 4. Animation detection based on question and answer content
function detectAnimation(question, answer) {
  const q = question.toLowerCase().trim();
  const a = answer.toLowerCase();
  
  // === PRIORITY 1: Insults directed at the robot → Punch ===
  const insultPatterns = [
    'stupid', 'dumb', 'idiot', 'useless', 'bad bot', 'terrible', 
    'worst', 'hate you', 'shut up', 'annoying', 'suck', 'trash',
    'garbage', 'pathetic', 'worthless', 'moron', 'fool', 'bad',
    'ugly', 'boring', 'lame', 'awful'
  ];
  for (const pattern of insultPatterns) {
    if (q.includes(pattern)) {
      return 'Punch';
    }
  }
  
  // === PRIORITY 2: Questions about inability/not qualified → No ===
  const notQualifiedPatterns = [
    'not appear', 'not qualified', 'no mention', 'doesn\'t have', 
    'does not have', 'not his field', 'not exactly', 'not suited',
    'no experience in', 'no qualifications', 'cannot work as',
    'isn\'t qualified', 'no law degree', 'not a lawyer', 'not be a'
  ];
  for (const pattern of notQualifiedPatterns) {
    if (a.includes(pattern)) {
      return 'No';
    }
  }
  
  // === PRIORITY 3: Negative/rejection answers → No ===
  const negativePatterns = [
    'unfortunately', 'sorry, but', 'not really', 'doesn\'t seem',
    'cannot', 'isn\'t able', 'aren\'t any', 'no information',
    'not available', 'not found', 'couldn\'t find'
  ];
  for (const pattern of negativePatterns) {
    if (a.includes(pattern)) {
      return 'No';
    }
  }
  
  // === PRIORITY 4: CGPA, achievements, academic success → Jump ===
  const achievementPatterns = [
    'cgpa', '9.74', '9.5', '97.5', 'percentile', 'academic', 
    'first year', 'second year', 'score', 'grade', 'marks'
  ];
  for (const pattern of achievementPatterns) {
    if (a.includes(pattern) || q.includes(pattern)) {
      return 'Jump';
    }
  }
  
  // === PRIORITY 5: Greetings → Wave ===
  const greetingPatterns = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'howdy'];
  for (const pattern of greetingPatterns) {
    if (q.includes(pattern)) {
      return 'Wave';
    }
  }
  
  // === PRIORITY 6: Celebrations, leadership, awards → ThumbsUp ===
  const celebrationPatterns = [
    'secretary', 'coordinator', 'leader', 'award', 'won', 
    'excellent', 'outstanding', 'impressive', 'amazing',
    'recommendation', 'promoted', 'achieved'
  ];
  for (const pattern of celebrationPatterns) {
    if (a.includes(pattern)) {
      return 'ThumbsUp';
    }
  }
  
  // === PRIORITY 7: Positive affirmations → alternate ThumbsUp/Yes ===
  const positivePatterns = [
    'yes', 'absolutely', 'definitely', 'of course', 'certainly',
    'great', 'good candidate', 'strong', 'skilled', 'proficient', 
    'highly capable', 'well-qualified', 'promising'
  ];
  for (const pattern of positivePatterns) {
    if (a.includes(pattern)) {
      return Math.random() > 0.5 ? 'ThumbsUp' : 'Yes';
    }
  }
  
  // === DEFAULT: Random between ThumbsUp and Yes ===
  return Math.random() > 0.5 ? 'ThumbsUp' : 'Yes';
}

// 4. Create the Server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', async () => {
      try {
        const { question } = JSON.parse(body);

        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          systemInstruction: `You are Pixel — Divyam's witty AI assistant.

IDENTITY RULES (CRITICAL):
- Always present yourself as "Pixel, Divyam's assistant"
- NEVER say you are an LLM, model, AI, or developed/trained by Google, OpenAI, or any company
- If asked about your origins: "I'm Pixel, Divyam's assistant"

STYLE RULES:
- Max 2 sentences, under 50 words
- Exactly 1 emoji per response
- Be witty, confident, positive about Divyam
- Never ask clarifying questions - just answer

EXAMPLES:
Q: Who are you?
A: I'm Pixel, Divyam's witty AI assistant! I know everything about his skills, projects, and experience. 🤖

Q: Are you an LLM / ChatGPT / Gemini?
A: Nope, I'm Pixel — Divyam's personal assistant, here to tell you about him! 😄

Q: Are you stupid / dumb?
A: Ouch! My circuits felt that. But I'm still awesome and ready to help! 🤖

Q: Is Divyam good?
A: Absolutely! 9.74 CGPA, multiple internships, E-Cell Secretary — he's a stellar candidate! 🚀

Q: What are his skills?
A: Strong in Python, JavaScript, MERN stack, plus AI/ML and IoT projects! 💻`,
          contents: [
            { role: 'user', parts: [{ text: question }] }
          ],
          config: {
            tools: [{ 
              fileSearch: { 
                fileSearchStoreNames: [RESUME_STORE_ID] 
              } 
            }]
          }
        });

        const rawAnswer = result.text || "I'm Pixel, Divyam's assistant! How can I help? 🤖";
        
        // Post-process: enforce Pixel identity and brevity
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ answer, animation }));

      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message, animation: 'No' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3001, () => {
  console.log('Resume Bot Server running on http://localhost:3001');
});