<script>
  import { createEventDispatcher } from 'svelte';
  import Card from './ui/Card.svelte';
  import Button from './ui/Button.svelte';

  const dispatch = createEventDispatcher();

  export let light;
  let editing = false;
  let editedName = '';

  function toggleLight() {
    dispatch('update', { isOn: !light.isOn });
  }

  function handleColorChange(event) {
    dispatch('update', { color: event.target.value });
  }

  function startEdit() {
    editing = true;
    editedName = light.name;
  }

  function cancelEdit() {
    editing = false;
    editedName = '';
  }

  function saveEdit() {
    if (editedName.trim()) {
      dispatch('update', { name: editedName });
      editing = false;
    }
  }

  function deleteLight() {
    dispatch('delete');
  }
</script>

<Card class="p-6">
  <div class="mb-4">
    {#if editing}
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={editedName}
          class="flex-1 px-2 py-1 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          on:keydown={(e) => e.key === 'Enter' && saveEdit()}
        />
        <button
          on:click={saveEdit}
          class="p-1 text-green-600 hover:text-green-700"
          title="Save"
        >
          ✓
        </button>
        <button
          on:click={cancelEdit}
          class="p-1 text-red-600 hover:text-red-700"
          title="Cancel"
        >
          ✕
        </button>
      </div>
    {:else}
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {light.name}
        </h3>
        <div class="flex gap-1">
          <button
            on:click={startEdit}
            class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            title="Edit name"
          >
            ✏️
          </button>
          <button
            on:click={deleteLight}
            class="p-1 text-red-600 hover:text-red-700"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    {/if}

    <div 
      class="w-full h-32 rounded-lg transition-all duration-300 mb-4"
      class:bg-opacity-100={light.isOn}
      class:bg-opacity-30={!light.isOn}
      style="background-color: {light.isOn ? light.color : light.color};"
    >
    </div>
  </div>

  <div class="space-y-4">
    <div>
      <label for="color-{light.id}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Color
      </label>
      <input
        id="color-{light.id}"
        type="color"
        value={light.color}
        on:change={handleColorChange}
        class="w-full h-12 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-700"
      />
    </div>

    <div>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {light.isOn ? 'On' : 'Off'}
        </span>
        <Button
          variant={light.isOn ? 'default' : 'outline'}
          on:click={toggleLight}
        >
          {light.isOn ? 'Turn Off' : 'Turn On'}
        </Button>
      </div>
    </div>
  </div>
</Card>
