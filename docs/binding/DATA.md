# Tree.js - Binding Options - Data:

Below is a list of all the options supported for the property "data" used in the "data-tree-options" binding attribute for DOM elements.
<br>
<br>


| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | id | The ID of the item (defaults to guid). |
| *string* | name | The name of the item (required). |
| *string* | description | The description of the item (optional). |
| *string* | backgroundColor | The background color to use for the items box (optional). |
| *string* | textColor | The text color to use for the items box (optional). |
| *string* | borderColor | The border color to use for the items box (optional). |
| *number* | value | The value of the item (required). |
| *string* | category | The category for the item (optional). |
| *boolean* | showValue | States if the value of the item should be shown in the box (defaults to true). |
| *Object[]* | children | All the child items that should be displayed (the same format, with the "children" and "category" properties being ignored). |
| *string* | content | The additional HTML content will be shown in the items box (optional). |

<br>


## Example:

```markdown
<script> 
    var dataItem = {
        id: "1",
        name: "Data Set 1",
        description: "This is a description for Data Set 1.",
        backgroundColor: "rgba( 80, 200, 120, 1 )",
        textColor: "black",
        borderColor: "rgba( 80, 200, 120, 0.75 )",
        value: 10,
        category: category,
        showValue: true,
        children: [],
        content: "<p>This is some additional content in HTML.</p>"
    };
</script>
```