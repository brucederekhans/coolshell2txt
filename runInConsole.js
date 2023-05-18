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