<script>
  export let variant = 'default';
  export let type = 'button';
  
  $: classes = {
    'default': 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    'outline': 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700',
    'ghost': 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  }[variant];

  $: buttonClasses = `px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${classes}`;
</script>

<button 
  {type}
  class={buttonClasses}
  on:click
>
  <slot />
</button>

