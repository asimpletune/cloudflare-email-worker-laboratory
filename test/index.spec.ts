// test/index.spec.ts
// import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
// import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
// const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

import { foldLines, getFoldedHeaderValue } from '../src/util';

describe('Hello World worker', () => {
	// it('responds with Hello World! (unit style)', async () => {
	// 	const request = new IncomingRequest('http://example.com');
	// 	// Create an empty context to pass to `worker.fetch()`.
	// 	const ctx = createExecutionContext();
	// 	const response = await worker.fetch(request, env, ctx);
	// 	// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
	// 	await waitOnExecutionContext(ctx);
	// 	expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	// });

	// it('responds with Hello World! (integration style)', async () => {
	// 	const response = await SELF.fetch('https://example.com');
	// 	expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	// });

	it('should fold lines correctly', () => {
		let message_id = `Message-ID: <PAXP193MB2314C6F90A60DA909597069AA7802@PAXP193MB2314.EURP193.PROD.OUTLOOK.COM>`;
		let folded_message_id = foldLines(message_id, 76, false, false);
		expect(folded_message_id).toBe('Message-ID:\n <PAXP193MB2314C6F90A60DA909597069AA7802@PAXP193MB2314.EURP193.PROD.OUTLOOK.COM>');
		let header_value = getFoldedHeaderValue('Message-ID', folded_message_id);
		expect(header_value).toBe('\n <PAXP193MB2314C6F90A60DA909597069AA7802@PAXP193MB2314.EURP193.PROD.OUTLOOK.COM>');
	});

	it('should be able to get arbitrary headers possible', () => {
		let thread_topic = example_headers.find((header: { key: string; value: string }) => header.key === 'thread-topic');
		expect(thread_topic?.value).toBe('Test r3ply parse');
	});
});

let example_headers = [
	{
		key: 'received',
		value:
			'from EUR05-VI1-obe.outbound.protection.outlook.com (2a01:111:f403:2e13::801) by cloudflare-email.net (unknown) id UFO8pL3RM170 for <parse@r3ply.org>; Sat, 17 Aug 2024 10:40:14 +0000',
	},
	{
		key: 'arc-seal',
		value:
			'i=2; a=rsa-sha256; s=2023; d=cloudflare-email.net; cv=pass; b=UdkDogByS0ot+NnfZvxipwO5rTnPzLbHuoezq6RmEHA7Rzsni8Dh4oB/6x2axZjQW0QYO/IoK qiov+7Veri5FGUOP+7urB//AGDyaTyGBbfEbRMjZhqGxdHTZVCIwKZRezWZAf2qsKV9ty+BUooh hkcOLVPd2eqeeqqzkAHG1pXYOsJ0K0wHhvDb45dC3nQFEcc40OIjbU/XzB6T/ndOMNRQZLxN6pO BwZhtWn3NTgSe/QfQtpGRBl9fN0T54d2mLoWg54C2H48/E3IGliWcrIWV13hoi4I0sh8f83b33O F3go4jz1cEOmtFc6HRdhANxQ/Edl4BM09O8iaIb4eM+w==;',
	},
	{
		key: 'arc-message-signature',
		value:
			'i=2; a=rsa-sha256; s=2023; d=cloudflare-email.net; c=relaxed/relaxed; h=Date:Subject:To:From:reply-to:cc:resent-date:resent-from:resent-to :resent-cc:in-reply-to:references:list-id:list-help:list-unsubscribe :list-subscribe:list-post:list-owner:list-archive; t=1723891215; x=1724496015; bh=7if/akMWWn4j5UGDdfHDwL/IX2Ac4+fh6EqA+VVoC5U=; b=Nl0M8GTo2r 46s5MHpl6bMsFwPIklBuHqYwu4j/r01sukXdpeOT5Q6NW7gjZyOvyIlBKKhBmcJLIjgtXJq0UkJ Pg13mRy2HgO1YZtSJRgWAJ80D7+YMeqGNr4tAkaTFBeGFcuMzf+hld3P1EB8tlS/Btj9O6lpmTr 3PyjMZtEwAnK7b5Vb0T/tSIMZTEbNHkkX9glV8cCdEUHKhL4Ag0psEOmqxcVANVJjv3WBI9yRCa SyF0hp1Tr7sUpJ3pPf8HWXmiimh+QGei8QnNDXN13q7HHqC3iBlyGIU6HYyEpmSrliIW2+qyOvY IbkheMKsANwIO2soszK15GVnNvzeediQ==;',
	},
	{
		key: 'arc-authentication-results',
		value:
			'i=2; mx.cloudflare.net; dkim=pass header.d=outlook.com header.s=selector1 header.b=TVyC8HAT; dmarc=pass header.from=outlook.com policy.dmarc=none; spf=pass (mx.cloudflare.net: domain of postmaster@EUR05-VI1-obe.outbound.protection.outlook.com designates 2a01:111:f403:2e13::801 as permitted sender) smtp.helo=EUR05-VI1-obe.outbound.protection.outlook.com; spf=pass (mx.cloudflare.net: domain of spencerscorcelletti@outlook.com designates 2a01:111:f403:2e13::801 as permitted sender) smtp.mailfrom=spencerscorcelletti@outlook.com; arc=pass smtp.remote-ip=2a01:111:f403:2e13::801',
	},
	{
		key: 'received-spf',
		value:
			'pass (mx.cloudflare.net: domain of spencerscorcelletti@outlook.com designates 2a01:111:f403:2e13::801 as permitted sender) receiver=mx.cloudflare.net; client-ip=2a01:111:f403:2e13::801; envelope-from="spencerscorcelletti@outlook.com"; helo=EUR05-VI1-obe.outbound.protection.outlook.com;',
	},
	{
		key: 'authentication-results',
		value:
			'mx.cloudflare.net; dkim=pass header.d=outlook.com header.s=selector1 header.b=TVyC8HAT; dmarc=pass header.from=outlook.com policy.dmarc=none; spf=pass (mx.cloudflare.net: domain of postmaster@EUR05-VI1-obe.outbound.protection.outlook.com designates 2a01:111:f403:2e13::801 as permitted sender) smtp.helo=EUR05-VI1-obe.outbound.protection.outlook.com; spf=pass (mx.cloudflare.net: domain of spencerscorcelletti@outlook.com designates 2a01:111:f403:2e13::801 as permitted sender) smtp.mailfrom=spencerscorcelletti@outlook.com; arc=pass smtp.remote-ip=2a01:111:f403:2e13::801',
	},
	{
		key: 'arc-seal',
		value:
			'i=1; a=rsa-sha256; s=arcselector10001; d=microsoft.com; cv=none; b=oTYlaf4aJkialEIavBI5I0NXGfz3aJRbUG0O8750QxZfmFNdbdquFpoY148GXlnEM/kHnHNBV3uAD+WyL7stEuHenTb67Z95uwM7KotgV9ujV3GGfxuwyaCnbNmnkyT5TfQYki9mAgIQa1xF1sXahr6gQuM808FyIWQOsp180ZEipVWYY2J2xTc/jcCf3AtO9VsSqaySLr44l3jT3l9SQaH1sXrB56cfxF/TN+iGfHj/hbIPNhUYaETC5N00KHAvnzp3pF1+bNIAasm88kkPsQr2+LHEVrk6ATP3+kkXZli+/+b/0QJ9zE4hDy2aXEDv5klkg2oAeUzU8XhuI52M1Q==',
	},
	{
		key: 'arc-message-signature',
		value:
			'i=1; a=rsa-sha256; c=relaxed/relaxed; d=microsoft.com; s=arcselector10001; h=From:Date:Subject:Message-ID:Content-Type:MIME-Version:X-MS-Exchange-AntiSpam-MessageData-ChunkCount:X-MS-Exchange-AntiSpam-MessageData-0:X-MS-Exchange-AntiSpam-MessageData-1; bh=7if/akMWWn4j5UGDdfHDwL/IX2Ac4+fh6EqA+VVoC5U=; b=bUjqRrMiBg0A7pvlILtcECFHGzGxFfXsQ9grri3HpE8sTwa5RdY8WBt7P06L556H4gfPTjRftL9pycTqBm8QuEr88adH6k3V00sBkUQ8Zxt3j8e//Urrr5FdOIlCnyw8HZjSRHMzai2TKFKixn/HgkeEXEz2wsDgql79/b1UcMZ9TOGDB3Sx20dR8asV55Usx+IiTMf0UODgJ5MP0dYl/wJ1GLl+h7b6Tl1RNq5G9tDlUFbw0NsWtR2+eR0Oe5WK36FHsUYdJgpuVT8hfXCSiswW5aysIMx6Ah7FmBGxsK98VpOTpsCTb4AJfOoFwN2pKLJnDEZTDKSmfmzqMZQnaA==',
	},
	{ key: 'arc-authentication-results', value: 'i=1; mx.microsoft.com 1; spf=none; dmarc=none; dkim=none; arc=none' },
	{
		key: 'dkim-signature',
		value:
			'v=1; a=rsa-sha256; c=relaxed/relaxed; d=outlook.com; s=selector1; h=From:Date:Subject:Message-ID:Content-Type:MIME-Version:X-MS-Exchange-SenderADCheck; bh=7if/akMWWn4j5UGDdfHDwL/IX2Ac4+fh6EqA+VVoC5U=; b=TVyC8HAT5aRl4mfhFlu/0ddnfaEuQHvQAP8acqBoJTBXKG4B2I2hzE3Lg68jX0ytdDWZJCp4cYLD3G2Br0jXZFLn5Hie+JjlURu00vVvwzF/9c8FaPoJ1KpYc8rGys8q0/GqBbnuMMJ9ybjFBADSH7ERDBiQ7EnhecKHGTTlSamYtPMrUgqjGAhMteMHQsPiSqveqt1MmWbZ8WA/6hVmmhYpeeXB9qfwFZJ+WNoLm1gWN+6DcOFjJmbqwkbA7PFN6tCQaZtAFsO3C5IyZ7SWVwY1nQVFpQtQa+Z77lcKElV7o6L7G193czYIcVh14nJhVikiGNRvimz28jeO0Csthg==',
	},
	{
		key: 'received',
		value:
			'from PAXP193MB2314.EURP193.PROD.OUTLOOK.COM (2603:10a6:102:220::21) by AS8P193MB2031.EURP193.PROD.OUTLOOK.COM (2603:10a6:20b:442::14) with Microsoft SMTP Server (version=TLS1_2, cipher=TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384) id 15.20.7875.20; Sat, 17 Aug 2024 10:40:13 +0000',
	},
	{
		key: 'received',
		value:
			'from PAXP193MB2314.EURP193.PROD.OUTLOOK.COM ([fe80::dec8:a739:e833:3040]) by PAXP193MB2314.EURP193.PROD.OUTLOOK.COM ([fe80::dec8:a739:e833:3040%4]) with mapi id 15.20.7849.014; Sat, 17 Aug 2024 10:40:13 +0000',
	},
	{ key: 'from', value: '"spencerscorcelletti@outlook.com" <spencerscorcelletti@outlook.com>' },
	{ key: 'to', value: '"parse@r3ply.org" <parse@r3ply.org>' },
	{ key: 'subject', value: 'Test r3ply parse' },
	{ key: 'thread-topic', value: 'Test r3ply parse' },
	{ key: 'thread-index', value: 'AQHa8JHGON+ZKcvPaUWC7s6ReAs84Q==' },
	{ key: 'date', value: 'Sat, 17 Aug 2024 10:40:13 +0000' },
	{ key: 'message-id', value: '<PAXP193MB231434D11278612B82FDCA10A7822@PAXP193MB2314.EURP193.PROD.OUTLOOK.COM>' },
	{ key: 'accept-language', value: 'en-US' },
	{ key: 'content-language', value: 'en-US' },
	{ key: 'x-ms-has-attach', value: '' },
	{ key: 'x-ms-tnef-correlator', value: '' },
	{ key: 'x-tmn', value: '[cvW1mZ2Vs+sXSJZC+vdSebO3hrO7XZc5]' },
	{ key: 'x-ms-publictraffictype', value: 'Email' },
	{ key: 'x-ms-traffictypediagnostic', value: 'PAXP193MB2314:EE_|AS8P193MB2031:EE_' },
	{ key: 'x-ms-office365-filtering-correlation-id', value: 'fb834f36-240c-4cc3-db36-08dcbea8f9ec' },
	{
		key: 'x-microsoft-antispam',
		value:
			'BCL:0;ARA:14566002|14030799003|15080799003|8060799006|19110799003|461199028|3412199025|440099028|102099032|3420499032|3430499032;',
	},
	{
		key: 'x-microsoft-antispam-message-info',
		value:
			'dXk1UcEJ/SgNdVl/1FyIfqFgVjnYd/LnGGFYeFA0r3p4k0uRf/x5VbWiBZRZR6hHUfxFY2W2jlbc0qbVe12ZOPgImqoN77D2Zx1yscJyPXnq7Dzeo0EFqhu5uaWgYySto9HL/D4jDG5OBlSE6T1DOhpM1UswcIp86+bmpIyE2YlZbdQIsUuN/+xszhAGQc+gli7IahgVu/BlJjoG5bIVBEeOj7iwfHfrJsDF4979zXHOZ0HzlEJH6kAo15xz6UnBxYBOgMCwXsnWLeQz8/bXnxcYtH/z4OJ8yHA7KIRvXKROLDJDwWdnIJ8DYtfS8gQv2NMBd448DTHqiAhXT4FXmkvxkDEWctDFUttsUO4b/DwN4DK5EcVfLdKG9JGrpzgZsgra03qaJ+vyVyJ5t3hTl74JupSvJj3KZJEKrdatBp6JnG/L9KKYKRXXjDAY6mA9O+HOO2kAYsyoNLJUFxKSgCsJ+hYjbMo59wegF8wUBWBmWQimBveCd3x9ZjVYMYS6UIicVcCs5Q3NDm7BazlpADONDQKQCz+qBdIGyZqIBCFdjcGqdLfAVI4RjfJA4pvTJDLgiuHiEX+Vn9jtxGhezSW0Y8Hnh8OC9Qbs/SUV0atOTOpRxeXzsUnleoWJaj1fUzs4qGrCIHU3OPMFSsFB+Gtdbb/Xga5dE6NKeI5AogaFTLJMkqupOmsuzfnMlz9lEiTeG3LhxEdxU9RYqZZPFg==',
	},
	{ key: 'x-ms-exchange-antispam-messagedata-chunkcount', value: '1' },
	{
		key: 'x-ms-exchange-antispam-messagedata-0',
		value:
			'=?us-ascii?Q?ctY37VKaAydlBvQ82rYczfp/Uprm9wfw0qlUY+ZLzl012cTDSAQBk2/hO9NS?= =?us-ascii?Q?e9C30gu2Q6V1+CUQnyycl8JV9RVBKNiOiAw2Z35AspqYGeFox80a8ih+jOta?= =?us-ascii?Q?ANBSTOy6S5mLr37sKzlR+H8XYSYCHyx3JbDIkOawj4/FXnr3PK+EZ/i6NiL5?= =?us-ascii?Q?BNo7Pof1Xs/EdumhS5H6kRBgZh+QigvJGxQt6Zw4wLkbMo9OwQwH43nR6JLI?= =?us-ascii?Q?zWFiY+enUjCR2tGe2i5HODIf6hrQhQV83uumKtQqz92tpH++lmnzzzsd7Fwb?= =?us-ascii?Q?TnOh9KMZaT95G9bo2fBBIGDJLPiOtWz1PZmrHSHEhybo+e9rLGVlpdbr3Yez?= =?us-ascii?Q?aCTr5zjUOhA1kzTJSudXilzOSJ4qUs8dH9lzrwtbR/h12tmn32DJmQLV0HNZ?= =?us-ascii?Q?K3r0zrcoFeZ+hUUpWpnZZU61ubCLW5st5fbjeexMEnSpX5eGY5rbOQo38Wkn?= =?us-ascii?Q?ow1U9YSuUVDSH0dbPTLa4g0jJgpzBL1fNEYOBSI9cYjF4RQoGHGJp0nrygWy?= =?us-ascii?Q?BjwMlwGz6l2WK86K8L+h0M4ESDnLOYLOju30rRcm/iEzYCXivmRv+f5hd/SG?= =?us-ascii?Q?AEL1aYEYpMSXmHNDYH0FC5gNosj7tfWAHTz/wjV9VkHHnjoQnc3hpORdXQUz?= =?us-ascii?Q?SmiM0KqcX2xYcXTZFtFQyp12y2adYoo4PvQkVuj3DmnS74UnbUFRmhAb9UJs?= =?us-ascii?Q?ME0H+795z+2HRM5vmwQdRWMwp/i4o6DlT5Ws3NoAXHUgal8lYMUpiYoViraL?= =?us-ascii?Q?/bT5l2YmZKbhMebvjsCyy0tvq2iNpFYjLHQeztRPZG2NJ3mgBVG2fyzoFpLe?= =?us-ascii?Q?TGTsiu7VTstgjVcNcy9mWYxKGxdFribggTbwvYIpHYrdwnDXR3EPj6Fy54JU?= =?us-ascii?Q?Vs9FIkpdomB8aOspM+IYxnXFAYYlqbOjzirz8OR8wOdY+Xlclq1noAG0WP2g?= =?us-ascii?Q?TQW0FybZ0lJSlgjBfyTT+XNgIncRPowmhBX8UmI/bs1zF0xhm0hAXdPnLH/P?= =?us-ascii?Q?zfrJlpuqqXbsKLxB+GTpM5hNJfL0ntd2i0Ce6wiljCnJwl0SdbhyVfVTtW7+?= =?us-ascii?Q?v4rNt0WOyQuF3tXTb+yol/VyariyDEoEnxX5lHu0Te7nlaZm8ODl8cinGV6k?= =?us-ascii?Q?M1Vo1/JsLMO0hHIBMhnZX63UdURJiGUzmnnph4Ppd4u3PJftSrJTAkELM1N3?= =?us-ascii?Q?8MqHmJub0WTcYm/xHCprwvclFBCpCapkL99khJqk7OHwCI/mbf2Q9TCOqsQ7?= =?us-ascii?Q?apfYg6DB3WggVHmqju+0ZOiB0IiLh8PfQ+texJtbrw=3D=3D?=',
	},
	{ key: 'content-type', value: 'multipart/alternative; boundary="_000_PAXP193MB231434D11278612B82FDCA10A7822PAXP193MB2314EURP_"' },
	{ key: 'mime-version', value: '1.0' },
	{ key: 'x-originatororg', value: 'outlook.com' },
	{ key: 'x-ms-exchange-crosstenant-authas', value: 'Internal' },
	{ key: 'x-ms-exchange-crosstenant-authsource', value: 'PAXP193MB2314.EURP193.PROD.OUTLOOK.COM' },
	{ key: 'x-ms-exchange-crosstenant-rms-persistedconsumerorg', value: '00000000-0000-0000-0000-000000000000' },
	{ key: 'x-ms-exchange-crosstenant-network-message-id', value: 'fb834f36-240c-4cc3-db36-08dcbea8f9ec' },
	{ key: 'x-ms-exchange-crosstenant-originalarrivaltime', value: '17 Aug 2024 10:40:13.6400 (UTC)' },
	{ key: 'x-ms-exchange-crosstenant-fromentityheader', value: 'Hosted' },
	{ key: 'x-ms-exchange-crosstenant-id', value: '84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa' },
	{ key: 'x-ms-exchange-crosstenant-rms-persistedconsumerorg', value: '00000000-0000-0000-0000-000000000000' },
	{ key: 'x-ms-exchange-transport-crosstenantheadersstamped', value: 'AS8P193MB2031' },
];
