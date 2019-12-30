// Open an extension page in a new tab to make use of the Browser Content Toolbox
// to be able to debug the storage actor script:
// (mozilla-central/devtools/server/actors/storage.js)
// Useful for debugging storage actor when we have no background page (or remove
// it temporarily)
browser.tabs.create({url: browser.extension.getURL('extension-page.html')});

(async function main() {
  const supportedIDBData = {  
    // undef: undefined,
    null: null,
    bool: true,
    num: 4,
    str: "hi",
    // bigint: 1n,
    // date: new Date(0),
    // regexp: /regexp/,
    obj: {a: 123},
    arr: [1, 2],
    // No idea how to stringify the types of values below for displaying in the storage panel,
    // but they are supported by the WE storage API.
    // arrBuffer: new ArrayBuffer(8),
    // map: (new Map()).set("a", "b"),
    // "set": (new Set()).add(1).add("a"),
  };


  await browser.storage.local.set(supportedIDBData);

  const data = await browser.storage.local.get();
  for (const [key, value] of Object.entries(data)) {
    console.log(key, value, typeof value);
  }
})();