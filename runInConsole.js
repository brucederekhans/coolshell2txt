let textContent = document.querySelector(".entry-content").textContent;
let title = document.querySelector(".entry-title").textContent;
let blob = new Blob([textContent], {type:"text/plain"});
let anchorElement = document.createElement("a");
anchorElement.href = URL.createObjectURL(blob);
anchorElement.download = title;
anchorElement.click();