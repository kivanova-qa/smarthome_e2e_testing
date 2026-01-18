<script>
  import { goto } from '$app/navigation';
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Card from './ui/Card.svelte';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let success = '';
  let confirmationLink = '';
  let showLink = false;

  async function handleSubmit() {
    if (!email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        success = data.message;
        showLink = data.showLink;
        confirmationLink = data.confirmationLink;
      } else {
        error = data.error || 'Registration failed';
      }
    } catch (err) {
      error = 'Registration failed';
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(confirmationLink);
    alert('Link copied to clipboard!');
  }
</script>

<div class="flex items-center justify-center min-h-screen p-4">
  <Card class="w-full max-w-md">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Sign up to get started</p>
    </div>

    {#if success}
      <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        <p class="mb-3">{success}</p>
        {#if showLink}
          <div class="bg-white p-3 rounded border">
            <p class="text-sm mb-2">Your verification link (click to copy):</p>
            <button
              on:click={copyLink}
              class="break-all text-blue-600 hover:text-blue-800 underline text-sm"
            >
              {confirmationLink}
            </button>
          </div>
        {/if}
      </div>
      <Button on:click={() => goto('/login')} class="w-full">
        Go to Login
      </Button>
    {:else}
      {#if error}
        <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <Input
          type="email"
          label="Email"
          bind:value={email}
          placeholder="Enter your email"
        />
        
        <Input
          type="password"
          label="Password"
          bind:value={password}
          placeholder="Enter your password"
        />

        <Input
          type="password"
          label="Confirm Password"
          bind:value={confirmPassword}
          placeholder="Confirm your password"
        />

        <div class="pt-2">
          <Button type="submit" class="w-full">Sign Up</Button>
        </div>
      </form>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account? 
          <a href="/login" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Sign in
          </a>
        </p>
        <p class="mt-2 text-sm">
          <a href="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ← Back to Testing Guide
          </a>
        </p>
      </div>
    {/if}
  </Card>
</div>
