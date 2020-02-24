// Test to see if we can access IDB data from a content script
(async function main() {
  const dbName = "Bug1292234IndexedDB";

  var db;
  var request = await indexedDB.open(dbName, 4);
  console.log(request);
  
  request.onerror = function(event) {
    throw new Error(`${request.errorCode}`);
  };
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log(db);
    try {
      var transaction = db.transaction(["customers"]);
    } catch (error) {
      console.log(error); // DOMException: "The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened."
    }
    // var objectStore = transaction.objectStore("customers");
    // console.log(objectStore);
    // var getRequest = objectStore.get("444-44-4444");
    // getRequest.onerror = function(event) {
    //   // Handle errors!
    //   console.log("error");
    // };
    // getRequest.onsuccess = function(event) {
    //   // Do something with the request.result!
    //   console.log("Name for SSN 444-44-4444 is " + getRequest.result.name);
    // };
  };
})();