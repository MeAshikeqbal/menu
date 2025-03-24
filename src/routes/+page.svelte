<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
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
    
    await tick();
    setTimeout(() => {
      isFlipping = false;
    }, 400);
  }

  // Function to get category emoji if no image is available
  function getCategoryEmoji(category: string) {
    switch(category) {
      case 'Main': return '🍽️';
      case 'Starters': return '🥗';
      case 'Desserts': return '🍰';
      case 'Sides': return '🍟';
      default: return '🍴';
    }
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
  <div class="w-full max-w-3xl">
    <!-- Book Cover -->
    <div class="relative bg-white shadow-md rounded-sm overflow-hidden border border-stone-200" 
         style="min-height: {windowWidth < 640 ? '500px' : '650px'}; max-width: 800px; margin: 0 auto;">
      
      <!-- Book Header -->
      <div class="border-b border-stone-100 p-4 text-center">
        <h1 class="text-2xl font-serif text-stone-800">Time Pass Cafe</h1>
        <p class="text-sm text-stone-500 mt-1">Est. 2024</p>
      </div>
      
      <!-- Book Content -->
      <div class="relative w-full h-full">
        <!-- Current Page Content -->
        <div class="w-full">
          {#key currentPage}
            <div 
              class="w-full p-6 sm:p-8"
              in:fade={{ duration: 300 }}
              out:fly={{ x: flipDirection === 'next' ? -100 : 100, duration: 300, opacity: 0 }}
            >
              <!-- Page Title -->
              <div class="mb-6 pb-2 border-b border-stone-100">
                <h2 class="text-lg font-serif text-stone-800">
                  {currentPage === 1 ? 'Starters & Appetizers' : 
                   currentPage === 2 ? 'Main Courses' : 
                   currentPage === 3 ? 'Desserts & Beverages' : `Page ${currentPage}`}
                </h2>
              </div>
              
              <!-- Menu Items -->
              <div class="space-y-6">
                {#if menuItemsByPage[currentPage]}
                  {#each menuItemsByPage[currentPage] as item, i}
                    <div 
                      class="flex justify-between items-start pb-4 border-b border-stone-100 last:border-0"
                      in:fade={{ 
                        duration: 300, 
                        delay: i * 100,
                        easing: cubicOut
                      }}
                    >
                      <!-- Image (small, shown on all screen sizes) -->
                      <div class="w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden mr-3 bg-stone-100">
                        {#if item.image}
                          <img 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            class="w-full h-full object-cover"
                          />
                        {:else}
                          <div class="w-full h-full flex items-center justify-center text-xl">
                            {getCategoryEmoji(item.category)}
                          </div>
                        {/if}
                      </div>
                      
                      <!-- Description -->
                      <div class="flex-1">
                        <div class="flex items-center flex-wrap">
                          <h3 class="text-base font-medium text-stone-800">{item.name}</h3>
                          {#if item.outOfStock}
                            <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-500">
                              Sold Out
                            </span>
                          {/if}
                        </div>
                        <p class="text-sm text-stone-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      
                      <!-- Price -->
                      <div class="ml-3 text-base font-medium text-stone-800 flex-shrink-0 pl-2">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  {/each}
                {:else}
                  <div class="text-center py-12 text-stone-400">
                    No items on this page
                  </div>
                {/if}
              </div>
            </div>
          {/key}
        </div>
        
        <!-- Page Number Indicator -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <div class="inline-flex items-center gap-4">
            <button 
              class="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
              on:click={() => flipPage('prev')}
              disabled={currentPage === 1 || isFlipping}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span class="text-xs text-stone-500 font-serif">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              class="text-stone-400 hover:text-stone-600 disabled:cursor-not-allowed"
              on:click={() => flipPage('next')}
              disabled={currentPage === totalPages || isFlipping}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Page Turn Animation Overlay -->
        {#if isFlipping}
          <div 
            class="absolute inset-0 bg-black bg-opacity-5 z-10"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}
          ></div>
        {/if}
      </div>
      
      <!-- Book Footer -->
      <div class="border-t border-stone-100 p-3 text-center text-xs text-stone-500">
        <p>All prices include applicable taxes</p>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-8 text-center text-stone-500 text-xs">
      <p>© {new Date().getFullYear()} Time Pass Cafe. All rights reserved.</p>
    </footer>
  </div>
</div>

<style>
  /* Add subtle paper texture */
  .bg-stone-50 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a8a29e' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>