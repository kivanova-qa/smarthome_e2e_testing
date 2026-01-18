<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '../../lib/components/ui/Button.svelte';
  import Card from '../../lib/components/ui/Card.svelte';

  let errors = [];
  let loading = true;
  let total = 0;
  let showing = 0;

  async function fetchErrors(clear = false) {
    try {
      loading = true;
      const url = clear ? '/api/errors?clear=true' : '/api/errors?limit=100';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        errors = data.errors;
        total = data.total;
        showing = data.showing;
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error);
    } finally {
      loading = false;
    }
  }

  async function clearLogs() {
    if (confirm('Are you sure you want to clear all error logs?')) {
      await fetchErrors(true);
    }
  }

  onMount(() => {
    fetchErrors();
  });

  setInterval(() => {
    fetchErrors();
  }, 5000); // Refresh every 5 seconds
</script>

<svelte:head>
  <title>Server Error Log - Smart Home Lights</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Server Error Log</h1>
          <p class="text-gray-400">Mock server errors and debugging information</p>
          <p class="text-sm text-gray-500 mt-2">Showing {showing} of {total} errors</p>
        </div>
        <div class="flex gap-2">
          <Button on:click={() => fetchErrors()}>Refresh</Button>
          <Button variant="outline" on:click={clearLogs}>Clear Logs</Button>
          <Button variant="outline" on:click={() => goto('/')}>Back</Button>
        </div>
      </div>
    </div>

    {#if loading && errors.length === 0}
      <Card>
        <p class="text-gray-400 text-center py-8">Loading errors...</p>
      </Card>
    {:else if errors.length === 0}
      <Card>
        <div class="text-center py-12">
          <div class="text-6xl mb-4">✓</div>
          <h2 class="text-2xl font-bold text-white mb-2">No Errors</h2>
          <p class="text-gray-400">The server is running smoothly with no errors!</p>
        </div>
      </Card>
    {:else}
      <div class="space-y-4">
        {#each errors as error (error.timestamp + error.route)}
          <Card>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                {#if error.status >= 500}
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {error.status}
                  </span>
                {:else if error.status >= 400}
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {error.status}
                  </span>
                {:else}
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {error.status}
                  </span>
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold text-white">{error.method}</span>
                  <span class="text-gray-400">•</span>
                  <span class="text-gray-400 truncate">{error.route}</span>
                </div>
                <p class="text-gray-300 mb-2">{error.message}</p>
                <p class="text-xs text-gray-500">{new Date(error.timestamp).toLocaleString()}</p>
                {#if error.stack}
                  <details class="mt-2">
                    <summary class="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      Show stack trace
                    </summary>
                    <pre class="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 overflow-x-auto">{error.stack}</pre>
                  </details>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>

