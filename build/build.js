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
	
	const fs = require('fs');
	const README = Buffer.from(fs.readFileSync(__dirname+'/../docs/README.md', 'utf8').replace(/(\n```+)[^`\r\n]+/g, '$1'), 'utf8');
	const NPM_README = __dirname+'/../dist/NPM/README.md';
	try { if ( fs.readFileSync(NPM_README).equals(README) ) { return; } }
	catch (error) { if ( error.code!=='ENOENT' ) { throw error; } }
	fs.writeFileSync(NPM_README, README);
	
}, () => {}).catch(console.error);
