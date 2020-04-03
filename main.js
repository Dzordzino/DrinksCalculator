(function() {
    var root = document.documentElement,
        drinksList = "",
        orderList = "",
        totalPrice = "",
        pageUrl = window.location.origin,
        languageObject = "",
        showElement = "",
        loadPlaceName = "",
        language = "",
        resetOrderModal = "",
        splitBillModal = "",
        billValue = "";
    //add event listeners to the app elements
    function addEventListeners() {
        orderUtils.eventHandler(".js-enterDrink", "click", createDrink);
        orderUtils.eventHandler(".js-submitRound", "click", submitRound);
        orderUtils.eventHandler(".js-reset", "click", resetData);
        orderUtils.eventHandler(".js-savePlace", "click", savePlace);
        orderUtils.eventHandler(".js-loadPlace", "click", loadPlace);
        orderUtils.eventHandler(".js-sumModal", "click", showSum);
        orderUtils.eventHandler(".js-mainButton", "click", modalShow);
        orderUtils.eventHandler(".js-backButton", "click", stepBack);
        orderUtils.eventHandler(".js-languageChange ", "click", languageChange);
        orderUtils.eventHandler(".js-splitModal ", "click", toggleSplitModal);
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
        errorText.textContent = languageObject[language]["Obavezna polja"];
        errorText.setAttribute("data-text", "Obavezna polja");
        // render new drink if value and price aren't empty
        if (inputValue && price.value && orderUtils.checkHTML(inputValue)) {
            singleDrink = '<p class="js-orderItem js-drinkOrdered orderButton">' +
                inputValue + "<span>" + price.value + "</span></p>";
            drinksList.innerHTML += singleDrink;
            drinksArray.push(singleDrink);
            orderUtils.setItem("drinks", drinksArray);
            input.value = "";
            price.value = "";
            errorText.classList.remove("show");
        } else {
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
        if (addedDrinksArray && orderUtils.checkHTML(addedDrinksArray)) {
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

        if (orderUtils.checkHTML(singleDrink.outerHTML)) {
            orderList.innerHTML += singleDrink.outerHTML;
            newPrice = priceValue + drinkPrice;
            totalPrice.value = newPrice;
            listItems = [].slice.call(orderList.children);
            // render/remove text inside modal list if it's empty
            renderOverlay(singleDrink.parentElement.parentElement);
            // add event listeners to all drinks inside order modal list
            orderUtils.eventHandler(listItems, "click", removeDrink);
        }
    }
    /**
    * create new round
    * @param e - click event
    */
    function submitRound(e) {
        var roundTotal = totalPrice.value,
            order = [].slice.call(orderList.children),
            singleOrder = "",
            hours = new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours(),
            minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes(),
            time = hours + ":" + minutes,
            allOrders = orderUtils.getItem("orders", []),
            orderId = orderUtils.getItem("orderId", 0);
            console.log(new Date().getMinutes())
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
    /**
    * separates order text from index
    * @param orderName - order name
    */
    function splitOrderName(orderName) {
        var numReg = /[+-]?\d+(?:\.\d+)?/g,
            number = numReg.exec(orderName),
            numberToSlice = "",
            orderText = "";

        if (number) {
            numberToSlice = orderName.indexOf(number)
            orderText = orderName.substr(0, numberToSlice)
            return [orderText, number]
        };

        return 
    }
    // render receipts inside modal list
    function renderReceipts() {
        var allOrders = orderUtils.getItem("orders", []),
            info = "",
            totalValue = 0,
            receiptHolder = document.querySelector(".js-receiptHolder"),
            totalPrice = document.querySelector(".js-totalPrice"),
            orderNameData = "";

        receiptHolder.innerHTML = "";
        // render all receipts
        [].forEach.call(allOrders, function(item) {
            info = item.split("&");
            if (info.length > 1) {
                //split name into sting and number
                orderNameData = splitOrderName(info[0]);
                receiptHolder.innerHTML += '<p class="js-listItem js-orderInfo" data-id="' +
                    info[0] + '"><span class="orderText" data-text="Porudzbina">' + languageObject[language]["Porudzbina"] + "</span>" + orderNameData[1] + "<span>" + info[1] + "/" + info[2] + "</span></p>";
                totalValue = totalValue + Number(info[2]);
            }
        });
        // render tatal price
        totalPrice.value = totalValue;
        // add event listeners to evry order item
        orderUtils.eventHandler(".js-orderInfo", "click", showDetails);
        if(totalValue > 0){
            billValue = totalValue
            document.querySelector(".js-splitModal").removeAttribute("disabled");
            createSplitModal()
        }
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
            if (orderUtils.checkHTML(item)) {
                orderHolder.innerHTML += item;
            }
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
        errorText.textContent = languageObject[language]["Popuni mesta"];
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
        loadPlaceName = e.currentTarget.textContent;
        if (resetModal === null) {
            resetOrderModal = new createModals(
                {
                    "modalClass": "js-orderResetModal reset",
                    "modalContent": '<p data-text="Obrisi narudzbine poruka">Ucitavanjem mesta obrisacete sve sacuvane porudzbine</p><button class="js-resetOrders modalButton" data-text="Obrisi narudzbine">Obrisi sve narudzbine</button>'
                }
            );
            orderUtils.eventHandler(".js-resetOrders", "click", loadData);
        }
        resetOrderModal.constructor.prototype.openModal(e);
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
                placesList.innerHTML += '<p class="js-closeModal js-loadPlace" data-id="orderReset">' + item + "</p>";
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
            resetOrderModal = document.querySelector(".show");

        for (var i = 1; i <= allOrders; i++) {
            orderUtils.removeItem("order" + i);
        }
        orderUtils.setItem("orderId", 0);
        orderUtils.removeItem("orders");
        if (resetOrderModal) {
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
    //function that splits tabs depending of person number
    function splitTabPerPerson() {
        var personNumber = document.querySelector(".js-peopleCount"),
            singleBill = document.querySelector(".js-singleTabBill");

        if (personNumber.value) {
            singleBill.innerText = Math.round(billValue / personNumber.value) + " din";
        } else {
            singleBill.innerText = "0"
        }
    }
    //show/hide split bill modal
    function toggleSplitModal(e) {
        var splitModal = document.querySelector(".js-splitBillModal"),
            parentModal = document.querySelector(".js-receiptModal");

        if (splitModal.classList.contains("show")) {
            splitModal.classList.remove("show");
            parentModal.classList.remove("hide");
        } else {
            document.querySelector(".js-tabBill").innerText = billValue + " din";
            splitBillModal.constructor.prototype.openModal(e);
            parentModal.classList.add("hide");
        }
    }
    //render split modal
    function createSplitModal() {
        var splitModal = document.querySelector(".js-splitBillModal");
        if (splitModal === null) {
            splitBillModal = new createModals(
                {
                    "modalClass": "js-splitBillModal billModal",
                    "closeButton": false,
                    "modalContent": '<h2 data-text="Podeli racun">Podeli racun</h2><p data-text="Iznos racuna">Iznos racuna</p><p class="js-tabBill tabBill"></p><p  data-text="Broj osoba">Unesite broj osoba</p><input class="js-peopleCount tabBill" type="number"><p data-text="Iznos po osobi">Iznos po osobi</p><p class="js-singleTabBill tabBill">0</p><button class="js-closeSplitModal modalButton" data-text="Natrag">Natrag</button'
                }
            );
            orderUtils.eventHandler(".js-closeSplitModal", "click", toggleSplitModal);
            orderUtils.eventHandler(".js-peopleCount", "keyup", splitTabPerPerson);
        }
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
                item.textContent = languageObject[lang][itemText];
            }
        });

        [].forEach.call(placeholderVariables, function(item) {
            itemPlaceholder = item.getAttribute("data-placeholder");
            if (itemPlaceholder && languageObject[lang][itemPlaceholder]) {
                item.setAttribute("placeholder", languageObject[lang][itemPlaceholder].toString());
            }
        });
    }
     // toggle main hloder button disable
    function disableButtonsToggle() {
        var allButtons = document.querySelectorAll(".js-mainButton");
        [].forEach.call(allButtons, function(item){
            if (item.classList.contains("clickDisabled")) {
                item.classList.remove("clickDisabled");  
            } else {
                item.classList.add("clickDisabled");  
            }
        })
    }
    // render app content
    function renderContent() {
        // create modals
        new createModals(
            {
                "modalClass": "js-loadModal",
                "bodyCloseModal": true,
                "modalContent": '<div class="drinksList js-placesList js-itemList"></div>'
            }
        );
        
        new createModals(
            {
                "modalClass": "js-roundsModal",
                "modalContent": '<div class="js-buttonsHolder buttonsHolder"></div><div class="drinksList js-orderList js-itemList"></div><div class="infoHolder"><input class="js-roundPrice orderPrice" type="text" readonly="readonly" value="0"><button class="modalButton close js-submitRound" data-text="Sacuvaj Turu">Sacuvaj Turu</button></div>'
            }
        );
        
        new createModals(
            {
                "modalClass": "js-receiptModal receiptModal",
                "modalContent": '<div class="stepPreview"><div class="js-stepHolder stepHolder"><div class="singleStep"><h2 data-text="Ukupna kolicina">Ukupna kolicina</h2><div class="drinksList js-sumInfo"></div><button class="js-backButton modalButton" data-text="Natrag">Natrag</button></div><div class="singleStep"><h2 data-text="Ukupna kolicina">Ukupna kolicina</h2><div class="drinksList js-receiptHolder js-itemList"></div><p class="billText" data-text="Iznos racuna">Iznos racuna</p><input class="js-totalPrice totalPrice" placeholder="0" readonly="readonly"><button class="js-sumModal modalButton close" data-text="Ukupna kolicina">Ukupna kolicina</button><button class="js-splitModal modalButton splitButton" data-text="Podeli racun" data-id="splitBill" disabled="disabled">Podeli racun</button></div><div class="singleStep"><h2 data-text="Ukupna kolicina">Ukupna kolicina</h2><div class="drinksList js-infoOrder"></div><button class="js-backButton modalButton" data-text="Natrag">Natrag</button></div></div></div>'
            }
        );
        
        new createModals(
            {
                "modalClass": "js-drinksModal",
                "bodyCloseModal": true,
                "modalContent": '<div class="newDrinkiInput"><input class="js-drinksInput" type="text" placeholder="Unesite naziv pica" data-placeholder="Unesite naziv pica"><input class="js-priceInput priceInput" type="number" placeholder="Unesite cenu pica" data-placeholder="Unesite cenu pica"><button class="js-enterDrink modalButton" data-text="Unesi stavku">Unesi stavku</button></div><h2 data-text="Lista Stavki">Lista Stavki</h2><div class="drinksList js-drinksList js-itemList"></div><div class="placeHolder"><input class="js-placeName" type="text" placeholder="Naziv Mesta" data-placeholder="Naziv Mesta"><button class="js-savePlace modalButton close" data-text="Sacuvaj">Sacuvaj</button><p class="js-errorText error" data-text="Popuni mesta">Naziv mesta / Lista stavki moraju biti popunjeni</p></div>'
            }
        );
        
        new createModals(
            {
                "modalClass": "js-resetModal reset",
                "modalContent": '<p data-text="Obrisi podatke">Da li zelite sve da obrisete sve podatke</p><button class="js-reset modalButton" data-text="Obrisi">Obrisi podatke</button>'
            }
        );

        // update global variables
        drinksList = document.querySelector(".js-drinksList");
        orderList = document.querySelector(".js-orderList");
        totalPrice = document.querySelector(".js-roundPrice");
        renderLoad();
        addEventListeners();
    }

    return renderContent();
})();
