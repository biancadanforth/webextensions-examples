# Hidden WE with Options page

This extension is a proof-of-concept for a hidden[1] Mozilla extension to expose the [Options page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages) in `about:debugging` rather than in `about:addons`. See [Motivation](#motivation).

Based largely on the [Favorite Color](https://github.com/mdn/webextensions-examples/tree/master/favourite-colour) example extension. Shows the extension's browserAction badge color and badge text in the about:addons page for the add-on and stores their values in the extension's local storage.

## Demonstrates:

* storing data with storage.local 
* creating an options page and opening it with `runtime.openOptionsPage()`.
* changing and persisting extension state as a result of changes to options in the options page

The Options page form is dynamically generated based on static data provided in `config.js`. For this proof-of-concept, only select boxes are supported, but other types of form elements can work just fine, including text fields or text areas.

Note: `web-ext run` reloads do not clear local storage or have the option to do so currently. See [this issue](https://github.com/mozilla/web-ext/issues/1517). You can clear local storage manually in the add-on debugger console (go to `about:debugging` and click "Debug" for your extension) by entering `browser.storage.local.clear()`.

## Motivation:

For privileged Mozilla extensions, often `Services.prefs` is used as a key-value store for extension-specific configuration. This has happened largely to bootstrap `about:config` into a UI that QA, PMs and other non-developer team members can use to test the extension where configuration choices can persist between browser sessions.

This is problematic for a number of reasons:
* **Performance**: If temporary preferences aren't removed at the end of an experiment, these orphaned preferences can slow down Firefox.
* **Security**: Using preferences for this purpose violates the principles of "least privilege" and "defense in depth". I.e. this use case does not require privileged code. Exposing privileged code unnecessarily increases the attack surface for potential bad actors unnecessarily.
* **User Choice**: It is possible when writing to `Services.prefs` to accidentally modify a user-set preference permanently.
* **Privacy**: Some preferences used in this manner can store sensitive user information that is not cleared when when the user clears their history/private data in `about:preferences`. 
  * Note that the solution presented here does not solve this particular concern, though another solution exists. See [Bug 1528978](https://bugzilla.mozilla.org/show_bug.cgi?id=1528978) for more information.

Virtually all of these risks can be mitigated by providing an alternative UI to `about:config` and using [extension storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage) to persist extension-specific configuration changes rather than preferences. Thankfully, such a UI already exists in extension [Options pages](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages).

What remains to be done is to expose the Mozilla extension's Options page in a restricted manner -- i.e. in a way that QA and other project team members can access it but that the user cannot.

1: Mozilla privileged extensions (e.g. system add-ons, extensions signed with the privileged key) can set `"hidden": true` in `manifest.json` to hide the extension in `about:addons`. This is valuable for extension-based experiments to decouple the purpose of the experiment from its implementation. Hidden extensions can be shown in `about:debugging` by setting the preference `devtools.aboutdebugging.showSystemAddons` to `true`.