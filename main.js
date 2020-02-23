(function() {
    var root = document.documentElement,
        drinksList = "",
        orderList = "",
        totalPrice = "",
        pageUrl = window.location.origin,
        languageObject = "",
        language = "rs",
        showElement = "";

    function addEventListeners() {
        orderUtils.eventHandler(".js-enterDrink", "click", createDrink);
        orderUtils.eventHandler(".js-submitRound", "click", submitRound);
        orderUtils.eventHandler(".js-reset", "click", resetData);
        orderUtils.eventHandler(".js-savePlace", "click", savePlace);
        orderUtils.eventHandler(".js-loadPlace", "click", loadData);
        orderUtils.eventHandler(".js-sumModal", "click", showSum);
        orderUtils.eventHandler(".js-mainButton", "click", modalToggle);
        orderUtils.eventHandler(".js-closeModal", "click", modalToggle);
        orderUtils.eventHandler(".js-backButton", "click", stepBack);
        orderUtils.eventHandler(".js-languageChange ", "click", languageChange);
    }
    function renderOverlay(target) {
        var listData = target.querySelector(".js-itemList"),
            sumButton = document.querySelector(".js-sumModal"),
            submitButton = document.querySelector(".js-submitRound");

        if (!listData.innerHTML) {
            sumButton.setAttribute("disabled", true);
            submitButton.setAttribute("disabled", true);
            listData.classList.add("emptyContent");
        } else {
            sumButton.removeAttribute("disabled");
            submitButton.removeAttribute("disabled");
            listData.classList.remove("emptyContent");
        }
    }
    function modalToggle(e) {
        var targetElement = e.currentTarget;
        if (!targetElement.classList.contains("js-closeModal")) {
            createModals.prototype.openModal(e);
            showElement = document.querySelector(".show");
            if (showElement.classList.contains("js-roundsModal")) {
                renderDrinks();
            }
            if (showElement.classList.contains("js-receiptModal") && localStorage.getItem("orders")) {
                renderReceipts();
            }
            renderOverlay(showElement);
        }
    }

    function createDrink(e) {
        var input = document.querySelector(".js-drinksInput"),
            inputValue = input.value,
            price = document.querySelector(".js-priceInput"),
            drinksArray = orderUtils.getItem("drinks", []),
            singleDrink = "",
            listItems = "",
            drinkCreated = e.currentTarget;

        if (inputValue) {
            singleDrink =
                '<p class="js-orderItem js-drinkOrdered orderButton">' +
                inputValue +
                "<span>" +
                price.value +
                "</span></p>";
            drinksList.innerHTML += singleDrink;
            drinksArray.push(singleDrink);
            orderUtils.setItem("drinks", drinksArray);
            input.value = "";
            price.value = "";
        }
        listItems = [].slice.call(drinksList.children);
        orderUtils.eventHandler(listItems, "click", removeDrink);
        renderOverlay(drinkCreated.parentElement.parentElement);
    }

    function renderDrinks() {
        var addedDrinksArray = orderUtils.getItem("drinks", []),
            modalButtonsHolder = document.querySelector(".js-buttonsHolder");

        modalButtonsHolder.innerHTML = "";
        if (addedDrinksArray) {
            modalButtonsHolder.innerHTML += addedDrinksArray;
        }
        orderUtils.eventHandler(".js-drinkOrdered", "click", drinkAdd);
    }

    function drinkAdd(e) {
        var singleDrink = e.currentTarget,
            priceValue = Number(totalPrice.value),
            newPrice = "",
            drinkPrice = Number(singleDrink.querySelector("span").innerHTML),
            listItems = [];

        orderList.innerHTML += singleDrink.outerHTML;
        newPrice = priceValue + drinkPrice;
        totalPrice.value = newPrice;
        listItems = [].slice.call(orderList.children);
        renderOverlay(singleDrink.parentElement.parentElement);
        orderUtils.eventHandler(listItems, "click", removeDrink);
    }

    function submitRound(e) {
        var roundTotal = totalPrice.value,
            order = [].slice.call(orderList.children),
            singleOrder = "",
            hours = new Date().getHours() > 9 ? new Date().getHours() : 0 + new Date().getHours(),
            minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : 0 + new Date().getMinutes(),
            time = hours + ":" + minutes,
            allOrders = orderUtils.getItem("orders", []),
            orderId = orderUtils.getItem("orderId", 0);

        singleOrder = order.map(function(item) {
            return item.outerHTML;
        });
        if (order) {
            orderId++;
            allOrders.push("order" + orderId + "&" + time + "&" + roundTotal);
            orderUtils.setItem("orderId", orderId);
            orderUtils.setItem("orders", allOrders);
            orderUtils.setItem("order" + orderId, singleOrder);
            orderList.innerHTML = "";
            totalPrice.value = 0;
            createModals.prototype.closeModal(e);
        }
    }

    function renderReceipts() {
        var allOrders = orderUtils.getItem("orders", []),
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
        orderUtils.eventHandler(".js-orderInfo", "click", showDetails);
    }

    function removeDrink(e) {
        var singleItem = e.currentTarget,
            parentList = singleItem.parentElement,
            allItems = parentList.querySelectorAll(".js-orderItem"),
            listArray = [].slice.call(allItems).filter(function(item) {
                return item !== singleItem;
            });

        if (parentList.classList.contains("js-orderList")) {
            totalPrice.value = totalPrice.value - Number(singleItem.querySelector("span").innerHTML);
        }
        parentList.innerHTML = "";
        [].forEach.call(listArray, function(item) {
            parentList.appendChild(item);
        });
        renderOverlay(parentList.parentElement);
    }

    function showDetails(e) {
        var singleOrderInfo = e.currentTarget,
            singleId = singleOrderInfo.getAttribute("data-id"),
            orderInfo = orderUtils.getItem(singleId, ""),
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
        var action = confirm(languageObject[language]["Obrisi podatke"]);

        if (action) {
            orderUtils.removeItem("drinks");
            orderUtils.removeItem("orderId");
            clearOrders();
            window.location.reload();
        }
    }

    function savePlace() {
        var placeName = document.querySelector(".js-placeName").value,
            drinkList = [],
            allPlaces = orderUtils.getItem("allPlaces", []),
            errorText = document.querySelector(".js-errorText"),
            allItems = [].slice.call(drinksList.children);

        drinkList = allItems.map(function(item) {
            return item.outerHTML;
        });
        if (placeName && drinkList.length) {
            placeName = placeName.charAt(0).toUpperCase() + placeName.slice(1);
            if (allPlaces.indexOf(placeName) === -1) {
                allPlaces.push(placeName);
            }
            orderUtils.setItem(placeName, drinkList);
            orderUtils.setItem("allPlaces", allPlaces);
            orderUtils.setItem("drinks", drinkList);
            errorText.classList.remove("show");
            renderLoad();
        } else {
            errorText.classList.add("show");
        }
    }

    function loadData(e) {
        var placeName = e.currentTarget.innerHTML,
            placeData = orderUtils.getItem(placeName, "");

        orderUtils.setItem("drinks", placeData);
        drinksList.innerHTML = "";
        renderExistingDrink(placeName);
    }

    function renderLoad() {
        var allPlaces = orderUtils.getItem("allPlaces", []),
            loadButton = document.querySelector(".js-load"),
            placesList = document.querySelector(".js-placesList"),
            closeFucntion = createModals.prototype.closeModal;

        if (allPlaces.length) {
            placesList.innerHTML = "";
            loadButton.removeAttribute("disabled");
            [].forEach.call(allPlaces, function(item) {
                placesList.innerHTML += '<p class="js-closeModal js-loadPlace" data-id="load">' + item + "</p>";
            });
        } else {
            loadButton.setAttribute("disabled", true);
        }
        getLanguage();
        orderUtils.eventHandler(".js-closeModal", "click", closeFucntion);
    }

    function renderExistingDrink(placeName) {
        var drinks = orderUtils.getItem(placeName, ""),
            listItems = "";

        [].forEach.call(drinks, function(item) {
            drinksList.innerHTML += item;
        });
        listItems = [].slice.call(drinksList.children);
        document.querySelector(".js-placeName").value = placeName;
        renderReceipts();
        orderUtils.eventHandler(listItems, "click", removeDrink);
    }

    function clearOrders() {
        var allOrders = Number(orderUtils.getItem("orderId", 0));
        for (var i = 1; i <= allOrders; i++) {
            orderUtils.removeItem("order" + i);
        }
        orderUtils.setItem("orderId", 0);
        orderUtils.removeItem("orders");
    }

    function showSum() {
        renderSum();
        document.querySelector(".js-stepHolder").style.marginLeft = "0";
    }

    function renderSum() {
        var orderNumber = orderUtils.getItem("orderId", 0),
            object = "",
            sumArray = [];

        for (var i = 1; i <= orderNumber; i++) {
            object = orderUtils.getItem("order" + i, 0);
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
            if (allDrinks.indexOf(currentValue) === -1) {
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

    function getLanguage() {
        var appLang = orderUtils.getItem("lang", "rs"),
            langReque = new XMLHttpRequest(),
            styleText = "";

        langReque.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                languageObject = JSON.parse(this.responseText);
                styleText = '"' + languageObject[appLang]["Prazna lista"] + '"';
                root.style.setProperty("--emptyText", styleText);
                renderLanguage(appLang);
            }
        };
        langReque.open("GET", `${pageUrl}/language.json`, true);
        langReque.send();
    }

    function languageChange(e) {
        var currentLanguage = e.currentTarget.getAttribute("data-id"),
            styleTextChange = '"' + languageObject[currentLanguage]["Prazna lista"] + '"';

        root.style.setProperty("--emptyText", styleTextChange);
        orderUtils.setItem("lang", currentLanguage);
        language = currentLanguage;
        renderLanguage(currentLanguage);
    }

    function renderLanguage(lang) {
        var languageVariables = document.querySelectorAll("[data-text]"),
            placeholderVariables = document.querySelectorAll("[placeholder]"),
            itemText = "",
            itemPlaceholder = "";

        [].forEach.call(languageVariables, function(item) {
            itemText = item.getAttribute("data-text");
            if (itemText && languageObject[lang][itemText]) {
                item.innerHTML = languageObject[lang][itemText];
            }
        });

        [].forEach.call(placeholderVariables, function(item) {
            itemPlaceholder = item.getAttribute("data-placeholder");
            if (itemPlaceholder && languageObject[lang][itemPlaceholder]) {
                item.setAttribute("placeholder", languageObject[lang][itemPlaceholder]);
            }
        });
    }

    function renderContent() {
        var allModals = new XMLHttpRequest(),
            modalArray = "";

        allModals.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                modalArray = JSON.parse(this.responseText);
                [].forEach.call(modalArray.modals, function(item) {
                    new createModals(item);
                });
                drinksList = document.querySelector(".js-drinksList");
                orderList = document.querySelector(".js-orderList");
                totalPrice = document.querySelector(".js-roundPrice");
                renderLoad();
                addEventListeners();
            }
        };
        allModals.open("GET", `${pageUrl}/modal.json`, true);
        allModals.send();
    }

    return renderContent();
})();
