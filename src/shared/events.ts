export class SimpleEvent<T> {
	private listeners: ((arg: T) => void)[] = [];

	public subscribe(cb: (arg: T) => void) {
		this.listeners.push(cb);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== cb);
		};
	}

	public emit(arg: T) {
		this.listeners.forEach((cb) => cb(arg));
	}
}
