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
        bindingOptions.currentView.element.innerHTML = _string.empty;
        bindingOptions.currentView.element.className = "tree-js";

        renderControlToolTip( bindingOptions );
        renderRowsAndBoxes( bindingOptions, bindingOptions.data );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Render:  Rows & Boxes
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function renderRowsAndBoxes( bindingOptions, data ) {
        var rowData = getRowsAndBoxes( bindingOptions, data ),
            boxRows = createElement( bindingOptions.currentView.element, "div", "box-rows" ),
            boxWidth = null,
            rowIndex = !bindingOptions.swapSizes ? rowData.totalRows : 1,
            dividedBoxHeight = bindingOptions.maximumBoxHeight / rowData.totalRows;

        for ( var rowKey in rowData.boxesPerRow ) {
            var boxHeight = dividedBoxHeight * rowIndex;

            if ( rowData.boxesPerRow.hasOwnProperty( rowKey ) ) {
                var boxRow = createElement( boxRows, "div", "box-row" ),
                    boxesLength = rowData.boxesPerRow[ rowKey ].length;

                if ( !bindingOptions.showBoxGaps ) {
                    addClass( boxRow, "box-row-no-spacing" );

                } else {
                    if ( !isDefinedNumber( boxWidth ) ) {
                        boxWidth = ( boxRow.offsetWidth / rowData.largestAmountOfBoxesOnARow ) - bindingOptions.spacing;
                    }
                }

                for ( var boxIndex = 0; boxIndex < boxesLength; boxIndex++ ) {
                    var boxDetails = rowData.boxesPerRow[ rowKey ][ boxIndex ],
                        box = createElement( boxRow, "div", "box" );

                    box.style.height = boxHeight + "px";

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
                }
            }

            if ( !bindingOptions.swapSizes ) {
                rowIndex--;
            } else {
                rowIndex++;
            }
        }

        if ( bindingOptions.reverseOrder ) {
            reverseElementsOrder( boxRows );
        }
    }

    function getRowsAndBoxes( bindingOptions, data ) {
        var totalBoxesForFirstRow = getTotalBoxesForFirstRow( bindingOptions, data ),
            boxesPerRow = {},
            largestAmountOfBoxesOnARow = 0;

        data = data.sort( function( a, b ) {
            return b.value - a.value;
        } );

        var rowNumber = 1
            startIndex = 0,
            endIndex = totalBoxesForFirstRow,
            dataLength = data.length;

        while ( true ) {
            var breakOnceProcessed = false;

            boxesPerRow[ rowNumber ] = [];

            if ( endIndex > dataLength ) {
                endIndex = dataLength;
                breakOnceProcessed = true;
            }

            for ( var arrayIndex = startIndex; arrayIndex < endIndex; arrayIndex++ ) {
                boxesPerRow[ rowNumber ].push( data[ arrayIndex ] );
            }

            largestAmountOfBoxesOnARow = _parameter_Math.max( boxesPerRow[ rowNumber ].length, largestAmountOfBoxesOnARow );

            if ( breakOnceProcessed ) {
                break;

            } else {
                startIndex = endIndex;
                endIndex += totalBoxesForFirstRow + ( rowNumber * 2 );
                rowNumber++;
            }
        }

        return {
            boxesPerRow: boxesPerRow,
            largestAmountOfBoxesOnARow: largestAmountOfBoxesOnARow,
            totalRows: rowNumber
        };
    }

    function getTotalBoxesForFirstRow( bindingOptions, data ) {
        var totalItems = data.length,
            totalRows = bindingOptions.maximumRows,
            totalBoxes = totalItems / totalRows;

        while ( totalBoxes < 1.0 ) {
            totalRows--;

            totalBoxes = totalItems / totalRows;
        }

        return _parameter_Math.round( totalBoxes );
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

        return buildAttributeOptionCustomTriggers( options );
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onBeforeRender = getDefaultFunction( options.onBeforeRender, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );

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
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );
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