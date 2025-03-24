<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let currentPage = 1;
  let totalPages = 0;
  let menuItemsByPage: Record<number, any[]> = {};
  let isFlipping = false;
  let flipDirection: 'next' | 'prev' = 'next';
  let windowWidth: number;
  
  onMount(async () => {
    totalPages = data.totalPages;
    menuItemsByPage = data.menuItemsByPage;
  });
  
  async function flipPage(direction: 'next' | 'prev') {
    if (isFlipping) return;
    
    isFlipping = true;
    flipDirection = direction;
    
    if (direction === 'next' && currentPage < totalPages) {
      currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
      currentPage--;
    }
    
    // Allow time for the animation to complete
    await tick();
    setTimeout(() => {
      isFlipping = false;
    }, 400); // Shorter animation time
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="min-h-screen bg-gray-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-medium text-center mb-8 text-gray-900">Our Menu</h1>
    
    <div class="relative bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200" style="min-height: {windowWidth < 640 ? '450px' : '600px'};">
      <!-- Menu Book -->
      <div class="relative w-full h-full flex justify-center">
        <!-- Page Number Indicator -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <div class="inline-block bg-gray-100 px-4 py-1 rounded-full shadow-sm text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        
        <!-- Current Page Content -->
        <div class="w-full">
          {#key currentPage}
            <div 
              class="w-full p-4 sm:p-8"
              in:fade={{ duration: 300 }}
            >
              <div class="grid grid-cols-1 gap-4">
                {#if menuItemsByPage[currentPage]}
                  {#each menuItemsByPage[currentPage] as item, i}
                    <div 
                      class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-all duration-300"
                      class:opacity-75={item.outOfStock}
                      in:scale={{ 
                        start: 0.98, 
                        duration: 300, 
                        delay: i * 50,
                        easing: cubicOut
                      }}
                    >
                      <div class="flex items-center p-4">
                        <!-- Image -->
                        <div class="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {#if item.image}
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.name} 
                              class="w-full h-full object-cover"
                            />
                          {:else}
                            <div class="w-full h-full flex items-center justify-center text-2xl">
                              {item.category === 'Main' ? '🍽️' : 
                               item.category === 'Starters' ? '🥗' : 
                               item.category === 'Desserts' ? '🍰' : '🍟'}
                            </div>
                          {/if}
                        </div>
                        
                        <!-- Content -->
                        <div class="ml-4 flex-1">
                          <div class="flex justify-between items-start">
                            <div>
                              <h3 class="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p class="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            </div>
                            <div class="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</div>
                          </div>
                          
                          <div class="mt-2 flex justify-between items-center">
                            <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {item.category}
                            </span>
                            
                            {#if item.outOfStock}
                              <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            {:else}
                              <button class="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm">
                                Add to Order
                              </button>
                            {/if}
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          {/key}
        </div>
        
        <!-- Page Turn Controls -->
        <button 
          class="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-2 sm:p-3 shadow-sm hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200 z-20"
          on:click={() => flipPage('prev')}
          disabled={currentPage === 1 || isFlipping}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          class="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-2 sm:p-3 shadow-sm hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200 z-20"
          on:click={() => flipPage('next')}
          disabled={currentPage === totalPages || isFlipping}
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <!-- Simplified Page Turn Animation -->
        {#if isFlipping}
          <div 
            class="absolute inset-0 bg-black bg-opacity-5 z-10"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}
          ></div>
        {/if}
      </div>
    </div>
    
    <!-- Menu Legend -->
    <div class="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="flex flex-wrap gap-2 justify-center">
        <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
          🥗 <span>Starters</span>
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
          🍽️ <span>Main</span>
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
          🍟 <span>Sides</span>
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
          🍰 <span>Desserts</span>
        </span>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-8 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} Time Pass Cafe. All rights reserved.</p>
      <p class="mt-1">Made with ❤️ and fresh ingredients</p>
    </footer>
  </div>
</div>