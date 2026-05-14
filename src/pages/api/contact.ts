import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { CONTACT_EMAIL } from '../../consts';

export const prerender = false;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

type ContactPayload = {
	name?: unknown;
	email?: unknown;
	message?: unknown;
};

function isEmail(s: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function stripNewlines(s: string): string {
	return s.replace(/[\r\n\t]/g, ' ').trim();
}

const FROM_ADDRESS = 'Contact form <onboarding@resend.dev>';

const apiKey = import.meta.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export const POST: APIRoute = async ({ request }) => {
	let body: ContactPayload;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: 'Invalid request' }, { status: 400 });
	}

	const { name, email, message } = body ?? {};

	if (
		typeof name !== 'string' ||
		typeof email !== 'string' ||
		typeof message !== 'string' ||
		!name.trim() ||
		!message.trim() ||
		name.length > MAX_NAME ||
		email.length > MAX_EMAIL ||
		message.length > MAX_MESSAGE ||
		!isEmail(email)
	) {
		return Response.json({ error: 'Please check the form and try again.' }, { status: 400 });
	}

	if (!resend) {
		console.error('RESEND_API_KEY is not set');
		return Response.json({ error: 'Email is not configured.' }, { status: 500 });
	}

	const cleanName = stripNewlines(name);
	const cleanEmail = stripNewlines(email);

	const { error } = await resend.emails.send({
		from: FROM_ADDRESS,
		to: CONTACT_EMAIL,
		replyTo: cleanEmail,
		subject: `New message from ${cleanName}`,
		text: `From: ${cleanName} <${cleanEmail}>\n\n${message}`,
	});

	if (error) {
		console.error('Resend error', error);
		return Response.json({ error: 'Could not send. Try again later.' }, { status: 502 });
	}

	return Response.json({ ok: true }, { status: 200 });
};
