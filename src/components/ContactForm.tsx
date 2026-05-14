import { useEffect, useState } from 'react';
import { track } from '../lib/analytics';

type State = { kind: 'idle' | 'submitting' | 'success' } | { kind: 'error'; message: string };

const STORAGE_KEY = 'contact-form:last-sent-at';
const WINDOW_MS = 30 * 60 * 1000;

const inputClass =
	'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-200';

function readLastSentAt(): number | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const n = Number(raw);
		return Number.isFinite(n) ? n : null;
	} catch {
		return null;
	}
}

function formatAgo(ms: number): string {
	const minutes = Math.max(1, Math.round(ms / 60000));
	return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
}

export default function ContactForm() {
	const [state, setState] = useState<State>({ kind: 'idle' });
	const [recentSentAt, setRecentSentAt] = useState<number | null>(null);

	useEffect(() => {
		const ts = readLastSentAt();
		if (ts !== null && Date.now() - ts < WINDOW_MS) {
			setRecentSentAt(ts);
		}
	}, []);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const payload = {
			name: String(data.get('name') ?? ''),
			email: String(data.get('email') ?? ''),
			message: String(data.get('message') ?? ''),
		};

		setState({ kind: 'submitting' });
		track('contact_form_submit');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? 'Something went wrong.');
			}
			try {
				localStorage.setItem(STORAGE_KEY, String(Date.now()));
			} catch {}
			setState({ kind: 'success' });
			track('contact_form_success');
			form.reset();
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Something went wrong.';
			setState({ kind: 'error', message });
			track('contact_form_error', { message });
		}
	}

	if (state.kind === 'success') {
		return (
			<div className="rounded-lg border border-emerald-300 bg-emerald-50 p-6 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
				<p className="font-medium">Thanks — your message is on its way.</p>
				<p className="mt-1 text-sm">I'll get back to you as soon as I can.</p>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
			{recentSentAt !== null && (
				<div className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-100">
					You sent a message {formatAgo(Date.now() - recentSentAt)}. Feel free to send another if you have more to say.
				</div>
			)}
			<div>
				<label htmlFor="contact-name" className={labelClass}>Name</label>
				<input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} />
			</div>
			<div>
				<label htmlFor="contact-email" className={labelClass}>Email</label>
				<input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
			</div>
			<div>
				<label htmlFor="contact-message" className={labelClass}>Message</label>
				<textarea id="contact-message" name="message" required rows={5} maxLength={5000} className={inputClass} />
			</div>

			{state.kind === 'error' && (
				<p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
			)}

			<button
				type="submit"
				disabled={state.kind === 'submitting'}
				className="self-start rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{state.kind === 'submitting' ? 'Sending…' : 'Send message'}
			</button>
		</form>
	);
}
