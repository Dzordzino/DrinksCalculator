var toggleModal = (function() {
    'use strict';

	function Modal() {
        this.showModal = arguments[0] ? true : false;
        this.arg = arguments[0];
        this.toggleModal()
    }

    Modal.prototype = {
        constructor: Modal,
        toggleModal: function() {
            if(this.showModal){
                _renderModal.call(this);
            }else{
                _destroyModal.call(this);
            }
        }
    }
    function _renderModal() {
        console.log(this.arg)
        console.log(this.showModal)
    };
    function _destroyModal() {
        console.log(this.showModal)
    };

    return Modal;
  })()