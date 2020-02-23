var createModals = (function() {
    "use strict";

    function Modal() {
        this.arguments = arguments[0];
        this.default = {
            pagesNumber: 1,
            modalClass: "",
            listClass: "",
            closeButton: false,
            buttonsHolder: false,
            infoHolder: false,
            placeHolder: false,
            newDrinkIput: false,
            title: ""
        };

        this.closeButton = null;

        _updateArguments.call(this);
        _init.call(this);
    }

    Modal.prototype = {
        constructor: Modal,
        openModal: function(e) {
            var targetClass = e.currentTarget.getAttribute("data-id"),
                target = document.querySelector(".js-" + targetClass + "Modal");
            if (target) {
                target.classList.add("show");
            }
        },
        closeModal: function(e) {
            var target = document.querySelector(".show"),
                targetList = target.querySelector(".js-itemList");

            if (targetList.classList.contains("js-orderList")) {
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
            saveButton = orderUtils.renderElement("button", "modalButton close js-submitRound", "Sacuvaj Turu", [
                { name: "data-text", data: "Sacuvaj Turu" }
            ]);

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
            saveDrinkButton = orderUtils.renderElement("button", "js-enterDrink modalButton", "Unesi stavku", [
                { name: "data-text", data: "Unesi stavku" }
            ]);

        newDrinkElement.appendChild(drinkNameInput);
        newDrinkElement.appendChild(drinkPriceInput);
        newDrinkElement.appendChild(saveDrinkButton);

        return newDrinkElement;
    }

    function _renderTitle() {
        var modalTitle = orderUtils.renderElement("h2", "", "Lista Stavki", [
            { name: "data-text", data: "Lista Stavki" }
        ]);

        return modalTitle;
    }

    function _renderNewPlaceHolder() {
        var newPlaceElement = orderUtils.renderElement("div", "placeHolder"),
            placeNameinput = orderUtils.renderElement("input", "js-placeName", "", [
                { name: "type", data: "text" },
                { name: "placeholder", data: "Naziv Mesta" },
                { name: "data-placeholder", data: "Naziv Mesta" }
            ]),
            savePlaceButton = orderUtils.renderElement("button", "js-savePlace modalButton close", "Sacuvaj", [
                { name: "data-text", data: "Sacuvaj" }
            ]),
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

    function _renderFirstStep() {
        var firstStep = orderUtils.renderElement("div", "singleStep"),
            firstStepTitle = orderUtils.renderElement("h2", "", "Ukupna kolicina", [
                { name: "data-text", data: "Ukupna kolicina" }
            ]),
            firstStepList = orderUtils.renderElement("div", "drinksList js-sumInfo"),
            firstStepButton = orderUtils.renderElement("button", "js-backButton modalButton", "Natrag", [
                { name: "data-text", data: "Natrag" }
            ]);

        firstStep.appendChild(firstStepTitle);
        firstStep.appendChild(firstStepList);
        firstStep.appendChild(firstStepButton);

        return firstStep;
    }

    function _renderSecondStep() {
        var secondStep = orderUtils.renderElement("div", "singleStep"),
            secondStepTitle = orderUtils.renderElement("h2", "", "Lista Tura", [
                { name: "data-text", data: "Lista Tura" }
            ]),
            secondStepList = orderUtils.renderElement("div", "drinksList js-receiptHolder js-itemList"),
            secondStepInput = orderUtils.renderElement("input", "js-totalPrice totalPrice", "", [
                { name: "placeholder", data: 0 },
                { name: "readonly", data: "readonly" }
            ]),
            secondStepSumButton = orderUtils.renderElement(
                "button",
                "js-sumModal modalButton close",
                "Ukupna kolicina",
                [{ name: "data-text", data: "Ukupna kolicina" }]
            ),
            secondStepButton = orderUtils.renderElement("button", "js-closeModal modalButton close", "Zatvori prozor", [
                { name: "data-text", data: "Zatvori prozor" }
            ]);

        secondStep.appendChild(secondStepTitle);
        secondStep.appendChild(secondStepList);
        secondStep.appendChild(secondStepInput);
        secondStep.appendChild(secondStepSumButton);
        secondStep.appendChild(secondStepButton);

        return secondStep;
    }

    function _renderThirdStep() {
        var thirdStep = orderUtils.renderElement("div", "singleStep"),
            thirdStepTitle = orderUtils.renderElement("h2", "", "Ukupna kolicina", [
                { name: "data-text", data: "Ukupna kolicina" }
            ]),
            thirdStepInfo = orderUtils.renderElement("div", "infoHolder"),
            thirdStepList = orderUtils.renderElement("div", "js-infoOrder drinksList"),
            thirdStepPriceInfo = orderUtils.renderElement("div", "js-infoPrice"),
            thirdStepButton = orderUtils.renderElement("button", "js-backButton modalButton", " Natrag", [
                { name: "data-text", data: " Natrag" }
            ]);

        thirdStep.appendChild(thirdStepTitle);
        thirdStep.appendChild(thirdStepInfo);
        thirdStep.appendChild(thirdStepList);
        thirdStep.appendChild(thirdStepPriceInfo);
        thirdStep.appendChild(thirdStepButton);

        return thirdStep;
    }

    function _renderAllSteps() {
        var allSteps = orderUtils.renderElement("div", "stepPreview"),
            stepHolder = orderUtils.renderElement("div", "js-stepHolder stepHolder");

        stepHolder.appendChild(_renderFirstStep.call(this));
        stepHolder.appendChild(_renderSecondStep.call(this));
        stepHolder.appendChild(_renderThirdStep.call(this));
        allSteps.appendChild(stepHolder);

        return allSteps;
    }

    function _renderCloseButton() {
        var closeButton = "js-closeModal modalButton close",
            closeButtonElement = orderUtils.renderElement("button", closeButton, "Zatvori prozor", [
                { name: "data-text", data: "Zatvori prozor" }
            ]);

        return closeButtonElement;
    }

    function _initEvent() {
        if (this.closeButton) {
            orderUtils.eventHandler(".js-closeModal", "click", this.closeModal);
        }
    }

    function _init() {
        var wrapper = document.querySelector(".mainWrapper"),
            newModal = "",
            modalClasses = "";

        modalClasses = this.default.modalClass + " modal";
        newModal = orderUtils.renderElement("div", modalClasses);

        if (this.default.pagesNumber === 1) {
            if (this.default.buttonsHolder) {
                newModal.appendChild(_renderButtonsHolder.call(this));
            }

            if (this.default.newDrinkIput) {
                newModal.appendChild(_renderNewDrinkInput.call(this));
            }

            if (this.default.title) {
                newModal.appendChild(_renderTitle.call(this));
            }

            newModal.appendChild(_renderList.call(this));

            if (this.default.infoHolder) {
                newModal.appendChild(_renderInfoHolder.call(this));
            }

            if (this.default.placeHolder) {
                newModal.appendChild(_renderNewPlaceHolder.call(this));
            }

            if (this.default.closeButton) {
                this.closeButton = true;
                newModal.appendChild(_renderCloseButton.call(this));
            }
        } else {
            newModal.appendChild(_renderAllSteps.call(this));
        }

        wrapper.appendChild(newModal);
        _initEvent.call(this);
    }

    return Modal;
})();
