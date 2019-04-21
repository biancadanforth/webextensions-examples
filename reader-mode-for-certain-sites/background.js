(async function main() {

  // Workaround to avoid using Babel for now
  const config = (await import('./config.js')).default;

  // Should be an array of match patterns (strings)
  let domainList = await browser.storage.local.get("domainList").domainList || [];

  function switchToReaderMode(tabId, changeInfo, tabInfo) {
    if (tabInfo.isArticle && !tabInfo.isInReaderMode) {
      browser.tabs.toggleReaderMode(tabId);
    }
  }

  function handleChange(changes, areaName) {
    if (areaName !== 'local') return;
    for (const key in config) {
      if (!changes[key]) continue;
      const {oldValue} = changes[key];
      const {newValue} = changes[key];
      if (oldValue !== newValue) {
        switch (key) {
          case 'domainList':
            domainList = newValue;
            if (domainList.length > 0 && !browser.tabs.onUpdated.hasListener(switchToReaderMode)) {
              browser.tabs.onUpdated.addListener(switchToReaderMode, {urls: domainList, properties: ["isArticle"]});
            } else {
              // We don't need a listener if there are no domains in our domain list
              browser.tabs.onUpdated.removeListener(switchToReaderMode);
            }
            break;
          default:
            console.warn(`Unrecognized config key ${key}.`);
            break;
        }
      }
    }
  }
  
  function handleClick() {
    browser.runtime.openOptionsPage();
  }
  
  if (domainList.length > 0) {
    browser.tabs.onUpdated.addListener(switchToReaderMode, {urls: domainList, properties: ["isArticle"]});
  }
  browser.storage.onChanged.addListener(handleChange);
  browser.browserAction.onClicked.addListener(handleClick);
}());
