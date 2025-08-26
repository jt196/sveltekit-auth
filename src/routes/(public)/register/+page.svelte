<script>
  let { form, data } = $props();
  let name = $state('');
  let email = $state('');
  let password = $state('');
</script>

<section class="min-h-dvh grid place-items-center p-6">
  <form method="POST" class="card bg-base-100 w-full max-w-sm shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Create account</h2>
      {#if form?.error}
        <div class="alert alert-error">
          <span>{form.error}</span>
        </div>
      {/if}
      <label class="form-control">
        <div class="label"><span class="label-text">Name</span></div>
        <input class="input input-bordered" name="name" type="text" bind:value={name} required />
      </label>
      <label class="form-control mt-2">
        <div class="label"><span class="label-text">Email</span></div>
        <input class="input input-bordered" name="email" type="email" bind:value={email} required />
      </label>
      <label class="form-control mt-2">
        <div class="label"><span class="label-text">Password</span></div>
        <input class="input input-bordered" name="password" type="password" bind:value={password} required />
      </label>
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-primary" type="submit">Register</button>
      </div>
      <div class="mt-2 text-sm flex items-center gap-2">
        <span class="opacity-60">Already have an account?</span>
        <a href="/login" class="link link-primary">Sign in</a>
      </div>
    </div>
  </form>
</section>

