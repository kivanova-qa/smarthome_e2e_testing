<script>
  export let label = '';
  export let type = 'text';
  export let placeholder = '';
  export let value = '';
</script>

<div class="mb-4">
  {#if label}
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
  {/if}
  {#if type === 'email'}
    <input
      type="email"
      {placeholder}
      bind:value
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  {:else if type === 'password'}
    <input
      type="password"
      {placeholder}
      bind:value
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  {:else}
    <input
      type="text"
      {placeholder}
      bind:value
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  {/if}
</div>

