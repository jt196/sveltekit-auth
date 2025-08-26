<script>
  let { form, data } = $props();
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
      <div class="mt-2 text-sm flex items-center gap-2">
        <span class="opacity-60">No account?</span>
        {#if data?.allowRegister}
          <a href="/register" class="link link-primary">Register</a>
        {:else}
          <span class="opacity-60">Registration disabled</span>
        {/if}
      </div>
    </div>
  </form>
</section>
