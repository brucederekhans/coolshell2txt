let styleElement = document.createElement("style");
styleElement.textContent = `
.downloadLinksContainer{
    display: flex;
    justify-content: flex-end;
    padding: 0 4em;
}
.downloadLinksContainer a{
    margin: 1.5vh;
    padding: 1vh;
    font-size: 2.5vh;
    border: 2px solid #607d8b;
    color: #607d8b;
    background-color: #ffffff;
    transition: color, background-color 0.5s;
}
.downloadLinksContainer a:hover{
    color: #ffffff;
    background-color: #607d8b;
}
`;
document.body.appendChild(styleElement);

let anchorsContainerElementTop = document.createElement("div");
anchorsContainerElementTop.classList.add("downloadLinksContainer");
document.querySelector(".post-content").insertBefore(anchorsContainerElementTop, document.querySelector(".entry-content"));

let anchorsContainerElementBottom = document.createElement("div");
anchorsContainerElementBottom.classList.add("downloadLinksContainer");
document.querySelector(".post-content").insertBefore(anchorsContainerElementBottom, document.querySelector(".entry-footer"));

let lastChildDiv1TextContent = document.querySelector(".entry-content > div:nth-last-child(1)").textContent;
let lastChildDiv2TextContent = document.querySelector(".entry-content > div:nth-last-child(2)").textContent;
let lastChildDiv3TextContent = document.querySelector(".entry-content > div:nth-last-child(3)").textContent;
let title = document.querySelector(".entry-title").textContent;
let metaList = document.querySelector(".entry-meta").textContent.split("\n");
let metaJoined = "发表于" + metaList[1] + "作者 " + metaList[2];
let textContent = title + "\n" + metaJoined + "\n" + document.querySelector(".entry-content").textContent
    .replace(lastChildDiv1TextContent, "")
    .replace(lastChildDiv2TextContent, "")
    .replace(lastChildDiv3TextContent, "");
let textBlob = new Blob([textContent], {type:"text/plain"});
let textAnchorElement = document.createElement("a");
textAnchorElement.href = URL.createObjectURL(textBlob);
textAnchorElement.download = title;
textAnchorElement.textContent = "save as text";
anchorsContainerElementTop.appendChild(textAnchorElement);
let textAnchorElementClone = textAnchorElement.cloneNode(true);
anchorsContainerElementBottom.appendChild(textAnchorElementClone);

let markdownAnchorElement = document.createElement("a");
markdownAnchorElement.textContent = "fetching markdown";
anchorsContainerElementTop.appendChild(markdownAnchorElement);
let markdownAnchorElementClone = markdownAnchorElement.cloneNode(true);
anchorsContainerElementBottom.appendChild(markdownAnchorElementClone);
let turndownScriptElement = document.createElement("script");
turndownScriptElement.addEventListener("load", function(){
    let turndownService = new TurndownService();
    turndownService.addRule('deleteLastChildDivs', {
        filter: (node) => ( (node.id === "wp_rp_first") || node.classList.contains("post-ratings") || node.classList.contains("post-ratings-loading") ),
        replacement: () => ""
    });
    turndownService.addRule('backquoteCodeBlocks', {
        filter: (node) => node.classList.contains("EnlighterJSRAW"),
        replacement: (content, node) => ("```" + node.dataset.enlighterLanguage + "\n" + node.textContent + "\n```")
    });
    let markdown = "# " + title + "\n\n> " + metaJoined + "\n\n" + turndownService.turndown(document.querySelector(".entry-content").innerHTML);
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
        markdownAnchorElementClone.href = markdownAnchorElement.href;
        markdownAnchorElementClone.download = markdownAnchorElement.download;
        markdownAnchorElementClone.textContent = markdownAnchorElement.textContent;
    });
});
turndownScriptElement.src = "https://unpkg.com/turndown/dist/turndown.js";
document.body.appendChild(turndownScriptElement);