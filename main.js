(function() {
    var orderData = {
        confirmMessage: "Da li zelite sve da obrisete sve podatke",
        drinksList: document.querySelector(".js-drinksList"),
        orderList: document.querySelector(".js-orderList"),
        totalPrice: document.querySelector(".js-roundPrice"),

        getItem: function(item, defaultValue) {
            var orderItem = localStorage.getItem(item) !== null ? JSON.parse(localStorage.getItem(item)) : defaultValue;
            return orderItem;
        },

        setItem: function(itemName, itemValue) {
            localStorage.setItem(itemName, JSON.stringify(itemValue));
        },

        removeItem: function(itemName) {
            console.log(itemName);
            localStorage.removeItem(itemName);
        }
    };

    function eventHandler(objectData, eventName, functionTrigger) {
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
    }

    function addEventListeners() {
        eventHandler(".js-enterDrink", "click", createDrink);
        eventHandler(".js-submitRound", "click", submitRound);
        eventHandler(".js-reset", "click", resetData);
        eventHandler(".js-savePlace", "click", savePlace);
        eventHandler(".js-loadPlace", "click", loadData);
        eventHandler(".js-sumModal", "click", showSum);
        eventHandler(".js-mainButton", "click", modalToggle);
        eventHandler(".js-closeModal", "click", modalToggle);
        eventHandler(".js-backButton", "click", stepBack);
    }

    function modalToggle(e) {
        var targetClass = e.currentTarget.getAttribute("data-id"),
            target = document.querySelector(".js-" + targetClass + "Modal");

        if (target !== null && target.classList.contains("show")) {
            target.classList.remove("show");
        } else if (target !== null && !target.classList.contains("show")) {
            target.classList.add("show");
            if (targetClass === "rounds") {
                renderDrinks();
            }
            if (targetClass === "receipt" && localStorage.getItem("orders") !== null) {
                renderReceipts();
            }
        }
    }

    function createDrink() {
        var input = document.querySelector(".js-drinksInput"),
            inputValue = input.value,
            price = document.querySelector(".js-priceInput"),
            drinksArray = orderData.getItem("drinks", []),
            singleDrink = "",
            listItems = "";

        if (inputValue !== "") {
            singleDrink =
                '<p class="js-orderItem js-drinkOrdered orderButton">' +
                inputValue +
                "<span>" +
                price.value +
                "</span></p>";
            orderData.drinksList.innerHTML += singleDrink;
            drinksArray.push(singleDrink);
            orderData.setItem("drinks", drinksArray);
            input.value = "";
            price.value = "";
        }
        listItems = [].slice.call(orderData.drinksList.children);
        eventHandler(listItems, "click", removeDrink);
    }

    function renderDrinks() {
        var addedDrinksArray = orderData.getItem("drinks", []),
            modalButtonsHolder = document.querySelector(".js-buttonsHolder");

        modalButtonsHolder.innerHTML = "";
        if (addedDrinksArray !== []) {
            modalButtonsHolder.innerHTML += addedDrinksArray;
        }
        eventHandler(".js-drinkOrdered", "click", drinkAdd);
    }

    function drinkAdd(e) {
        var orderList = orderData.orderList,
            singleDrink = e.currentTarget,
            totalPrice = orderData.totalPrice,
            priceValue = Number(totalPrice.value),
            newPrice = "",
            drinkPrice = Number(singleDrink.querySelector("span").innerHTML),
            listItems = [];

        orderList.innerHTML += singleDrink.outerHTML;
        newPrice = priceValue + drinkPrice;
        totalPrice.value = newPrice;
        listItems = [].slice.call(orderList.children);
        eventHandler(listItems, "click", removeDrink);
    }

    function submitRound(e) {
        var roundTotal = orderData.totalPrice.value,
            order = [].slice.call(orderData.orderList.children),
            singleOrder = [],
            hours = new Date().getHours(),
            minutes = new Date().getMinutes(),
            time = hours + ":" + minutes,
            allOrders = orderData.getItem("orders", []),
            orderId = orderData.getItem("orderId", 0);
        [].forEach.call(order, function(item) {
            singleOrder.push(item.outerHTML);
        });
        if (order !== "") {
            orderId++;
            allOrders.push("order" + orderId + "&" + time + "&" + roundTotal);
            orderData.setItem("orderId", orderId);
            orderData.setItem("orders", allOrders);
            orderData.setItem("order" + orderId, singleOrder);
            orderData.orderList.innerHTML = "";
            orderData.totalPrice.value = 0;
            modalToggle(e);
        }
    }

    function renderReceipts() {
        var allOrders = orderData.getItem("orders", []),
            info = "",
            tatalValue = 0,
            receiptHolder = document.querySelector(".js-receiptHolder"),
            totalPrice = document.querySelector(".js-totalPrice");

        receiptHolder.innerHTML = "";
        [].forEach.call(allOrders, function(item) {
            info = item.split("&");
            if (info.length > 1) {
                receiptHolder.innerHTML +=
                    '<p class="js-listItem js-orderInfo" data-id="' +
                    info[0] +
                    '">' +
                    info[0] +
                    "<span>" +
                    info[1] +
                    "/" +
                    info[2] +
                    "</span></p>";
                tatalValue = tatalValue + Number(info[2]);
            }
        });
        totalPrice.value = tatalValue;
        eventHandler(".js-orderInfo", "click", showDetails);
    }

    function removeDrink(e) {
        var singleItem = e.currentTarget,
            drinkParent = singleItem.parentElement.getAttribute("data-id"),
            parentList = orderData[drinkParent],
            totalPrice = orderData.totalPrice,
            allItems = parentList.querySelectorAll(".js-orderItem"),
            listArray = [].slice.call(allItems).filter(function(item) {
                return item !== singleItem;
            });

        if (drinkParent === "orderList") {
            totalPrice.value = totalPrice.value - Number(singleItem.querySelector("span").innerHTML);
        }
        parentList.innerHTML = "";
        [].forEach.call(listArray, function(item) {
            parentList.appendChild(item);
        });
    }

    function showDetails(e) {
        var singleOrderInfo = e.currentTarget,
            singleId = singleOrderInfo.getAttribute("data-id"),
            orderInfo = orderData.getItem(singleId, ""),
            orderHolder = document.querySelector(".js-infoOrder");

        orderHolder.innerHTML = "";
        document.querySelector(".js-stepHolder").style.marginLeft = "-200%";
        [].forEach.call(orderInfo, function(item) {
            orderHolder.innerHTML += item;
        });
    }

    function stepBack() {
        document.querySelector(".js-stepHolder").style.marginLeft = "-100%";
    }

    function resetData() {
        var allOrders = Number(orderData.getItem("orderId", 0)),
            action = confirm(orderData.confirmMessage);
        if (action === true) {
            orderData.removeItem("drinks");
            orderData.removeItem("orderId");
            orderData.removeItem("orders");
            for (var i = 1; i <= allOrders; i++) {
                orderData.removeItem("order" + i);
            }
            window.location.reload();
        }
    }

    function savePlace() {
        var placeName = document.querySelector(".js-placeName").value,
            drinkList = [],
            allPlaces = orderData.getItem("allPlaces", []),
            errorText = document.querySelector(".js-errorText"),
            allItems = [].slice.call(orderData.drinksList.children);

        [].forEach.call(allItems, function(item) {
            drinkList.push(item.outerHTML);
        });
        if (placeName !== "" && drinkList.length !== 0) {
            placeName = placeName.charAt(0).toUpperCase() + placeName.slice(1);
            if (!allPlaces.indexOf(placeName) > -1) {
                allPlaces.push(placeName);
            }
            orderData.setItem(placeName, drinkList);
            orderData.setItem("allPlaces", allPlaces);
            orderData.setItem("drinks", drinkList);
            errorText.classList.remove("show");
            renderLoad();
        } else {
            errorText.classList.add("show");
        }
    }

    function loadData(e) {
        var placeName = e.currentTarget.innerHTML,
            placeData = orderData.getItem(placeName, "");

        orderData.setItem("drinks", placeData);
        orderData.drinksList.innerHTML = "";
        renderExistingDrink(placeName);
    }

    function renderLoad() {
        var allPlaces = orderData.getItem("allPlaces", []),
            loadButton = document.querySelector(".js-load"),
            placesList = document.querySelector(".js-placesList");
        if (allPlaces.length > 0) {
            placesList.innerHTML = "";
            loadButton.removeAttribute("disabled");
            [].forEach.call(allPlaces, function(item) {
                placesList.innerHTML += '<p class="js-closeModal js-loadPlace" data-id="load">' + item + "</p>";
            });
        } else {
            loadButton.setAttribute("disabled", true);
        }
        eventHandler(".js-closeModal", "click", modalToggle);
    }

    function renderExistingDrink(placeName) {
        var drinks = orderData.getItem(placeName, ""),
            allOrders = Number(orderData.getItem("orderId", 0)),
            listItems = "";

        [].forEach.call(drinks, function(item) {
            orderData.drinksList.innerHTML += item;
        });
        listItems = [].slice.call(orderData.drinksList.children);
        document.querySelector(".js-placeName").value = placeName;
        for (var i = 1; i <= allOrders; i++) {
            orderData.removeItem("order" + i);
        }
        orderData.removeItem("orders");
        renderReceipts();
        eventHandler(listItems, "click", removeDrink);
    }

    function showSum() {
        renderSum();
        document.querySelector(".js-stepHolder").style.marginLeft = "0";
    }

    function renderSum() {
        var orderNumber = orderData.getItem("orderId", 0),
            object = "",
            sumArray = [];

        for (var i = 1; i <= orderNumber; i++) {
            object = orderData.getItem("order" + i, 0);
            drinksSum(object, sumArray);
        }
    }

    function drinksSum(sum, array) {
        var spanElement = "",
            singleDrink = "",
            sumAll = "",
            allDrinks = [];

        [].forEach.call(sum, function(item) {
            spanElement = item.match("<s*span[^>]*>(.*?)<s*/s*span>");
            singleDrink = item.replace(spanElement[0], "");
            array.push(singleDrink);
        });
        sumAll = array.reduce(function(total, currentValue) {
            if (allDrinks.indexOf(currentValue) == -1) {
                allDrinks.push(currentValue);
            }
            total[currentValue] = total[currentValue] + 1 || 1;
            return total;
        }, {});
        renderSumData(allDrinks, sumAll);
    }

    function renderSumData(drinksArray, completeSum) {
        var sumHolder = document.querySelector(".js-sumInfo"),
            singleItemValue = "",
            singleItem = "";

        sumHolder.innerHTML = "";
        [].forEach.call(drinksArray, function(item) {
            singleItemValue = completeSum[item];
            singleItem = item.match("<s*p[^>]*>(.*?)<s*/s*p>");
            sumHolder.innerHTML +=
                '<p class="orderButton">' + singleItem[1] + "<span>" + singleItemValue + "</span></p>";
        });
    }

    return renderLoad(), addEventListeners();
})();
