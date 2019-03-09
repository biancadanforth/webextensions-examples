const customerData = [
  { ssn: "666-66-6666", name: "Linda", age: 39, email: "linda@company.com" },
  { ssn: "777-77-7777", name: "Greg", age: 31, email: "greg@home.org" }
];

for (const entry of customerData) {
  browser.storage.local.set({[entry.ssn]: entry});
}
