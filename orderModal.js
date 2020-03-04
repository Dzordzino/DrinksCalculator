/**
* Options:
* 
* modalClass       - main modal classes / type = String
* closeButton      - condition for rendering modal close button / type = Boolean
* bodyCloseModal   - condition for closing modal functionality from background / type = Boolean
* modalContent     - condition for rendering content inside modal / type = String
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
        self = this;
        // Default value to the arguments
        this.arguments = "";
        // Default options
        this.default = {
            modalClass: "",
            closeButton: true,
            bodyCloseModal: false,
            modalContent: ""
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
            var targetClass = e.currentTarget.getAttribute("data-id"),
                target = document.querySelector(".js-" + targetClass + "Modal");
            console.log(target)
            target ? target.classList.add("show") : "" ;
            if(target.classList.contains("js-bodyClose")) {
                orderUtils.eventHandler(".js-background", "click", this.closeModal);
            }
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
            newModalElement = orderUtils.renderElement("div", modalClasses);
        
        // update default arguments wit on that are received
        this.arguments = arg;
        _updateArguments.call(this);
        // add content to the modal
        if(this.default.modalContent) {
            newModalElement.innerHTML = this.default.modalContent;
        }
        // add close button to the modal
        if(this.default.closeButton) {
            newModalElement.appendChild(_renderButton.call(this, {"class": "js-closeModal modalButton close", "data-text":"Zatvori prozor"}))
        }
        // condition for adding close modal functionality to the background
        this.default.bodyCloseModal ? newModalElement.classList.add("js-bodyClose") : "";
        // append child to the document
        wrapper.appendChild(newModalElement);
        // add event listener
        _initEvent.call(this);
    }

    return Modal;
})();
