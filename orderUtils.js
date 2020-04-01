var orderUtils = (function() {
    var order = {
        /**
        * Get data from local storage
        * @param item - local storage item name
        * @param defaultValue - default value that returns if local storage is empty
        * @return -local storage data or default value
        */
        getItem: function(item, defaultValue) {
            var orderItem = localStorage.getItem(item) !== null ? JSON.parse(localStorage.getItem(item)) : defaultValue ;
            return orderItem;
        },
        /**
        * Save data to local storage
        * @param itemName - new local storage item name
        * @param itemValue - new local storage item value
        */
        setItem: function(itemName, itemValue) {
            localStorage.setItem(itemName, JSON.stringify(itemValue));
        },
        /**
        * Remove item from local storage
        * @param itemName - local storage item nae that will be removed
        */
        removeItem: function(itemName) {
            localStorage.removeItem(itemName);
        },
        /**
        * Add event listener to the element
        * @param objectData      - list of elements or element class
        * @param eventName       - event (click, scroll...)
        * @param functionTrigger - function trigered by event
        */
        eventHandler: function(objectData, eventName, functionTrigger) {
            var array = "";
            if (!Array.isArray(objectData)) {
                array = document.querySelectorAll(objectData) !== null ? [].slice.call(document.querySelectorAll(objectData)) : [] ;
            } else {
                array = objectData;
            }
            if (array) {
                [].forEach.call(array, function(item) {
                    item.addEventListener(eventName, functionTrigger);
                });
            }
        },
        /**
        * Remove event listener to the element
        * @param objectData      - list of elements or element class
        * @param eventName       - event (click, scroll...)
        * @param functionTrigger - function trigered by event
        */
        eventHandlerRemove: function(objectData, eventName, functionTrigger) {
            var array = "";
            if (!Array.isArray(objectData)) {
                array = document.querySelectorAll(objectData) !== null ? [].slice.call(document.querySelectorAll(objectData)) : [];
            } else {
                array = objectData;
            }
            if (array) {
                [].forEach.call(array, function(item) {
                    item.removeEventListener(eventName, functionTrigger);
                });
            }
        },
        /**
        * Add event listener to the element
        * @param elementType        - elemnt type (input, button...)
        * @param elementClass       - element classes
        * @param innerText          - element inner text
        * @param elementAttributes  - all element attributes
        * @return new element
        */
        renderElement: function(elementType, elementClass, innerText, elementAttributes) {
            var newElement = "";
            if (elementType) {
                newElement = document.createElement(elementType);

                elementClass ? newElement.className = elementClass : "" ;

                innerText ? newElement.innerText = innerText : "" ;

                if (elementAttributes && Array.isArray(elementAttributes)) {
                    [].forEach.call(elementAttributes, function(item) {
                        newElement.setAttribute(item.name, item.data);
                    });
                }
            }

            return newElement;
        },
        /**
        * Check html code
        * @param html - text string
        * @return checked html code
        */
        checkHTML: function(html) {
            return /<(br|basefont|hr|input|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|ins|kbd|label|legend|li|map|mark|menu|meter|nav|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|samp|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|video).*?<\/\2>|(^[0-9a-zA-Z' ']+$)/i
            .test(html)
        }
    };

    return order;
})();
