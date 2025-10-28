const answerCache = new Map();

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "answerForMe",
      title: "AnswerForMe",
      contexts: ["selection"]
    });
  });
}

chrome.runtime.onInstalled.addListener(createContextMenu);
createContextMenu();

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "answerForMe" && info.selectionText) {
    const question = info.selectionText.trim();

    if (answerCache.has(question)) {
      sendAnswerToTab(tab.id, answerCache.get(question));
      return;
    }

    try {
      const response = await fetch("https://my-extension-project.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      const answerText = data.answer || "No answer.";

      answerCache.set(question, answerText);
      setTimeout(() => answerCache.delete(question), 2 * 60 * 1000);

      sendAnswerToTab(tab.id, answerText);
    } catch (err) {
      console.error("Error fetching answer:", err);
      sendAnswerToTab(tab.id, "Error fetching answer.");
    }
  }
});

function sendAnswerToTab(tabId, answerText) {
  chrome.scripting.executeScript(
    { target: { tabId }, files: ["content.js"] },
    () => {
      chrome.tabs.sendMessage(tabId, { action: "showAnswer", answer: answerText }, () => {});
    }
  );
}
