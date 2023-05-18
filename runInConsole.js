let lastChildDiv1TextContent = document.querySelector(".entry-content > div:nth-last-child(1)").textContent;
let lastChildDiv2TextContent = document.querySelector(".entry-content > div:nth-last-child(2)").textContent;
let lastChildDiv3TextContent = document.querySelector(".entry-content > div:nth-last-child(3)").textContent;
let textContent = document.querySelector(".entry-content").textContent
    .replace(lastChildDiv1TextContent, "")
    .replace(lastChildDiv2TextContent, "")
    .replace(lastChildDiv3TextContent, "");
let title = document.querySelector(".entry-title").textContent;
let blob = new Blob([textContent], {type:"text/plain"});
let anchorElement = document.createElement("a");
anchorElement.href = URL.createObjectURL(blob);
anchorElement.download = title;
anchorElement.textContent = "save as";
document.querySelector(".post-content").insertBefore(anchorElement, document.querySelector(".entry-content"));
anchorElement.click();