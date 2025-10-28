chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: "answerForMe",
    title: "AnswerForMe",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "answerForMe" && info.selectionText) {
    const question = info.selectionText.trim();

    try {
      const response = await fetch("https://my-extension-project.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      const answerText = data.answer || "No answer.";

      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: ["content.js"] },
        () => {
          chrome.tabs.sendMessage(tab.id, { action: "showAnswer", answer: answerText });
        }
      );
    } catch (err) {
      console.error("Error fetching answer:", err);
    }
  }
});
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: "answerForMe",
    title: "AnswerForMe",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "answerForMe" && info.selectionText) {
    const question = info.selectionText.trim();

    try {
      const response = await fetch("https://my-extension-project.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      const answerText = data.answer || "No answer.";

      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: ["content.js"] },
        () => {
          chrome.tabs.sendMessage(tab.id, { action: "showAnswer", answer: answerText });
        }
      );
    } catch (err) {
      console.error("Error fetching answer:", err);
    }
  }
});
