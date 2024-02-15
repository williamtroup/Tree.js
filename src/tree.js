/**
 * Tree.js
 * 
 * A lightweight JavaScript library.
 * 
 * @file        tree.js
 * @version     v0.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_Math = null,
        _parameter_JSON = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
        },

        // Variables: Elements
        _elements_Type = {},

        // Variables: Attribute Names
        _attribute_Name_Options = "data-tree-options";

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() {
        var tagTypes = _configuration.domElementTypes,
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element ) {
        var result = true;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    renderControl( renderBindingOptions( bindingOptions.result, element ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( "The attribute '" + _attribute_Name_Options + "' is not a valid object." );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( "The attribute '" + _attribute_Name_Options + "' has not been set correctly." );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderBindingOptions( data, element ) {
        var bindingOptions = buildAttributeOptions( data );
        bindingOptions.currentView = {};
        bindingOptions.currentView.element = element;
        bindingOptions.currentView.tooltip = null;
        bindingOptions.currentView.tooltipTimer = null;

        var categories = getCategories( bindingOptions );

        bindingOptions.currentView.category = categories.length > 0 ? categories[ 0 ] : null;
        bindingOptions.currentView.categories = categories;
        bindingOptions.currentView.categoryText = null;
        bindingOptions.currentView.categoryIndex = 0;
        bindingOptions.currentView.fullScreenBoxId = null;
        bindingOptions.currentView.fullScreenBoxHeight = null;

        return bindingOptions;
    }

    function renderControl( bindingOptions ) {
        fireCustomTrigger( bindingOptions.onBeforeRender, bindingOptions.element );

        if ( !isDefinedString( bindingOptions.currentView.element.id ) ) {
            bindingOptions.currentView.element.id = newGuid();
        }

        renderControlContainer( bindingOptions );
        fireCustomTrigger( bindingOptions.onRenderComplete, bindingOptions.currentView.element );
    }

    function renderControlContainer( bindingOptions ) {
        bindingOptions.currentView.element.removeAttribute( _attribute_Name_Options );
        bindingOptions.currentView.rows = null;
        bindingOptions.currentView.element.innerHTML = _string.empty;
        bindingOptions.currentView.element.className = "tree-js";

        renderControlToolTip( bindingOptions );
        renderControlTitleBar( bindingOptions );
        renderControlRows( bindingOptions );
        renderControlRowsAndBoxes( bindingOptions, bindingOptions.currentView.rows, bindingOptions.data );

        _parameter_Window.addEventListener( "resize", function() {
            renderControlRowsAndBoxes( bindingOptions, bindingOptions.currentView.rows, bindingOptions.data );
        } );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Title Bar
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlTitleBar( bindingOptions ) {
        var titleBar = createElement( bindingOptions.currentView.element, "div", "title-bar" );
        
        createElementWithHTML( titleBar, "div", "title", bindingOptions.titleText );

        if ( bindingOptions.currentView.categories.length > 1 ) {
            var controls = createElement( titleBar, "div", "controls" ),
                back = createElementWithHTML( controls, "button", "back", _configuration.backButtonText );
            
            back.onclick = function() {
                if ( bindingOptions.currentView.categoryIndex > 0 ) {
                    bindingOptions.currentView.categoryIndex--;
                    bindingOptions.currentView.category = bindingOptions.currentView.categories[ bindingOptions.currentView.categoryIndex ];

                    renderControlContainer( bindingOptions );
                    fireCustomTrigger( bindingOptions.onBackCategory, bindingOptions.currentView.category );
                }
            };

            bindingOptions.currentView.categoryText = createElementWithHTML( controls, "div", "category-text", bindingOptions.currentView.category );

            createElement( bindingOptions.currentView.categoryText, "div", "down-arrow" );

            var categoriesList = createElement( bindingOptions.currentView.categoryText, "div", "categories-list" ),
                categories = createElement( categoriesList, "div", "categories" ),
                activeCategory = null,
                categoriesLength = bindingOptions.currentView.categories.length;

            categoriesList.style.display = "block";
            categoriesList.style.visibility = "hidden";

            for ( var categoryIndex = 0; categoryIndex < categoriesLength; categoryIndex++ ) {
                var category = renderControlTitleBarCategory( bindingOptions, categories, bindingOptions.currentView.categories[ categoryIndex ] );

                if ( !isDefined( activeCategory ) ) {
                    activeCategory = category;
                }
            }

            if ( isDefined( activeCategory ) ) {
                categories.scrollTop = activeCategory.offsetTop - ( categories.offsetHeight / 2 );
            }

            categoriesList.style.display = "none";
            categoriesList.style.visibility = "visible";

            var next = createElementWithHTML( controls, "button", "next", _configuration.nextButtonText );

            next.onclick = function() {
                if ( bindingOptions.currentView.categoryIndex < categoriesLength - 1 ) {
                    bindingOptions.currentView.categoryIndex++;
                    bindingOptions.currentView.category = bindingOptions.currentView.categories[ bindingOptions.currentView.categoryIndex ];

                    renderControlContainer( bindingOptions );
                    fireCustomTrigger( bindingOptions.onNextCategory, bindingOptions.currentView.category );
                }
            };
        }
    }

    function renderControlTitleBarCategory( bindingOptions, categories, currentCategory ) {
        var result = null,
            category = createElementWithHTML( categories, "div", "category", currentCategory );

        if ( bindingOptions.currentView.category !== currentCategory ) {
            category.onclick = function() {
                bindingOptions.currentView.category = currentCategory;
                bindingOptions.currentView.categoryIndex = bindingOptions.currentView.categories.indexOf( currentCategory );
    
                renderControlContainer( bindingOptions );
                fireCustomTrigger( bindingOptions.onSetCategory, bindingOptions.currentView.category );
            };

        } else {
            addClass( category, "category-active" );
            result = category;
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Rows & Boxes
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlRows( bindingOptions ) {
        bindingOptions.currentView.rows = createElement( bindingOptions.currentView.element, "div", "box-rows" );
    }

    function renderControlRowsAndBoxes( bindingOptions, container, data, isChildren ) {
        isChildren = isDefined( isChildren ) ? isChildren : false;

        var rowData = getRowsAndBoxes( bindingOptions, data, isChildren ),
            boxWidth = null,
            rowIndex = !bindingOptions.swapSizes ? rowData.totalRows : 1,
            dividedBoxHeight = bindingOptions.maximumBoxHeight / rowData.totalRows;

        if ( !isChildren ) {
            container.innerHTML = _string.empty;
        }

        for ( var rowKey in rowData.boxesPerRow ) {
            if ( rowData.boxesPerRow.hasOwnProperty( rowKey ) ) {
                var boxHeight = dividedBoxHeight * rowIndex;

                if ( rowData.boxesPerRow.hasOwnProperty( rowKey ) ) {
                    var boxRow = createElement( container, "div", "box-row" ),
                        boxesLength = rowData.boxesPerRow[ rowKey ].length;
    
                    if ( !bindingOptions.showBoxGaps ) {
                        addClass( boxRow, "box-row-no-spacing" );
    
                    } else {
                        if ( !isDefinedNumber( boxWidth ) ) {
                            boxWidth = ( boxRow.offsetWidth / rowData.largestAmountOfBoxesOnARow ) - bindingOptions.spacing;
                        }
                    }
    
                    for ( var boxIndex = 0; boxIndex < boxesLength; boxIndex++ ) {
                        renderBox( bindingOptions, boxRow, boxHeight, boxWidth, rowData.boxesPerRow[ rowKey ][ boxIndex ], isChildren );
                    }
                }
    
                if ( !bindingOptions.swapSizes ) {
                    rowIndex--;
                } else {
                    rowIndex++;
                }
            }
        }

        if ( bindingOptions.reverseOrder ) {
            reverseElementsOrder( container );
        }
    }

    function renderBox( bindingOptions, boxRow, boxHeight, boxWidth, boxDetails, isChild ) {
        var box = createElement( boxRow, "div", "box" );
        box.id = boxDetails.id;

        if ( bindingOptions.currentView.fullScreenBoxId === boxDetails.id ) {
            box.style.height = bindingOptions.currentView.fullScreenBoxHeight + "px";
        } else {
            box.style.height = boxHeight + "px";
        }

        if ( isDefinedFunction( bindingOptions.onBoxClick ) ) {
            box.onclick = function( e ) {
                cancelBubble( e );
                fireCustomTrigger( bindingOptions.onBoxClick, boxDetails );
            };

        } else {
            addClass( box, "no-click" );
        }

        if ( isDefinedNumber( boxWidth ) ) {
            box.style.width = boxWidth + "px";
        }

        if ( isDefinedString( boxDetails.backgroundColor ) ) {
            box.style.backgroundColor = boxDetails.backgroundColor;
        }

        if ( isDefinedString( boxDetails.textColor ) ) {
            box.style.color = boxDetails.textColor;
        }

        if ( isDefinedString( boxDetails.borderColor ) ) {
            box.style.borderColor = boxDetails.borderColor;
        }

        if ( isDefinedString( boxDetails.name ) || ( isDefinedBoolean( boxDetails.showValue ) && boxDetails.showValue ) ) {
            var titleBar = createElement( box, "div", "box-title-bar" );

            createElementWithHTML( titleBar, "div", "box-title", boxDetails.name );

            if ( isDefinedBoolean( boxDetails.showValue ) && boxDetails.showValue && isDefinedNumber( boxDetails.value ) ) {
                createElementWithHTML( titleBar, "div", "box-value", boxDetails.value );
            }

            if ( !isChild ) {
                titleBar.onclick = cancelBubble;

                titleBar.ondblclick = function( e ) {
                    cancelBubble( e );

                    if ( isDefined( bindingOptions.currentView.fullScreenBoxId ) ) {
                        bindingOptions.currentView.fullScreenBoxId = null;
                        bindingOptions.currentView.fullScreenBoxHeight = null;
                    } else {
                        bindingOptions.currentView.fullScreenBoxId = boxDetails.id;
                        bindingOptions.currentView.fullScreenBoxHeight = boxRow.parentNode.offsetHeight;
                    }

                    renderControlContainer( bindingOptions );
                };
            }
        }

        if ( isDefinedString( boxDetails.description ) ) {
            createElementWithHTML( box, "p", "description", boxDetails.description );
        }

        if ( !isChild && isDefinedArray( boxDetails.children ) && boxDetails.children.length > 0 && ( !isDefinedBoolean( boxDetails.showChildren ) || boxDetails.showChildren ) ) {
            var boxRows = createElement( box, "div", "box-rows children" );
            
            renderControlRowsAndBoxes( bindingOptions, boxRows, boxDetails.children, true );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  ToolTip
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderControlToolTip( bindingOptions ) {
        if ( !isDefined( bindingOptions.currentView.tooltip ) ) {
            bindingOptions.currentView.tooltip = createElement( _parameter_Document.body, "div", "tree-js-tooltip" );
            bindingOptions.currentView.tooltip.style.display = "none";
    
            _parameter_Document.body.addEventListener( "mousemove", function() {
                hideToolTip( bindingOptions );
            } );
    
            _parameter_Document.addEventListener( "scroll", function() {
                hideToolTip( bindingOptions );
            } );
        }
    }

    function addToolTip( element, bindingOptions, text ) {
        if ( element !== null ) {
            element.onmousemove = function( e ) {
                showToolTip( e, bindingOptions, text );
            };
        }
    }

    function showToolTip( e, bindingOptions, text ) {
        cancelBubble( e );
        hideToolTip( bindingOptions );

        bindingOptions.currentView.tooltipTimer = setTimeout( function() {
            bindingOptions.currentView.tooltip.innerHTML = text;
            bindingOptions.currentView.tooltip.style.display = "block";

            showElementAtMousePosition( e, bindingOptions.currentView.tooltip );
        }, bindingOptions.tooltipDelay );
    }

    function hideToolTip( bindingOptions ) {
        if ( isDefined( bindingOptions.currentView.tooltip ) ) {
            if ( isDefined( bindingOptions.currentView.tooltipTimer ) ) {
                clearTimeout( bindingOptions.currentView.tooltipTimer );
                bindingOptions.currentView.tooltipTimer = null;
            }
    
            if ( bindingOptions.currentView.tooltip.style.display === "block" ) {
                bindingOptions.currentView.tooltip.style.display = "none";
            }
        }
    }

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getRowsAndBoxes( bindingOptions, data, isChildren ) {
        var boxesDetails = getBoxesAndMaximumPerRow( bindingOptions, data, isChildren ),
            boxesPerRow = {},
            largestAmountOfBoxesOnARow = 0;

        boxesDetails.boxes = boxesDetails.boxes.sort( function( a, b ) {
            return b.value - a.value;
        } );

        var rowNumber = 1,
            startIndex = 0,
            endIndex = boxesDetails.maximum,
            dataLength = boxesDetails.boxes.length;

        while ( true ) {
            var breakOnceProcessed = false;

            boxesPerRow[ rowNumber ] = [];

            if ( endIndex > dataLength ) {
                endIndex = dataLength;
                breakOnceProcessed = true;
            }

            for ( var arrayIndex = startIndex; arrayIndex < endIndex; arrayIndex++ ) {
                boxesPerRow[ rowNumber ].push( boxesDetails.boxes[ arrayIndex ] );
            }

            largestAmountOfBoxesOnARow = _parameter_Math.max( boxesPerRow[ rowNumber ].length, largestAmountOfBoxesOnARow );

            if ( breakOnceProcessed ) {
                break;

            } else {
                startIndex = endIndex;
                endIndex += boxesDetails.maximum + ( rowNumber * 2 );
                rowNumber++;
            }
        }

        return {
            boxesPerRow: boxesPerRow,
            largestAmountOfBoxesOnARow: largestAmountOfBoxesOnARow,
            totalRows: rowNumber
        };
    }

    function getBoxesAndMaximumPerRow( bindingOptions, data, isChildren ) {
        var boxes = [],
            dataLength = data.length;

        for ( var dataIndex = 0; dataIndex < dataLength; dataIndex++ ) {
            var dataItem = data[ dataIndex ];

            if ( !isDefinedString( dataItem.id ) ) {
                dataItem.id = newGuid();
            }

            if ( !isChildren && isDefined( bindingOptions.currentView.fullScreenBoxId ) ) {
                if ( dataItem.id === bindingOptions.currentView.fullScreenBoxId ) {
                    boxes.push( dataItem );
                }
               
            } else {
                if ( isChildren || !isDefinedString( dataItem.category ) || !isDefinedString( bindingOptions.currentView.category ) || bindingOptions.currentView.category === dataItem.category ) {
                    boxes.push( dataItem );
                }
            }
        }

        var totalItems = boxes.length,
            totalRows = bindingOptions.maximumRows,
            maximumBoxes = totalItems / totalRows;

        while ( maximumBoxes < 1.0 ) {
            totalRows--;

            maximumBoxes = totalItems / totalRows;
        }

        return {
            maximum: _parameter_Math.round( maximumBoxes ),
            boxes: boxes
        };
    }

    function getCategories( bindingOptions ) {
        var categories = [],
            dataLength = bindingOptions.data.length;

        for ( var dataIndex = 0; dataIndex < dataLength; dataIndex++ ) {
            var data = bindingOptions.data[ dataIndex ];

            if ( isDefinedString( data.category ) && categories.indexOf( data.category ) === -1 ) {
                categories.push( data.category );
            }
        }

        return categories;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;
        options.data = getDefaultArray( options.data, null );
        options.maximumRows = getDefaultNumber( options.maximumRows, 10 );
        options.spacing = getDefaultNumber( options.spacing, 10 );
        options.maximumBoxHeight = getDefaultNumber( options.maximumBoxHeight, 200 );
        options.reverseOrder = getDefaultBoolean( options.reverseOrder, false );
        options.showBoxGaps = getDefaultBoolean( options.showBoxGaps, true );
        options.swapSizes = getDefaultBoolean( options.swapSizes, false );

        options = buildAttributeOptionCustomTriggers( options );
        options = buildAttributeOptionStrings( options );

        return options;
    }

    function buildAttributeOptionStrings( options ) {
        options.titleText = getDefaultString( options.titleText, "Tree.js" );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onBeforeRender = getDefaultFunction( options.onBeforeRender, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );
        options.onBoxClick = getDefaultFunction( options.onBoxClick, null );
        options.onBackCategory = getDefaultFunction( options.onBackCategory, null );
        options.onNextCategory = getDefaultFunction( options.onNextCategory, null );
        options.onSetCategory = getDefaultFunction( options.onSetCategory, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( container, type, className ) {
        var result = null,
            nodeType = type.toLowerCase(),
            isText = nodeType === "text";

        if ( !_elements_Type.hasOwnProperty( nodeType ) ) {
            _elements_Type[ nodeType ] = isText ? _parameter_Document.createTextNode( _string.empty ) : _parameter_Document.createElement( nodeType );
        }

        result = _elements_Type[ nodeType ].cloneNode( false );

        if ( isDefined( className ) ) {
            result.className = className;
        }

        container.appendChild( result );

        return result;
    }

    function createElementWithHTML( container, type, className, html ) {
        var element = createElement( container, type, className );
        element.innerHTML = html;

        return element;
    }

    function getScrollPosition() {
        var doc = _parameter_Document.documentElement,
            left = ( _parameter_Window.pageXOffset || doc.scrollLeft )  - ( doc.clientLeft || 0 ),
            top = ( _parameter_Window.pageYOffset || doc.scrollTop ) - ( doc.clientTop || 0 );

        return {
            left: left,
            top: top
        };
    }

    function showElementAtMousePosition( e, element ) {
        var left = e.pageX,
            top = e.pageY,
            scrollPosition = getScrollPosition();

        element.style.display = "block";

        if ( left + element.offsetWidth > _parameter_Window.innerWidth ) {
            left -= element.offsetWidth;
        } else {
            left++;
        }

        if ( top + element.offsetHeight > _parameter_Window.innerHeight ) {
            top -= element.offsetHeight;
        } else {
            top++;
        }

        if ( left < scrollPosition.left ) {
            left = e.pageX + 1;
        }

        if ( top < scrollPosition.top ) {
            top = e.pageY + 1;
        }
        
        element.style.left = left + "px";
        element.style.top = top + "px";
    }

    function reverseElementsOrder( parent ) {
        var children = parent.children,
            childrenLength = children.length - 1;

        for ( ; childrenLength--; ) {
            parent.appendChild( children[ childrenLength ] );
        }
    }

    function addClass( element, className ) {
        element.className += _string.space + className;
    }

    function cancelBubble( e ) {
        e.preventDefault();
        e.cancelBubble = true;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = _parameter_JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                if ( !_configuration.safeMode ) {
                    console.error( "Errors in object: " + e1.message + ", " + e2.message );
                    parsed = false;
                }
                
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( "-" );
            }

            var character = _parameter_Math.floor( _parameter_Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
     * 
     * @returns     {Object}                                                The Tree.js class instance.
     */
    this.setConfiguration = function( newConfiguration ) {
        for ( var propertyName in newConfiguration ) {
            if ( newConfiguration.hasOwnProperty( propertyName ) ) {
                _configuration[ propertyName ] = newConfiguration[ propertyName ];
            }
        }

        buildDefaultConfiguration( _configuration );

        return this;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.backButtonText = getDefaultString( _configuration.backButtonText, "Back" );
        _configuration.nextButtonText = getDefaultString( _configuration.nextButtonText, "Next" );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of Tree.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    this.getVersion = function() {
        return "0.1.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Tree.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_Math = mathObject;
        _parameter_JSON = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$tree ) ) {
            _parameter_Window.$tree = this;
        }

    } ) ( document, window, Math, JSON );
} )();