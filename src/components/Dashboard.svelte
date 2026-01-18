<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Button from './ui/Button.svelte';
  import Card from './ui/Card.svelte';
  import LightCard from './LightCard.svelte';

  const dispatch = createEventDispatcher();

  export let userId = '';
  // Keep userId in props even if not displayed - it's used for API calls implicitly

  let lights = [];
  let loading = true;

  async function loadLights() {
    try {
      const response = await fetch('/api/lights', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        lights = data.lights;
      }
    } catch (error) {
      console.error('Failed to load lights:', error);
    } finally {
      loading = false;
    }
  }

  async function updateLight(lightId, updates) {
    try {
      const response = await fetch(`/api/lights/${lightId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Update local state
        const lightIndex = lights.findIndex(l => l.id === lightId);
        if (lightIndex !== -1) {
          lights[lightIndex] = { ...lights[lightIndex], ...updates };
          lights = lights; // Trigger reactivity
        }
      }
    } catch (error) {
      console.error('Failed to update light:', error);
    }
  }

  async function handleLogout() {
    dispatch('logout');
  }

  onMount(() => {
    loadLights();
  });
</script>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white">Smart Home Lights</h1>
          <p class="text-gray-400 mt-2">Control your lights</p>
        </div>
        <Button variant="outline" on:click={handleLogout}>
          Logout
        </Button>
      </div>
    </div>

    <!-- Lights Grid -->
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <p class="text-gray-400">Loading lights...</p>
      </div>
    {:else if lights.length === 0}
      <div class="text-center py-16">
        <p class="text-gray-400">No lights available</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each lights as light (light.id)}
          <LightCard {light} on:update={(e) => updateLight(light.id, e.detail)} />
        {/each}
      </div>
    {/if}
  </div>
</div>

