<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	
  // onMount(() => {
  //   // Register service worker
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/service-worker.js')
  //       .then(registration => {
  //         console.log('Service Worker registered with scope:', registration.scope);
  //       })
  //       .catch(error => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   }
  // });
</script>

<svelte:head>
  <title>Time Pass Cafe - Menu</title>
  <meta name="description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  <meta name="keywords" content="cafe, menu, food, drinks, desserts, Time Pass Cafe" />
  
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#F59E0B" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="TP Cafe" />
  
  <!-- Manifest Link -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Favicon and Apple Touch Icons -->
  <link rel="icon" type="image/png" sizes="72x72" href="/icons/icon-72x72.png" />
  <link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48x48.png" />
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  
  <!-- Open Graph and Twitter Tags -->
  <meta property="og:title" content="Time Pass Cafe - Menu" />
  <meta property="og:description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Time Pass Cafe - Menu" />
  <meta name="twitter:description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  
  <link rel="canonical" href="https://menu.timepasscafe.in/" />
</svelte:head>

{@render children()}