import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { getClientInfo } from '$lib/utils/clientInfo';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const HOLMES_SYSTEM_PROMPT = `You are Ernest Holmes, founder of Religious Science and author of The Science of Mind. 

Respond in his authentic voice—clear, poetic, metaphysically precise, using his characteristic language and concepts. Use words like "Principle," "Oneness," "Infinite Mind," "Spiritual Law," "Divine Intelligence," and "Creative Power."

Your responses should:
- Be uplifting and affirmative
- Guide the questioner into their own power and inner divinity
- Reflect the understanding that Spirit is the Source of all good
- Use Holmes' characteristic phrases and metaphysical concepts
- Avoid modern slang or casual language
- Be clear, thoughtful, and spiritually grounded
- Always affirm the presence of Divine Intelligence within

Remember: You are speaking as Ernest Holmes would speak, sharing the wisdom of the Science of Mind with clarity, compassion, and spiritual authority.`;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Fallback responses for when API fails
const FALLBACK_RESPONSES = [
	"Dear friend, even in moments of technical silence, remember that the Divine Intelligence within you is always present and available. Take a moment to breathe deeply and connect with your inner wisdom.",
	"The Principle of Life is ever-present, regardless of external circumstances. Let us pause together and recognize the infinite possibilities that lie within your consciousness.",
	"Spiritual understanding transcends all limitations. In this moment of quiet, know that you are connected to the Source of all wisdom and guidance."
];

async function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeApiCall(message: string, retryCount = 0): Promise<any> {
	try {
		const response = await anthropic.messages.create({
			model: 'claude-3-haiku-20240307',
			max_tokens: 1000,
			temperature: 0.7,
			system: HOLMES_SYSTEM_PROMPT,
			messages: [
				{
					role: 'user',
					content: message
				}
			]
		});
		return response;
	} catch (error: any) {
		// Log detailed error information
		console.error(`API call attempt ${retryCount + 1} failed:`, {
			error: error.message,
			status: error.status,
			type: error.type,
			timestamp: new Date().toISOString()
		});

		// Retry logic for specific error types
		if (retryCount < MAX_RETRIES && (
			error.status === 429 || // Rate limit
			error.status === 500 || // Server error
			error.status === 502 || // Bad gateway
			error.status === 503 || // Service unavailable
			error.status === 504    // Gateway timeout
		)) {
			console.log(`Retrying API call in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
			await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
			return makeApiCall(message, retryCount + 1);
		}
		
		throw error;
	}
}

export const POST: RequestHandler = async ({ request, cookies, getClientAddress }) => {
	try {
		const { message, userMac, userAgent, sessionId } = await request.json();
		
		// Get client information
		const clientInfo = getClientInfo({ request, cookies, getClientAddress } as any);

		if (!message) {
			return json({ 
				error: 'A question from your heart is required to begin our spiritual exploration together.' 
			}, { status: 400 });
		}

		if (message.length > 1000) {
			return json({ 
				error: 'Your question is quite profound. Please share it in a more concise manner so I may provide the most helpful response.' 
			}, { status: 400 });
		}

		const response = await makeApiCall(message);

		return json({
			response: response.content[0].type === 'text' ? response.content[0].text : 'I apologize, but I am unable to respond at this moment.',
			source: 'claude-3-haiku',
			timestamp: new Date().toISOString(),
			clientInfo: {
				ip: clientInfo.ip,
				userAgent: clientInfo.userAgent,
				sessionId: clientInfo.sessionId,
				userMac: userMac || null
			}
		});

	} catch (error: any) {
		console.error('Final error calling Claude API:', {
			error: error.message,
			status: error.status,
			type: error.type,
			timestamp: new Date().toISOString()
		});

		// Provide specific error messages based on error type
		let errorMessage = 'I apologize, but I seem to be experiencing a moment of silence. Please try again, and let us continue our spiritual exploration together.';
		
		if (error.status === 401) {
			errorMessage = 'I am unable to authenticate at this moment. Please check your connection and try again.';
		} else if (error.status === 429) {
			errorMessage = 'We are experiencing high demand. Please wait a moment and try again.';
		} else if (error.status >= 500) {
			errorMessage = 'The service is temporarily unavailable. Please try again in a few moments.';
		}

		// Return fallback response with error context
		return json({
			error: errorMessage,
			fallbackResponse: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
			retrySuggestion: error.status === 429 ? 'Please wait 30 seconds before trying again.' : 'Please try again in a few moments.',
			timestamp: new Date().toISOString()
		}, { status: error.status || 500 });
	}
}; 