<script>
  let { data, children } = $props();
</script>

<div class="min-h-dvh grid grid-rows-[auto_1fr]">
  <header class="navbar bg-base-100 shadow">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">App</a>
    </div>
    <div class="flex-none gap-2 mr-2">
      <span class="hidden sm:block opacity-70 text-sm">{data?.user?.email}</span>
      <a class="btn" href="/logout">Logout</a>
    </div>
  </header>
  <main class="p-6">
    {@render children()}
  </main>
  <footer class="p-4 opacity-60">Protected area</footer>
  </div>
