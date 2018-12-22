'use strict';

require('../test/test.js')(async ({ build, read, copy }) => {
	
	await build({
		name: 'j-orderify',
		Name: '@ltd/j-orderify',
		Desc: `
			返回一个可以保证给定对象的自有属性按照此后添加的顺序排列的 proxy，即便键名是 symbol，或整数式 string。
			Return a proxy for the given object, which can guarantee the own keys are in setting order, even if the key name is a symbol or an integer-form string.`,
		semver: await read('src/version'),
		ES: 6,
		ESM: true,
		NPM: {
			meta_: {
				description: 'Return a proxy for the given object, which can guarantee the own keys are in setting order, even if the key name is a symbol or an integer-form string.／返回一个可以保证给定对象的自有属性按照此后添加的顺序排列的 proxy，即便键名是 symbol，或整数式 string。',
			}
		},
	});
	
	await copy(
		'docs/README.md',
		string => string.replace(/(\n```+)[^`\r\n]+/g, '$1'),
		'dist/NPM/README.md',
	);
	
});
