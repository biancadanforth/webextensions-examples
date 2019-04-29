# Test WE for Bug 1292234


## About

This extension is a test extension for providing a patch for [Bug 1292234](https://bugzilla.mozilla.org/show_bug.cgi?id=1292234).

It simply sets some storage values in `browser.storage.local`.

Because I am using this extension to develop the patch for Bug 1292234 landing in Firefox, I have a `web-ext-config.js` file that points to my local build of Firefox.

See the README for the related [Hidden with Options Page extension](https://github.com/biancadanforth/webextensions-examples/tree/master/hidden-with-options-page) for some more context.