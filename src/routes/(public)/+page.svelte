<script>
  // Svelte 5: no props needed here
  // Client console should now be captured by the root layout hook
  if (!import.meta.env.SSR) {
    console.log('Root public page loaded');
  }
</script>

<section class="min-h-dvh grid place-items-center p-6">
  <div class="prose text-center">
    <h1>SvelteKit Starter</h1>
    <p>Public landing page. Try the dashboard (protected):</p>
    <a href="/dashboard" class="btn btn-primary">Go to dashboard</a>
  </div>
</section>
