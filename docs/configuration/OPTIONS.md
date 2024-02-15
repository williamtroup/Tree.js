# Tree.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.
<br>
<br>


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | highlightAllDomElementTypes | The DOM element types to lookup (can be either an array of strings, or a space separated string, and defaults to "*"). |

<br/>


### Options - Strings:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | backButtonText | The text that should be shown for the "Back" button. |
| *string* | nextButtonText | The text that should be shown for the "Next" button. |
| *string* | showChildrenLabelText | The text that should be shown for the "Show Children" label. |
| *string* | showDescriptionsLabelText | The text that should be shown for the "Show Descriptions" label. |
| *string* | showContentsLabelText | The text that should be shown for the "Show Contents" label. |

<br/>


## Example:


```markdown
<script> 
  $tree.setConfiguration( {
      safeMode: false
  } );
</script>
```