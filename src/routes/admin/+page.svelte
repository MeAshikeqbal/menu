<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  
  export let data: PageData;
  export let form;
  
  let categories = ['Starters', 'Main', 'Sides', 'Desserts'];
  let imagePreview: string | null = null;
  let showAddForm = false;
  
  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      imagePreview = URL.createObjectURL(file);
    } else {
      imagePreview = null;
    }
  }
  
  function toggleAddForm() {
    showAddForm = !showAddForm;
  }
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-medium text-gray-900">Menu Management</h1>
      <button 
        on:click={toggleAddForm}
        class="px-4 py-2 bg-gray-900 text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 text-sm"
      >
        {showAddForm ? 'Cancel' : '+ Add Item'}
      </button>
    </div>
    
    {#if showAddForm}
      <div class="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
        <form method="POST" action="?/add" use:enhance enctype="multipart/form-data">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                id="category" 
                name="category" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                id="description" 
                name="description" 
                rows="2" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              ></textarea>
            </div>
            
            <!-- Image Upload Field -->
            <div class="md:col-span-2">
              <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
              <div class="flex items-center">
                <input 
                  type="file" 
                  id="image" 
                  name="image" 
                  accept="image/*"
                  on:change={handleImageChange}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
                {#if imagePreview}
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" class="h-12 w-12 ml-2 object-cover rounded-md border border-gray-300" />
                {/if}
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-4 py-2 bg-gray-900 text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 text-sm"
            >
              Save Item
            </button>
          </div>
        </form>
        
        {#if form?.success}
          <div class="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
            Menu item added successfully!
          </div>
        {/if}
        
        {#if form?.error}
          <div class="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            Error: {form.error}
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Menu Items</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data.menuItems as item}
              <tr class={item.outOfStock ? 'bg-gray-50' : ''}>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      {#if item.image}
                        <img src={item.image || "/placeholder.svg"} alt={item.name} class="h-10 w-10 object-cover rounded-md" />
                      {:else}
                        <div class="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      {/if}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{item.name}</div>
                      <div class="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pageNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 py-1 text-xs rounded-full ${item.outOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.outOfStock ? 'Out of Stock' : 'Available'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form method="POST" action="?/toggleStock" class="inline-block" use:enhance>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" class="text-gray-600 hover:text-gray-900 mr-3">
                      {item.outOfStock ? 'Mark Available' : 'Mark Out of Stock'}
                    </button>
                  </form>
                  <form method="POST" action="?/delete" class="inline-block" use:enhance>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" class="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>