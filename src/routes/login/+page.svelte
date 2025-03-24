<script lang="ts">
  import { enhance } from '$app/forms';
  
  export let form;
</script>

<div class="min-h-screen flex items-center justify-center bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h1 class="mt-6 text-center text-3xl font-extrabold text-amber-900">Admin Login</h1>
      <p class="mt-2 text-center text-sm text-gray-600">
        Sign in to access the menu management system
      </p>
    </div>
    
    <div class="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
      <form method="POST" use:enhance class="space-y-6">
        {#if form?.error}
          <div class="p-3 bg-red-100 text-red-800 rounded-md">
            {form.error}
          </div>
        {/if}
        
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</div>