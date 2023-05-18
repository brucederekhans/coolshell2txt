// ==UserScript==
// @name         CoolShell2txt
// @namespace    https://github.com/brucederekhans/coolshell2txt
// @version      0.3
// @description  save an article in coolshell.cn as text file
// @author       brucederekhans
// @match        *://coolshell.cn/articles/*
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
    let textblob = new Blob([textContent], {type:"text/plain"});
    let textAnchorElement = document.createElement("a");
    textAnchorElement.href = URL.createObjectURL(textblob);
    textAnchorElement.download = title;
    textAnchorElement.textContent = "save as text";
    document.querySelector(".post-content").insertBefore(textAnchorElement, document.querySelector(".entry-content"));
})();