<script>
  let className = '';
  export { className as class };
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 {className}">
  <slot />
</div>

