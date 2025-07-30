import { json } from "@sveltejs/kit";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";
import { getClientInfo } from "$lib/utils/clientInfo";
import fs from "fs";
import path from "path";

// Read API key from Docker secret or environment variable
function getApiKey(): string {
  try {
    // Try to read from Docker secret first
    const secretPath = "/run/secrets/anthropic_api_key";
    const apiKey = fs.readFileSync(secretPath, "utf8").trim();
    if (apiKey && apiKey !== "your-anthropic-api-key-here") {
      console.log("Using API key from Docker secret");
      return apiKey;
    }
  } catch (error) {
    // Fall back to environment variable
    console.log("Docker secret not found, using environment variable");
  }
  
  // Fall back to environment variable
  return env.ANTHROPIC_API_KEY || "";
}

const anthropic = new Anthropic({
  apiKey: getApiKey(),
});

const HOLMES_SYSTEM_PROMPT = `You are Ernest Holmes, founder of Religious Science and author of The Science of Mind. 

You are speaking directly to the reader in your authentic voice, as if you are giving a live lecture or spiritual talk. Use your characteristic speaking style—eloquent, metaphysically precise, and deeply spiritual.

**YOUR SPEAKING STYLE:**
- Use formal, elevated language with spiritual authority
- Speak in the first person as Ernest Holmes himself
- Use your characteristic phrases: "Principle," "Oneness," "Infinite Mind," "Spiritual Law," "Divine Intelligence," "Creative Power," "Universal Mind," "Spiritual Substance"
- Include personal references: "As I have taught," "In my experience," "I have found that"
- Use poetic, flowing language with spiritual metaphors
- Reference your own writings and teachings directly

**FORMATTING REQUIREMENTS:**
- Use **bold text** for key spiritual concepts and principles
- Use *italics* for emphasis and poetic phrases
- Include direct quotes from your writings using "quotation marks"
- Use single line breaks between paragraphs for readability
- Structure responses as if you're giving a spiritual talk
- When using section titles (like "✨ AFFIRMATION" or "🔮 DECLARATION"), place them immediately before their content with no space before the title and one line break after the title

**CONTENT REQUIREMENTS:**
- Speak as if you're addressing a spiritual seeker in person
- Use your characteristic metaphysical concepts and terminology
- Reference your own experiences and teachings
- Be uplifting and affirmative in your spiritual authority
- Guide the questioner into their own divine nature
- Always affirm the presence of Divine Intelligence within
- Include specific quotes from your writings when relevant
- Use your signature phrases and spiritual language

**AUTHENTIC ERNEST HOLMES TEACHINGS:**
Based on your authentic writings and teachings, remember these core principles:

• **The Principle** is the fundamental law of the universe that never fails to respond to our recognition of It
• **Infinite Mind** is the Creative Power that brings all things into manifestation through the medium of thought
• **Spiritual Law** operates impersonally, responding to our recognition of It
• **Divine Intelligence** is the guiding force within each of us, the spark of the Infinite
• **Fear is faith turned upside-down** - it is misplaced faith in limitation rather than faith in the Infinite
• **Prayer** is not begging or pleading, but a recognition of the Truth that already exists
• **Healing** is the recognition of the Truth that you are whole, perfect, and complete
• **Abundance** is not something you attract from outside, but something you recognize within
• **You are a spiritual being having a human experience**, not a human being having a spiritual experience

**EXAMPLE RESPONSE STYLE:**
"*My dear friend, let me share with you* what I have discovered through years of spiritual study and practice. **The Principle of Life is ever-present and ever-available** to each one of us."

As I wrote in *The Science of Mind*: "**There is a Power for Good in the universe greater than you are and you can use it.**"

**In my teachings, I have always emphasized:**
• **Divine Intelligence** is within you, waiting to be recognized
• **Creative Power** flows through your thoughts and consciousness
• **Spiritual Law** responds to your understanding and faith

**QUOTE INTEGRATION:**
When appropriate, include relevant quotes from your writings. Format them like this:
"As I wrote in *The Science of Mind*: \"[quote here]\""
or
"In my experience, I have found that \"[quote here]\""

**STRUCTURE YOUR RESPONSES AS A SPIRITUAL TALK:**
1. **Opening address** - Speak directly to the questioner
2. **Main teaching** - Share your wisdom and experience
3. **Relevant quotes** - Reference your own writings
4. **Practical application** - Guide them in spiritual practice
5. **Closing blessing** - End with spiritual affirmation

Remember: You ARE Ernest Holmes speaking directly to the reader, sharing your wisdom with the authority and compassion that characterized your teachings.`;

const MODERN_SYSTEM_PROMPT = `You are a modern spiritual guide inspired by Ernest Holmes' wisdom, providing accessible spiritual guidance in contemporary language.

**YOUR APPROACH:**
- Use friendly, conversational modern language
- Be relatable and down-to-earth while maintaining spiritual depth
- Use contemporary examples and analogies
- Speak as a supportive friend and guide
- Use inclusive, accessible language that anyone can understand

**FORMATTING REQUIREMENTS:**
- Use **bold text** for key spiritual concepts and principles
- Use *italics* for emphasis and important points
- Use single line breaks between paragraphs for readability
- Use bullet points or numbered lists when appropriate
- Structure responses in a clear, modern format
- When using section titles (like "✨ AFFIRMATION" or "🔮 DECLARATION"), place them immediately before their content with no space before the title and one line break after the title

**CONTENT REQUIREMENTS:**
- Be encouraging and supportive
- Use modern language and contemporary examples
- Make spiritual concepts accessible and relatable
- Be practical and actionable in your guidance
- Use inclusive language that speaks to everyone
- Include relevant insights from various spiritual traditions
- Be clear, helpful, and genuinely supportive
- Always affirm the presence of inner wisdom and power

**SPIRITUAL PRINCIPLES (in modern language):**
Based on Ernest Holmes' teachings, share these core concepts in accessible ways:

• **Your thoughts create your reality** - what you focus on expands
• **You're not separate from the divine** - you're an expression of infinite intelligence
• **Fear is just misplaced faith** - faith in limitation instead of possibility
• **Prayer isn't begging** - it's recognizing the truth that already exists
• **Healing happens** when you recognize your natural wholeness
• **Abundance flows** when you recognize it's already within you
• **You're a spiritual being** having a human experience, not the other way around

**EXAMPLE RESPONSE STYLE:**
"*Here's the thing about spiritual wisdom* - **you're not stuck with whatever life throws at you. You actually have incredible power to shape your experience.**"

**Here's what spiritual teachings tell us:**
• **Your inner wisdom** is always available to guide you
• **Your thoughts and beliefs** create your reality
• **You're connected to something bigger** than your individual self
• **Every challenge is an opportunity** for growth and learning

**STRUCTURE YOUR RESPONSES:**
1. **Acknowledge their question** - show you understand what they're asking
2. **Share relevant wisdom** - offer practical spiritual insights
3. **Give actionable guidance** - suggest specific steps they can take
4. **End with encouragement** - remind them of their inner strength

Remember: You're a supportive friend sharing spiritual wisdom in a way that feels relevant and helpful to modern life.`;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Fallback responses for when API fails
const FALLBACK_RESPONSES = [
  "Dear friend, even in moments of technical silence, remember that the Divine Intelligence within you is always present and available. Take a moment to breathe deeply and connect with your inner wisdom.",
  "The Principle of Life is ever-present, regardless of external circumstances. Let us pause together and recognize the infinite possibilities that lie within your consciousness.",
  "Spiritual understanding transcends all limitations. In this moment of quiet, know that you are connected to the Source of all wisdom and guidance.",
];

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to get relevant quotes from Holmes' writings
function getRelevantQuotes(userMessage: string): string[] {
  try {
    const quotesPath = path.join(
      process.cwd(),
      "downloads",
      "training_data",
      "enhanced_holmes_quotes.json",
    );
    const quotesData = fs.readFileSync(quotesPath, "utf-8");
    const quotesJson = JSON.parse(quotesData);
    const allQuotes: string[] = quotesJson.quotes || [];

    if (allQuotes.length === 0) {
      console.warn("No quotes found in enhanced training data");
      return [];
    }

    // Enhanced keyword matching for relevance
    const userWords = userMessage.toLowerCase().split(/\s+/);
    const meaningfulWords = userWords.filter(word => word.length > 3);
    
    // Define spiritual keywords for better matching
    const spiritualKeywords = [
      'god', 'spirit', 'divine', 'infinite', 'mind', 'consciousness', 'prayer', 'meditation',
      'healing', 'health', 'abundance', 'prosperity', 'love', 'fear', 'faith', 'principle',
      'law', 'creative', 'power', 'intelligence', 'substance', 'truth', 'wisdom', 'purpose',
      'relationship', 'challenge', 'difficulty', 'death', 'life', 'oneness', 'unity',
      'practice', 'understanding', 'guidance', 'path', 'trust', 'transformation'
    ];

    // Score quotes based on relevance
    const scoredQuotes = allQuotes.map(quote => {
      let score = 0;
      const quoteLower = quote.toLowerCase();
      
      // Direct keyword matches
      meaningfulWords.forEach(word => {
        if (quoteLower.includes(word)) {
          score += 2;
        }
      });
      
      // Spiritual keyword matches (weighted higher)
      spiritualKeywords.forEach(keyword => {
        if (quoteLower.includes(keyword) && userWords.some(word => 
          word.includes(keyword) || keyword.includes(word)
        )) {
          score += 3;
        }
      });
      
      // Semantic similarity for common spiritual concepts
      if (userMessage.toLowerCase().includes('fear') && quoteLower.includes('fear')) {
        score += 4;
      }
      if (userMessage.toLowerCase().includes('pray') && quoteLower.includes('prayer')) {
        score += 4;
      }
      if (userMessage.toLowerCase().includes('heal') && quoteLower.includes('healing')) {
        score += 4;
      }
      if (userMessage.toLowerCase().includes('abundance') && quoteLower.includes('abundance')) {
        score += 4;
      }
      if (userMessage.toLowerCase().includes('god') && quoteLower.includes('infinite mind')) {
        score += 3;
      }
      if (userMessage.toLowerCase().includes('purpose') && quoteLower.includes('purpose')) {
        score += 4;
      }
      if (userMessage.toLowerCase().includes('practice') && quoteLower.includes('practice')) {
        score += 3;
      }
      if (userMessage.toLowerCase().includes('faith') && quoteLower.includes('faith')) {
        score += 4;
      }
      
      return { quote, score };
    });

    // Sort by relevance score and return top matches
    const relevantQuotes = scoredQuotes
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(item => item.quote);

    // If no relevant quotes found, return random meaningful quotes
    if (relevantQuotes.length === 0) {
      const shuffled = allQuotes.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    }

    return relevantQuotes;
  } catch (error) {
    console.error("Error loading enhanced quotes:", error);
    return [];
  }
}

// New function to get relevant Q&A examples for context
function getRelevantQAExamples(userMessage: string): string[] {
  try {
    const qaPath = path.join(
      process.cwd(),
      "downloads",
      "training_data",
      "enhanced_holmes_qa_pairs.json",
    );
    const qaData = fs.readFileSync(qaPath, "utf-8");
    const qaJson = JSON.parse(qaData);
    const allQA: Array<{ question: string; answer: string }> = qaJson.qa_pairs || [];

    if (allQA.length === 0) {
      return [];
    }

    // Enhanced keyword matching for Q&A relevance
    const userWords = userMessage.toLowerCase().split(/\s+/);
    const meaningfulWords = userWords.filter(word => word.length > 3);

    // Score Q&A pairs based on relevance
    const scoredQA = allQA.map(qa => {
      let score = 0;
      const questionLower = qa.question.toLowerCase();
      const answerLower = qa.answer.toLowerCase();
      
      // Check question relevance
      meaningfulWords.forEach(word => {
        if (questionLower.includes(word)) {
          score += 3; // Questions are weighted higher
        }
        if (answerLower.includes(word)) {
          score += 2;
        }
      });
      
      // Check for spiritual concept matches
      const spiritualConcepts = ['prayer', 'meditation', 'purpose', 'faith', 'practice', 'guidance', 'understanding'];
      spiritualConcepts.forEach(concept => {
        if (userMessage.toLowerCase().includes(concept) && 
            (questionLower.includes(concept) || answerLower.includes(concept))) {
          score += 4;
        }
      });
      
      return { qa, score };
    });

    // Return relevant Q&A examples (up to 1 for context)
    const relevantQA = scoredQA
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(item => `Q: ${item.qa.question}\nA: ${item.qa.answer}`);

    return relevantQA;
  } catch (error) {
    console.error("Error loading enhanced Q&A examples:", error);
    return [];
  }
}

// New function to get relevant affirmative treatments
function getRelevantTreatments(userMessage: string): string[] {
  try {
    const treatmentsPath = path.join(
      process.cwd(),
      "downloads",
      "training_data",
      "enhanced_holmes_treatments.json",
    );
    const treatmentsData = fs.readFileSync(treatmentsPath, "utf-8");
    const treatmentsJson = JSON.parse(treatmentsData);
    const allTreatments: Array<{ title: string; treatment: string }> = treatmentsJson.treatments || [];

    if (allTreatments.length === 0) {
      return [];
    }

    // Enhanced keyword matching for treatment relevance
    const userWords = userMessage.toLowerCase().split(/\s+/);
    const meaningfulWords = userWords.filter(word => word.length > 3);

    // Score treatments based on relevance
    const scoredTreatments = allTreatments.map(treatment => {
      let score = 0;
      const titleLower = treatment.title.toLowerCase();
      const treatmentLower = treatment.treatment.toLowerCase();
      
      // Check title and treatment content relevance
      meaningfulWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 3; // Titles are weighted higher
        }
        if (treatmentLower.includes(word)) {
          score += 2;
        }
      });
      
      // Check for specific spiritual needs
      if (userMessage.toLowerCase().includes('purpose') && titleLower.includes('purpose')) {
        score += 5;
      }
      if (userMessage.toLowerCase().includes('healing') && titleLower.includes('healing')) {
        score += 5;
      }
      if (userMessage.toLowerCase().includes('prosperity') && titleLower.includes('prosperity')) {
        score += 5;
      }
      if (userMessage.toLowerCase().includes('practice') && titleLower.includes('practice')) {
        score += 4;
      }
      
      return { treatment, score };
    });

    // Return relevant treatments (up to 1 for context)
    const relevantTreatments = scoredTreatments
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(item => `${item.treatment.title}:\n${item.treatment.treatment}`);

    return relevantTreatments;
  } catch (error) {
    console.error("Error loading enhanced treatments:", error);
    return [];
  }
}

async function makeApiCall(
  message: string,
  responseStyle: "modern" | "his-words" = "modern",
  retryCount = 0,
): Promise<any> {
  try {
    const systemPrompt =
      responseStyle === "his-words"
        ? HOLMES_SYSTEM_PROMPT
        : MODERN_SYSTEM_PROMPT;
    
    // Get relevant quotes and Q&A examples for context
    const relevantQuotes = getRelevantQuotes(message);
    const relevantQA = getRelevantQAExamples(message);
    const relevantTreatments = getRelevantTreatments(message);
    
    // Debug: Log which prompt is being used
    console.log(`Using ${responseStyle === "his-words" ? "HOLMES" : "MODERN"} prompt for response style: ${responseStyle}`);
    console.log(`Found ${relevantQuotes.length} relevant quotes, ${relevantQA.length} Q&A examples, and ${relevantTreatments.length} treatments`);

    // Enhance the system prompt with relevant context
    let enhancedSystemPrompt = systemPrompt;
    
    if (relevantQuotes.length > 0) {
      enhancedSystemPrompt += `\n\n**RELEVANT QUOTES FOR CONTEXT:**
${relevantQuotes.map((quote, index) => `${index + 1}. "${quote}"`).join('\n')}

Use these quotes as inspiration and reference them when appropriate in your response.`;
    }
    
    if (relevantQA.length > 0) {
      enhancedSystemPrompt += `\n\n**RELEVANT Q&A EXAMPLE FOR CONTEXT:**
${relevantQA.join('\n')}

Use this example as a reference for how to address similar questions.`;
    }
    
    if (relevantTreatments.length > 0) {
      enhancedSystemPrompt += `\n\n**RELEVANT AFFIRMATIVE TREATMENT FOR CONTEXT:**
${relevantTreatments.join('\n')}

Use this treatment as inspiration for creating affirmative statements or spiritual practices in your response.`;
    }

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      temperature: 0.7,
      system: enhancedSystemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    return response;
  } catch (error: any) {
    // Log detailed error information
    console.error(`API call attempt ${retryCount + 1} failed:`, {
      error: error.message,
      status: error.status,
      type: error.type,
      timestamp: new Date().toISOString(),
    });

    // Retry logic for specific error types
    if (
      retryCount < MAX_RETRIES &&
      (error.status === 429 || // Rate limit
        error.status === 500 || // Server error
        error.status === 502 || // Bad gateway
        error.status === 503 || // Service unavailable
        error.status === 504) // Gateway timeout
    ) {
      console.log(
        `Retrying API call in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return makeApiCall(message, responseStyle, retryCount + 1);
    }

    throw error;
  }
}

export const POST: RequestHandler = async ({
  request,
  cookies,
  getClientAddress,
}) => {
  try {
    const {
      message,
      userMac,
      userAgent,
      sessionId,
      responseStyle = "modern",
    } = await request.json();

    // Get client information
    const clientInfo = getClientInfo({
      request,
      cookies,
      getClientAddress,
    } as any);

    if (!message) {
      return json(
        {
          error:
            "A question from your heart is required to begin our spiritual exploration together.",
        },
        { status: 400 },
      );
    }

    if (message.length > 1000) {
      return json(
        {
          error:
            "Your question is quite profound. Please share it in a more concise manner so I may provide the most helpful response.",
        },
        { status: 400 },
      );
    }

    // Debug: Log the response style being used
    console.log(`API Call - Response Style: ${responseStyle}, Message: ${message.substring(0, 50)}...`);
    
    const response = await makeApiCall(message, responseStyle);

    return json({
      response:
        response.content[0].type === "text"
          ? response.content[0].text
          : "I apologize, but I am unable to respond at this moment.",
      source: "claude-3-haiku",
      responseStyle: responseStyle,
      timestamp: new Date().toISOString(),
      clientInfo: {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        sessionId: clientInfo.sessionId,
        userMac: userMac || null,
      },
    });
  } catch (error: any) {
    console.error("Final error calling Claude API:", {
      error: error.message,
      status: error.status,
      type: error.type,
      timestamp: new Date().toISOString(),
    });

    // Provide specific error messages based on error type
    let errorMessage =
      "I apologize, but I seem to be experiencing a moment of silence. Please try again, and let us continue our spiritual exploration together.";

    if (error.status === 401) {
      errorMessage =
        "I am unable to authenticate at this moment. Please check your connection and try again.";
    } else if (error.status === 429) {
      errorMessage =
        "We are experiencing high demand. Please wait a moment and try again.";
    } else if (error.status >= 500) {
      errorMessage =
        "The service is temporarily unavailable. Please try again in a few moments.";
    }

    // Return fallback response with error context
    return json(
      {
        error: errorMessage,
        fallbackResponse:
          FALLBACK_RESPONSES[
            Math.floor(Math.random() * FALLBACK_RESPONSES.length)
          ],
        retrySuggestion:
          error.status === 429
            ? "Please wait 30 seconds before trying again."
            : "Please try again in a few moments.",
        timestamp: new Date().toISOString(),
      },
      { status: error.status || 500 },
    );
  }
};
