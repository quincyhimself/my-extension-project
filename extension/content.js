// Remove existing box
const existingBox = document.getElementById("answerForMe-box");
if (existingBox) existingBox.remove();

const box = document.createElement("div");
box.id = "answerForMe-box";
box.style.position = "fixed";
box.style.top = "50px";
box.style.right = "20px";
box.style.background = "#000";
box.style.color = "#fff";
box.style.padding = "10px 15px";
box.style.borderRadius = "10px";
box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
box.style.fontFamily = "Arial, sans-serif";
box.style.fontSize = "14px";
box.style.zIndex = 99999;
box.style.maxWidth = "300px";
box.style.whiteSpace = "pre-wrap";
box.style.wordBreak = "break-word";

const answerText = document.createElement("div");
answerText.id = "answerForMe-text";
answerText.textContent = "";
box.appendChild(answerText);

// Copy button
const copyBtn = document.createElement("button");
copyBtn.textContent = "Copy";
copyBtn.style.marginTop = "8px";
copyBtn.style.padding = "4px 8px";
copyBtn.style.background = "#333";
copyBtn.style.color = "#fff";
copyBtn.style.border = "none";
copyBtn.style.borderRadius = "5px";
copyBtn.style.cursor = "pointer";
copyBtn.onclick = () => navigator.clipboard.writeText(answerText.textContent);
box.appendChild(copyBtn);

// Dismiss button
const dismissBtn = document.createElement("span");
dismissBtn.textContent = "✖";
dismissBtn.style.position = "absolute";
dismissBtn.style.top = "5px";
dismissBtn.style.right = "8px";
dismissBtn.style.cursor = "pointer";
dismissBtn.style.fontWeight = "bold";
dismissBtn.onclick = () => box.remove();
box.appendChild(dismissBtn);

document.body.appendChild(box);

// Listen for messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showAnswer") {
    answerText.textContent = msg.answer;
    box.style.display = "block";
  }
});
