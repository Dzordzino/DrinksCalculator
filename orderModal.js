var createModals = (function() {
    "use strict";

    function Modal() {
        this.arguments = "";
        this.default = {
            pagesNumber: 1,
            modalClass: "",
            renderList: true,
            listClass: "",
            closeButton: false,
            buttonsHolder: false,
            infoHolder: false,
            placeHolder: false,
            newDrinkIput: false,
            title: "",
            bodyCloseModal: false,
            backButton: false,
            totalPriceInput: false,
            sumButton: false,
            modalButton: false,
            message: false,
            resetAllButton: false
        };

        _init.call(this, arguments[0])
    }

    Modal.prototype = {
        constructor: Modal,
        openModal: function(e) {
            var targetClass = e.currentTarget.getAttribute("data-id"),
                target = document.querySelector(".js-" + targetClass + "Modal");
            if (target) {
                target.classList.add("show");
            }
            if(target.classList.contains("js-bodyClose")) {
                orderUtils.eventHandler(".js-background", "click", this.closeModal);
            } else {
                orderUtils.eventHandlerRemove(".js-background", "click", this.closeModal);
            }
        },
        closeModal: function() {
            var target = document.querySelector(".show"),
                targetList = target.querySelector(".js-itemList");

            if (targetList && targetList.classList.contains("js-orderList")) {
                targetList.innerHTML = "";
            }
            target.classList.remove("show");
        }
    };

    function _updateArguments() {
        for (var i in this.arguments) {
            if (this.arguments.hasOwnProperty(i)) {
                this.default[i] = this.arguments[i];
            }
        }
    }

    function _renderList() {
        var listClasses = "drinksList " + this.default.listClass,
            listElement = orderUtils.renderElement("div", listClasses);

        return listElement;
    }

    function _renderButtonsHolder() {
        var holderClasses = "js-buttonsHolder buttonsHolder",
            holderElement = orderUtils.renderElement("div", holderClasses);

        return holderElement;
    }

    function _renderInfoHolder() {
        var infoHolderElement = orderUtils.renderElement("div", "infoHolder"),
            infoInput = orderUtils.renderElement("input", "js-roundPrice orderPrice", "", [
                { name: "type", data: "text" },
                { name: "readonly", data: "readonly" },
                { name: "value", data: 0 }
            ]),
            saveButton =  _renderButton.call(this, {"class": "modalButton close js-submitRound", "data-text": "Sacuvaj Turu"});

        infoHolderElement.appendChild(infoInput);
        infoHolderElement.appendChild(saveButton);

        return infoHolderElement;
    }

    function _renderNewDrinkInput() {
        var newDrinkElement = orderUtils.renderElement("div", "newDrinkiInput"),
            drinkNameInput = orderUtils.renderElement("input", "js-drinksInput", "", [
                { name: "type", data: "text" },
                { name: "placeholder", data: "Unesite naziv pica" },
                { name: "data-placeholder", data: "Unesite naziv pica" }
            ]),
            drinkPriceInput = orderUtils.renderElement("input", "js-priceInput priceInput", "", [
                { name: "type", data: "number" },
                { name: "placeholder", data: "Unesite cenu pica" },
                { name: "data-placeholder", data: "Unesite cenu pica" }
            ]),
            saveDrinkButton =  _renderButton.call(this, {"class": "js-enterDrink modalButton", "data-text": "Unesi stavku"});
            

        newDrinkElement.appendChild(drinkNameInput);
        newDrinkElement.appendChild(drinkPriceInput);
        newDrinkElement.appendChild(saveDrinkButton);

        return newDrinkElement;
    }

    function _renderTitle() {
        var titleText = this.default.title,
            modalTitle = orderUtils.renderElement("h2", "", titleText, [
            { name: "data-text", data: titleText }
        ]);

        return modalTitle;
    }
    
    function _renderMessage() {
        var messageText = this.default.message,
            modalMessage = orderUtils.renderElement("p", "", messageText, [
            { name: "data-text", data: messageText }
        ]);

        return modalMessage ;
    }

    function _renderNewPlaceHolder() {
        var newPlaceElement = orderUtils.renderElement("div", "placeHolder"),
            placeNameinput = orderUtils.renderElement("input", "js-placeName", "", [
                { name: "type", data: "text" },
                { name: "placeholder", data: "Naziv Mesta" },
                { name: "data-placeholder", data: "Naziv Mesta" }
            ]),
            savePlaceButton =  _renderButton.call(this, {"class": "js-savePlace modalButton close", "data-text": "Sacuvaj"}),
            
            errorText = orderUtils.renderElement(
                "p",
                "js-errorText error",
                "Naziv mesta / Lista stavki moraju biti popunjeni",
                [{ name: "data-text", data: "Popuni mesta" }]
            );

        newPlaceElement.appendChild(placeNameinput);
        newPlaceElement.appendChild(savePlaceButton);
        newPlaceElement.appendChild(errorText);

        return newPlaceElement;
    }

    function _totalPriceInput() {
        var totalSumClass = "js-totalPrice totalPrice",
            totalSum = orderUtils.renderElement("input", totalSumClass, "", [
                { name: "placeholder", data: 0 },
                { name: "readonly", data: "readonly" }
            ]);

        return totalSum;
    }

    function _renderButton(buttonElement) {
        var attributeArray = [],
            buttonText = buttonElement["data-text"],
            newButtonElement = "";
            
            for(var attribute in buttonElement) {
                attributeArray.push({name: attribute, data: buttonElement[attribute]})
            }
            
            newButtonElement = orderUtils.renderElement("button", "", buttonText, attributeArray);

        return newButtonElement;
    }

    function _renderModal(newModal) {

        if (this.default.buttonsHolder) {
            newModal.appendChild(_renderButtonsHolder.call(this));
        }

        if (this.default.newDrinkIput) {
            newModal.appendChild(_renderNewDrinkInput.call(this));
        }

        if (this.default.title) {
            newModal.appendChild(_renderTitle.call(this));
        }
        
        if(this.default.renderList) {
            newModal.appendChild(_renderList.call(this));
        }

        if (this.default.infoHolder) {
            newModal.appendChild(_renderInfoHolder.call(this));
        }

        if (this.default.placeHolder) {
            newModal.appendChild(_renderNewPlaceHolder.call(this));
        }
        
        if (this.default.totalPriceInput) {
            newModal.appendChild(_totalPriceInput.call(this));
        }
        
        if(this.default.message) {
            newModal.appendChild(_renderMessage.call(this));
        }
        
        if (this.default.sumButton) {
            newModal.appendChild(_renderButton.call(this, this.default.sumButton));
        }

        if (this.default.backButton) {
            newModal.appendChild(_renderButton.call(this, this.default.backButton));
        }

        if (this.default.resetAllButton) {
            newModal.appendChild(_renderButton.call(this, this.default.resetAllButton));
        }

        if (this.default.closeButton) {
            newModal.appendChild(_renderButton.call(this, this.default.closeButton));
        }
        
        return newModal;
    }

    function _initEvent() {
        orderUtils.eventHandler(".js-closeModal", "click", this.closeModal);
    }
    
    function _init(arg) {
        var wrapper = document.querySelector(".mainWrapper"),
            modalClasses = arg.modalClass + " modal",
            newModalElement = orderUtils.renderElement("div", modalClasses),
            allSteps = orderUtils.renderElement("div", "stepPreview"),
            stepHolder = orderUtils.renderElement("div", "js-stepHolder stepHolder"),
            singleStep = "",
            buttonsHolder = document.querySelector(".js-modalButtonHolder"),
            renderModalButton = arg.modalButton;

        if (!arg.pagesNumber) {
            this.arguments = arg;
            _updateArguments.call(this);
            newModalElement = _renderModal.call(this, newModalElement);
        } else {
            for(var i = 1; i <= arg.pagesNumber; i++) {
                singleStep = orderUtils.renderElement("div", "singleStep");
                this.arguments = arg["step" + i];
                _updateArguments.call(this);
                stepHolder.appendChild(_renderModal.call(this, singleStep));
            }
            allSteps.appendChild(stepHolder);
            newModalElement.appendChild(allSteps);
        }
        
        renderModalButton ? buttonsHolder.appendChild(_renderButton.call(this, renderModalButton)) : "";

        this.default.bodyCloseModal ? newModalElement.classList.add("js-bodyClose") : "";

        wrapper.appendChild(newModalElement);
        _initEvent.call(this);
    }

    return Modal;
})();
