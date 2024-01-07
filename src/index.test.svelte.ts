import { writable, readable } from '$lib/index.js';
import { describe, it, expect } from 'vitest';

describe('Readable', () => {
	it('Can be created', () => {

		const test = writable();

		const state = readable(0);
		expect(state).toHaveProperty('value');
	});

	it('Can be read from', () => {
		const state = readable(0);
		expect(state.value).toBe(0);
	});

	it ('Cannot be written to', () => {
		const state = readable(0);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - this should fail
		expect(() => state.value = 1).toThrowError();
	});

	it('Runs the start/stop notifier once the value is referenced in an effect', async () => {
		let ran = false;

		const state = readable(0, () => {
			 ran = true
		});

		const cleanup = $effect.root(() => {
			$effect(() => {
				state.value;
			});
		});

		await new Promise((resolve) => {
			setTimeout(resolve);
		});

		cleanup();

		expect(ran).toBeTruthy();
	});
});

describe('Writable', () => {
	it('Can be created', () => {
		const state = writable(0);
		expect(state).toHaveProperty('value');
	});

	it('Can be read from', () => {
		const state = writable(0);
		expect(state.value).toBe(0);
	});

	it('Can be written to', () => {
		const state = writable(0);
		state.value = 1;
		expect(state.value).toBe(1);
	});
});
