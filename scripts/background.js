chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
  console.log("Extension installed and badge set to OFF");
});
const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    console.log(prevState);

    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
    console.log(nextState);
    if (nextState === "ON") {
      // Inject the file first
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/buttonClicked.js"],
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["toast.css"],
      });
      //execute the function in the injected file
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (typeof buttonClicked === "function") {
            buttonClicked();
          }
        },
      });
    }
  }
  // open a new tab if not on extensions or webstore pages
  else chrome.tabs.create({ url: extensions });
});
