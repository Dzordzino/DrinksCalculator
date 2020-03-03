(function() {
    var root = document.documentElement,
        drinksList = "",
        orderList = "",
        totalPrice = "",
        pageUrl = window.location.origin,
        languageObject = "",
        showElement = "",
        loadPlaceName = "",
        language = "";
    //add event listeners to the app elements
    function addEventListeners() {
        orderUtils.eventHandler(".js-enterDrink", "click", createDrink);
        orderUtils.eventHandler(".js-submitRound", "click", submitRound);
        orderUtils.eventHandler(".js-reset", "click", resetData);
        orderUtils.eventHandler(".js-savePlace", "click", savePlace);
        orderUtils.eventHandler(".js-loadPlace", "click", loadPlace);
        orderUtils.eventHandler(".js-resetOrders", "click", loadData);
        orderUtils.eventHandler(".js-sumModal", "click", showSum);
        orderUtils.eventHandler(".js-mainButton", "click", modalShow);
        orderUtils.eventHandler(".js-backButton", "click", stepBack);
        orderUtils.eventHandler(".js-languageChange ", "click", languageChange);
    }
    /**
    * render/remove text inside list if it's empty
    * @param target - modal element
    */
    function renderOverlay(target) {
        var listData = target.querySelector(".js-itemList"),
            sumButton = document.querySelector(".js-sumModal"),
            submitButton = document.querySelector(".js-submitRound");

        if (listData && !listData.innerHTML) {
            sumButton.setAttribute("disabled", true);
            submitButton.setAttribute("disabled", true);
            listData.classList.add("emptyContent");
        } else if (listData){
            sumButton.removeAttribute("disabled");
            submitButton.removeAttribute("disabled");
            listData.classList.remove("emptyContent");
        }
    }
    /**
    * show modal
    * @param e - click event
    */
    function modalShow(e) {
        var targetElement = e.currentTarget;
        if (!targetElement.classList.contains("js-closeModal")) {
            createModals.prototype.openModal(e);
            showElement = document.querySelector(".show");
            // render drinks inside modal list if endet another round button is clicked
            if (showElement.classList.contains("js-roundsModal")) {
                renderDrinks();
            }
            // render receipts inside modal list if tab review button is clicked
            if (showElement.classList.contains("js-receiptModal") && localStorage.getItem("orders")) {
                renderReceipts();
            }
            // render/remove text inside modal list if it's empty
            renderOverlay(showElement);
            // disable buttons in background
            disableButtonsToggle();
        }
    }
    /**
    * create new drink and add it to the local storage drinks item
    * @param e - click event
    */
    function createDrink(e) {
        var input = document.querySelector(".js-drinksInput"),
            inputValue = input.value,
            price = document.querySelector(".js-priceInput"),
            drinksArray = orderUtils.getItem("drinks", []),
            singleDrink = "",
            listItems = "",
            drinkCreated = e.currentTarget,
            errorText = document.querySelector(".js-errorText");
        // render error message
        errorText.innerHTML = languageObject[language]["Obavezna polja"];
        errorText.setAttribute("data-text", "Obavezna polja");
        // render new drink if value and price aren't empty
        if (inputValue && price.value) {
            singleDrink = '<p class="js-orderItem js-drinkOrdered orderButton">' +
                inputValue + "<span>" + price.value + "</span></p>";
            drinksList.innerHTML += singleDrink;
            drinksArray.push(singleDrink);
            orderUtils.setItem("drinks", drinksArray);
            input.value = "";
            price.value = "";
            errorText.classList.remove("show");
        }else {
            errorText.classList.add("show");
        }
        listItems = [].slice.call(drinksList.children);
        // add event listeners to all drinks inside modal list
        orderUtils.eventHandler(listItems, "click", removeDrink);
        // render/remove text inside modal list if it's empty
        renderOverlay(drinkCreated.parentElement.parentElement);
    }
    // render drinks inside rounds modal list
    function renderDrinks() {
        var addedDrinksArray = orderUtils.getItem("drinks", []),
            modalButtonsHolder = document.querySelector(".js-buttonsHolder");

        modalButtonsHolder.innerHTML = "";
        // render drinks inside oreder modal buttons holder if drink item from local storage isn't empty
        if (addedDrinksArray) {
            modalButtonsHolder.innerHTML += addedDrinksArray;
        }
        // add event listeners to all drinks inside modal list
        orderUtils.eventHandler(".js-drinkOrdered", "click", drinkAdd);
    }
    /**
    * add drink to the new order
    * @param e - click event
    */
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
        // render/remove text inside modal list if it's empty
        renderOverlay(singleDrink.parentElement.parentElement);
        // add event listeners to all drinks inside order modal list
        orderUtils.eventHandler(listItems, "click", removeDrink);
    }
    /**
    * create new round
    * @param e - click event
    */
    function submitRound(e) {
        var roundTotal = totalPrice.value,
            order = [].slice.call(orderList.children),
            singleOrder = "",
            hours = new Date().getHours() > 9 ? new Date().getHours() : 0 + new Date().getHours(),
            minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : 0 + new Date().getMinutes(),
            time = hours + ":" + minutes,
            allOrders = orderUtils.getItem("orders", []),
            orderId = orderUtils.getItem("orderId", 0);
        // create new order
        singleOrder = order.map(function(item) {
            return item.outerHTML;
        });
        // set new order if order item isn't empty
        if (order) {
            orderId++;
            allOrders.push("order" + orderId + "&" + time + "&" + roundTotal);
            // set local storage items
            orderUtils.setItem("orderId", orderId);
            orderUtils.setItem("orders", allOrders);
            orderUtils.setItem("order" + orderId, singleOrder);
            // revert default values to the modal elements
            orderList.innerHTML = "";
            totalPrice.value = 0;
            // close modal
            createModals.prototype.closeModal(e);
        }
    }
    // render receipts inside modal list
    function renderReceipts() {
        var allOrders = orderUtils.getItem("orders", []),
            info = "",
            tatalValue = 0,
            receiptHolder = document.querySelector(".js-receiptHolder"),
            totalPrice = document.querySelector(".js-totalPrice");

        receiptHolder.innerHTML = "";
        // render all receipts
        [].forEach.call(allOrders, function(item) {
            info = item.split("&");
            if (info.length > 1) {
                receiptHolder.innerHTML += '<p class="js-listItem js-orderInfo" data-id="' +
                    info[0] + '">' + info[0] + "<span>" + info[1] + "/" + info[2] + "</span></p>";
                tatalValue = tatalValue + Number(info[2]);
            }
        });
        // render tatal price
        totalPrice.value = tatalValue;
        // add event listeners to evry order item
        orderUtils.eventHandler(".js-orderInfo", "click", showDetails);
    }
    /**
    * remove drink from the list
    * @param e - click event
    */
    function removeDrink(e) {
        var singleItem = e.currentTarget,
            parentList = singleItem.parentElement,
            allItems = parentList.querySelectorAll(".js-orderItem"),
            listArray = [].slice.call(allItems).filter(function(item) {
                return item !== singleItem;
            });
        // decrease value by drink price
        if (parentList.classList.contains("js-orderList")) {
            totalPrice.value = totalPrice.value - Number(singleItem.querySelector("span").innerHTML);
        }
        // remove all data from the modal list
        parentList.innerHTML = "";
        // add data to the modal list except removed drink
        [].forEach.call(listArray, function(item) {
            parentList.appendChild(item);
        });
        // render/remove text inside modal list if it's empty
        renderOverlay(parentList.parentElement);
    }
    /**
    * show single order details
    * @param e - click event
    */
    function showDetails(e) {
        var singleOrderInfo = e.currentTarget,
            singleId = singleOrderInfo.getAttribute("data-id"),
            orderInfo = orderUtils.getItem(singleId, ""),
            orderHolder = document.querySelector(".js-infoOrder");
        // clear order list 
        orderHolder.innerHTML = "";
        document.querySelector(".js-stepHolder").style.marginLeft = "-200%";
        // add new data to the order list
        [].forEach.call(orderInfo, function(item) {
            orderHolder.innerHTML += item;
        });
    }
    // back to th previous modal
    function stepBack() {
        document.querySelector(".js-stepHolder").style.marginLeft = "-100%";
    }
    // reset all app data
    function resetData() {
        // clear local storage data
        orderUtils.removeItem("drinks");
        orderUtils.removeItem("orderId");
        clearOrders();
        // reload page
        window.location.reload();
    }
    // add new place
    function savePlace() {
        var placeName = document.querySelector(".js-placeName").value,
            drinkList = [],
            allPlaces = orderUtils.getItem("allPlaces", []),
            errorText = document.querySelector(".js-errorText"),
            allItems = [].slice.call(drinksList.children);
        // render error message
        errorText.innerHTML = languageObject[language]["Popuni mesta"];
        errorText.setAttribute("data-text", "Popuni mesta");
        // generate new place drink list
        drinkList = allItems.map(function(item) {
            return item.outerHTML;
        });
        // set new place if place name and drinks list aren't empty
        if (placeName && drinkList.length) {
            placeName = placeName.charAt(0).toUpperCase() + placeName.slice(1);
            // check if place allready exist
            if (allPlaces.indexOf(placeName) === -1) {
                allPlaces.push(placeName);
            }
            // set local storage items
            orderUtils.setItem(placeName, drinkList);
            orderUtils.setItem("allPlaces", allPlaces);
            orderUtils.setItem("drinks", drinkList);
            // remove error text
            errorText.classList.remove("show");
            // reload page
            renderLoad();
        } else {
            // display error text
            errorText.classList.add("show");
        }
    }
    /**
    * show reset orders modal
    * @param e - click event
    */
    function loadPlace(e) {
        var resetModal = document.querySelector(".js-orderResetModal");
        
        loadPlaceName = e.currentTarget.innerHTML
        resetModal.classList.add("show");
         // disable buttons in background
         disableButtonsToggle()
    }
    //render place data
    function loadData() {
        var placeName = loadPlaceName,
            placeData = orderUtils.getItem(placeName, "");

        orderUtils.setItem("drinks", placeData);
        drinksList.innerHTML = "";
        // render drinks
        clearOrders();
        renderExistingDrink(placeName);
    }
    // render page on load
    function renderLoad() {
        var allPlaces = orderUtils.getItem("allPlaces", []),
            loadButton = document.querySelector(".js-load"),
            placesList = document.querySelector(".js-placesList"),
            closeFucntion = createModals.prototype.closeModal;
        // render places if they are saved in local storage
        if (allPlaces.length) {
            placesList.innerHTML = "";
            loadButton.removeAttribute("disabled");
            [].forEach.call(allPlaces, function(item) {
                placesList.innerHTML += '<p class="js-closeModal js-loadPlace" data-id="load">' + item + "</p>";
            });
        } else {
            // disable load places button if there aren't places in local storage
            loadButton.setAttribute("disabled", true);
        }
        // get app language
        getLanguage();
        // add event listeners to close modal buttons
        orderUtils.eventHandler(".js-closeModal", "click", closeFucntion);
    }
    /**
    * render drinks based on place name
    * @param placeName - selected place name
    */
    function renderExistingDrink(placeName) {
        var drinks = orderUtils.getItem(placeName, ""),
            listItems = "";
        // render place drinks data
        [].forEach.call(drinks, function(item) {
            drinksList.innerHTML += item;
        });
        listItems = [].slice.call(drinksList.children);
        document.querySelector(".js-placeName").value = placeName;
        // clear receipts
        renderReceipts();
         // add event listeners to modal list
        orderUtils.eventHandler(listItems, "click", removeDrink);
    }
    // clear all orders from local storage
    function clearOrders() {
        var allOrders = Number(orderUtils.getItem("orderId", 0)),
            resetOrderModal = document.querySelector(".js-orderResetModal");

        for (var i = 1; i <= allOrders; i++) {
            orderUtils.removeItem("order" + i);
        }
        orderUtils.setItem("orderId", 0);
        orderUtils.removeItem("orders");
        if(resetOrderModal) {
            resetOrderModal.classList.remove("show");
             // disable buttons in background
             disableButtonsToggle()
        }
    }
    // show sum inside modal list
    function showSum() {
        renderSum();
        document.querySelector(".js-stepHolder").style.marginLeft = "0";
    }
    // show sum of all drinks inside modal list
    function renderSum() {
        var orderNumber = orderUtils.getItem("orderId", 0),
            object = "",
            sumArray = [];

        for (var i = 1; i <= orderNumber; i++) {
            object = orderUtils.getItem("order" + i, 0);
            // render sum for each drink
            drinksSum(object, sumArray);
        }
    }
    /**
    * render sum for each drink
    * @param sum - all drinks sum
    * @param sumArray - empty array
    */
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
    /**
    * render sum for each drink
    * @param drinksArray - all drinks array
    * @param completeSum - obejct with all drinks
    */
    function renderSumData(drinksArray, completeSum) {
        var sumHolder = document.querySelector(".js-sumInfo"),
            singleItemValue = "",
            singleItem = "";

        sumHolder.innerHTML = "";
        [].forEach.call(drinksArray, function(item) {
            singleItemValue = completeSum[item];
            singleItem = item.match("<s*p[^>]*>(.*?)<s*/s*p>");
            sumHolder.innerHTML += '<p class="orderButton">' + singleItem[1] + "<span>" + singleItemValue + "</span></p>";
        });
    }
    // get language data
    function getLanguage() {
        var appLang = orderUtils.getItem("lang", "rs"),
            langReque = new XMLHttpRequest(),
            styleText = "";
        // get language data
        langReque.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                languageObject = JSON.parse(this.responseText);
                // update css root variable
                styleText = '"' + languageObject[appLang]["Prazna lista"] + '"';
                root.style.setProperty("--emptyText", styleText);

                renderLanguage(appLang);
            }
        };
        langReque.open("GET", pageUrl + "/language.json", true);
        langReque.send();
    }
    /**
    * change language
    * @param e - event
    */
    function languageChange(e) {
        var currentLanguage = e.currentTarget.getAttribute("data-id"),
            styleTextChange = '"' + languageObject[currentLanguage]["Prazna lista"] + '"';

        root.style.setProperty("--emptyText", styleTextChange);
        orderUtils.setItem("lang", currentLanguage);
        renderLanguage(currentLanguage);
    }
    /**
    * render laguage to all element that have data-text or data-placeholder attribute
    * @param lang - language
    */
    function renderLanguage(lang) {
        var languageVariables = document.querySelectorAll("[data-text]"),
            placeholderVariables = document.querySelectorAll("[placeholder]"),
            itemText = "",
            itemPlaceholder = "";

        language = lang;
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
     // toggle main hloder button disable
    function disableButtonsToggle() {
        var allButtons = document.querySelectorAll(".js-mainButton");
        [].forEach.call(allButtons, function(item){
            if(item.classList.contains("clickDisabled")) {
                item.classList.remove("clickDisabled");  
            } else {
                item.classList.add("clickDisabled");  
            }
        })
    }
    // render app content
    function renderContent() {
        var allModals = new XMLHttpRequest(),
            modalArray = "";
        // get all modal objects
        allModals.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                modalArray = JSON.parse(this.responseText);
                // create each modal based on data repsonse
                [].forEach.call(modalArray.modals, function(item) {
                    new createModals(item);
                });
                // update global variables
                drinksList = document.querySelector(".js-drinksList");
                orderList = document.querySelector(".js-orderList");
                totalPrice = document.querySelector(".js-roundPrice");
                renderLoad();
                addEventListeners();
            }
        };
        allModals.open("GET", pageUrl + "/modal.json", true);
        allModals.send();
    }

    return renderContent();
})();
