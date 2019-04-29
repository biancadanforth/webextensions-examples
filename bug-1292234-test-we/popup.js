// Open an extension page in a new tab to make use of the Browser Content Toolbox
// to be able to debug the storage actor script:
// (mozilla-central/devtools/server/actors/storage.js)
// Useful for debugging storage actor when we have no background page (or remove
// it temporarily)
browser.tabs.create({url: browser.extension.getURL('extension-page.html')});

const customerData = [
  { ssn: "666-66-6666", name: "Linda", age: 39, email: "linda@company.com" },
  { ssn: "777-77-7777", name: "Greg", age: 31, email: "greg@home.org" }
];

for (const entry of customerData) {
  browser.storage.local.set({[entry.ssn]: entry});
}
