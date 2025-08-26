<script>
  let { form } = $props();
  let email = $state('');
  let password = $state('');
</script>

<section class="min-h-dvh grid place-items-center p-6">
  <form method="POST" class="card bg-base-100 w-full max-w-sm shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Sign in</h2>
      {#if form?.error}
        <div class="alert alert-error">
          <span>{form.error}</span>
        </div>
      {/if}
      <label class="form-control">
        <div class="label"><span class="label-text">Email</span></div>
        <input class="input input-bordered" name="email" type="email" bind:value={email} required />
      </label>
      <label class="form-control mt-2">
        <div class="label"><span class="label-text">Password</span></div>
        <input class="input input-bordered" name="password" type="password" bind:value={password} required />
      </label>
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-primary" type="submit">Continue</button>
      </div>
      <p class="text-sm opacity-60">Use your demo credentials from .env</p>
    </div>
  </form>
</section>
