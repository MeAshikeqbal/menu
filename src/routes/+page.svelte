<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let currentPage = 1;
  let totalPages = 0;
  let menuItemsByPage: Record<number, any[]> = {};
  let isFlipping = false;
  let flipDirection: 'next' | 'prev' = 'next';
  let windowWidth: number;
  let searchQuery = '';
  let filteredItems: any[] = [];
  let activeCategory: string | null = null;
  let allCategories: string[] = [];
  let isSearching = false;
  
  onMount(async () => {
    totalPages = data.totalPages;
    menuItemsByPage = data.menuItemsByPage;
    
    // Extract all unique categories
    const categories = new Set<string>();
    Object.values(menuItemsByPage).flat().forEach(item => {
      if (item.category) categories.add(item.category);
    });
    allCategories = Array.from(categories);
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
      case 'Drinks': return '🥤';
      case 'Hot Beverages': return '☕';
      default: return '🍴';
    }
  }
  
  // Search functionality
  function handleSearch() {
    if (!searchQuery.trim()) {
      isSearching = false;
      return;
    }
    
    isSearching = true;
    const query = searchQuery.toLowerCase();
    filteredItems = Object.values(menuItemsByPage)
      .flat()
      .filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
  }
  
  // Filter by category
  function filterByCategory(category: string) {
    if (activeCategory === category) {
      activeCategory = null;
      isSearching = false;
    } else {
      activeCategory = category;
      isSearching = true;
      filteredItems = Object.values(menuItemsByPage)
        .flat()
        .filter(item => item.category === category);
    }
  }
  
  // Clear search and filters
  function clearSearch() {
    searchQuery = '';
    activeCategory = null;
    isSearching = false;
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
  <div class="w-full max-w-3xl">
    <!-- Book Cover -->
    <div class="relative bg-white shadow-xl rounded-md overflow-hidden border border-stone-200" 
         style="min-height: {windowWidth < 640 ? '500px' : '650px'}; max-width: 800px; margin: 0 auto;">
      
      <!-- Book Header -->
      <div class="border-b border-stone-100 p-4 text-center bg-gradient-to-r from-amber-50 to-stone-50">
        <h1 class="text-3xl font-serif text-stone-800">Time Pass Cafe</h1>
        <p class="text-sm text-stone-500 mt-1">Est. 2024</p>
        
        <!-- Search and Filter -->
        <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <div class="relative w-full max-w-xs">
            <input
              type="text"
              bind:value={searchQuery}
              on:input={handleSearch}
              placeholder="Search menu..."
              class="w-full px-3 py-2 pr-10 text-sm border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
            />
            {#if searchQuery}
              <button 
                on:click={clearSearch}
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            {/if}
          </div>
          
          <!-- Category Pills -->
          <div class="flex flex-wrap justify-center gap-1 mt-2 sm:mt-0">
            {#each allCategories as category}
              <button
                on:click={() => filterByCategory(category)}
                class="px-2 py-1 text-xs rounded-full transition-colors {activeCategory === category ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}"
              >
                {getCategoryEmoji(category)} {category}
              </button>
            {/each}
          </div>
        </div>
      </div>
      
      <!-- Book Content -->
      <div class="relative w-full h-full">
        <!-- Current Page Content -->
        <div class="w-full">
          {#if isSearching}
            <div 
              class="w-full p-6 sm:p-8"
              in:fade={{ duration: 300 }}
            >
              <!-- Search Results Title -->
              <div class="mb-6 pb-2 border-b border-stone-100 flex justify-between items-center">
                <h2 class="text-lg font-serif text-stone-800">
                  {activeCategory ? `${getCategoryEmoji(activeCategory)} ${activeCategory}` : 'Search Results'}
                </h2>
                <button 
                  on:click={clearSearch}
                  class="text-xs px-2 py-1 rounded bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Back to Menu
                </button>
              </div>
              
              <!-- Search Results -->
              <div class="space-y-6">
                {#if filteredItems.length > 0}
                  {#each filteredItems as item, i}
                    <div 
                      class="flex justify-between items-start p-3 rounded-md hover:bg-stone-50 transition-colors"
                      in:scale={{ 
                        duration: 300, 
                        delay: i * 50,
                        easing: elasticOut,
                        start: 0.95
                      }}
                    >
                      <!-- Image (small, shown on all screen sizes) -->
                      <div class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden mr-3 bg-stone-100 shadow-sm">
                        {#if item.image}
                          <img 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            class="w-full h-full object-cover {item.outOfStock ? 'opacity-50 grayscale' : ''}"
                          />
                        {:else}
                          <div class="w-full h-full flex items-center justify-center text-2xl {item.outOfStock ? 'opacity-50' : ''}">
                            {getCategoryEmoji(item.category)}
                          </div>
                        {/if}
                      </div>
                      
                      <!-- Description -->
                      <div class="flex-1 {item.outOfStock ? 'opacity-70' : ''}">
                        <div class="flex items-center flex-wrap gap-1">
                          <h3 class="text-base font-medium text-stone-800 {item.outOfStock ? 'line-through' : ''}">
                            {item.name}
                          </h3>
                          <span class="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-500">
                            {item.category}
                          </span>
                          {#if item.outOfStock}
                            <span class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                              Sold Out
                            </span>
                          {/if}
                        </div>
                        <p class="text-sm text-stone-500 mt-1 line-clamp-2 {item.outOfStock ? 'line-through' : ''}">
                          {item.description}
                        </p>
                      </div>
                      
                      <!-- Price -->
                      <div class="ml-3 text-base font-medium text-stone-800 flex-shrink-0 pl-2 {item.outOfStock ? 'line-through opacity-70' : ''}">
                        ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                  {/each}
                {:else}
                  <div class="text-center py-12 text-stone-400">
                    No items found matching your search
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            {#key currentPage}
              <div 
                class="w-full p-6 sm:p-8"
                in:fade={{ duration: 300 }}
                out:fly={{ x: flipDirection === 'next' ? -100 : 100, duration: 300, opacity: 0 }}
              >
                <!-- Page Title -->
                <div class="mb-6 pb-2 border-b border-stone-100">
                  <h2 class="text-lg font-serif text-stone-800">
                    {`Page ${currentPage}`}
                  </h2>
                </div>
                
                <!-- Menu Items -->
                <div class="space-y-6">
                  {#if menuItemsByPage[currentPage] && menuItemsByPage[currentPage].length > 0}
                    {#each menuItemsByPage[currentPage] as item, i}
                      <div 
                        class="flex justify-between items-start p-3 rounded-md hover:bg-stone-50 transition-colors"
                        in:fade={{ 
                          duration: 300, 
                          delay: i * 100,
                          easing: cubicOut
                        }}
                      >
                        <!-- Image (small, shown on all screen sizes) -->
                        <div class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden mr-3 bg-stone-100 shadow-sm">
                          {#if item.image}
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.name} 
                              class="w-full h-full object-cover {item.outOfStock ? 'opacity-50 grayscale' : ''}"
                              loading="lazy"
                            />
                          {:else}
                            <div class="w-full h-full flex items-center justify-center text-2xl {item.outOfStock ? 'opacity-50' : ''}">
                              {getCategoryEmoji(item.category)}
                            </div>
                          {/if}
                        </div>
                        
                        <!-- Description -->
                        <div class="flex-1 {item.outOfStock ? 'opacity-70' : ''}">
                          <div class="flex items-center flex-wrap gap-1">
                            <h3 class="text-base font-medium text-stone-800 {item.outOfStock ? 'line-through' : ''}">
                              {item.name}
                            </h3>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-500">
                              {item.category}
                            </span>
                            {#if item.outOfStock}
                              <span class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-medium animate-pulse">
                                Sold Out
                              </span>
                            {/if}
                          </div>
                          <p class="text-sm text-stone-500 mt-1 line-clamp-2 {item.outOfStock ? 'line-through' : ''}">
                            {item.description}
                          </p>
                        </div>
                        
                        <!-- Price -->
                        <div class="ml-3 text-base font-medium text-stone-800 flex-shrink-0 pl-2 {item.outOfStock ? 'line-through opacity-70' : ''}">
                          ₹{item.price.toFixed(2)}
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
          {/if}
        </div>
        
        <!-- Page Number Indicator -->
        {#if !isSearching}
          <div class="absolute bottom-4 left-0 right-0 text-center">
            <div class="inline-flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-full shadow-sm">
              <button 
                type="button"
                class="text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                type="button"
                class="text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
        {/if}
      </div>
      
      <!-- Book Footer -->
      <div class="border-t border-stone-100 p-4 text-center text-xs text-stone-500 bg-gradient-to-r from-stone-50 to-amber-50">
        <p>All prices include applicable taxes</p>
        <p class="mt-1">Please inform our staff of any allergies or dietary requirements</p>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-8 text-center text-stone-500 text-xs">
      <p>© {new Date().getFullYear()} Time Pass Cafe. All rights reserved.</p>
      <div class="mt-2 flex justify-center space-x-4">
        <a href="https://www.instagram.com/timepasscafe.in" class="hover:text-amber-600 transition-colors">Instagram</a>
      </div>
    </footer>
  </div>
</div>

<style>
  /* Add subtle paper texture */
  .bg-stone-50 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a8a29e' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-attachment: fixed;
  }
  
  /* Add subtle page curl effect */
  .rounded-md {
    position: relative;
  }
  
  .rounded-md::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 20px 20px;
    border-color: transparent transparent rgba(245, 245, 244, 0.5) transparent;
    pointer-events: none;
  }
  
  /* Improve animation performance */
  .transition-colors {
    will-change: background-color, color;
  }
  
  /* Add animation for sold out badge */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
</style>

