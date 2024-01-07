# svelte-slash-signals

svelte-slash-signals (svelte/signals) is copy of the svelte/store API using the new svelte 5 $state signals instead of the publish/subscribe pattern.

So this:
```js
import { writable } from 'svelte/store';

const store = writable(5);

$store; // 5
```

Becomes:
```js
import { writable } from 'svelte-slash-signals';

const store = writable(5);

store.value; // 5
```