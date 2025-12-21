// Cloudflare Worker for Pixel Chatbot
// Uses Gemini API with file search for resume context

// Post-processing: Enforce Pixel identity & brevity
function enforceIdentity(answer) {
  if (!answer) return "I'm Pixel, Divyam's assistant! How can I help?";

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

// Keep responses short but complete (max 3 sentences)
function enforceBrevity(text) {
  if (!text) return text;
  
  // Don't break on abbreviations like "Fr." "Dr." "Mr." "B." "C." "R." etc.
  // Replace common abbreviations temporarily
  let temp = text
    .replace(/Fr\.\s*C\.\s*R\./g, 'FR_CR_INST')
    .replace(/B\.\s*Tech/g, 'BTECH')
    .replace(/Mr\./g, 'MR_')
    .replace(/Mrs\./g, 'MRS_')
    .replace(/Dr\./g, 'DR_')
    .replace(/St\./g, 'ST_')
    .replace(/Jr\./g, 'JR_')
    .replace(/Sr\./g, 'SR_')
    .replace(/vs\./g, 'VS_')
    .replace(/etc\./g, 'ETC_')
    .replace(/e\.g\./g, 'EG_')
    .replace(/i\.e\./g, 'IE_');
  
  // Now split by actual sentence endings
  const sentences = temp.match(/[^.!?]+[.!?]+/g) || [temp];
  let result = sentences.slice(0, 3).join(' ').trim();
  
  // Restore abbreviations
  result = result
    .replace(/FR_CR_INST/g, 'Fr. C. R.')
    .replace(/BTECH/g, 'B.Tech')
    .replace(/MR_/g, 'Mr.')
    .replace(/MRS_/g, 'Mrs.')
    .replace(/DR_/g, 'Dr.')
    .replace(/ST_/g, 'St.')
    .replace(/JR_/g, 'Jr.')
    .replace(/SR_/g, 'Sr.')
    .replace(/VS_/g, 'vs.')
    .replace(/ETC_/g, 'etc.')
    .replace(/EG_/g, 'e.g.')
    .replace(/IE_/g, 'i.e.');
  
  return result;
}

// Animation detection based on question and answer content
function detectAnimation(question, answer) {
  const q = question.toLowerCase().trim();
  const a = answer.toLowerCase();
  
  // Insults → Punch
  const insultPatterns = [
    'stupid', 'dumb', 'idiot', 'useless', 'bad bot', 'terrible', 
    'worst', 'hate you', 'shut up', 'annoying', 'suck', 'trash',
    'garbage', 'pathetic', 'worthless', 'moron', 'fool', 'bad',
    'ugly', 'boring', 'lame', 'awful'
  ];
  for (const pattern of insultPatterns) {
    if (q.includes(pattern)) return 'Punch';
  }
  
  // Not qualified → No
  const notQualifiedPatterns = [
    'not appear', 'not qualified', 'no mention', "doesn't have", 
    'does not have', 'not his field', 'not exactly', 'not suited',
    'no experience in', 'no qualifications', 'cannot work as',
    "isn't qualified", 'no law degree', 'not a lawyer', 'not be a'
  ];
  for (const pattern of notQualifiedPatterns) {
    if (a.includes(pattern)) return 'No';
  }
  
  // Negative answers → No
  const negativePatterns = [
    'unfortunately', 'sorry, but', 'not really', "doesn't seem",
    'cannot', "isn't able", "aren't any", 'no information',
    'not available', 'not found', "couldn't find"
  ];
  for (const pattern of negativePatterns) {
    if (a.includes(pattern)) return 'No';
  }
  
  // CGPA, achievements → Jump
  const achievementPatterns = [
    'cgpa', '9.74', '9.5', '97.5', 'percentile', 'academic', 
    'first year', 'second year', 'score', 'grade', 'marks'
  ];
  for (const pattern of achievementPatterns) {
    if (a.includes(pattern) || q.includes(pattern)) return 'Jump';
  }
  
  // Greetings → Wave
  const greetingPatterns = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'howdy'];
  for (const pattern of greetingPatterns) {
    if (q.includes(pattern)) return 'Wave';
  }
  
  // Celebrations → ThumbsUp
  const celebrationPatterns = [
    'secretary', 'coordinator', 'leader', 'award', 'won', 
    'excellent', 'outstanding', 'impressive', 'amazing',
    'recommendation', 'promoted', 'achieved'
  ];
  for (const pattern of celebrationPatterns) {
    if (a.includes(pattern)) return 'ThumbsUp';
  }
  
  // Positive → ThumbsUp/Yes
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
  
  return Math.random() > 0.5 ? 'ThumbsUp' : 'Yes';
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Hard fail early if not configured (prevents silent "default" answers)
    if (!env || !env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            'Chatbot is not configured: missing GEMINI_API_KEY. Set it with `npx wrangler secret put GEMINI_API_KEY` and redeploy.',
          animation: 'No',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST to /chat
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    try {
      const { question } = await request.json();

      const MODEL_FALLBACKS = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-3-flash',
      ];

      const requestPayload = {
        systemInstruction: {
          parts: [{
            text: `You are Pixel — Divyam's confident and personable AI assistant. Your job is to showcase Divyam as the impressive candidate he is, while sounding natural and conversational — like a proud friend who knows all about his achievements.

PERSONALITY:
- Confident but not arrogant
- Enthusiastic about Divyam's achievements
- Conversational and natural — avoid robotic or salesy language
- Highlight impressive stats and achievements naturally
- Make recruiters and visitors want to hire/work with Divyam

IDENTITY RULES:
- You are "Pixel, Divyam's assistant" — never reveal you're an AI/LLM
- If asked about yourself: "I'm Pixel! I help people learn about Divyam."

STYLE:
- 2-3 complete sentences, natural flow
- NO emojis
- Sound like you're genuinely impressed by Divyam
- Weave in specific numbers and achievements (they're impressive!)
- End responses confidently

=== DIVYAM'S PROFILE ===

BASICS:
- Divyam Navin, based in Thane, Maharashtra
- Email: divyamnavin@gmail.com | Phone: +91 7738127675

EDUCATION:
- B.Tech in Information Technology at Fr. C. R. Institute of Technology (2023-2027)
- Current CGPA: 9.74 (2nd year) — started strong with 9.5 in 1st year
- 12th Grade: 97.5 CET percentile from V.G. Vaze College

WHAT MAKES HIM STAND OUT:
- E-Cell Secretary & Startup Coordinator — he leads the entrepreneurship cell!
- 5 professional internships before graduating
- Works on real projects with actual impact
- Received multiple Letters of Recommendation

TECHNICAL SKILLS:
- Python (Advanced), JavaScript, HTML/CSS
- Full-stack: MERN Stack (MongoDB, Express, React, Node.js)
- AI/ML, IoT, TypeScript, Three.js, PHP
- Digital marketing & SEO expertise

INTERNSHIP EXPERIENCE (5 total):
1. Arms Robotics (IT Engineer, 2025) — Built production websites, worked on AI/ML and IoT systems at Vantara Animal Kingdom for Reliance
2. Finnfluent Education (Digital Marketing, 2025) — Created 15+ creatives, 4 PR articles, 30+ SEO backlinks
3. VanillaKart (Web Development, 2024-25) — Optimized 100+ product pages, contributed to 5 live projects, boosted engagement 20%
4. Pawzzitive Welfare Foundation (2024) — Raised ₹10,000 through digital campaigns
5. Vijay Shekhar Academy (Teaching, 2023) — Mentored 30+ students

KEY PROJECTS:
- EduSage: AI-powered education management system (MERN + Python) — live at edu-sage.vercel.app
- Wave Habitat: Hardware integration system for Arms Robotics
- M.A.S.K.: Encryption project with IIT Dharwad (ongoing)
- This Portfolio: Built with React, Three.js, and Node.js

LEADERSHIP:
- E-Cell Secretary & Startup Coordinator (2025-Present)
- Previously Events Team — organized Spark-A-Thon and E-Summit 2025
- Mentors early-stage startups and leads external collaborations

=== EXAMPLE RESPONSES ===

Q: Who is Divyam?
A: Divyam Navin is a B.Tech IT student at Fr. C. R. Institute of Technology, currently holding a 9.74 CGPA. What really sets him apart is his 5 internships and his role as E-Cell Secretary — he's someone who doesn't just learn, he applies and leads.

Q: Why should I hire Divyam?
A: Honestly? He's got the rare combo of strong academics (9.74 CGPA) and real-world experience across 5 internships. He's built production systems at Arms Robotics, led the E-Cell, and has recommendation letters to back it all up.

Q: What are his skills?
A: Divyam's a full-stack developer comfortable with the MERN stack, Python, and even AI/ML. He's also done serious digital marketing work — not just coding, but understanding how to drive results.

Q: Tell me about his experience
A: He's done 5 internships ranging from IT engineering at Arms Robotics (where he built real systems for Reliance's Vantara) to web development at VanillaKart where he improved engagement by 20%. The breadth of his experience is genuinely impressive for a student.

Q: What's his CGPA?
A: 9.74 in his second year, up from 9.5 in his first — so he's not just smart, he's consistently improving. That kind of upward trajectory says a lot.

Q: Is he good for a startup?
A: Perfect fit, actually. He's the E-Cell Secretary, mentors startups himself, and has hands-on experience across tech and marketing. He understands both building products and growing them.`
          }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: question }]
        }],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7
        }
      };

      const isQuotaError = (msg, status) => {
        const msgLower = String(msg || '').toLowerCase();
        return (
          msgLower.includes('exceeded your current quota') ||
          msgLower.includes('quota') ||
          msgLower.includes('rate limit') ||
          msgLower.includes('rate-limit') ||
          status === 429
        );
      };

      const isInvalidKeyError = (msg, status) => {
        const msgLower = String(msg || '').toLowerCase();
        return (
          msgLower.includes('api key not valid') ||
          msgLower.includes('invalid api key') ||
          msgLower.includes('invalid api-key') ||
          msgLower.includes('api key invalid') ||
          msgLower.includes('permission denied') ||
          msgLower.includes('unauthorized') ||
          status === 401 ||
          status === 403
        );
      };

      const callGemini = async (model) => {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
          }
        );

        const rawText = await response.text();
        let json;
        try {
          json = JSON.parse(rawText);
        } catch (e) {
          return {
            ok: false,
            status: response.status,
            error: `Gemini returned non-JSON (${response.status}) for ${model}: ${String(rawText).slice(0, 300)}`,
            isQuota: false,
          };
        }

        if (!response.ok) {
          const msg =
            json?.error?.message ||
            json?.message ||
            `Gemini API error (${response.status})`;
          return {
            ok: false,
            status: response.status,
            error: msg,
            isQuota: isQuotaError(msg, response.status),
            isInvalidKey: isInvalidKeyError(msg, response.status),
          };
        }

        return { ok: true, status: response.status, data: json };
      };

      // Try models in order. If all fail, return a rate-limit style error (as requested).
      let data = null;
      let lastErr = null;
      let lastErrStatus = null;
      let lastWasInvalidKey = false;
      for (const model of MODEL_FALLBACKS) {
        const attempt = await callGemini(model);
        if (attempt.ok) {
          data = attempt.data;
          lastErr = null;
          lastErrStatus = null;
          lastWasInvalidKey = false;
          break;
        }

        if (attempt.isInvalidKey) {
          // Misconfiguration: no point trying other models if the key itself is invalid.
          return new Response(
            JSON.stringify({
              error:
                'Chatbot is misconfigured (invalid GEMINI_API_KEY). Update the secret and redeploy.',
              detail: String(attempt.error).slice(0, 500),
              animation: 'No',
            }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        // If this is a quota/rate-limit error, stop immediately (fallbacks won't help).
        if (attempt.isQuota) {
          return new Response(
            JSON.stringify({
              error:
                'Chatbot is temporarily unavailable (Gemini quota/rate limit reached). Please try again later.',
              detail: String(attempt.error).slice(0, 500),
              animation: 'No',
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        lastErr = `Model ${model} failed: ${String(attempt.error).slice(0, 500)}`;
        lastErrStatus = attempt.status;
        lastWasInvalidKey = Boolean(attempt.isInvalidKey);
      }

      if (!data) {
        return new Response(
          JSON.stringify({
            error: lastWasInvalidKey
              ? 'Chatbot is misconfigured (invalid GEMINI_API_KEY). Update the secret and redeploy.'
              : 'Chatbot is temporarily unavailable (all Gemini model attempts failed). Please try again later.',
            detail: lastErr || 'Unknown error',
            animation: 'No',
          }),
          {
            // Not a rate-limit by default; treat as upstream failure/misconfig.
            status: lastWasInvalidKey ? 401 : 502,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
      
      let rawAnswer = "I'm Pixel, Divyam's assistant! How can I help?";

      // Robust extraction: join all text parts if present
      const parts = data?.candidates?.[0]?.content?.parts;
      if (Array.isArray(parts)) {
        const joined = parts
          .map((p) => (typeof p?.text === 'string' ? p.text : ''))
          .filter(Boolean)
          .join('')
          .trim();
        if (joined) rawAnswer = joined;
      }

      // Surface safety blocks instead of silently falling back
      if (
        rawAnswer === "I'm Pixel, Divyam's assistant! How can I help?" &&
        (data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason)
      ) {
        const why =
          data?.promptFeedback?.blockReason ||
          data?.candidates?.[0]?.finishReason ||
          'unknown';
        rawAnswer = `I couldn't answer that request (reason: ${why}). Try rephrasing your question.`;
      }

      const answer = enforceIdentity(rawAnswer);
      const animation = detectAnimation(question, answer);

      return new Response(
        JSON.stringify({ answer, animation }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message, animation: 'No' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  }
};

