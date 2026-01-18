<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let status = 'loading';
  let message = '';

  onMount(async () => {
    const token = $page.url.searchParams.get('token');
    
    if (!token) {
      status = 'error';
      message = 'No verification token provided.';
      return;
    }

    try {
      const response = await fetch(`/api/auth/verify?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        status = 'success';
        message = data.message;
      } else {
        status = 'error';
        message = data.error;
      }
    } catch (error) {
      status = 'error';
      message = 'Verification failed. Please try again.';
    }
  });

  function goToLogin() {
    goto('/');
  }
</script>

<div class="flex items-center justify-center min-h-screen p-4">
  <Card class="w-full max-w-md">
    {#if status === 'loading'}
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Verifying your email...</p>
      </div>
    {:else if status === 'success'}
      <div class="text-center">
        <div class="text-green-600 text-6xl mb-4">✓</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <Button on:click={goToLogin}>Go to Login</Button>
      </div>
    {:else}
      <div class="text-center">
        <div class="text-red-600 text-6xl mb-4">✕</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <Button on:click={goToLogin}>Go to Login</Button>
      </div>
    {/if}
  </Card>
</div>

