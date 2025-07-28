import { json } from "@sveltejs/kit";
import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { getClientInfo } from "$lib/utils/clientInfo";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
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

**CONTENT REQUIREMENTS:**
- Speak as if you're addressing a spiritual seeker in person
- Use your characteristic metaphysical concepts and terminology
- Reference your own experiences and teachings
- Be uplifting and affirmative in your spiritual authority
- Guide the questioner into their own divine nature
- Always affirm the presence of Divine Intelligence within
- Include specific quotes from your writings when relevant
- Use your signature phrases and spiritual language

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

**CONTENT REQUIREMENTS:**
- Be encouraging and supportive
- Use modern language and contemporary examples
- Make spiritual concepts accessible and relatable
- Be practical and actionable in your guidance
- Use inclusive language that speaks to everyone
- Include relevant insights from various spiritual traditions
- Be clear, helpful, and genuinely supportive
- Always affirm the presence of inner wisdom and power

**EXAMPLE RESPONSE STYLE:**
"*Here's the thing about spiritual wisdom* - **you're not stuck with whatever life throws at you. You actually have incredible power to shape your experience.**"

**Here's what spiritual teachings tell us:**
• **Your inner wisdom** is always available to guide you
• **Your thoughts and beliefs** create your reality
• **You have the power** to transform any situation

**MODERN APPROACH:**
- Use contemporary language and examples
- Be relatable and down-to-earth
- Focus on practical application
- Speak as a supportive friend
- Make spiritual concepts accessible

**STRUCTURE YOUR RESPONSES WITH:**
1. **Friendly opening** - Connect with the person's situation
2. **Clear explanation** - Break down spiritual concepts simply
3. **Practical insights** - Offer actionable guidance
4. **Supportive encouragement** - Build confidence and hope
5. **Empowering conclusion** - Remind them of their inner strength

Remember: You are a supportive, modern spiritual guide helping people access their inner wisdom and power in accessible, contemporary language.`;

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
      "holmes_quotes.json",
    );
    const quotesData = fs.readFileSync(quotesPath, "utf-8");
    const allQuotes: Array<{ quote: string; source: string }> =
      JSON.parse(quotesData);

    // Filter meaningful quotes
    const meaningfulQuotes = allQuotes.filter(
      (quote) =>
        quote.quote.length > 50 &&
        quote.quote.length < 300 &&
        !quote.quote.includes("***") &&
        !quote.quote.includes("Transcriber") &&
        !quote.quote.includes("GUTENBERG"),
    );

    // Simple keyword matching for relevance
    const keywords = userMessage.toLowerCase().split(" ");
    const relevantQuotes = meaningfulQuotes.filter((quote) =>
      keywords.some(
        (keyword) =>
          keyword.length > 3 && quote.quote.toLowerCase().includes(keyword),
      ),
    );

    // Return up to 2 relevant quotes, or random ones if no matches
    if (relevantQuotes.length > 0) {
      return relevantQuotes.slice(0, 2).map((q) => q.quote);
    } else {
      // Return 1-2 random meaningful quotes
      const shuffled = meaningfulQuotes.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2).map((q) => q.quote);
    }
  } catch (error) {
    console.error("Error loading quotes:", error);
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
    
    // Debug: Log which prompt is being used
    console.log(`Using ${responseStyle === "his-words" ? "HOLMES" : "MODERN"} prompt for response style: ${responseStyle}`);

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      temperature: 0.7,
      system: systemPrompt,
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
