var orderUtils = (function() {
    var order = {
        getItem: function(item, defaultValue) {
            var orderItem = localStorage.getItem(item) !== null ? JSON.parse(localStorage.getItem(item)) : defaultValue;
            return orderItem;
        },

        setItem: function(itemName, itemValue) {
            localStorage.setItem(itemName, JSON.stringify(itemValue));
        },

        removeItem: function(itemName) {
            localStorage.removeItem(itemName);
        },
        eventHandler: function(objectData, eventName, functionTrigger) {
            var array = "";
            if (!Array.isArray(objectData)) {
                array =
                    document.querySelectorAll(objectData) !== null
                        ? [].slice.call(document.querySelectorAll(objectData))
                        : [];
            } else {
                array = objectData;
            }
            if (array.length !== 0) {
                [].forEach.call(array, function(item) {
                    item.addEventListener(eventName, functionTrigger);
                });
            }
        },
        renderElement: function(elementType, elementClass, innerText, elementAttributes) {
            var newElement = "";
            if (elementType) {
                newElement = document.createElement(elementType);

                if (elementClass) {
                    newElement.className = elementClass;
                }

                if (innerText) {
                    newElement.innerText = innerText;
                }

                if (elementAttributes && Array.isArray(elementAttributes)) {
                    [].forEach.call(elementAttributes, function(item) {
                        newElement.setAttribute(item.name, item.data);
                    });
                }
            }

            return newElement;
        }
    };

    return order;
})();
