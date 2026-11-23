type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
	interface Window {
		dataLayer?: unknown[];
		track?: (name: string, data?: Props) => void;
		plausible?: (name: string, options?: { props?: Record<string, string> }) => void;
	}
}

const DEBUG = import.meta.env.DEV || import.meta.env.PUBLIC_ANALYTICS_DEBUG === 'true';

export function track(event: string, props?: Props): void {
	if (typeof window === 'undefined') return;

	if (DEBUG) {
		console.log('[analytics]', event, props ?? {});
	}

	try {
		(window.dataLayer ??= []).push(arguments_(event, props));
	} catch {}

	try {
		window.track?.(event, props);
	} catch {}

	try {
		const plausibleProps = propsForPlausible(props);
		window.plausible?.(event, plausibleProps ? { props: plausibleProps } : undefined);
	} catch {}
}

function propsForPlausible(props?: Props): Record<string, string> | undefined {
	if (!props) return undefined;

	const entries = Object.entries(props).flatMap(([key, value]) =>
		value === null || value === undefined ? [] : [[key, String(value)]],
	);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function arguments_(event: string, props?: Props): IArguments {
	return (function () {
		return arguments;
	})('event', event, props ?? {});
}
