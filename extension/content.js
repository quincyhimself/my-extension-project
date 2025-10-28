chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "showAnswer") {
    const existing = document.getElementById("answerForMeBox");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "answerForMeBox";
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.backgroundColor = "#000";
    box.style.color = "#fff";
    box.style.padding = "15px";
    box.style.borderRadius = "8px";
    box.style.zIndex = 99999;
    box.style.maxWidth = "400px";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.fontSize = "14px";
    box.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    box.style.whiteSpace = "pre-wrap";

    box.innerText = msg.answer;

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Copy";
    copyBtn.style.marginLeft = "10px";
    copyBtn.style.padding = "3px 8px";
    copyBtn.style.cursor = "pointer";
    copyBtn.onclick = () => navigator.clipboard.writeText(msg.answer);
    box.appendChild(copyBtn);

    // Dismiss button
    const dismissBtn = document.createElement("button");
    dismissBtn.innerText = "×";
    dismissBtn.style.marginLeft = "10px";
    dismissBtn.style.padding = "3px 8px";
    dismissBtn.style.cursor = "pointer";
    dismissBtn.onclick = () => box.remove();
    box.appendChild(dismissBtn);

    document.body.appendChild(box);
  }
});
