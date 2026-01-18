<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Button from './ui/Button.svelte';
  import LightCard from './LightCard.svelte';

  let lights = [];
  let loading = true;
  let showAddForm = false;
  let newLightName = '';

  async function loadLights() {
    try {
      const response = await fetch('/api/lights');
      if (response.ok) {
        const data = await response.json();
        lights = data.lights || [];
      } else if (response.status === 401) {
        goto('/');
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
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const lightIndex = lights.findIndex(l => l.id === lightId);
        if (lightIndex !== -1) {
          lights[lightIndex] = { ...lights[lightIndex], ...updates };
          lights = lights;
        }
      }
    } catch (error) {
      console.error('Failed to update light:', error);
    }
  }

  async function addLight() {
    if (!newLightName.trim()) return;

    try {
      const response = await fetch('/api/lights/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLightName })
      });

      if (response.ok) {
        const data = await response.json();
        lights = [...lights, data.light];
        newLightName = '';
        showAddForm = false;
      }
    } catch (error) {
      console.error('Failed to add light:', error);
    }
  }

  async function deleteLight(lightId) {
    if (!confirm('Are you sure you want to delete this light?')) return;

    try {
      const response = await fetch(`/api/lights/${lightId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        lights = lights.filter(l => l.id !== lightId);
      }
    } catch (error) {
      console.error('Failed to delete light:', error);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      goto('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Account deleted successfully');
        // Redirect to login page
        goto('/');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete account');
      }
    } catch (error) {
      alert('Failed to delete account');
    }
  }

  onMount(() => {
    loadLights();
  });
</script>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white">Smart Home Lights</h1>
          <p class="text-gray-400 mt-2">Control your lights</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" on:click={handleLogout}>
            Logout
          </Button>
          <button
            on:click={handleDeleteAccount}
            class="px-4 py-2 rounded-md font-medium transition-colors duration-200 border border-red-600 text-red-600 bg-transparent hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-950"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <p class="text-gray-400">Loading lights...</p>
      </div>
    {:else}
      <!-- Add Light Form -->
      <div class="mb-6">
        {#if showAddForm}
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Light</h3>
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={newLightName}
                placeholder="Enter light name"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                on:keydown={(e) => e.key === 'Enter' && addLight()}
              />
              <Button on:click={addLight}>Add</Button>
              <Button variant="outline" on:click={() => { showAddForm = false; newLightName = ''; }}>Cancel</Button>
            </div>
          </div>
        {:else}
          <Button on:click={() => showAddForm = true}>
            + Add Light
          </Button>
        {/if}
      </div>

      <!-- Lights Grid -->
      {#if lights.length === 0}
        <div class="text-center py-16">
          <p class="text-gray-400 mb-4">No lights available</p>
          <Button on:click={() => showAddForm = true}>Add Your First Light</Button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each lights as light (light.id)}
            <LightCard 
              {light} 
              on:update={(e) => updateLight(light.id, e.detail)}
              on:delete={() => deleteLight(light.id)}
            />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
