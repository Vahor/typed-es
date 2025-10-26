export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type PrettyArray<T> = Array<Prettify<T>>;

// https://stackoverflow.com/a/73641837/12903953
export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? Prettify<I>
	: never;

export type IsNever<T> = [T] extends [never] ? true : false;

export type GetField<
	T extends Record<string, unknown>,
	Key extends string,
> = Key extends keyof T ? T[Key] : never;

export type IsNumericLiteral<T> = T extends number
	? number extends T
		? false // it's just "number"
		: true // it's a literal
	: false;

export type IsFloatLiteral<T> = IsNumericLiteral<T> extends true
	? T extends number // only here to make type narrowing work
		? `${T}` extends `${string}.${string}`
			? true
			: false
		: false
	: false;

export type IsStringLiteral<T> = T extends string
	? string extends T
		? false // it's just "string"
		: true // it's a literal
	: false;

export type AnyString = string & {};

export type OrLowercase<T extends string> = Lowercase<T> | T;

export type ToString<T> = T extends string | number | boolean | undefined | null
	? `${T}`
	: T extends Function
		? "function"
		: T extends Array<any>
			? `Array`
			: T extends object
				? "object"
				: T extends any
					? "any"
					: "unknown";

export type IsSomeSortOf<T, U, AllowNever = true> = IsNever<T> extends true
	? AllowNever
	: T extends U
		? true
		: U extends T
			? true
			: false;

export type ToDecimal<N> = IsFloatLiteral<N> extends true
	? ToString<N>
	: IsNumericLiteral<N> extends true
		? `${ToString<N>}.0`
		: never;

export type Enumerate<T extends number, Acc extends number[] = []> = T extends 0
	? Acc
	: Acc["length"] extends T
		? Acc[number]
		: Enumerate<T, [...Acc, Acc["length"]]>;

export type RangeInclusive<T extends number, U extends number> =
	| U
	| Exclude<Enumerate<U>, Enumerate<T>>;

export type AtLeastOneOf<
	T,
	Keys extends keyof T = keyof T,
> = Keys extends unknown
	? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
	: never;

export type Ipv4 = `${number}.${number}.${number}.${number}`;
export type CidrIpv4<T extends number = number> = `${Ipv4}/${T}`;
export type Ipv6 = string;
export type CidrIpv6<T extends number = number> = `${Ipv6}/${T}`;

export type KeyedArrayToObject<O> = O extends readonly { key: string }[]
	? {
			[K in O[number] as K["key"]]: Omit<K, "key">;
		}
	: never;

export type And<A, B> = A extends true
	? B extends true
		? true
		: false
	: false;

export type Not<A> = A extends true ? false : true;

export type AtMostN<T, N extends number, R extends unknown[] = []> =
	| R
	| (R["length"] extends N ? never : AtMostN<T, N, [T, ...R]>);

// biome-ignore format: formatting this will be ugly
type CharCode<C extends string> = 
  C extends "0" ? 48 : C extends "1" ? 49 : C extends "2" ? 50 : C extends "3" ? 51 :
  C extends "4" ? 52 : C extends "5" ? 53 : C extends "6" ? 54 : C extends "7" ? 55 :
  C extends "8" ? 56 : C extends "9" ? 57 :
  C extends "A" ? 65 : C extends "B" ? 66 : C extends "C" ? 67 : C extends "D" ? 68 :
  C extends "E" ? 69 : C extends "F" ? 70 : C extends "G" ? 71 : C extends "H" ? 72 :
  C extends "I" ? 73 : C extends "J" ? 74 : C extends "K" ? 75 : C extends "L" ? 76 :
  C extends "M" ? 77 : C extends "N" ? 78 : C extends "O" ? 79 : C extends "P" ? 80 :
  C extends "Q" ? 81 : C extends "R" ? 82 : C extends "S" ? 83 : C extends "T" ? 84 :
  C extends "U" ? 85 : C extends "V" ? 86 : C extends "W" ? 87 : C extends "X" ? 88 :
  C extends "Y" ? 89 : C extends "Z" ? 90 :
  C extends "a" ? 97 : C extends "b" ? 98 : C extends "c" ? 99 : C extends "d" ? 100 :
  C extends "e" ? 101 : C extends "f" ? 102 : C extends "g" ? 103 : C extends "h" ? 104 :
  C extends "i" ? 105 : C extends "j" ? 106 : C extends "k" ? 107 : C extends "l" ? 108 :
  C extends "m" ? 109 : C extends "n" ? 110 : C extends "o" ? 111 : C extends "p" ? 112 :
  C extends "q" ? 113 : C extends "r" ? 114 : C extends "s" ? 115 : C extends "t" ? 116 :
  C extends "u" ? 117 : C extends "v" ? 118 : C extends "w" ? 119 : C extends "x" ? 120 :
  C extends "y" ? 121 : C extends "z" ? 122 :
  C extends "_" ? 95 : C extends "-" ? 45 : C extends "." ? 46 : C extends "+" ? 43 :
  C extends "=" ? 61 : C extends "!" ? 33 : C extends "@" ? 64 : C extends "#" ? 35 :
  C extends "$" ? 36 : C extends "%" ? 37 : C extends "^" ? 94 : C extends "&" ? 38 :
  C extends "*" ? 42 : C extends "(" ? 40 : C extends ")" ? 41 : C extends "[" ? 91 :
  C extends "]" ? 93 : C extends "{" ? 123 : C extends "}" ? 125 : C extends "|" ? 124 :
  C extends "\\" ? 92 : C extends "/" ? 47 : C extends ":" ? 58 : C extends ";" ? 59 :
  C extends "'" ? 39 : C extends '"' ? 34 : C extends "<" ? 60 : C extends ">" ? 62 :
  C extends "?" ? 63 : C extends "," ? 44 : C extends " " ? 32 : C extends "~" ? 126 :
  C extends "`" ? 96 : 999; // Unknown chars go to end

type LessThan<A extends number, B extends number> = [A, B] extends [B, A]
	? false
	: BuildTuple<A> extends [...BuildTuple<B>, ...any[]]
		? false
		: true;

type BuildTuple<
	N extends number,
	Acc extends unknown[] = [],
> = Acc["length"] extends N ? Acc : BuildTuple<N, [...Acc, unknown]>;

// Compare two strings lexicographically
type CompareStrings<A extends string, B extends string> = A extends B
	? false
	: // Equal strings, not less than
		A extends `${infer AC}${infer AR}`
		? B extends `${infer BC}${infer BR}`
			? CharCode<AC> extends CharCode<BC>
				? CompareStrings<AR, BR> // Same char, continue
				: LessThan<CharCode<AC>, CharCode<BC>> // Different char, compare
			: false // A is longer, not less than
		: true; // A is shorter prefix of B, is less than

export type Combinations<
	T extends string,
	Sep extends string = "",
	U extends string = T,
	Used extends string[] = [],
	LastUsed extends string = "",
> = Used["length"] extends 10
	? string // Prevent infinite recursion
	: T extends any
		? T extends Used[number]
			? never // Already used
			: LastUsed extends ""
				? T | `${T}${Sep}${Combinations<U, Sep, U, [...Used, T], T>}`
				: CompareStrings<LastUsed, T> extends true
					? T | `${T}${Sep}${Combinations<U, Sep, U, [...Used, T], T>}`
					: never
		: never;

type DeepPickOne<
	T,
	Path extends string,
> = Path extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? { [Q in K]: DeepPickOne<T[K], Rest> } // Remove Pick<T, K> &
		: {} & 2
	: Path extends keyof T
		? Pick<T, Path>
		: unknown;

export type DeepPickPaths<T, Paths extends string> = Prettify<
	UnionToIntersection<Paths extends any ? DeepPickOne<T, Paths> : never>
>;
