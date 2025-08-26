<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
  // Install client console hook early so child components' logs are captured.

	let { children } = $props();

  if (import.meta.env?.DEV && typeof window !== 'undefined') {
    const endpoint = '/__clientlog';
    const send = (level, args) => {
      const message = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      const payload = JSON.stringify({ level, message });
      const blob = new Blob([payload], { type: 'application/json' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(endpoint, blob))) {
        fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload }).catch(() => {});
      }
    };
    const orig = { ...console };
    console.log = (...args) => { try { send('log', args); } catch {} orig.log(...args); };
    console.info = (...args) => { try { send('info', args); } catch {} orig.info(...args); };
    console.warn = (...args) => { try { send('warn', args); } catch {} orig.warn(...args); };
    console.error = (...args) => { try { send('error', args); } catch {} orig.error(...args); };

    // Capture unhandled errors and rejections
    window.addEventListener('error', (e) => {
      try { send('error', [e.message || 'window.error', e.filename, e.lineno, e.colno]); } catch {}
    });
    window.addEventListener('unhandledrejection', (e) => {
      try { send('error', ['unhandledrejection', String(e.reason)]); } catch {}
    });
  }
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
