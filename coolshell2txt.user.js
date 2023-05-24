// ==UserScript==
// @name         CoolShell2txt
// @namespace    https://github.com/brucederekhans/coolshell2txt
// @version      0.15
// @description  save an article in coolshell.cn as text file
// @author       brucederekhans
// @match        *://coolshell.cn/articles/*.html
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let anchorsContainerElement = document.createElement("div");
    anchorsContainerElement.style.display = "flex";
    anchorsContainerElement.style.justifyContent = "flex-end";
    anchorsContainerElement.style.padding = "0 4em";
    document.querySelector(".post-content").insertBefore(anchorsContainerElement, document.querySelector(".entry-content"));

    let lastChildDiv1TextContent = document.querySelector(".entry-content > div:nth-last-child(1)").textContent;
    let lastChildDiv2TextContent = document.querySelector(".entry-content > div:nth-last-child(2)").textContent;
    let lastChildDiv3TextContent = document.querySelector(".entry-content > div:nth-last-child(3)").textContent;
    let textContent = document.querySelector(".entry-content").textContent
        .replace(lastChildDiv1TextContent, "")
        .replace(lastChildDiv2TextContent, "")
        .replace(lastChildDiv3TextContent, "");
    let title = document.querySelector(".entry-title").textContent;
    let textBlob = new Blob([textContent], {type:"text/plain"});
    let textAnchorElement = document.createElement("a");
    textAnchorElement.href = URL.createObjectURL(textBlob);
    textAnchorElement.download = title;
    textAnchorElement.textContent = "save as text";
    textAnchorElement.style.margin = "3vh";
    textAnchorElement.style.padding = "2vh";
    textAnchorElement.style.fontSize = "5vh";
    textAnchorElement.style.border = "2px solid";
    anchorsContainerElement.appendChild(textAnchorElement);

    let markdownAnchorElement = document.createElement("a");
    markdownAnchorElement.textContent = "fetching markdown";
    markdownAnchorElement.style.margin = "3vh";
    markdownAnchorElement.style.padding = "2vh";
    markdownAnchorElement.style.fontSize = "5vh";
    markdownAnchorElement.style.border = "2px solid";
    anchorsContainerElement.appendChild(markdownAnchorElement);
    let turndownService = new TurndownService();
    turndownService.addRule('deleteLastChildDivs', {
        filter: (node) => ( (node.id === "wp_rp_first") || node.classList.contains("post-ratings") || node.classList.contains("post-ratings-loading") ),
        replacement: () => ""
    });
    turndownService.addRule('backquoteCodeBlocks', {
        filter: (node) => node.classList.contains("EnlighterJSRAW"),
        replacement: (content, node) => ("```" + node.dataset.enlighterLanguage + "\n" + node.textContent + "\n```")
    });
    let markdown = turndownService.turndown(document.querySelector(".entry-content").innerHTML);
    let matchResults = [...markdown.matchAll(/!\[(.*?)\]\((.+?(\.(\w+))?)\)/g)];
    let imageElement = new Image();
    imageElement.crossOrigin = "anonymous";
    let canvasElement = document.createElement("canvas");
    let context = canvasElement.getContext("2d");
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
    queueImagesLoading.finally(() => {
        let markdownBlob = new Blob([markdown], {type:"text/markdown"});
        markdownAnchorElement.href = URL.createObjectURL(markdownBlob);
        markdownAnchorElement.download = title + ".md";
        markdownAnchorElement.textContent = "save as markdown";
    });
})();