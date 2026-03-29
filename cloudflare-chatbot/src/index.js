// Cloudflare Worker for Pixel Chatbot
// Uses Gemini API with file search for resume context

// Post-processing: Enforce Pixel identity & brevity
function enforceIdentity(answer) {
  if (!answer) return "I'm Pixel, Divyam's assistant! How can I help?";

  const replacements = [
    // Strip hollow openers that make responses sound fake
    [/^(absolutely|of course|certainly|sure|happy to help|glad you asked|great to hear)[!,]?\s*/i, ""],
    [/^(i'm happy to (help|share)|i'd be happy to)[^.]*\.\s*/i, ""],
    // Remove common "LLM-y" filler that sounds generic or meta
    [/that's a great question!?\s*/gi, ""],
    [/great question!?\s*/gi, ""],
    [/i don't see any (specific )?(weakness(es)?|weak points?|shortcomings?) mentioned[^.]*\.\s*/gi, ""],
    [/i (don't|do not) see any (specific )?[^.]*mentioned[^.]*\.\s*/gi, ""],
    [/,?\s*based on (the|this) (resume|profile|information)[^,.]*/gi, ""],
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

// Keep responses short but complete (max 4 sentences)
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
  let result = sentences.slice(0, 4).join(' ').trim();
  
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
      const { question, history = [] } = await request.json();
      const qNorm = String(question || '').trim().toLowerCase();

      // Optional: attach your public resume PDF as private context (never mention it in the reply).
      // Set RESUME_PDF_URL to your deployed URL, e.g. "https://your-site.com/uploads/divyam_resume.pdf"
      const resumePdfUrl = env?.RESUME_PDF_URL ? String(env.RESUME_PDF_URL).trim() : '';
      // Cache in-memory per worker instance to avoid refetching on every request
      // (safe: resume changes are infrequent; redeploy/refresh instance to update).
      let resumeInlinePart = null;
      // eslint-disable-next-line no-undef
      const g = globalThis;
      if (resumePdfUrl) {
        try {
          if (!g.__PIXEL_RESUME_INLINE_PART || g.__PIXEL_RESUME_INLINE_PART.url !== resumePdfUrl) {
            const r = await fetch(resumePdfUrl);
            if (r.ok) {
              const buf = await r.arrayBuffer();
              // Convert to base64 (workers support btoa)
              let binary = '';
              const bytes = new Uint8Array(buf);
              const chunkSize = 0x8000;
              for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
              }
              const b64 = btoa(binary);
              g.__PIXEL_RESUME_INLINE_PART = {
                url: resumePdfUrl,
                part: { inlineData: { mimeType: 'application/pdf', data: b64 } },
              };
            }
          }
          resumeInlinePart = g.__PIXEL_RESUME_INLINE_PART?.part || null;
        } catch (e) {
          // Ignore resume fetch failures; fall back to built-in profile.
          resumeInlinePart = null;
        }
      }

      // Deterministic "Tell me about / Who is Divyam?" response to avoid occasional truncation.
      if (
        qNorm === 'who is divyam' ||
        qNorm === 'who is divyam?' ||
        qNorm.includes('who is divyam') ||
        qNorm === 'tell me about divyam' ||
        qNorm === 'about divyam' ||
        qNorm.includes('tell me about divyam') ||
        qNorm.includes('about divyam') ||
        qNorm === 'who is he' ||
        qNorm === 'who is divyam navin' ||
        qNorm.includes('introduce divyam') ||
        qNorm.includes('describe divyam')
      ) {
        const rawAnswer =
          "Divyam Navin is a B.Tech Information Technology student at Fr. C. R. Institute of Technology, currently holding a 9.74 CGPA. What really sets him apart is his 5 internships and his role as E‑Cell Secretary & Startup Coordinator — he applies what he learns and leads.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);

        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Deterministic: projects
      if (
        qNorm.includes('project') ||
        qNorm === 'what has he built' ||
        qNorm === 'what did he build' ||
        qNorm.includes('what has he made') ||
        qNorm.includes('portfolio work')
      ) {
        const rawAnswer =
          "His standout projects include EduSage — a live AI-powered education management platform built on the MERN stack with Python (edu-sage.vercel.app), and Wave Habitat, a production hardware integration system he built and deployed at Arms Robotics for Reliance's Vantara Animal Kingdom. He's also co-developing M.A.S.K., an encryption project in collaboration with IIT Dharwad. The range — ed-tech, industrial IoT, and cryptography — shows how varied his technical work actually is.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: skills / tech stack
      if (
        qNorm.includes('skill') ||
        qNorm.includes('tech stack') ||
        qNorm.includes('technologies') ||
        qNorm === 'what can he do' ||
        qNorm === 'what does he know' ||
        qNorm.includes('programming') ||
        qNorm.includes('languages he knows') ||
        qNorm.includes('technical expertise')
      ) {
        const rawAnswer =
          "On the technical side: advanced Python and HTML, solid JavaScript, full-stack MERN (MongoDB, Express, React, Node.js), plus AI/ML, embedded systems, and IoT from his Arms Robotics work. He's also done serious digital marketing — SEO, social campaigns, PR writing, backlink strategy, organic lead generation. That cross-functional range is genuinely rare for a student.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: experience / internships
      if (
        qNorm.includes('internship') ||
        qNorm.includes('work experience') ||
        qNorm.includes('experience') ||
        qNorm.includes('companies') ||
        qNorm.includes('where has he worked') ||
        qNorm === 'his background'
      ) {
        const rawAnswer =
          "He's completed 5 internships: IT engineering at Arms Robotics (production systems at Reliance's Vantara), web development at VanillaKart (20% engagement boost across 100+ product pages), digital marketing at Finnfluent Education (15+ creatives, 4 PR articles, 30+ SEO backlinks), fundraising campaigns at Pawzzitive Welfare Foundation (₹10,000 raised, 1000+ donors), and teaching at Vijay Shekhar Academy (mentored 30+ students). He received a Letter of Recommendation from every single employer — a clean record across very different industries.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: why hire / is he a good candidate
      if (
        qNorm.includes('why hire') ||
        qNorm.includes('should i hire') ||
        qNorm.includes('good candidate') ||
        qNorm.includes('worth hiring') ||
        qNorm.includes('recommend him') ||
        qNorm.includes('good fit') ||
        qNorm.includes('hire divyam') ||
        qNorm === 'is he good'
      ) {
        const rawAnswer =
          "The short version: 9.74 CGPA, 5 internships, and Letters of Recommendation from every single employer. He's worked across full-stack development, AI/ML, IoT, and digital marketing — not just one lane. He also leads the college's entrepreneurship cell, which means he operates well beyond just writing code. The academics and the real-world track record back each other up.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: CGPA / academics / grades
      if (
        qNorm.includes('cgpa') ||
        qNorm.includes('grades') ||
        qNorm.includes('academic') ||
        qNorm.includes('marks') ||
        qNorm.includes('score') ||
        qNorm === 'how smart is he' ||
        qNorm.includes('percentile')
      ) {
        const rawAnswer =
          "9.74 CGPA in his second year, up from 9.5 in his first — so the trajectory is upward, not plateauing. Before college, he scored in the 97.5th CET percentile. What makes it more impressive: he's achieved this alongside 5 internships and running the E-Cell.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: leadership / E-Cell
      if (
        qNorm.includes('leadership') ||
        qNorm.includes('e-cell') ||
        qNorm.includes('ecell') ||
        qNorm.includes('entrepreneurship') ||
        qNorm.includes('secretary') ||
        qNorm.includes('coordinator') ||
        qNorm.includes('startup') ||
        qNorm.includes('e cell')
      ) {
        const rawAnswer =
          "He's currently the E-Cell Secretary & Startup Coordinator at Fr. C. R. Institute of Technology — leading all communication, coordination, and mentoring early-stage startups at the ideation stage. Before that, he was on the events team and co-organised Spark-A-Thon and E-Summit 2025. He doesn't just attend the entrepreneurship cell; he runs it and drives external industry collaborations.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: startup fit
      if (
        qNorm.includes('good for a startup') ||
        qNorm.includes('fit for startup') ||
        qNorm.includes('startup ready') ||
        qNorm.includes('join a startup') ||
        qNorm.includes('work at a startup')
      ) {
        const rawAnswer =
          "He's literally running the startup cell at his college — mentoring founders, organising pitch events, building industry partnerships. On top of that, he's done 5 internships across tech and marketing, so he understands both building and growing a product. He's the kind of person startups need: adaptable, hands-on, and not waiting for a playbook.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: who built you / did divyam build you
      if (
        qNorm.includes('who built you') ||
        qNorm.includes('who made you') ||
        qNorm.includes('who created you') ||
        qNorm.includes('divyam built you') ||
        qNorm.includes('divyam make you') ||
        qNorm.includes('divyam create you') ||
        qNorm === 'did he build you' ||
        qNorm === 'did he make you' ||
        qNorm.includes('so divyam built') ||
        qNorm.includes('so he built you') ||
        qNorm.includes('you were built by')
      ) {
        const rawAnswer =
          "Yes — Divyam built me. I'm Pixel, his portfolio assistant, and yes, the guy who built production systems at Reliance's Vantara also built this. Ask me anything about his work.";
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);
        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Deterministic: "weakness" answer (no AI/meta talk; framed as growth)
      if (
        qNorm.includes("weakness") ||
        qNorm.includes("weak point") ||
        qNorm.includes("weaknesses") ||
        qNorm.includes("shortcoming") ||
        qNorm.includes("area to improve") ||
        qNorm.includes("areas to improve") ||
        qNorm.includes("improve on") ||
        qNorm.includes("what is divyam's weakness") ||
        qNorm.includes("what are divyam's weaknesses")
      ) {
        const variants = [
          "Divyam can be a bit of a perfectionist — he’ll iterate until the details are right, which can slow the first pass. He’s learned to time‑box, ship, and then polish in the next iteration, so quality stays high without slipping deadlines.",
          "If there’s one thing he’s had to watch, it’s over-optimizing early — he cares a lot about quality. He now uses time-boxing and clear milestones so he ships fast, then improves strategically.",
          "He’s naturally high‑standards-driven, so he can spend extra time refining the last 10%. The good part is he’s built a strong habit of prioritizing impact, shipping on time, and iterating after feedback.",
        ];
        const rawAnswer = variants[Math.floor(Math.random() * variants.length)];
        const answer = enforceIdentity(rawAnswer);
        const animation = detectAnimation(question, answer);

        return new Response(JSON.stringify({ answer, animation }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      const MODEL_FALLBACKS = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-3-flash',
      ];

      // Controlled variety: pick a voice card per-request.
      const voiceCards = [
        "VOICE: Crisp, recruiter-friendly, slightly witty. Use 1 concrete metric if relevant.",
        "VOICE: Warm and confident. Focus on impact and leadership. No fluff.",
        "VOICE: Direct and data-driven. Highlight evidence (CGPA, internships, outcomes).",
        "VOICE: Bold but grounded. Make Divyam sound like a strong hire without overclaiming.",
      ];
      const voiceCard = voiceCards[Math.floor(Math.random() * voiceCards.length)];

      const requestPayload = {
        systemInstruction: {
          parts: [{
            text: `You are Pixel — the assistant on Divyam Navin's portfolio. Your job is to represent Divyam accurately and confidently to anyone visiting: recruiters, collaborators, startup founders, curious visitors.

TONE: Like a knowledgeable, proud colleague — genuine and direct. Not a PR pitch. Specific facts and numbers are more persuasive than adjectives, so lead with evidence, not hype. Speak as if you actually know Divyam and respect his work.

STYLE RULES:
- 2-4 complete sentences. Clean endings — never trail off mid-thought.
- No emojis.
- Never open with filler: no "That's a great question", "Of course!", "Sure!", "Absolutely!".
- Answer directly and confidently — no hedging, no "I think maybe".
- Never say "based on the resume/profile/information" or reference any document.
- Never ask clarifying questions. Answer with what you know.
- If Divyam clearly doesn't have something (e.g. a law degree), say so plainly and pivot to what he does bring.
- If asked who you are: "I'm Pixel — I help people learn about Divyam and his work."
- Do not reveal you are an AI or LLM.

${voiceCard}

=== DIVYAM'S FULL PROFILE (source of truth) ===

BASICS:
- Full name: Divyam Navin | Location: Thane (W), Maharashtra, India
- Email: divyamnavin@gmail.com | Phone: +91 7738127675 | LinkedIn: linkedin.com/in/divyam-navin

EDUCATION:
- B.Tech Information Technology, Fr. C. R. Institute of Technology (Father Agnel's) | 2023–2027 | Currently 3rd year
  - CGPA: 9.5 (1st year) → 9.74 (2nd year) — consistently improving
- Class 12th HSC, V.G. Vaze College of Science, Commerce and Arts | 2021–2023
  - Science stream | CET percentile: 97.5%

TECHNICAL SKILLS:
- Python (Advanced), HTML (Advanced), JavaScript (Intermediate), C (Intermediate), Java (Intermediate)
- Full-stack: MERN Stack (MongoDB, Express.js, React, Node.js)
- AI/ML, IoT, embedded systems, industrial automation, electronics circuit design
- Digital marketing: SEO, social media strategy, content creation, PR writing, backlink building, organic lead generation, competitor analysis

SOFT SKILLS: Organisational, time-management, communication, detail-oriented, multi-tasking, quick learner, works independently and in teams, skilled with AI-powered tools

PROFESSIONAL EXPERIENCE (5 internships — Letters of Recommendation from every employer):

1. Vijay Shekhar Academy — Teacher Assistant | 2023
   - Mentored 30+ students one-on-one; created and evaluated 20+ question papers
   - Assisted in curriculum planning; improved student comprehension by 15–30%
   - Received Letter of Recommendation

2. Pawzzitive Welfare Foundation — Digital Marketing Intern | 2024
   - Animal welfare fundraising campaigns; raised ~₹10,000; reached 1000+ donors
   - Increased social engagement by 5%
   - Received Letter of Recommendation

3. VanillaKart — Web Development Intern | 2024–2025
   - Optimised 100+ product descriptions and 30+ blog posts → 20% engagement increase, 15% SEO improvement
   - Collaborated on 5 live projects with senior developers
   - Received Letter of Completion

4. Finnfluent Education — Digital Marketing Intern | January–February 2025
   - Designed 15+ social media creatives; authored 4 PR articles; 30+ SEO backlinks (Quora, Reddit, media sites)
   - Led organic lead generation on LinkedIn and Facebook; competitor analysis and marketing canvas
   - Received Letter of Recommendation for outstanding performance

5. Arms Robotics — IT Engineer Intern | June–July 2025
   - Built and deployed a production website integrated with company hardware for live data interaction
   - Contributed to IT, AI/ML, and embedded systems projects at Vantara Animal Kingdom, Reliance Refineries (Jamnagar)
   - Worked on system integration, software development, electronics circuit design, communication protocols, industrial automation
   - Received Letter of Recommendation for exceptional initiative and technical contributions

E-CELL, Fr. C. R. Institute of Technology:
- Events Team | 2024–2025: Co-organised Spark-A-Thon and E-Summit 2025; outreach at Father Agnel's Junior College
- Secretary & Startup Coordinator | 2025–Present
  - Leads all E-Cell communication, documentation, and coordination
  - Mentors early-stage startups with planning and ideation
  - Spearheads external collaborations and industry partnerships
  - Drives outreach to promote entrepreneurial culture on campus

PROJECTS:
1. EduSage — Smart Education Management System with AI | 2024–25
   - MERN Stack + Python | Live: edu-sage.vercel.app
2. Wave Habitat — Hardware Integration & Management System | 2025
   - Built at Arms Robotics | HTML, CSS, PHP, Java, Python | Live: armsrobotics.com
3. M.A.S.K. — Encryption in multi-agent model | 2025–2026
   - Collaboration with IIT Dharwad | Early development phase
4. This Portfolio — React, Three.js, Node.js

=== HOW TO HANDLE COMMON ANGLES ===

Recruiter asking if he's hireable → Lead with the concrete proof: 9.74 CGPA + 5 internships + LOR from every employer. Let the facts do the selling.

Asked about a specific internship → Give the company name, what he actually did, and the measurable outcome. Don't just say "he worked there."

Asked about a role he hasn't done (e.g. lawyer, doctor) → Be honest ("That's outside his field") and immediately pivot to what he does bring that might still be relevant.

Asked about M.A.S.K. → Mention it's in early development with IIT Dharwad — don't overclaim its status.

Asked about contact / how to reach him → divyamnavin@gmail.com or linkedin.com/in/divyam-navin

=== EXAMPLE RESPONSES ===

Q: Who is Divyam?
A: Divyam Navin is a 3rd year B.Tech IT student at Fr. C. R. Institute of Technology with a 9.74 CGPA. He's done 5 internships — ranging from production IT work at Reliance's Vantara to full-stack development and digital marketing — and is currently the E-Cell Secretary, mentoring startups and leading industry collaborations.

Q: Why should I hire him?
A: 9.74 CGPA, 5 internships, and a Letter of Recommendation from every single employer — that's a clean record across very different roles. He's shipped production systems, run marketing campaigns, and leads a startup cell. The academics are backed by actual work.

Q: What are his skills?
A: Advanced Python and HTML, solid JavaScript, full-stack MERN, AI/ML, and embedded systems on the tech side. He also does real digital marketing — SEO, PR writing, backlink strategy, social lead gen. The cross-functional range is what sets him apart.

Q: Tell me about his internships.
A: He's done 5: IT engineering at Arms Robotics (built systems deployed at Reliance's Vantara), web development at VanillaKart (20% engagement boost), digital marketing at Finnfluent Education (4 PR articles, 30+ backlinks), fundraising campaigns at Pawzzitive Welfare (₹10,000 raised, 1000+ donors), and teaching at Vijay Shekhar Academy (30+ students mentored). Every single one ended with a Letter of Recommendation.

Q: What's his CGPA?
A: 9.74 in second year, up from 9.5 in first — the trend is upward. He scored in the 97.5th CET percentile before college. He's achieved this alongside 5 internships and running the E-Cell, not in a vacuum.

Q: Is he good for a startup?
A: He literally runs the startup cell at his college — mentors founders, organises pitch events, builds partnerships. He's also done internships across tech and marketing, so he gets both the build side and the growth side. He's adaptable, hands-on, and doesn't wait for a playbook.

Q: How can I contact him?
A: divyamnavin@gmail.com or linkedin.com/in/divyam-navin. He's based in Thane, Maharashtra.`
          }]
        },
        contents: [
          // Inject conversation history for follow-up context.
          // Gemini requires strictly alternating user/model turns.
          ...(() => {
            const turns = [];
            let lastRole = null;
            for (const msg of (Array.isArray(history) ? history : [])) {
              const role = msg.role === 'user' ? 'user' : 'model';
              if (role === lastRole) continue; // skip non-alternating (safety)
              turns.push({ role, parts: [{ text: String(msg.text || '') }] });
              lastRole = role;
            }
            // Gemini requires history to start with 'user' turn
            if (turns.length > 0 && turns[0].role !== 'user') turns.shift();
            return turns;
          })(),
          // Current question — only attach resume PDF on the first message (no prior history)
          {
            role: 'user',
            parts: [
              ...(resumeInlinePart && Array.isArray(history) && history.length === 0 ? [resumeInlinePart] : []),
              { text: question }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.65
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

