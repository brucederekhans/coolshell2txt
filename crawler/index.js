const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch();

	let articleLinkList = [];
	let pageLinkList;

	let page = await browser.newPage();
	page.setDefaultTimeout(300000);
	await page.goto("https://coolshell.cn");
	await page.content();

	await page.waitForSelector(".wp-pagenavi > a.last");
	let lastPageHref = await page.$eval(".wp-pagenavi > a.last", e => e.href);
	if(/https:\/\/coolshell.cn\/page\/(\d+)/.test(lastPageHref))
	{
		let lastPageIndex = parseInt(lastPageHref.match(/https:\/\/coolshell.cn\/page\/(\d+)/)[1]);
		pageLinkList = [...Array(lastPageIndex).keys()].map(x => lastPageHref.replace(/\d+/, x + 1));
	}

	for(let i = 0; i < pageLinkList.length; i++)
	{
		await page.goto(pageLinkList[i]);
		await page.content();
		let articleInPageLinkList = await page.$$eval("article .entry-title > a", arr => arr.map(e => e.href));
		articleLinkList = [...articleLinkList, ...articleInPageLinkList];
	}
	fs.writeFileSync("articleLinkList.txt", JSON.stringify(articleLinkList, null, "\t"));

	await browser.close();
})();