<script>
  export let data;
</script>

<div class="prose">
  <h1>Dashboard</h1>
  <p>This route is protected by the hook and only accessible when a session exists.</p>
  <pre><code>{JSON.stringify(data?.user, null, 2)}</code></pre>
</div>

