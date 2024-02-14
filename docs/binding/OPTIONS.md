# Tree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-tree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *number* | maximumColumns | States ... (defaults to 10). |
| *number* | spacing | States ... (defaults to 10). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | copyButtonText | The text that should be displayed for the "Copy" button. |

<br/>


## Binding Example:

```markdown
<code data-tree-options="{ 'showCopyButton': false }">
    <pre>
        var something = true;
    </pre>
</code>
```