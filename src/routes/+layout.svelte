<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

<svelte:head>
  <title>Time Pass Cafe - Menu</title>
  <meta name="description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  <meta name="keywords" content="cafe, menu, food, drinks, desserts, Time Pass Cafe" />
  <meta property="og:title" content="Time Pass Cafe - Menu" />
  <meta property="og:description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Time Pass Cafe - Menu" />
  <meta name="twitter:description" content="Explore our delicious menu at Time Pass Cafe. We offer a variety of dishes, desserts, and beverages." />
  <link rel="canonical" href="https://menu.timepasscafe.in/" />
</svelte:head>

{@render children()}

