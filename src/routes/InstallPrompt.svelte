<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let deferredPrompt: any = null;
  let showInstallPrompt = false;
  
  onMount(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      // Show the install button
      showInstallPrompt = true;
    });
    
    // Hide the prompt if the app is already installed
    window.addEventListener('appinstalled', () => {
      showInstallPrompt = false;
      deferredPrompt = null;
      console.log('PWA was installed');
    });
  });
  
  // Function to handle the install button click
  function installApp() {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt
      deferredPrompt = null;
      showInstallPrompt = false;
    });
  }
</script>

{#if showInstallPrompt}
  <div 
    class="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-sm p-4 bg-white rounded-lg shadow-lg border border-amber-100 z-40"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
    role="alert"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0 bg-amber-100 rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium text-stone-800">Install Time Pass Cafe Menu</p>
        <p class="text-xs text-stone-500">Add to your home screen for quick access</p>
      </div>
      <div class="flex-shrink-0 flex">
        <button 
          class="mr-2 text-xs px-3 py-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          on:click={installApp}
        >
          Install
        </button>
        <button 
          class="text-xs px-2 py-1.5 text-stone-500 hover:text-stone-700 transition-colors"
          on:click={() => showInstallPrompt = false}
          aria-label="Dismiss"
        >
          Later
        </button>
      </div>
    </div>
  </div>
{/if}