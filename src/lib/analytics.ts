type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
	interface Window {
		dataLayer?: unknown[];
		umami?: { track: (name: string, props?: Props) => void };
		ebit?: { track: (name: string, props?: Props) => void };
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
		window.umami?.track(event, props);
	} catch {}

	try {
		window.ebit?.track(event, props);
	} catch {}
}

function arguments_(event: string, props?: Props): IArguments {
	return (function () {
		return arguments;
	})('event', event, props ?? {});
}
