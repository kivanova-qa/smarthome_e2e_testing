<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '../lib/components/ui/Button.svelte';
  import Card from '../lib/components/ui/Card.svelte';

  let testingContent = '';
  let loading = true;

  onMount(async () => {
    try {
      const response = await fetch('/TESTING.md');
      if (response.ok) {
        testingContent = await response.text();
      }
    } catch (error) {
      console.error('Failed to load TESTING.md:', error);
      testingContent = '# Testing Guide\n\nFailed to load testing documentation.';
    } finally {
      loading = false;
    }
  });

  function navigateTo(path) {
    goto(path);
  }
</script>

<svelte:head>
  <title>Smart Home Lights - Testing Guide</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">Smart Home Lights</h1>
      <p class="text-gray-400">Testing Documentation</p>
    </div>

    <!-- Navigation Links -->
    <div class="mb-6 flex gap-4 flex-wrap">
      <Button on:click={() => navigateTo('/login')}>Login</Button>
      <Button variant="outline" on:click={() => navigateTo('/register')}>Register</Button>
      <Button variant="outline" on:click={() => navigateTo('/errors')}>View Error Log</Button>
    </div>

    <!-- Testing Content -->
    <Card>
      {#if loading}
        <p class="text-gray-400">Loading testing guide...</p>
      {:else}
        <div class="prose prose-invert max-w-none">
          <pre class="whitespace-pre-wrap text-sm">{testingContent}</pre>
        </div>
      {/if}
    </Card>
  </div>
</div>

<style>
  :global(.prose pre) {
    background-color: #1f2937;
    color: #e5e7eb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    line-height: 1.6;
  }
</style>