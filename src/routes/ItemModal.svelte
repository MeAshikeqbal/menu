<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  export let item: any = null;
  export let isOpen = false;
  
  function closeModal() {
    isOpen = false;
  }
  
  // Close modal when Escape key is pressed
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  // Function to get category emoji if no image is available
  function getCategoryEmoji(category: string) {
    switch(category) {
      case 'Main': return '🍽️';
      case 'Starters': return '🥗';
      case 'Desserts': return '🍰';
      case 'Sides': return '🍟';
      case 'Drinks': return '🥤';
      case 'Hot Beverages': return '☕';
      default: return '🍴';
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen && item}
  <!-- Modal Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    on:click={closeModal}
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
  >
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation={() => {}}
      in:scale={{ duration: 300, start: 0.95, opacity: 0, easing: cubicOut }}
      out:scale={{ duration: 200, start: 0.95, opacity: 0 }}
    >
      <!-- Image Header -->
      <div class="relative w-full h-48 bg-stone-100">
        {#if item.image}
          <img 
            src={item.image || "/placeholder.svg"} 
            alt={item.name} 
            class="w-full h-full object-cover {item.outOfStock ? 'opacity-50 grayscale' : ''}"
          />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-6xl {item.outOfStock ? 'opacity-50' : ''}">
            {getCategoryEmoji(item.category)}
          </div>
        {/if}
        
        <!-- Close Button -->
        <button 
          class="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          on:click={closeModal}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-medium text-stone-800 {item.outOfStock ? 'line-through' : ''}">
            {item.name}
          </h2>
          <span class="text-lg font-medium text-stone-800 {item.outOfStock ? 'line-through opacity-70' : ''}">
            ₹{item.price.toFixed(2)}
          </span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-600">
            {item.category}
          </span>
          {#if item.outOfStock}
            <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium animate-pulse">
              Sold Out
            </span>
          {/if}
        </div>
        
        <p class="text-stone-600 mb-6 {item.outOfStock ? 'opacity-70' : ''}">
          {item.description}
        </p>
        
        {#if item.ingredients}
          <div class="mb-4">
            <h3 class="text-sm font-medium text-stone-700 mb-2">Ingredients:</h3>
            <p class="text-sm text-stone-600">{item.ingredients}</p>
          </div>
        {/if}
        
        {#if item.allergens}
          <div class="mb-4">
            <h3 class="text-sm font-medium text-stone-700 mb-2">Allergens:</h3>
            <p class="text-sm text-stone-600">{item.allergens}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

