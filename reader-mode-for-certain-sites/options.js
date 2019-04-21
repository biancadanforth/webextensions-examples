(async function main() {
  // Workaround to avoid using Babel for now
  const config = {
    domainList: {
      label: "List of domains (one per line) to enable reader mode for: ",
      placeholder: `techcrunch.com
nytimes.com
www.npr.com`,
    },
  };

  const formEle = document.querySelector('form');

  function buildForm() {
    for (const [key, keyConfig] of Object.entries(config)) {
      const labelEle = document.createElement('label');
      labelEle.setAttribute('for', key);
      labelEle.innerText = keyConfig.label;
      formEle.appendChild(labelEle);
      const textAreaEle = document.createElement('textArea');
      textAreaEle.id = key;
      textAreaEle.name = key;
      textAreaEle.rows = "10";
      textAreaEle.cols = "40";
      textAreaEle.style.resize = "none";
      textAreaEle.style.display = "block";
      textAreaEle.placeholder = config[key].placeholder;
      formEle.appendChild(textAreaEle);
    }
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Save';
    formEle.appendChild(submitButton);
  }

  function saveOptions(e) {
    for (const key in config) {
      const newDomainList = (document.querySelector(`#${key}`).value).split(/\n/g);
      // Convert domain names to match patterns for filtering tabs.onUpdated listener
      const matchPatternList = [];
      for (const domain of newDomainList) {
        if (domain !== "") {
          const matchPattern = `*://*.${domain}/*`;
          matchPatternList.push(matchPattern);
        }
      }
      browser.storage.local.set({
        [key]: matchPatternList,
      });
    }
    e.preventDefault();
  }

  async function restoreOptions() {
    for (const [key, keyConfig] of Object.entries(config)) {
      const storageItem = await browser.storage.local.get(key);
      // Convert match patterns to domain names for displaying in the Options page
      // (e.g. "*://*.domain.com/*" becomes "domain.com")
      if (storageItem[key]) {
        let domainList = storageItem[key].map(ele => ele.replace(/\/\*$/, '').replace(/^\*:\/\/\*\./, '')).join('\n');
        document.querySelector(`#${key}`).value = domainList;
      } else {
        document.querySelector(`#${key}`).value = "";
      }
    }
  }

  buildForm();
  document.addEventListener('DOMContentLoaded', restoreOptions);
  formEle.addEventListener('submit', saveOptions);
}());