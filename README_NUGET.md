# Tree.js v0.2.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Tree.js%2C%20a%20free%20JavaScript%data%20tree&url=https://github.com/williamtroup/Tree.js&hashtags=javascript,tree,data)
[![npm](https://img.shields.io/badge/npmjs-v0.2.0-blue)](https://www.npmjs.com/package/jtree.js)
[![nuget](https://img.shields.io/badge/nuget-v0.2.0-purple)](https://www.nuget.org/packages/jTree.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/Tree.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/Tree.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://william-troup.com/)

> 🌲 A lightweight JavaScript library that allows you to create responsive and customizable interactive tree diagrams from an array of JS objects.


## What features does Tree.js have?

- Zero-dependencies and extremely lightweight!
- Full API available via public functions.
- Fully styled in CSS/SASS, fully responsive, and compatible with the Bootstrap library.
- Full CSS theme support (using :root variables).
- Fully configurable per DOM element.
- Toggling data on/off support.
- Customizable tooltips.
- Expand/Contract data items.
- Configurable colors for boxes!


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](docs/CHANGE_LOG.md).


## How do I install Tree.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jtree.js
```


## How do I get started?

To get started using Tree.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<link rel="stylesheet" href="dist/tree.js.css">
<script src="dist/tree.js"></script>
```

### 3. DOM Element Binding:

```markdown
<div id="tree-1" data-tree-options="{ 'showBoxGaps': true, 'data': [] }">
    Your HTML.
</div>
```

To see a list of all the available binding options you can use for "data-tree-options", click [here](docs/binding/OPTIONS.md).

To see a list of all the available custom triggers you can use for "data-tree-options", click [here](docs/binding/CUSTOM_TRIGGERS.md).


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing Tree.js?

To customize, and get more out of Tree.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](docs/PUBLIC_FUNCTIONS.md).


### 2. Configuration:

Configuration options allow you to customize how Tree.js will function.  You can set them as follows:

```markdown
<script> 
  $tree.setConfiguration( {
      safeMode: false
  } );
</script>
```

To see a list of all the available configuration options you can use, click [here](docs/configuration/OPTIONS.md).