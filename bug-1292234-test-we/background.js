(async function main() {

  // This is what our customer data looks like.
  const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
  ];
  
  // Populate extension local storage as similarly as possible to how the
  // same data populates IndexedDB storage
  for (const entry of customerData) {
    browser.storage.local.set({[entry.ssn]: entry});
  }

  // Populate window.indexedDB storage
  // (Put something (e.g. object literal) in window.indexedDB to compare
  // how IndexedDB storage actors access/handle the information, since
  // extension storage is similar (but more restrictive) in terms of
  // acceptable store items.)
  function storeObjectLiteralInIndexedDB() {

    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB.");
    }

    // Open a database
    const dbName = "Bug1292234IndexedDB";

    var db;
    var request = indexedDB.open(dbName, 4);
    request.onerror = function(event) {
      throw new Error(`${request.errorCode}`);
    };
    request.onsuccess = function(event) {
      db = event.target.result;
    };
    // Also fires when a new db is being created.
    request.onupgradeneeded = function(event) {
      var db = event.target.result;

      // 2. Create an object store in the database
      // Create an objectStore to hold information about our customers. We're
      // going to use "ssn" as our key path because it's guaranteed to be
      // unique - or at least that's what I was told during the kickoff meeting.
      var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

      // Create an index to search customers by name. We may have duplicates
      // so we can't use a unique index.
      objectStore.createIndex("name", "name", { unique: false });

      // Create an index to search customers by email. We want to ensure that
      // no two customers have the same email, so use a unique index.
      objectStore.createIndex("email", "email", { unique: true });

      // Wait for the operation to complete by listening to the right kind of
      // DOM event.
      // Use transaction oncomplete to make sure the objectStore creation is 
      // finished before adding data into it.
      objectStore.transaction.oncomplete = function(event) {
        // Store values in the newly created objectStore.
        var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        customerData.forEach((customer) => {
          customerObjectStore.add(customer);
        });
      };
    };
  }

  storeObjectLiteralInIndexedDB();

  function handleChange(changes, areaName) {
    if (areaName !== 'local') return;
    console.log("WebExtensionLog::ExtensionLocalStorageChange", changes);
  }
  
  // Add listeners
  browser.storage.onChanged.addListener(handleChange);
}());
