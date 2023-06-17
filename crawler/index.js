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

	let retry = 0, retryLimit = 3;
	for(let i = 0; i < articleLinkList.length; i++)
	{
		try
		{
			await page.goto(articleLinkList[i]);
			await page.content();

			let evaluateResult = await page.evaluate(function(){
				let title = document.querySelector(".entry-title").textContent;
				let metaList = document.querySelector(".entry-meta").textContent.split("\n");
				let metaJoined = "发表于" + metaList[1] + "作者 " + metaList[2];

				let imageElement = new Image();
				imageElement.crossOrigin = "anonymous";
				let canvasElement = document.createElement("canvas");
				let context = canvasElement.getContext("2d");

				let queueLoading = new Promise(function(resolve, reject){
					let turndownScriptElement = document.createElement("script");
					turndownScriptElement.addEventListener("load", resolve);
					turndownScriptElement.src = "https://unpkg.com/turndown/dist/turndown.js";
					document.body.appendChild(turndownScriptElement);
				})
				.then(() => {
					let turndownService = new TurndownService();
					turndownService.addRule('deleteElements', {
						filter: (node) => ( (node.id === "wp_rp_first") || node.classList.contains("post-ratings") || node.classList.contains("post-ratings-loading") || node.classList.contains("enlighter-default") ),
						replacement: () => ""
					});
					turndownService.addRule('backquoteCodeBlocks', {
						filter: (node) => node.classList.contains("EnlighterJSRAW"),
						replacement: (content, node) => ("```" + node.dataset.enlighterLanguage + "\n" + node.textContent + "\n```")
					});
					let markdown = "# " + title + "\n\n> " + metaJoined + "\n\n" + turndownService.turndown(document.querySelector(".entry-content").innerHTML);
					let matchResults = [...markdown.matchAll(/!\[(.*?)\]\((.+?(\.(\w+))?)\)/g)];
					let queueImagesLoading = Promise.resolve();
					matchResults.forEach(function(matchResult){
						queueImagesLoading = queueImagesLoading.then(() => new Promise(function(resolve, reject){
							imageElement.src = matchResult[2];
							imageElement.onload = resolve;
							imageElement.onerror = reject;
						})
						.then(() => {
							canvasElement.width = imageElement.width;
							canvasElement.height = imageElement.height;
							context.drawImage(imageElement, 0, 0);
							markdown = markdown.replaceAll(matchResult[0], "![" + matchResult[1] + "](" + canvasElement.toDataURL(((extension) => {
								switch(extension.toLowerCase()){
									case "avif":
										return "image/avif";
									case "bmp":
										return "image/bmp";
									case "ico":
										return "image/vnd.microsoft.icon";
									case "svg":
										return "image/svg+xml";
									case "tif":
									case "tiff":
										return "image/tiff";
									case "jpg":
									case "jpeg":
										return "image/jpeg";
									case "gif":
										return "image/gif";
									case "webp":
										return "image/webp";
									case "png":
									default:
										return "image/png";
								}
							})(matchResult[4])) + ")");
						})
						.catch(() => undefined));
					});
					return queueImagesLoading.then(() => ({title, markdown}));
				});
				return queueLoading;
			});
			fs.writeFileSync((evaluateResult.title + ".md").replaceAll(/[<>:"/\\|?*]/g, "_"), evaluateResult.markdown);
			retry = 0;
		}
		catch(e)
		{
			retry++;
			if(retry < 3)
			{
				i--;
			}
			else
			{
				retry = 0;
			}
		}
	}

	await browser.close();
})();