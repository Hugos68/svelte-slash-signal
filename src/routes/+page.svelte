<script>
	import { writable } from "svelte/store";

	const test = writable("test");

	$test;
</script>