import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import EmailRepository from '$lib/db/emailRepository';
import { getClientInfo } from '$lib/utils/clientInfo';

const emailRepo = new EmailRepository();

export const POST: RequestHandler = async ({ request }) => {
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

		// Get client information
		const clientInfo = getClientInfo(request);

		// Store email in database
		const emailRecord = emailRepo.storeEmail(
			emailAddress,
			messageContent,
			messageId,
			clientInfo.ip,
			clientInfo.userAgent,
			clientInfo.sessionId
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
				const stats = emailRepo.getEmailStats();
				return json({ success: true, data: stats });

			case 'recent':
				const limit = parseInt(url.searchParams.get('limit') || '50');
				const recentEmails = emailRepo.getRecentEmails(limit);
				return json({ success: true, data: recentEmails });

			case 'by-address':
				const emailAddress = url.searchParams.get('email');
				if (!emailAddress) {
					return json(
						{ error: 'Email address parameter is required' },
						{ status: 400 }
					);
				}
				const emailsByAddress = emailRepo.getEmailsByAddress(emailAddress);
				return json({ success: true, data: emailsByAddress });

			case 'exists':
				const checkEmail = url.searchParams.get('email');
				if (!checkEmail) {
					return json(
						{ error: 'Email address parameter is required' },
						{ status: 400 }
					);
				}
				const exists = emailRepo.emailExists(checkEmail);
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
			const deleted = emailRepo.deleteEmail(id);
			if (deleted) {
				return json({ success: true, message: 'Email record deleted successfully' });
			} else {
				return json(
					{ error: 'Email record not found' },
					{ status: 404 }
				);
			}
		} else if (emailAddress) {
			const deletedCount = emailRepo.deleteEmailsByAddress(emailAddress);
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