# Tree.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-tree-options" binding attribute for DOM elements.
<br>
<br>


## For Rendering:

### options.onRefresh( *element* ):
Fires when a rendered element is refreshed.
<br>
***Parameter:*** element: '*Object*' - The element that was refreshed.
<br>

### options.onBeforeRenderComplete( *element* ):
Fires before the rendering an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.
<br>
<br>


## For Clicking:

### options.onBoxClick( *boxDetails* ):
Fires when a box is clicked.
<br>
***Parameter:*** boxDetails: '*Object*' - The details of the box that was clicked.
<br>
<br>


## For Category Selections:

### options.onBackCategory( *category* ):
Fires when the category is moved back.
<br>
***Parameter:*** category: '*string*' - The category that is now being viewed.

### options.onNextCategory( *category* ):
Fires when the category is moved forward.
<br>
***Parameter:*** category: '*string*' - The category that is now being viewed.
<br>

### options.onSetCategory( *category* ):
Fires when the category is manually set.
<br>
***Parameter:*** category: '*string*' - The category that is now being viewed.
<br>
<br>


## Binding Example:

```markdown
<div data-tree-options="{ 'onRenderComplete': yourCustomJsFunction }">
    Your HTML.
</div>
```