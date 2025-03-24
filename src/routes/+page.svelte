<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let currentPage = 1;
  let totalPages = 0;
  let menuItemsByPage: Record<number, any[]> = {};
  let isFlipping = false;
  let flipDirection: 'next' | 'prev' = 'next';
  let windowWidth: number;
  
  // Food doodle elements
  const foodDoodles = [
    { icon: '🍔', x: 5, y: 15, size: 24, rotation: 15, delay: 0 },
    { icon: '🍕', x: 85, y: 25, size: 28, rotation: -10, delay: 1 },
    { icon: '🍦', x: 15, y: 75, size: 26, rotation: 5, delay: 2 },
    { icon: '🍗', x: 80, y: 65, size: 22, rotation: -5, delay: 1.5 },
    { icon: '🥗', x: 25, y: 40, size: 24, rotation: 8, delay: 0.5 },
    { icon: '🍹', x: 70, y: 85, size: 26, rotation: -12, delay: 2.5 },
    { icon: '🧁', x: 60, y: 10, size: 20, rotation: 20, delay: 1.8 },
    { icon: '🍣', x: 10, y: 60, size: 22, rotation: -8, delay: 3 }
  ];
  
  onMount(async () => {
    totalPages = data.totalPages;
    menuItemsByPage = data.menuItemsByPage;
    
    // Add animation to food doodles
    const doodles = document.querySelectorAll('.food-doodle');
    doodles.forEach(doodle => {
      animateDoodle(doodle as HTMLElement);
    });
  });
  
  function animateDoodle(element: HTMLElement) {
    const randomX = Math.random() * 20 - 10; // -10 to 10
    const randomY = Math.random() * 20 - 10; // -10 to 10
    const duration = 3000 + Math.random() * 5000; // 3-8 seconds
    
    element.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)` },
        { transform: `translate(${randomX}px, ${randomY}px) rotate(${randomX}deg)` },
        { transform: `translate(0, 0) rotate(0deg)` }
      ],
      {
        duration,
        iterations: Infinity,
        easing: 'ease-in-out'
      }
    );
  }
  
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

<div class="min-h-screen bg-amber-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 overflow-hidden relative">
  <!-- Floating Food Doodles -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    {#each foodDoodles as doodle, i}
      <div 
        class="food-doodle absolute"
        style="left: {doodle.x}%; top: {doodle.y}%; font-size: {doodle.size}px; transform: rotate({doodle.rotation}deg); opacity: 0.6; animation-delay: {doodle.delay}s;"
        in:fade={{ delay: doodle.delay * 500, duration: 1000 }}
      >
        {doodle.icon}
      </div>
    {/each}
  </div>

  <div class="max-w-4xl mx-auto relative z-10">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif text-center mb-4 sm:mb-8 text-amber-900 font-bold">
      <span class="inline-block animate-bounce delay-100">D</span>
      <span class="inline-block animate-bounce delay-200">e</span>
      <span class="inline-block animate-bounce delay-300">l</span>
      <span class="inline-block animate-bounce delay-400">i</span>
      <span class="inline-block animate-bounce delay-500">c</span>
      <span class="inline-block animate-bounce delay-600">i</span>
      <span class="inline-block animate-bounce delay-700">o</span>
      <span class="inline-block animate-bounce delay-800">u</span>
      <span class="inline-block animate-bounce delay-900">s</span>
      <span class="inline-block px-2"></span>
      <span class="inline-block animate-bounce delay-1000">M</span>
      <span class="inline-block animate-bounce delay-1100">e</span>
      <span class="inline-block animate-bounce delay-1200">n</span>
      <span class="inline-block animate-bounce delay-1300">u</span>
    </h1>
    
    <div class="relative bg-white shadow-2xl rounded-xl overflow-hidden border-4 border-amber-200" style="min-height: {windowWidth < 640 ? '450px' : '600px'};">
      <!-- Menu Book -->
      <div class="relative w-full h-full flex justify-center">
        <!-- Page Number Indicator -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <div class="inline-block bg-amber-100 px-4 py-1 rounded-full shadow-md text-amber-800 font-medium">
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {#if menuItemsByPage[currentPage]}
                  {#each menuItemsByPage[currentPage] as item, i}
                    <div 
                      class="border-2 border-amber-200 rounded-xl p-4 bg-amber-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      in:scale={{ 
                        start: 0.95, 
                        duration: 300, 
                        delay: i * 50,
                        easing: cubicOut
                      }}
                    >
                      <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-16 h-16 bg-amber-200 rounded-lg flex items-center justify-center text-2xl">
                          {item.category === 'Main' ? '🍽️' : 
                           item.category === 'Starters' ? '🥗' : 
                           item.category === 'Desserts' ? '🍰' : '🍟'}
                        </div>
                        <div class="flex-1">
                          <h3 class="text-xl font-bold text-amber-900">{item.name}</h3>
                          <p class="text-gray-600 mt-1 text-sm sm:text-base">{item.description}</p>
                          <div class="mt-2 flex justify-between items-center">
                            <span class="text-amber-800 font-bold text-lg">${item.price.toFixed(2)}</span>
                            <span class="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs uppercase tracking-wide">{item.category}</span>
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
          class="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-amber-800 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform duration-200 z-20"
          on:click={() => flipPage('prev')}
          disabled={currentPage === 1 || isFlipping}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          class="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-amber-800 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform duration-200 z-20"
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
    <div class="mt-6 sm:mt-8 bg-white p-4 rounded-xl shadow-lg border-2 border-amber-200">
      <h2 class="text-xl font-bold text-amber-900 mb-2">Menu Categories</h2>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1 shadow-sm">
          🥗 <span>Starters</span>
        </span>
        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1 shadow-sm">
          🍽️ <span>Main</span>
        </span>
        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1 shadow-sm">
          🍟 <span>Sides</span>
        </span>
        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1 shadow-sm">
          🍰 <span>Desserts</span>
        </span>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-8 text-center text-amber-800 text-sm">
      <p>© {new Date().getFullYear()} Delicious Restaurant. All rights reserved.</p>
      <p class="mt-1">Made with ❤️ and fresh ingredients</p>
    </footer>
  </div>
</div>

<style>
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  .food-doodle {
    animation: float 6s ease-in-out infinite;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  }
  
  /* Add animation delays for bounce effect */
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-700 { animation-delay: 0.7s; }
  .delay-800 { animation-delay: 0.8s; }
  .delay-900 { animation-delay: 0.9s; }
  .delay-1000 { animation-delay: 1s; }
  .delay-1100 { animation-delay: 1.1s; }
  .delay-1200 { animation-delay: 1.2s; }
  .delay-1300 { animation-delay: 1.3s; }
</style>