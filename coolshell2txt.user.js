// ==UserScript==
// @name         CoolShell2txt
// @namespace    https://github.com/brucederekhans/coolshell2txt
// @version      0.5
// @description  save an article in coolshell.cn as text file
// @author       brucederekhans
// @match        *://coolshell.cn/articles/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
    document.querySelector(".post-content").insertBefore(textAnchorElement, document.querySelector(".entry-content"));

    let turndownService = new TurndownService();
    turndownService.addRule('deletelastChildDivs', {
        filter: (node) => ((node.id === "wp_rp_first") || (node.classList.contains("post-ratings")) || (node.classList.contains("post-ratings-loading")) ),
        replacement:() => ""
    });
    let markdown = turndownService.turndown(document.querySelector(".entry-content").innerHTML);
    let markdownBlob = new Blob([markdown], {type:"text/markdown"});
    let markdownAnchorElement = document.createElement("a");
    markdownAnchorElement.href = URL.createObjectURL(markdownBlob);
    markdownAnchorElement.download = title + ".md";
    markdownAnchorElement.textContent = "save as markdown";
    document.querySelector(".post-content").insertBefore(markdownAnchorElement, document.querySelector(".entry-content"));
})();