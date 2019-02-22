import config from './config.js';

(async function main() {

  const formEle = document.querySelector('form');

  function buildForm() {
    for (const [key, keyConfig] of Object.entries(config)) {
      const labelEle = document.createElement('label');
      labelEle.setAttribute('for', key);
      labelEle.innerText = keyConfig.label;
      formEle.appendChild(labelEle);
      const selectEle = document.createElement('select');
      selectEle.id = key;
      formEle.appendChild(selectEle);
      for (const option of keyConfig.options) {
        const optionEle = document.createElement('option');
        optionEle.value = option;
        optionEle.innerText = option;
        selectEle.appendChild(optionEle);
      }
    }
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Save';
    formEle.appendChild(submitButton);
  }

  function saveOptions(e) {
    for (const key in config) {
      browser.storage.local.set({
        [key]: document.querySelector(`#${key}`).value,
      });
    }
    e.preventDefault();
  }

  async function restoreOptions() {
    for (const [key, keyConfig] of Object.entries(config)) {
      const storageItem = await browser.storage.local.get(key);
      // default to first option in config if no user set value in storage
      document.querySelector(`#${key}`).value = storageItem[key] || keyConfig.options[0];
    }
  }

  buildForm();
  document.addEventListener('DOMContentLoaded', restoreOptions);
  formEle.addEventListener('submit', saveOptions);
}());