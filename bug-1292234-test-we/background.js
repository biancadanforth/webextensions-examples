(async function main() {

  browser.storage.local.set({
    rainbows: "unicorns",
    catgifs: true,
  });

  function handleChange(changes, areaName) {
    if (areaName !== 'local') return;
    console.log("WebExtensionLog::ExtensionLocalStorageChange", changes);
  }
  
  // Add listeners
  browser.storage.onChanged.addListener(handleChange);
}());
