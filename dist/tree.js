/*! Tree.js v0.3.0 | (c) Bunoon 2024 | MIT License */
(function() {
  function render() {
    var tagTypes = _configuration.domElementTypes;
    var tagTypesLength = tagTypes.length;
    var tagTypeIndex = 0;
    for (; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]);
      var elements = [].slice.call(domElements);
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        if (!renderElement(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function renderElement(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          renderControl(renderBindingOptions(bindingOptions.result, element));
        } else {
          if (!_configuration.safeMode) {
            console.error("The attribute '" + _attribute_Name_Options + "' is not a valid object.");
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error("The attribute '" + _attribute_Name_Options + "' has not been set correctly.");
          result = false;
        }
      }
    }
    return result;
  }
  function renderBindingOptions(data, element) {
    var bindingOptions = buildAttributeOptions(data);
    var categories = getCategories(bindingOptions);
    bindingOptions.currentView = {};
    bindingOptions.currentView.element = element;
    bindingOptions.currentView.tooltip = null;
    bindingOptions.currentView.tooltipTimer = null;
    bindingOptions.currentView.category = categories.length > 0 ? categories[0] : null;
    bindingOptions.currentView.categories = categories;
    bindingOptions.currentView.categoryText = null;
    bindingOptions.currentView.categoryIndex = 0;
    bindingOptions.currentView.fullScreenBoxId = null;
    bindingOptions.currentView.fullScreenBoxHeight = null;
    return bindingOptions;
  }
  function renderControl(bindingOptions) {
    fireCustomTrigger(bindingOptions.onBeforeRender, bindingOptions.element);
    if (!isDefinedString(bindingOptions.currentView.element.id)) {
      bindingOptions.currentView.element.id = newGuid();
    }
    bindingOptions.currentView.element.className = "tree-js";
    bindingOptions.currentView.element.removeAttribute(_attribute_Name_Options);
    bindingOptions.currentView.rows = null;
    if (!_elements_Data.hasOwnProperty(bindingOptions.currentView.element.id)) {
      _elements_Data[bindingOptions.currentView.element.id] = {};
      _elements_Data[bindingOptions.currentView.element.id].options = bindingOptions;
      _elements_Data[bindingOptions.currentView.element.id].data = bindingOptions.data;
      delete bindingOptions.data;
    }
    renderControlContainer(bindingOptions);
    fireCustomTrigger(bindingOptions.onRenderComplete, bindingOptions.currentView.element);
  }
  function renderControlContainer(bindingOptions) {
    bindingOptions.currentView.element.innerHTML = _string.empty;
    hideToolTip(bindingOptions);
    renderControlToolTip(bindingOptions);
    renderControlTitleBar(bindingOptions);
    renderControlRows(bindingOptions);
    renderControlRowsAndBoxes(bindingOptions, bindingOptions.currentView.rows, _elements_Data[bindingOptions.currentView.element.id].data);
    renderControlFooter(bindingOptions);
    _parameter_Window.addEventListener("resize", function() {
      renderControlRowsAndBoxes(bindingOptions, bindingOptions.currentView.rows, _elements_Data[bindingOptions.currentView.element.id].data);
    });
  }
  function renderControlTitleBar(bindingOptions) {
    var titleBar = createElement(bindingOptions.currentView.element, "div", "title-bar");
    if (bindingOptions.showTitle) {
      createElementWithHTML(titleBar, "div", "title", bindingOptions.titleText);
    }
    if (bindingOptions.currentView.categories.length > 1) {
      var controls = createElement(titleBar, "div", "controls");
      if (bindingOptions.showRefreshButton) {
        var refresh = createElementWithHTML(controls, "button", "refresh", _configuration.refreshButtonText);
        refresh.onclick = function() {
          renderControlContainer(bindingOptions);
          fireCustomTrigger(bindingOptions.onRefresh, bindingOptions.currentView.element);
        };
      }
      if (bindingOptions.showCategorySelector) {
        var back = createElementWithHTML(controls, "button", "back", _configuration.backButtonText);
        back.onclick = function() {
          moveToPreviousCategory(bindingOptions);
        };
        bindingOptions.currentView.categoryText = createElementWithHTML(controls, "div", "category-text", bindingOptions.currentView.category);
        if (bindingOptions.showCategorySelectionDropDown) {
          createElement(bindingOptions.currentView.categoryText, "div", "down-arrow");
          var categoriesList = createElement(bindingOptions.currentView.categoryText, "div", "categories-list");
          var categories = createElement(categoriesList, "div", "categories");
          var activeCategory = null;
          var categoriesLength = bindingOptions.currentView.categories.length;
          categoriesList.style.display = "block";
          categoriesList.style.visibility = "hidden";
          var categoryIndex = 0;
          for (; categoryIndex < categoriesLength; categoryIndex++) {
            var category = renderControlTitleBarCategory(bindingOptions, categories, bindingOptions.currentView.categories[categoryIndex]);
            if (!isDefined(activeCategory)) {
              activeCategory = category;
            }
          }
          if (isDefined(activeCategory)) {
            categories.scrollTop = activeCategory.offsetTop - categories.offsetHeight / 2;
          }
          categoriesList.style.display = "none";
          categoriesList.style.visibility = "visible";
        } else {
          addClass(bindingOptions.currentView.categoryText, "no-click");
        }
        var next = createElementWithHTML(controls, "button", "next", _configuration.nextButtonText);
        next.onclick = function() {
          moveToNextCategory(bindingOptions);
        };
      }
    }
  }
  function renderControlTitleBarCategory(bindingOptions, categories, currentCategory) {
    var result = null;
    var category = createElementWithHTML(categories, "div", "category", currentCategory);
    if (bindingOptions.currentView.category !== currentCategory) {
      category.onclick = function() {
        bindingOptions.currentView.category = currentCategory;
        bindingOptions.currentView.categoryIndex = bindingOptions.currentView.categories.indexOf(currentCategory);
        renderControlContainer(bindingOptions);
        fireCustomTrigger(bindingOptions.onSetCategory, bindingOptions.currentView.category);
      };
    } else {
      addClass(category, "category-active");
      result = category;
    }
    return result;
  }
  function moveToPreviousCategory(bindingOptions) {
    if (bindingOptions.currentView.categoryIndex > 0) {
      bindingOptions.currentView.categoryIndex--;
      bindingOptions.currentView.category = bindingOptions.currentView.categories[bindingOptions.currentView.categoryIndex];
      renderControlContainer(bindingOptions);
      fireCustomTrigger(bindingOptions.onBackCategory, bindingOptions.currentView.category);
    }
  }
  function moveToNextCategory(bindingOptions) {
    if (bindingOptions.currentView.categoryIndex < bindingOptions.currentView.categories.length - 1) {
      bindingOptions.currentView.categoryIndex++;
      bindingOptions.currentView.category = bindingOptions.currentView.categories[bindingOptions.currentView.categoryIndex];
      renderControlContainer(bindingOptions);
      fireCustomTrigger(bindingOptions.onNextCategory, bindingOptions.currentView.category);
    }
  }
  function renderControlRows(bindingOptions) {
    bindingOptions.currentView.rows = createElement(bindingOptions.currentView.element, "div", "box-rows");
  }
  function renderControlRowsAndBoxes(bindingOptions, container, data, isChildren) {
    isChildren = isDefined(isChildren) ? isChildren : false;
    var rowData = getRowsAndBoxes(bindingOptions, data, isChildren);
    if (!isChildren) {
      container.innerHTML = _string.empty;
    }
    if (rowData.totalRows === 0) {
      if (!isChildren) {
        createElementWithHTML(container, "div", "no-data", _configuration.noDataMessage);
      }
    } else {
      var boxWidth = null;
      var rowIndex = !bindingOptions.swapSizes ? rowData.totalRows : 1;
      var dividedBoxHeight = bindingOptions.maximumBoxHeight / rowData.totalRows;
      var rowKey;
      for (rowKey in rowData.boxesPerRow) {
        if (rowData.boxesPerRow.hasOwnProperty(rowKey)) {
          var boxHeight = dividedBoxHeight * rowIndex;
          if (rowData.boxesPerRow.hasOwnProperty(rowKey)) {
            var boxRow = createElement(container, "div", "box-row");
            var boxesLength = rowData.boxesPerRow[rowKey].length;
            if (!isChildren && !bindingOptions.showBoxGaps || isChildren && !bindingOptions.showBoxGapsForChildren) {
              addClass(boxRow, "box-row-no-spacing");
            } else {
              if (!isDefinedNumber(boxWidth)) {
                boxWidth = boxRow.offsetWidth / rowData.largestAmountOfBoxesOnARow - bindingOptions.spacing;
              }
            }
            var boxIndex = 0;
            for (; boxIndex < boxesLength; boxIndex++) {
              renderBox(bindingOptions, boxRow, boxHeight, boxWidth, rowData.boxesPerRow[rowKey][boxIndex], isChildren);
            }
          }
          if (!bindingOptions.swapSizes) {
            rowIndex--;
          } else {
            rowIndex++;
          }
        }
      }
      if (bindingOptions.reverseOrder) {
        reverseElementsOrder(container);
      }
    }
    return container.children.length > 0;
  }
  function renderBox(bindingOptions, boxRow, boxHeight, boxWidth, boxDetails, isChild) {
    var box = createElement(boxRow, "div", "box");
    var boxChildrenAdded = false;
    box.id = boxDetails.id;
    if (bindingOptions.currentView.fullScreenBoxId === boxDetails.id) {
      box.style.height = bindingOptions.currentView.fullScreenBoxHeight + "px";
    } else {
      if (bindingOptions.useDecreasingHeightsForBoxes) {
        box.style.height = boxHeight + "px";
      } else {
        box.style.height = bindingOptions.maximumBoxHeight + "px";
      }
    }
    if (isDefinedFunction(bindingOptions.onBoxClick)) {
      box.onclick = function(e) {
        cancelBubble(e);
        fireCustomTrigger(bindingOptions.onBoxClick, boxDetails);
      };
    } else {
      addClass(box, "no-click");
    }
    if (isDefinedNumber(boxWidth)) {
      box.style.width = boxWidth + "px";
    }
    if (isDefinedString(boxDetails.backgroundColor)) {
      box.style.backgroundColor = boxDetails.backgroundColor;
    }
    if (isDefinedString(boxDetails.textColor)) {
      box.style.color = boxDetails.textColor;
    }
    if (isDefinedString(boxDetails.borderColor)) {
      box.style.borderColor = boxDetails.borderColor;
    }
    if (isDefinedString(boxDetails.name) || isDefinedBoolean(boxDetails.showValue) && boxDetails.showValue) {
      var titleBar = createElement(box, "div", "box-title-bar");
      createElementWithHTML(titleBar, "div", "box-title", boxDetails.name);
      var value = createElement(titleBar, "div", "box-value");
      if (isDefinedBoolean(boxDetails.showValue) && boxDetails.showValue && isDefinedNumber(boxDetails.value)) {
        createElementWithHTML(value, "span", null, boxDetails.value);
      }
      if (!isChild && bindingOptions.allowBoxExpanding) {
        var expandFunc = function(e) {
          cancelBubble(e);
          if (isDefined(bindingOptions.currentView.fullScreenBoxId)) {
            bindingOptions.currentView.fullScreenBoxId = null;
            bindingOptions.currentView.fullScreenBoxHeight = null;
          } else {
            bindingOptions.currentView.fullScreenBoxId = boxDetails.id;
            bindingOptions.currentView.fullScreenBoxHeight = boxRow.parentNode.offsetHeight;
          }
          renderControlContainer(bindingOptions);
        };
        if (bindingOptions.currentView.fullScreenBoxId !== boxDetails.id) {
          var expand = createElement(value, "div", "expand");
          expand.onclick = expandFunc;
          addToolTip(expand, bindingOptions, _configuration.expandToolTipText);
          if (isDefinedString(boxDetails.textColor)) {
            expand.style.borderColor = boxDetails.textColor;
          }
        } else {
          var contract = createElement(value, "div", "contract");
          contract.onclick = expandFunc;
          addToolTip(contract, bindingOptions, _configuration.contractToolTipText);
          if (isDefinedString(boxDetails.textColor)) {
            contract.style.setProperty("--tree-js-color-black", boxDetails.textColor);
          }
        }
      }
    }
    if (isDefinedString(boxDetails.description) && bindingOptions.showDescriptions) {
      createElementWithHTML(box, "p", "description", boxDetails.description);
    }
    if (!isChild && isDefinedArray(boxDetails.children) && boxDetails.children.length > 0 && bindingOptions.showChildren) {
      var boxRows = createElement(box, "div", "box-rows children");
      boxChildrenAdded = renderControlRowsAndBoxes(bindingOptions, boxRows, boxDetails.children, true);
    }
    if (!boxChildrenAdded && isDefinedString(boxDetails.content) && bindingOptions.showContents) {
      createElementWithHTML(box, "div", null, boxDetails.content);
    }
  }
  function renderControlFooter(bindingOptions) {
    var footer = createElement(bindingOptions.currentView.element, "div", "footer");
    var showChildren = null;
    var showDescriptions = null;
    var showContents = null;
    var onClick = function() {
      if (isDefined(showChildren)) {
        bindingOptions.showChildren = showChildren.checked;
      }
      if (isDefined(showDescriptions)) {
        bindingOptions.showDescriptions = showDescriptions.checked;
      }
      if (isDefined(showContents)) {
        bindingOptions.showContents = showContents.checked;
      }
      renderControlContainer(bindingOptions);
    };
    if (bindingOptions.showChildrenToggle) {
      showChildren = buildCheckBox(footer, _configuration.showChildrenLabelText, bindingOptions.showChildren, onClick)[0];
    }
    if (bindingOptions.showDescriptionsToggle) {
      showDescriptions = buildCheckBox(footer, _configuration.showDescriptionsLabelText, bindingOptions.showDescriptions, onClick)[0];
    }
    if (bindingOptions.showContentsToggle) {
      showContents = buildCheckBox(footer, _configuration.showContentsLabelText, bindingOptions.showContents, onClick)[0];
    }
  }
  function renderControlToolTip(bindingOptions) {
    if (!isDefined(bindingOptions.currentView.tooltip)) {
      bindingOptions.currentView.tooltip = createElement(_parameter_Document.body, "div", "tree-js-tooltip");
      bindingOptions.currentView.tooltip.style.display = "none";
      _parameter_Document.body.addEventListener("mousemove", function() {
        hideToolTip(bindingOptions);
      });
      _parameter_Document.addEventListener("scroll", function() {
        hideToolTip(bindingOptions);
      });
    }
  }
  function addToolTip(element, bindingOptions, text) {
    if (element !== null) {
      element.onmousemove = function(e) {
        showToolTip(e, bindingOptions, text);
      };
    }
  }
  function showToolTip(e, bindingOptions, text) {
    cancelBubble(e);
    hideToolTip(bindingOptions);
    bindingOptions.currentView.tooltipTimer = setTimeout(function() {
      bindingOptions.currentView.tooltip.innerHTML = text;
      bindingOptions.currentView.tooltip.style.display = "block";
      showElementAtMousePosition(e, bindingOptions.currentView.tooltip);
    }, bindingOptions.tooltipDelay);
  }
  function hideToolTip(bindingOptions) {
    if (isDefined(bindingOptions.currentView.tooltip)) {
      if (isDefined(bindingOptions.currentView.tooltipTimer)) {
        clearTimeout(bindingOptions.currentView.tooltipTimer);
        bindingOptions.currentView.tooltipTimer = null;
      }
      if (bindingOptions.currentView.tooltip.style.display === "block") {
        bindingOptions.currentView.tooltip.style.display = "none";
      }
    }
  }
  function getRowsAndBoxes(bindingOptions, data, isChildren) {
    var boxesDetails = getBoxesAndMaximumPerRow(bindingOptions, data, isChildren);
    var boxesPerRow = {};
    var largestAmountOfBoxesOnARow = 0;
    var rowNumber = 0;
    if (boxesDetails.maximum > 0) {
      rowNumber = 1;
      boxesDetails.boxes = boxesDetails.boxes.sort(function(a, b) {
        return b.value - a.value;
      });
      var startIndex = 0;
      var endIndex = boxesDetails.maximum;
      var dataLength = boxesDetails.boxes.length;
      for (; true;) {
        var breakOnceProcessed = false;
        boxesPerRow[rowNumber] = [];
        if (endIndex > dataLength) {
          endIndex = dataLength;
          breakOnceProcessed = true;
        }
        var arrayIndex = startIndex;
        for (; arrayIndex < endIndex; arrayIndex++) {
          boxesPerRow[rowNumber].push(boxesDetails.boxes[arrayIndex]);
        }
        largestAmountOfBoxesOnARow = _parameter_Math.max(boxesPerRow[rowNumber].length, largestAmountOfBoxesOnARow);
        if (breakOnceProcessed) {
          break;
        } else {
          startIndex = endIndex;
          endIndex = endIndex + (boxesDetails.maximum + rowNumber * 2);
          rowNumber++;
        }
      }
    }
    return {boxesPerRow:boxesPerRow, largestAmountOfBoxesOnARow:largestAmountOfBoxesOnARow, totalRows:rowNumber};
  }
  function getBoxesAndMaximumPerRow(bindingOptions, data, isChildren) {
    var boxes = [];
    var maximumBoxes = 0;
    var dataLength = data.length;
    if (dataLength > 1) {
      var dataIndex = 0;
      for (; dataIndex < dataLength; dataIndex++) {
        var dataItem = data[dataIndex];
        if (!isDefinedString(dataItem.id)) {
          dataItem.id = newGuid();
        }
        if (!isChildren && isDefined(bindingOptions.currentView.fullScreenBoxId)) {
          if (dataItem.id === bindingOptions.currentView.fullScreenBoxId) {
            boxes.push(dataItem);
          }
        } else {
          if (isChildren || !isDefinedString(dataItem.category) || !isDefinedString(bindingOptions.currentView.category) || bindingOptions.currentView.category === dataItem.category) {
            boxes.push(dataItem);
          }
        }
      }
      var totalItems = boxes.length;
      var totalRows = bindingOptions.maximumRows;
      maximumBoxes = totalItems / totalRows;
      for (; maximumBoxes < 1.0;) {
        totalRows--;
        maximumBoxes = totalItems / totalRows;
      }
    }
    return {maximum:_parameter_Math.round(maximumBoxes), boxes:boxes};
  }
  function getCategories(bindingOptions) {
    var categories = [];
    var dataLength = bindingOptions.data.length;
    var dataIndex = 0;
    for (; dataIndex < dataLength; dataIndex++) {
      var data = bindingOptions.data[dataIndex];
      if (isDefinedString(data.category) && categories.indexOf(data.category) === -1) {
        categories.push(data.category);
      }
    }
    return categories;
  }
  function buildAttributeOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options.data = getDefaultArray(options.data, []);
    options.maximumRows = getDefaultNumber(options.maximumRows, 10);
    options.spacing = getDefaultNumber(options.spacing, 10);
    options.maximumBoxHeight = getDefaultNumber(options.maximumBoxHeight, 200);
    options.reverseOrder = getDefaultBoolean(options.reverseOrder, false);
    options.showBoxGaps = getDefaultBoolean(options.showBoxGaps, true);
    options.swapSizes = getDefaultBoolean(options.swapSizes, false);
    options.showBoxGapsForChildren = getDefaultBoolean(options.showBoxGapsForChildren, false);
    options.allowBoxExpanding = getDefaultBoolean(options.allowBoxExpanding, true);
    options.showTitle = getDefaultBoolean(options.showTitle, true);
    options.showChildren = getDefaultBoolean(options.showChildren, true);
    options.showDescriptions = getDefaultBoolean(options.showDescriptions, true);
    options.showContents = getDefaultBoolean(options.showContents, true);
    options.tooltipDelay = getDefaultNumber(options.tooltipDelay, 750);
    options.showChildrenToggle = getDefaultBoolean(options.showChildrenToggle, true);
    options.showDescriptionsToggle = getDefaultBoolean(options.showDescriptionsToggle, true);
    options.showContentsToggle = getDefaultBoolean(options.showContentsToggle, true);
    options.showCategorySelector = getDefaultBoolean(options.showCategorySelector, true);
    options.showCategorySelectionDropDown = getDefaultBoolean(options.showCategorySelectionDropDown, true);
    options.useDecreasingHeightsForBoxes = getDefaultBoolean(options.useDecreasingHeightsForBoxes, true);
    options.showRefreshButton = getDefaultBoolean(options.showRefreshButton, false);
    options = buildAttributeOptionCustomTriggers(options);
    options = buildAttributeOptionStrings(options);
    return options;
  }
  function buildAttributeOptionStrings(options) {
    options.titleText = getDefaultString(options.titleText, "Tree.js");
    return options;
  }
  function buildAttributeOptionCustomTriggers(options) {
    options.onBeforeRender = getDefaultFunction(options.onBeforeRender, null);
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    options.onBoxClick = getDefaultFunction(options.onBoxClick, null);
    options.onBackCategory = getDefaultFunction(options.onBackCategory, null);
    options.onNextCategory = getDefaultFunction(options.onNextCategory, null);
    options.onSetCategory = getDefaultFunction(options.onSetCategory, null);
    options.onRefresh = getDefaultFunction(options.onRefresh, null);
    return options;
  }
  function createElement(container, type, className) {
    var result = null;
    var nodeType = type.toLowerCase();
    var isText = nodeType === "text";
    if (!_elements_Type.hasOwnProperty(nodeType)) {
      _elements_Type[nodeType] = isText ? _parameter_Document.createTextNode(_string.empty) : _parameter_Document.createElement(nodeType);
    }
    result = _elements_Type[nodeType].cloneNode(false);
    if (isDefined(className)) {
      result.className = className;
    }
    container.appendChild(result);
    return result;
  }
  function createElementWithHTML(container, type, className, html) {
    var element = createElement(container, type, className);
    element.innerHTML = html;
    return element;
  }
  function getScrollPosition() {
    var doc = _parameter_Document.documentElement;
    var left = (_parameter_Window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (_parameter_Window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return {left:left, top:top};
  }
  function showElementAtMousePosition(e, element) {
    var left = e.pageX;
    var top = e.pageY;
    var scrollPosition = getScrollPosition();
    element.style.display = "block";
    if (left + element.offsetWidth > _parameter_Window.innerWidth) {
      left = left - element.offsetWidth;
    } else {
      left++;
    }
    if (top + element.offsetHeight > _parameter_Window.innerHeight) {
      top = top - element.offsetHeight;
    } else {
      top++;
    }
    if (left < scrollPosition.left) {
      left = e.pageX + 1;
    }
    if (top < scrollPosition.top) {
      top = e.pageY + 1;
    }
    element.style.left = left + "px";
    element.style.top = top + "px";
  }
  function reverseElementsOrder(parent) {
    var children = parent.children;
    var childrenLength = children.length - 1;
    for (; childrenLength--;) {
      parent.appendChild(children[childrenLength]);
    }
  }
  function addClass(element, className) {
    element.className += _string.space + className;
  }
  function cancelBubble(e) {
    e.preventDefault();
    e.cancelBubble = true;
  }
  function buildCheckBox(container, labelText, checked, onClick) {
    var label = createElement(container, "label", "checkbox");
    var input = createElement(label, "input");
    input.type = "checkbox";
    if (isDefined(onClick)) {
      input.onclick = onClick;
    }
    if (isDefined(checked)) {
      input.checked = checked;
    }
    createElement(label, "span", "check-mark");
    createElementWithHTML(label, "span", "text", labelText);
    return [input, label];
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true;
    var result = null;
    try {
      if (isDefinedString(objectString)) {
        result = _parameter_JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        if (!_configuration.safeMode) {
          console.error("Errors in object: " + e1.message + ", " + e2.message);
          parsed = false;
        }
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = _parameter_Math.floor(_parameter_Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function buildDefaultConfiguration(newConfiguration) {
    _configuration = !isDefinedObject(newConfiguration) ? {} : newConfiguration;
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["*"]);
    buildDefaultConfigurationStrings();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.backButtonText = getDefaultString(_configuration.backButtonText, "Back");
    _configuration.nextButtonText = getDefaultString(_configuration.nextButtonText, "Next");
    _configuration.showChildrenLabelText = getDefaultString(_configuration.showChildrenLabelText, "Show Children");
    _configuration.showDescriptionsLabelText = getDefaultString(_configuration.showDescriptionsLabelText, "Show Descriptions");
    _configuration.showContentsLabelText = getDefaultString(_configuration.showContentsLabelText, "Show Contents");
    _configuration.noDataMessage = getDefaultString(_configuration.noDataMessage, "There is currently no data to view.");
    _configuration.expandToolTipText = getDefaultString(_configuration.expandToolTipText, "Expand");
    _configuration.contractToolTipText = getDefaultString(_configuration.contractToolTipText, "Contract");
    _configuration.refreshButtonText = getDefaultString(_configuration.refreshButtonText, "Refresh");
  }
  var _parameter_Document = null;
  var _parameter_Window = null;
  var _parameter_Math = null;
  var _parameter_JSON = null;
  var _configuration = {};
  var _string = {empty:"", space:" "};
  var _elements_Type = {};
  var _elements_Data = {};
  var _attribute_Name_Options = "data-tree-options";
  this.refresh = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      var bindingOptions = _elements_Data[elementId].options;
      renderControlContainer(bindingOptions);
      fireCustomTrigger(bindingOptions.onRefresh, bindingOptions.currentView.element);
    }
    return this;
  };
  this.refreshAll = function() {
    var elementId;
    for (elementId in _elements_Data) {
      if (_elements_Data.hasOwnProperty(elementId)) {
        var bindingOptions = _elements_Data[elementId].options;
        renderControlContainer(bindingOptions);
        fireCustomTrigger(bindingOptions.onRefresh, bindingOptions.currentView.element);
      }
    }
    return this;
  };
  this.moveToPreviousCategory = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      moveToPreviousCategory(_elements_Data[elementId].options);
    }
    return this;
  };
  this.moveToNextCategory = function(elementId) {
    if (isDefinedString(elementId) && _elements_Data.hasOwnProperty(elementId)) {
      moveToNextCategory(_elements_Data[elementId].options);
    }
    return this;
  };
  this.setConfiguration = function(newConfiguration) {
    var propertyName;
    for (propertyName in newConfiguration) {
      if (newConfiguration.hasOwnProperty(propertyName)) {
        _configuration[propertyName] = newConfiguration[propertyName];
      }
    }
    buildDefaultConfiguration(_configuration);
    return this;
  };
  this.getVersion = function() {
    return "0.3.0";
  };
  (function(documentObject, windowObject, mathObject, jsonObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_Math = mathObject;
    _parameter_JSON = jsonObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$tree)) {
      _parameter_Window.$tree = this;
    }
  })(document, window, Math, JSON);
})();