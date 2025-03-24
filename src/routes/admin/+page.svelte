<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let form;

  let categories = ["Starters", "Main", "Sides", "Desserts"];
  let imagePreview: string | null = null;
  let showAddForm = false;
  let showEditForm = false;
  let editingItem: any = null;
  let confirmDeleteId: string | null = null;

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
    if (showAddForm) {
      showEditForm = false;
      editingItem = null;
    }
  }

  function startEdit(item: any) {
    editingItem = { ...item };
    imagePreview = item.image;
    showEditForm = true;
    showAddForm = false;
    // Scroll to the edit form
    setTimeout(() => {
      document
        .getElementById("edit-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function cancelEdit() {
    showEditForm = false;
    editingItem = null;
    imagePreview = null;
  }

  function confirmDelete(id: string) {
    confirmDeleteId = id;
  }

  function cancelDelete() {
    confirmDeleteId = null;
  }
</script>

<div class="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <!-- Header with navigation -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <div>
        <h1 class="text-3xl font-serif text-stone-800">Menu Management</h1>
        <p class="text-stone-500 mt-1">Add, edit, and manage your menu items</p>
      </div>
      <div class="flex gap-3">
        <a
          href="/"
          class="px-4 py-2 border border-stone-300 text-stone-700 rounded-md shadow-sm hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
        >
          View Menu
        </a>
        <a
          href="/logout"
          class="px-4 py-2 border border-stone-300 text-stone-700 rounded-md shadow-sm hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
        >
          Logout
        </a>
        <button
          on:click={toggleAddForm}
          class="px-4 py-2 bg-stone-800 text-white rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>
    </div>

    <!-- Success/Error Messages -->
    {#if form?.success}
      <div
        class="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2 text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Operation completed successfully!
      </div>
    {/if}

    {#if form?.error}
      <div
        class="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        Error: {form.error}
      </div>
    {/if}

    <!-- Add Form -->
    {#if showAddForm}
      <div
        class="bg-white shadow-md rounded-lg p-6 mb-8 border border-stone-200"
      >
        <h3 class="text-xl font-medium text-stone-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2 text-stone-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Add New Menu Item
        </h3>
        <form
          method="POST"
          action="?/add"
          use:enhance
          enctype="multipart/form-data"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Item Name</label
              >
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g. Margherita Pizza"
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div>
              <label
                for="price"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Price ($)</label
              >
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div>
              <label
                for="category"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Category</label
              >
              <select
                id="category"
                name="category"
                required
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              >
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>

            <div>
              <label
                for="pageNumber"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Page Number</label
              >
              <input
                type="number"
                id="pageNumber"
                name="pageNumber"
                min="1"
                required
                placeholder="1"
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div class="md:col-span-2">
              <label
                for="description"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Description</label
              >
              <textarea
                id="description"
                name="description"
                rows="2"
                placeholder="Brief description of the item..."
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              ></textarea>
            </div>

            <!-- Image Upload Field -->
            <div class="md:col-span-2">
              <label
                for="image"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Food Image</label
              >
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <div class="flex-1 w-full">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    on:change={handleImageChange}
                    class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
                  />
                  <p class="mt-1 text-xs text-stone-500">
                    Recommended size: 400x400px, max 2MB
                  </p>
                </div>
                {#if imagePreview}
                  <div class="flex-shrink-0 relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      class="h-16 w-16 object-cover rounded-md border border-stone-300"
                    />
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              on:click={toggleAddForm}
              class="px-4 py-2 border border-stone-300 text-stone-700 rounded-md shadow-sm hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-stone-800 text-white rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Edit Form -->
    {#if showEditForm && editingItem}
      <div
        id="edit-form"
        class="bg-white shadow-md rounded-lg p-6 mb-8 border border-stone-200"
      >
        <h3 class="text-xl font-medium text-stone-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2 text-stone-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
          Edit Menu Item
        </h3>
        <form
          method="POST"
          action="?/edit"
          use:enhance
          enctype="multipart/form-data"
        >
          <input type="hidden" name="id" value={editingItem.id} />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                for="edit-name"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Item Name</label
              >
              <input
                type="text"
                id="edit-name"
                name="name"
                required
                value={editingItem.name}
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div>
              <label
                for="edit-price"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Price ($)</label
              >
              <input
                type="number"
                id="edit-price"
                name="price"
                step="0.01"
                min="0"
                required
                value={editingItem.price}
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div>
              <label
                for="edit-category"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Category</label
              >
              <select
                id="edit-category"
                name="category"
                required
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              >
                {#each categories as category}
                  <option
                    value={category}
                    selected={editingItem.category === category}
                    >{category}</option
                  >
                {/each}
              </select>
            </div>

            <div>
              <label
                for="edit-pageNumber"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Page Number</label
              >
              <input
                type="number"
                id="edit-pageNumber"
                name="pageNumber"
                min="1"
                required
                value={editingItem.pageNumber}
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
              />
            </div>

            <div class="md:col-span-2">
              <label
                for="edit-description"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Description</label
              >
              <textarea
                id="edit-description"
                name="description"
                rows="2"
                class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
                >{editingItem.description}</textarea
              >
            </div>

            <!-- Image Upload Field -->
            <div class="md:col-span-2">
              <label
                for="edit-image"
                class="block text-sm font-medium text-stone-700 mb-1"
                >Food Image</label
              >
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <div class="flex-1 w-full">
                  <input
                    type="file"
                    id="edit-image"
                    name="image"
                    accept="image/*"
                    on:change={handleImageChange}
                    class="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-stone-500 focus:border-stone-500 text-stone-800"
                  />
                  <div class="mt-1 text-xs text-stone-500">
                    {#if editingItem.image}
                      <p>
                        Current image will be kept if no new image is uploaded
                      </p>
                    {:else}
                      <p>No current image</p>
                    {/if}
                  </div>
                </div>
                {#if imagePreview}
                  <div class="flex-shrink-0 relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      class="h-16 w-16 object-cover rounded-md border border-stone-300"
                    />
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              on:click={cancelEdit}
              class="px-4 py-2 border border-stone-300 text-stone-700 rounded-md shadow-sm hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-stone-800 text-white rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Menu Items Table -->
    <div
      class="bg-white shadow-md rounded-lg border border-stone-200 overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-stone-200 flex justify-between items-center"
      >
        <h2 class="text-xl font-medium text-stone-800">Menu Items</h2>
        <div class="text-sm text-stone-500">{data.menuItems.length} items</div>
      </div>

      {#if data.menuItems.length === 0}
        <div class="p-8 text-center text-stone-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-stone-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p>No menu items found. Add your first item to get started.</p>
          <button
            on:click={toggleAddForm}
            class="mt-4 px-4 py-2 bg-stone-800 text-white rounded-md shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 text-sm transition-colors"
          >
            + Add Item
          </button>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-stone-200">
            <thead class="bg-stone-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Item</th
                >
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Price</th
                >
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Category</th
                >
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Page</th
                >
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Status</th
                >
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider"
                  >Actions</th
                >
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-stone-200">
              {#each data.menuItems as item}
                <tr class={item.outOfStock ? "bg-stone-50" : ""}>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0">
                        {#if item.image}
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            class="h-12 w-12 object-cover rounded-md border border-stone-200"
                          />
                        {:else}
                          <div
                            class="h-12 w-12 bg-stone-100 rounded-md flex items-center justify-center text-stone-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        {/if}
                      </div>
                      <div class="ml-4">
                        <div
                          class="text-sm font-medium text-stone-800 {item.outOfStock
                            ? 'line-through opacity-70'
                            : ''}"
                        >
                          {item.name}
                        </div>
                        <div class="text-xs text-stone-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-stone-500 {item.outOfStock
                      ? 'line-through opacity-70'
                      : ''}">${item.price.toFixed(2)}</td
                  >
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-800"
                    >
                      {item.category}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-stone-500"
                    >{item.pageNumber}</td
                  >
                  <td class="px-6 py-4">
                    <span
                      class={`px-2 py-1 text-xs rounded-full ${item.outOfStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {item.outOfStock ? "Out of Stock" : "Available"}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        type="button"
                        on:click={() => startEdit(item)}
                        class="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors"
                        title="Edit item"
                        aria-label="Edit item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <form
                        method="POST"
                        action="?/toggleStock"
                        class="inline-block"
                        use:enhance
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          class={`hover:bg-${item.outOfStock ? "green" : "amber"}-50 p-1 rounded transition-colors ${item.outOfStock ? "text-green-600 hover:text-green-900" : "text-amber-600 hover:text-amber-900"}`}
                          title={item.outOfStock
                            ? "Mark as available"
                            : "Mark as out of stock"}
                        >
                          {#if item.outOfStock}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          {:else}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          {/if}
                        </button>
                      </form>

                      {#if confirmDeleteId === item.id}
                        <div
                          class="absolute right-16 mt-1 bg-white shadow-lg rounded-md border border-stone-200 p-3 z-10"
                        >
                          <p class="text-sm text-stone-700 mb-2">
                            Delete this item?
                          </p>
                          <div class="flex gap-2">
                            <button
                              type="button"
                              on:click={cancelDelete}
                              class="px-2 py-1 text-xs border border-stone-300 text-stone-700 rounded hover:bg-stone-100"
                            >
                              Cancel
                            </button>
                            <form method="POST" action="?/delete" use:enhance>
                              <input type="hidden" name="id" value={item.id} />
                              <button
                                type="submit"
                                class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </div>
                      {/if}

                      <button
                        type="button"
                        on:click={() => confirmDelete(item.id)}
                        class="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Delete item"
                        aria-label="Delete item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
