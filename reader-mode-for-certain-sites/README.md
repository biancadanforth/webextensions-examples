# Enable Reader Mode for List of Domains via the Options page

## About

Through the options page on `about:addons`, the user can provide a list of domains in which to enable reader mode on page load in a tab.

## Demonstrates:

* storing data with storage.local 
* creating an options page and opening it with `runtime.openOptionsPage()`.
* changing and persisting extension state as a result of changes to options in the options page

The Options page form is dynamically generated based on static data provided in `config.js`.

The list of domains is specified on the Options page by entering one domain per line in the `textarea` element. For example:
```
npr.org
cnn.com
www.nytimes.com
```

Note: `web-ext run` reloads do not clear local storage or have the option to do so currently. See [this issue](https://github.com/mozilla/web-ext/issues/1517). You can clear local storage manually in the add-on debugger console (go to `about:debugging` and click "Debug" for your extension) by entering `browser.storage.local.clear()`.
