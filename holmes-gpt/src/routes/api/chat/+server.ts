import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import type { RequestHandler } from './$types';

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here'
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message) {
			return json({ error: 'Message is required' }, { status: 400 });
		}

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

		return json({
			response: response.content[0].type === 'text' ? response.content[0].text : 'I apologize, but I am unable to respond at this moment.'
		});

	} catch (error) {
		console.error('Error calling Claude API:', error);
		return json(
			{ 
				error: 'I apologize, but I seem to be experiencing a moment of silence. Please try again, and let us continue our spiritual exploration together.' 
			}, 
			{ status: 500 }
		);
	}
}; 