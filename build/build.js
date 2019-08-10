'use strict';

require('../test/test.js')(async ({ build, 龙腾道, get, map }) => {
	
	const zhs = `返回一个能保证给定对象的属性按此后添加顺序排列的 proxy，即使键名是 symbol，或整数 string。从属于“简计划”。`;
	const en = `Return a proxy for given object, which can guarantee own keys are in setting order, even if the key name is symbol or int string. Belong to "Plan J".`;
	
	await build({
		name: 'j-orderify',
		user: 'LongTengDao@ltd',
		Desc: `
			${zhs}
			${en}`,
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		semver: await get('src/version'),
		ES: 6,
		ESM: true,
		NPM: { description: `${en}／${zhs}` },
		UMD: { main_global: 'Ordered' },
		LICENSE_: true,
	});
	
	await map('docs/README.md', 'dist/NPM/README.md');
	
});
