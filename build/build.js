'use strict';

require('../test/test.js').then(async () => {
	
	await require('@ltd/j-dev').build({
		ESM: true,
		NPM: {
			'...': {
				description: 'Return a proxy for the given object, which can guarantee the own keys are in setting order, even if the key name is a symbol or an integer-form string.／返回一个可以保证给定对象的自有属性按照此后添加的顺序排列的 proxy，即便键名是 symbol，或整数式 string。',
			}
		},
		name: 'j-orderify',
		Name: '@ltd/j-orderify',
		Desc: `
			返回一个可以保证给定对象的自有属性按照此后添加的顺序排列的 proxy，即便键名是 symbol，或整数式 string。
			Return a proxy for the given object, which can guarantee the own keys are in setting order, even if the key name is a symbol or an integer-form string.`,
		dir: __dirname+'/..',
		semver: '1.0.0',
	});
	
}, () => {}).catch(console.error);
