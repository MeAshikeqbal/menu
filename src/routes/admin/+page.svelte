<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  
  export let data: PageData;
  export let form;
  
  let categories = ['Starters', 'Main', 'Sides', 'Desserts'];
  let imagePreview: string | null = null;
  
  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Create a preview URL
      imagePreview = URL.createObjectURL(file);
    } else {
      imagePreview = null;
    }
  }
</script>

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Menu Admin</h1>
    
    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Menu Item</h2>
      
      <form method="POST" use:enhance enctype="multipart/form-data">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              step="0.01" 
              min="0" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              id="category" 
              name="category" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label for="pageNumber" class="block text-sm font-medium text-gray-700 mb-1">Page Number</label>
            <input 
              type="number" 
              id="pageNumber" 
              name="pageNumber" 
              min="1" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <!-- Image Upload Field -->
          <div class="md:col-span-2">
            <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
            <input 
              type="file" 
              id="image" 
              name="image" 
              accept="image/*"
              on:change={handleImageChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            
            {#if imagePreview}
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-1">Preview:</p>
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" class="h-40 w-auto object-cover rounded-md border border-gray-300" />
              </div>
            {/if}
          </div>
          
          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Add Menu Item
          </button>
        </div>
      </form>
      
      {#if form?.success}
        <div class="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Menu item added successfully!
        </div>
      {/if}
      
      {#if form?.error}
        <div class="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {form.error}
        </div>
      {/if}
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Current Menu Items</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data.menuItems as item}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  {#if item.image}
                    <img src={item.image || "/placeholder.svg"} alt={item.name} class="h-12 w-12 object-cover rounded-md" />
                  {:else}
                    <div class="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pageNumber}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>