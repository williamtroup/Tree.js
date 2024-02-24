# Tree.js - Functions:

Below is a list of all the public functions that can be called from the Tree.js instance.
<br>
<br>


## Manage Instances:

### **refresh( *elementId* )**:
Refreshes a Tree.js instance.
<br>
***Fires***:  onRefresh
<br>
***Parameter: elementId***: '*string*' - The Tree.js element ID that should be refreshed.
<br>
***Returns***: '*Object*' - The Tree.js class instance.
<br>

### **refreshAll()**:
Refreshes all of the rendered Tree.js instances.
<br>
***Fires***:  onRefresh
<br>
***Returns***: '*Object*' - The Tree.js class instance.
<br>

### **moveToPreviousCategory( *elementId* )**:
Moves to the previous category.
<br>
***Fires***:  onBackCategory
<br>
***Parameter: elementId***: '*string*' - The Tree.js element ID that should be updated.
<br>
***Returns***: '*Object*' - The Tree.js class instance.
<br>

### **moveToNextCategory( *elementId* )**:
Moves to the next category.
<br>
***Fires***:  onNextCategory
<br>
***Parameter: elementId***: '*string*' - The Tree.js element ID that should be updated.
<br>
***Returns***: '*Object*' - The Tree.js class instance.
<br>
<br>


## Configuration:

### **setConfiguration( *newConfiguration* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newConfiguration***: '*Options*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The Tree.js class instance.
<br>
<br>


## Additional Data:

### **getIds()**:
Returns an array of element IDs that have been rendered.
<br>
***Returns***: '*string[]*' - The element IDs that have been rendered.
<br>

### **getVersion()**:
Returns the version of Tree.js.
<br>
***Returns***: '*string*' - The version number.
<br>
<br>


## Example:

```markdown
<script> 
    var version = $tree.getVersion();
</script>
```