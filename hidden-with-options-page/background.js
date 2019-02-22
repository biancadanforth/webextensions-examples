(async function main() {

  // Workaround to avoid using Babel for now
  const config = (await import('./config.js')).default;

  function handleChange(changes, areaName) {
    if (areaName !== 'local') return;
    for (const key in config) {
      if (!changes[key]) continue;
      const oldVal = changes[key].oldValue;
      const newVal = changes[key].newValue;
      if (oldVal !== newVal) {
        switch (key) {
          case 'badgeColor':
            browser.browserAction.setBadgeBackgroundColor({color: newVal});
            break;
          case 'badgeText':
            browser.browserAction.setBadgeText({text: newVal});
            break;
        }
      }
    }
  }
  
  function handleClick() {
    browser.runtime.openOptionsPage();
  }

  // Initial state
  browser.browserAction.setBadgeBackgroundColor({color: config.badgeColor.options[0]});
  browser.browserAction.setBadgeText({text: config.badgeText.options[0]});
  
  // Add listeners
  browser.storage.onChanged.addListener(handleChange);
  browser.browserAction.onClicked.addListener(handleClick);
}());
