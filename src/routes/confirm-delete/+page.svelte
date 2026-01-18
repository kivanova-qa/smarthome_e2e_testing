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
      message = 'No deletion token provided.';
      return;
    }

    try {
      const response = await fetch(`/api/auth/confirm-delete?token=${token}`);
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
      message = 'Account deletion failed. Please try again.';
    }
  });

  function goToHome() {
    goto('/');
  }

  function goToLogin() {
    goto('/');
  }
</script>

<div class="flex items-center justify-center min-h-screen p-4">
  <Card class="w-full max-w-md">
    {#if status === 'loading'}
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Processing deletion...</p>
      </div>
    {:else if status === 'success'}
      <div class="text-center">
        <div class="text-orange-600 text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Deleted</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">All your data and lights have been permanently removed.</p>
        <Button on:click={goToLogin}>Go to Login</Button>
      </div>
    {:else}
      <div class="text-center">
        <div class="text-red-600 text-6xl mb-4">✕</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Deletion Failed</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <Button on:click={goToHome}>Return to Home</Button>
      </div>
    {/if}
  </Card>
</div>

