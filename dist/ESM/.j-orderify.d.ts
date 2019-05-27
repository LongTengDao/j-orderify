export const version :'3.0.0';
export function of<target extends object> (object :target) :target;
export function create<target extends object> (proto :target | null) :target;
export function extend<Target extends { new (...args :any[]) :any }> (Class :Target) :Target;
export default exports;
declare const exports :{
	version :typeof version
	of :typeof of
	create :typeof create
	extend :typeof extend
	default :typeof exports
};