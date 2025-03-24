<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  
  export let data;
  export let form: { error: string; message?: string };
  
  // Track login attempts for client-side rate limiting
  let loginAttempts = 0;
  let isSubmitting = false;
  
  // Get the redirect URL from the query string
  $: redirectTo = $page.url.searchParams.get('redirectTo') || '/admin';
  
  function handleEnhance() {
    return ({ result, update }: { result: { type: string }; update: () => void }) => {
      isSubmitting = false;
      
      if (result.type === 'failure') {
        loginAttempts++;
      }
      
      update();
    };
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h1 class="mt-6 text-center text-3xl font-serif font-bold text-stone-800">Time Pass Cafe</h1>
      <p class="mt-2 text-center text-sm text-stone-600">
        Sign in to access the menu management system
      </p>
    </div>
    
    <div class="mt-8 bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-stone-200">
      <form method="POST" use:enhance={handleEnhance} class="space-y-6">
        <!-- CSRF token from the page data -->
        <input type="hidden" name="csrf" value={data.csrf} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        
        {#if form?.error}
          <div class="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-medium">{form.error}</p>
              {#if form.message}
                <p class="text-sm mt-1">{form.message}</p>
              {/if}
            </div>
          </div>
        {/if}
        
        <div>
          <label for="username" class="block text-sm font-medium text-stone-700">Username</label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="appearance-none block w-full pl-10 px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-stone-700">Password</label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none block w-full pl-10 px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loginAttempts >= 5 || isSubmitting}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            on:click={() => isSubmitting = true}
          >
            {#if isSubmitting}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              Sign in
            {/if}
          </button>
        </div>
        
        {#if loginAttempts >= 5}
          <div class="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
            <p>Too many failed login attempts. Please try again later.</p>
          </div>
        {/if}
      </form>
      
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-stone-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-stone-500">Security Notice</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-stone-500 text-center">
          This is a secure login page. Your session will expire after 24 hours of inactivity.
        </p>
      </div>
    </div>
    
    <div class="text-center">
      <a href="/" class="text-sm text-stone-600 hover:text-stone-900 transition-colors">
        ← Return to menu
      </a>
    </div>
  </div>
</div>