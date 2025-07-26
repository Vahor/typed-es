export interface LibNameOptions {
	/**
	 * Use JSDoc to document each option
	 *
	 * @default "some-value"
	 */
	options?: unknown;
}

export function superTool(options: LibNameOptions) {
	console.log("Hello world!");
}
