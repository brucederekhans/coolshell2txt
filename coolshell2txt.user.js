// ==UserScript==
// @name         CoolShell2txt
// @namespace    https://github.com/brucederekhans/coolshell2txt
// @version      0.1
// @description  save an article in coolshell.cn as text file
// @author       brucederekhans
// @match        *://coolshell.cn/articles/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let textContent = document.querySelector(".entry-content").textContent;
    let title = document.querySelector(".entry-title").textContent;
    let blob = new Blob([textContent], {type:"text/plain"});
    let anchorElement = document.createElement("a");
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.download = title;
    anchorElement.textContent = "save as";
    document.querySelector(".post-content").insertBefore(anchorElement, document.querySelector(".entry-content"));
})();