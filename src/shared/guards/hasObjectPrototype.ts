// stolen from my friend: stolen from react query: stolen from jonschlinkert/is-plain-object
export function hasObjectPrototype(obj: any): boolean {
	return Object.prototype.toString.call(obj) === '[object Object]';
}
