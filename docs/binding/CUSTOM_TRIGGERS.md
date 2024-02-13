# Tree.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-tree-options" binding attribute for DOM elements.
<br>
<br>


## For Rendering:

### options.onBeforeRenderComplete( *element* ):
Fires before the rendering of the notes of an element.
<br>
***Parameter:*** element: '*object*' - The DOM element that is going to be rendered.

### options.onRenderComplete( *element* ):
Fires when the rendering of the notes for an element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.

<br>


## Binding Example:

```markdown
<div data-tree-options="{ 'onRenderComplete': yourCustomJsFunction }">
    Your HTML.
</div>
```