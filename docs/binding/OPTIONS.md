# Tree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-tree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object[]* | data | States ... (defaults to null). |
| *number* | maximumRows | States ... (defaults to 10). |
| *number* | spacing | States ... (defaults to 10). |
| *number* | maximumBoxHeight | States ... (defaults to 200). |
| *boolean* | reverseOrder | States ... (defaults to false). |
| *boolean* | showBoxGaps | States ... (defaults to false). |
| *boolean* | swapSizes | States ... (defaults to false). |
| *boolean* | showBoxGapsForChildren | States ... (defaults to true). |
| *boolean* | allowBoxExpanding | States ... (defaults to true). |
| *boolean* | showTitle | States ... (defaults to true). |
| *boolean* | showChildren | States ... (defaults to true). |
| *boolean* | showDescriptions | States ... (defaults to true). |
| *boolean* | showContents | States ... (defaults to true). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | titleText | States ... (defaults to "Tree.js"). |

<br/>


## Binding Example:

```markdown
<code data-tree-options="{ 'showCopyButton': false }">
    <pre>
        var something = true;
    </pre>
</code>
```