# Tree.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-tree-options" binding attribute for a DOM element.


## Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *Object[]* | data | The data that should be shown in the display (see ["Data Format"](../DATA_FORMAT.md) for details, defaults to []). |
| *number* | maximumRows | States the maximum rows that can be shown (defaults to 10). |
| *number* | spacing | States the spacing that should be used around the row boxes (defaults to 10 pixels). |
| *number* | maximumBoxHeight | States the maximum height a row box can be (defaults to 200 pixels). |
| *boolean* | reverseOrder | States if the largest box values should be shown at the bottom (defaults to false). |
| *boolean* | showBoxGaps | States if the gaps should be shown for the boxes (gives more of a tree look, defaults to true). |
| *boolean* | swapSizes | States if the smallest values should used larger boxes (defaults to false). |
| *boolean* | showBoxGapsForChildren | States if the children for a box should show gaps (defaults to false). |
| *boolean* | allowBoxExpanding | States if the parent boxes can be expanded to full-view (defaults to true). |
| *boolean* | showTitle | States if the title is shown (defaults to true). |
| *boolean* | showChildren | States if the box children should be shown (defaults to true). |
| *boolean* | showDescriptions | States if the descriptions for the boxes should be shown (defaults to true). |
| *boolean* | showContents | States if additional box contents should be shown (when no children are available, defaults to true). |
| *number* | tooltipDelay | States how long the tooltip should wait (in milliseconds) until it's shown (defaults to 750). |
| *boolean* | showChildrenToggle | States if the "Show Children" toggle check box should be shown (defaults to true). |
| *boolean* | showDescriptionsToggle | States if the "Show Descriptions" toggle check box should be shown (defaults to true). |
| *boolean* | showContentsToggle | States if the "Show Contents" toggle check box should be shown (defaults to true). |

<br/>


## String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | titleText | States ... (defaults to "Tree.js"). |

<br/>


## Binding Example:

```markdown
<code data-tree-options="{ 'showBoxGaps': true }">
    <pre>
        var something = true;
    </pre>
</code>
```