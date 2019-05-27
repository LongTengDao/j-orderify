export = exports;
declare const exports :{
	version :'3.0.0'
	of<target extends object> (object :target) :target
	create<target extends object> (proto :target | null) :target
	extend<Target extends { new (...args :any[]) :any }> (Class :Target) :Target
	default :typeof exports
};