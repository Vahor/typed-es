export function expectTypeOf<T>() {
	return {
		toEqualTypeOf<_U extends T>() {
			return;
		},
	};
}
