/**
* Options:
* 
* pagesNumber      - number of steps inside one modal / type = Number
* modalClass       - main modal classes / type = String
* listClass        - rendering classes for list inside modal / type = Boolean/String
* closeButton      - condition for rendering modal close button / type = Boolean
* buttonsHolder    - condition for rendering buttons section inside modal / type = Boolean
* infoHolder       - condition for rendering order info section inside modal / type = Boolean
* placeHolder      - condition for rendering new place section inside modal / type = Boolean
* newDrinkIput     - condition for rendering new place section inside modal / type = Boolean
* title: "",       - title text / type = String
* bodyCloseModal   - condition for closing modal functionality from background / type = Boolean
* backButton       - condition for rendering step back button inside modal / type = Boolean
* totalPriceInput  - condition for rendering total price input inside modal / type = Boolean
* sumButton        - condition for rendering sum button inside modal / type = Boolean
* modalButton      - rendering button inside main holder / type = Boolean/String
* message          - rendering model message type = Boolean/String
* resetAllButton   - rendering reset button inside main holder / type = Boolean/String
* 
* Methods:
* 
* openModal - Show modal
* closeModal - Hide modal
* 
* Dependecies:
* 
* orederUtils.js contains helper methods all put inside orderUtils object
*/

var createModals = (function() {
    "use strict";

    function Modal() {
        this.self = '';
        // Default value to the arguments
        this.arguments = "";
        // Default options
        this.default = {
            pagesNumber: 1,
            modalClass: "",
            listClass: true,
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
        // render modal
        _init.call(this, arguments[0]);
    }

    Modal.prototype = {
        constructor: Modal,
        /**
        * Functionality for oppening modal
        * @param e - click event
        */
        openModal: function(e) {
            self = this
            var targetClass = e.currentTarget.getAttribute("data-id"),
                target = document.querySelector(".js-" + targetClass + "Modal");

            target ? target.classList.add("show") : "" ;
            target.classList.contains("js-bodyClose") ? orderUtils.eventHandler(".js-background", "click", this.closeModal) : "";
        },
        // Functionality for closing modal
        closeModal: function() {
            var target = document.querySelector(".show"),
                targetList = target.querySelector(".js-itemList"),
                allButtons = document.querySelectorAll(".js-mainButton");;

            targetList && targetList.classList.contains("js-orderList") ? targetList.innerHTML = "" : "";
            orderUtils.eventHandlerRemove(".js-background", "click", self.closeModal);
            target.classList.remove("show");

            [].forEach.call(allButtons, function(item){
                item.classList.remove("clickDisabled");
            })
        }
    };
    // Functionality for updating default options with arguments
    function _updateArguments() {
        for (var i in this.arguments) {
            if (this.arguments.hasOwnProperty(i)) {
                this.default[i] = this.arguments[i];
            }
        }
    }
    /**
    * Add list to the modal
    * @return - list element
    */
    function _renderList() {
        var listClasses = "drinksList " + this.default.listClass,
            listElement = orderUtils.renderElement("div", listClasses);

        return listElement;
    }
    /**
    * Add buttons holder section to the modal
    * @return - button holder element
    */
    function _renderButtonsHolder() {
        var holderClasses = "js-buttonsHolder buttonsHolder",
            holderElement = orderUtils.renderElement("div", holderClasses);

        return holderElement;
    }
    /**
    * Add order info section to the modal
    * @return - order info element
    */
    function _renderInfoHolder() {
        var infoHolderElement = orderUtils.renderElement("div", "infoHolder"),
            infoInput = orderUtils.renderElement("input", "js-roundPrice orderPrice", "", [{ name: "type", data: "text" },
                { name: "readonly", data: "readonly" },
                { name: "value", data: 0 }
            ]),
            saveButton =  _renderButton.call(this, {"class": "modalButton close js-submitRound", "data-text": "Sacuvaj Turu"});

        infoHolderElement.appendChild(infoInput);
        infoHolderElement.appendChild(saveButton);

        return infoHolderElement;
    }
    /**
    * Add new drink section to the modal
    * @return - new drink section
    */
    function _renderNewDrinkInput() {
        var newDrinkElement = orderUtils.renderElement("div", "newDrinkiInput"),
            drinkNameInput = orderUtils.renderElement("input", "js-drinksInput", "", [{ name: "type", data: "text" },
                { name: "placeholder", data: "Unesite naziv pica" },
                { name: "data-placeholder", data: "Unesite naziv pica" }
            ]),
            drinkPriceInput = orderUtils.renderElement("input", "js-priceInput priceInput", "", [{ name: "type", data: "number" },
                { name: "placeholder", data: "Unesite cenu pica" },
                { name: "data-placeholder", data: "Unesite cenu pica" }
            ]),
            saveDrinkButton =  _renderButton.call(this, {"class": "js-enterDrink modalButton", "data-text": "Unesi stavku"});

        newDrinkElement.appendChild(drinkNameInput);
        newDrinkElement.appendChild(drinkPriceInput);
        newDrinkElement.appendChild(saveDrinkButton);

        return newDrinkElement;
    }
    /**
    * Add title to the modal
    * @return - title text
    */
    function _renderTitle() {
        var titleText = this.default.title,
            modalTitle = orderUtils.renderElement("h2", "", titleText, [{ name: "data-text", data: titleText }]);

        return modalTitle;
    }
    /**
    * Add message to the modal
    * @return - message text
    */
    function _renderMessage() {
        var messageText = this.default.message,
            modalMessage = orderUtils.renderElement("p", "", messageText, [{ name: "data-text", data: messageText }]);

        return modalMessage ;
    }
    /**
    * Add new place add section to the modal
    * @return - new place
    */
    function _renderNewPlaceHolder() {
        var newPlaceElement = orderUtils.renderElement("div", "placeHolder"),
            placeNameinput = orderUtils.renderElement("input", "js-placeName", "", [{ name: "type", data: "text" },
                { name: "placeholder", data: "Naziv Mesta" },
                { name: "data-placeholder", data: "Naziv Mesta" }
            ]),
            savePlaceButton =  _renderButton.call(this, {"class": "js-savePlace modalButton close", "data-text": "Sacuvaj"}),
            errorText = orderUtils.renderElement("p", "js-errorText error", "Naziv mesta / Lista stavki moraju biti popunjeni",
                [{ name: "data-text", data: "Popuni mesta" }]
            );

        newPlaceElement.appendChild(placeNameinput);
        newPlaceElement.appendChild(savePlaceButton);
        newPlaceElement.appendChild(errorText);

        return newPlaceElement;
    }
    /**
    * Add total price input to the modal
    * @return - total price input
    */
    function _totalPriceInput() {
        var totalSumClass = "js-totalPrice totalPrice",
            totalSum = orderUtils.renderElement("input", totalSumClass, "", [
                { name: "placeholder", data: 0 },
                { name: "readonly", data: "readonly" }
            ]);

        return totalSum;
    }
    /**
    * Add button to the modal
    * @param buttonElement - button element data (attributes, inner text)
    * @return - button element
    */
    function _renderButton(buttonElement) {
        var attributeArray = [],
            buttonText = buttonElement["data-text"],
            newButtonElement = "";

            for(var attribute in buttonElement) {
                attributeArray.push({name: attribute, data: buttonElement[attribute]});
            }
            newButtonElement = orderUtils.renderElement("button", "", buttonText, attributeArray);

        return newButtonElement;
    }
    /**
    * Render modal depending on received data
    * @param newModal - new blank modal element
    * @return - new modal with all sections rendered based on passed data
    */
    function _renderModal(newModal) {

        this.default.buttonsHolder ? newModal.appendChild(_renderButtonsHolder.call(this)) : "" ;

        this.default.newDrinkIput ? newModal.appendChild(_renderNewDrinkInput.call(this)) : "" ;

        this.default.title ? newModal.appendChild(_renderTitle.call(this)) : "" ;

        this.default.listClass ? newModal.appendChild(_renderList.call(this)) : "" ;

        this.default.infoHolder ? newModal.appendChild(_renderInfoHolder.call(this)) : "" ;

        this.default.placeHolder ? newModal.appendChild(_renderNewPlaceHolder.call(this)) : "" ;

        this.default.totalPriceInput ? newModal.appendChild(_totalPriceInput.call(this)) : "" ;

        this.default.message ? newModal.appendChild(_renderMessage.call(this)) : "" ;

        this.default.sumButton ? newModal.appendChild(_renderButton.call(this, this.default.sumButton)) : "" ;

        this.default.backButton ? newModal.appendChild(_renderButton.call(this, this.default.backButton)) : "" ;

        this.default.resetAllButton ? newModal.appendChild(_renderButton.call(this, this.default.resetAllButton)) : "" ;

        this.default.closeButton ? newModal.appendChild(_renderButton.call(this, this.default.closeButton)) : "" ;

        return newModal;
    }
    //add event listener to the all close modal buttons
    function _initEvent() {
        orderUtils.eventHandler(".js-closeModal", "click", this.closeModal);
    }
    /**
    * Initialize now modal based on information gattered from received arguments
    * @param arg - received arguments
    */
    function _init(arg) {
        var wrapper = document.querySelector(".mainWrapper"),
            modalClasses = arg.modalClass + " modal",
            newModalElement = orderUtils.renderElement("div", modalClasses),
            allSteps = orderUtils.renderElement("div", "stepPreview"),
            stepHolder = orderUtils.renderElement("div", "js-stepHolder stepHolder"),
            singleStep = "",
            buttonsHolder = document.querySelector(".js-modalButtonHolder"),
            renderModalButton = arg.modalButton;
        // render modal without steps
        if (!arg.pagesNumber) {
            // update default arguments wit on that are received
            this.arguments = arg;
            _updateArguments.call(this);
            // render modal elements
            newModalElement = _renderModal.call(this, newModalElement);
        } else {
            // render modal with steps
            for(var i = 1; i <= arg.pagesNumber; i++) {
                // create new single step element
                singleStep = orderUtils.renderElement("div", "singleStep");
                // update default arguments wit on that are received
                this.arguments = arg["step" + i];
                _updateArguments.call(this);
                // render single step and add it to the step holder
                stepHolder.appendChild(_renderModal.call(this, singleStep));
            }
            // append step holder to the modal
            allSteps.appendChild(stepHolder);
            newModalElement.appendChild(allSteps);
        }
        // condition for rendering button to the main holder
        renderModalButton ? buttonsHolder.appendChild(_renderButton.call(this, renderModalButton)) : "";
        // condition for adding close modal functionality to the background
        this.default.bodyCloseModal ? newModalElement.classList.add("js-bodyClose") : "";
        // append child to the document
        wrapper.appendChild(newModalElement);
        // add event listener
        _initEvent.call(this);
    }

    return Modal;
})();
