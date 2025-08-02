import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import EmailRepository from '$lib/db/emailRepository';
import { getClientInfo } from '$lib/utils/clientInfo';

let emailRepo: EmailRepository | null = null;

function getEmailRepo(): EmailRepository {
	if (!emailRepo) {
		try {
			emailRepo = new EmailRepository();
		} catch (error) {
			console.error('Failed to initialize EmailRepository:', error);
			throw new Error('Database connection failed');
		}
	}
	return emailRepo;
}

export const POST: RequestHandler = async ({ request, getClientAddress, cookies }) => {
	try {
		const { emailAddress, messageContent, messageId } = await request.json();

		// Validate required fields
		if (!emailAddress || !messageContent) {
			return json(
				{ error: 'Email address and message content are required' },
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailAddress)) {
			return json({ error: 'Invalid email address format' }, { status: 400 });
		}

		// Get client information manually
		const clientIP = getClientAddress();
		const userAgent = request.headers.get('user-agent') || 'unknown';
		const sessionId = cookies.get('holmes_session_id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// Store email in database
		const emailRecord = getEmailRepo().storeEmail(
			emailAddress,
			messageContent,
			messageId,
			clientIP,
			userAgent,
			sessionId
		);

		return json({
			success: true,
			message: 'Email stored successfully',
			data: {
				id: emailRecord.id,
				email_address: emailRecord.email_address,
				created_at: emailRecord.created_at
			}
		});
	} catch (error) {
		console.error('Error storing email:', error);
		return json(
			{ error: 'Failed to store email' },
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const action = url.searchParams.get('action');

		switch (action) {
			case 'stats':
				const stats = getEmailRepo().getEmailStats();
				return json({ success: true, data: stats });

			case 'recent':
				const limit = parseInt(url.searchParams.get('limit') || '50');
				const recentEmails = getEmailRepo().getRecentEmails(limit);
				return json({ success: true, data: recentEmails });

			case 'by-address':
				const emailAddress = url.searchParams.get('email');
				if (!emailAddress) {
					return json(
						{ error: 'Email address parameter is required' },
						{ status: 400 }
					);
				}
				const emailsByAddress = getEmailRepo().getEmailsByAddress(emailAddress);
				return json({ success: true, data: emailsByAddress });

			case 'exists':
				const checkEmail = url.searchParams.get('email');
				if (!checkEmail) {
					return json(
						{ error: 'Email address parameter is required' },
						{ status: 400 }
					);
				}
				const exists = getEmailRepo().emailExists(checkEmail);
				return json({ success: true, data: { exists } });

			default:
				return json(
					{ error: 'Invalid action parameter' },
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error('Error retrieving email data:', error);
		return json(
			{ error: 'Failed to retrieve email data' },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');
		const emailAddress = url.searchParams.get('email');

		if (id) {
			const deleted = getEmailRepo().deleteEmail(id);
			if (deleted) {
				return json({ success: true, message: 'Email record deleted successfully' });
			} else {
				return json(
					{ error: 'Email record not found' },
					{ status: 404 }
				);
			}
		} else if (emailAddress) {
			const deletedCount = getEmailRepo().deleteEmailsByAddress(emailAddress);
			return json({
				success: true,
				message: `Deleted ${deletedCount} email records for ${emailAddress}`
			});
		} else {
			return json(
				{ error: 'Either id or email parameter is required' },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Error deleting email:', error);
		return json(
			{ error: 'Failed to delete email' },
			{ status: 500 }
		);
	}
}; 