function noop() {}

export type Updater<T> = (value: T) => T;

export type StartStopNotifier<T> = (
	set: (value: T) => void,
	update: (updater: Updater<T>) => T
) => StopFunction;

export type StopFunction = (() => void) | void;

export function writable<T>(initial_value?: T, start_stop_notifier: StartStopNotifier<T> = noop) {
	let value = $state(initial_value);
	let subscribers = 0;
	let stop: StopFunction | null = null;

	return {
		get value(): T {
			if ($effect.active()) {
				$effect(() => {
					if (subscribers++ === 0) {
						stop = start_stop_notifier(
							(newValue: T) => (this.value = newValue),
							(updater: Updater<T>) => (this.value = updater(this.value))
						);
					}
					return () => {
						queueMicrotask(() => {
							if (--subscribers === 0) {
								stop?.();
								stop = null;
							}
						});
					};
				});
			}
			return value as T;
		},
		set value(new_value: T) {
			if (!safe_not_equal(value, new_value)) {
				return;
			}
			value = new_value;
		},
		update(updater: Updater<T>) {
			this.value = updater(this.value);
		}
	};
}

export function readable<T>(initial_value?: T, start_stop_notifier: StartStopNotifier<T> = noop) {
	const state = writable(initial_value, start_stop_notifier);
	return {
		get value() {
			return state.value;
		}
	};
}

export function safe_not_equal(a: unknown, b: unknown) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
