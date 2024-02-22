# Tree.js - Change Log:

## Version 0.3.0:

#### **New Features:**
- Added full refreshing support via public functions and a new title bar button (off by default).

#### **Binding Options:**
- Added a new binding option called "useDecreasingHeightsForBoxes", which states if decreasing heights should be used for the boxes (defaults to true).
- Added a new binding option called "showRefreshButton", which states if the "Refresh" button should be shown (defaults to false).

#### **Binding Options - Custom Triggers:**
- Added a new binding option custom trigger called "onRefresh", which states an event that should be triggered when a rendered element is refreshed.

#### **Public Functions:**
- Added a new public function "moveToPreviousCategory()", which will move to the next category for a specific element and then refresh its UI.
- Added a new public function "moveToNextCategory()", which will move to the previous category for a specific element and then refresh its UI.
- Added a new public function "refresh()", which refreshes the UI for a specific element.
- Added a new public function "refreshAll()", which will refresh all the rendered elements.

#### **Configuration Options:**
- Added a new configuration option called "refreshButtonText", which states the text that should be shown for the "Refresh" button (defaults to "Refresh").

<br>


## Version 0.2.0:

#### **Binding Options:**
- Added a new binding option called "showChildrenToggle", which states if the "Show Children" toggle check box should be shown (defaults to true).
- Added a new binding option called "showDescriptionsToggle", which states if the "Show Descriptions" toggle check box should be shown (defaults to true).
- Added a new binding option called "showContentsToggle", which states if the "Show Contents" toggle check box should be shown (defaults to true).
- Added a new binding option called "showCategorySelector", which states if the category selector (and buttons) is shown (defaults to true).
- Added a new binding option called "showCategorySelectionDropDown", which states if the category selection drop-down menu is shown (defaults to true).

#### **Documentation:**
- Fixed a grammar mistake in the project description.
- Fixed grammar mistakes in other areas of the documentation.
- Moved the "DATA_FORMAT.md" file into "binding" and renamed it to "DATA.md".

<br>


## Version 0.1.0:
- Everything :)