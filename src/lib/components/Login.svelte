<script>
  import { goto } from '$app/navigation';
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Card from './ui/Card.svelte';

  let email = '';
  let password = '';
  let error = '';

  async function handleSubmit() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        goto('/dashboard');
      } else {
        error = data.error || 'Login failed';
      }
    } catch (err) {
      error = 'Login failed';
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen p-4">
  <Card class="w-full max-w-md">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
    </div>

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

      <div class="pt-2">
        <Button type="submit" class="w-full">Sign In</Button>
      </div>
    </form>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account? 
        <a href="/register" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          Sign up
        </a>
      </p>
      <p class="mt-2 text-sm">
        <a href="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ← Back to Testing Guide
        </a>
      </p>
    </div>
  </Card>
</div>
