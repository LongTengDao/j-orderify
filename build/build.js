'use strict';

require('../test/test.js')(async ({ build, read, copy }) => {
	
	await build({
		name: 'j-orderify',
		Name: '@ltd/j-orderify',
		Desc: `
			返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。
			Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.`,
		semver: await read('src/version'),
		ES: 6,
		ESM: true,
		NPM: {
			meta_: {
				description: 'Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string.／返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。',
			}
		},
	});
	
	await copy(
		'docs/README.md',
		string => string.replace(/(\n```+)[^`\r\n]+/g, '$1'),
		'dist/NPM/README.md',
	);
	
});
