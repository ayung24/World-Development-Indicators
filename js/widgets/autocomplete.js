/**
 * Class to create autocomplete for input field
 * Credit: https://www.w3schools.com/howto/howto_js_autocomplete.asp
 */
class AutocompleteCreator {
    /**
     * Class constructor
     * @param {Object} _inputElem = DOM node : input element 
     * @param {Object} _submitButton = DOM node : button
     */
    constructor(_inputElem, _submitButton) {
        this.keyEventMapper = new KeyEventMapper();
        this.inputElem = _inputElem;
        this.submitButton = _submitButton;
    }

    /**
     * Purpose: Creates a custom autocomplete dropdown using given array
     * @param {Array} arr : array of possible autocompleted values
     */
    autocomplete(arr) {
        let {inputElem} = this;
        let indexOfFocus;

        // Event listener for inputs in text field
        inputElem.addEventListener('input', (e) => {
            let val = inputElem.value;

            // Close any already open lists of autocompleted values
            this.closeAllLists();

            if (!val) { return false;}

            // Initialize index of current focused item
            indexOfFocus = -1;
            
            // Create div container to hold autocompleted items and values
            const itemContainer = this.createItemContainer();

            // Create autocompleted items and values
            this.createItems(arr, val, itemContainer);
        });
        
        // Event listener for keyEvents
        inputElem.addEventListener('keydown', (e) => {
            let itemContainer = document.getElementById(inputElem.id + '-autocomplete-list');
            let items;
            
            // If autocomplete dropdown is open, get all autocomplete items
            if (itemContainer) items = itemContainer.getElementsByTagName('div');

            indexOfFocus = this.handleKeyEvent(e, indexOfFocus, items)
        });

      // Close autocomplete dropdown when user clicks elsewhere
      document.addEventListener('click', (e) => {
          this.closeAllLists(e.target);
        });
      }

      /**
       * Purpose: Sets inputElem and submitButton to which we want to attach autocomplete
       * @param {Object} = {inputElem: <Node>, submitButton: <Node>} 
       */
      setInputOrSubmit({inputElem, submitButton}) {
        this.inputElem = inputElem ? inputElem : this.inputElem;
        this.submitButton = submitButton ? submitButton : this.submitButton;
      };
      

    // --------------------------- Helpers ------------------------------- //

    /**
     * Purpose: Handles keyevents and returns updated index of currently focused autocomplete item
     * @param {Event} e : native JS event 
     * @param {Integer} indexOfFocus : index of currently focused autocompleted item
     * @param {Array} items : array of autocompleted div items
     * @returns {Integer} : updated index of currently focused autocompleted item
     */
    handleKeyEvent(e, indexOfFocus, items) {
        let {keyCode} = e;
        const {ENTER, ESC, UP, DOWN} = this.keyEventMapper;

        switch (keyCode) {
            case DOWN:
                return this.handleDownKey(indexOfFocus, items);
            case UP:
                return this.handleUpKey(indexOfFocus, items);
            case ESC:
                this.closeAllLists();
                return indexOfFocus;
            case ENTER:
                return this.handleEnterKey(e, indexOfFocus, items);
            default: return indexOfFocus;
        }
    }

    /**
     * Purpose: Changes highlighted/active 'focus' to the autocompleted item below the original 
     *          and returns updated index of newly focused item
     * @param {Integer} index : index of currently focused autocompleted item
     * @param {Array} items : array of autocompleted div items
     * @returns {Integer} : updated index of currently focused autocompleted item
     */
    handleDownKey(index, items) {
        index++;
        return this.addActive(items, index);
    }

    /**
     * Purpose: Changes highlighted/active 'focus' to the autocompleted item above the original 
     *          and returns updated index of newly focused item
     * @param {Integer} index : index of currently focused autocompleted item
     * @param {Array} items : array of autocompleted div items
     * @returns {Integer} : updated index of currently focused autocompleted item
     */
    handleUpKey(index, items) {
        index--;
        return this.addActive(items, index);
    }

    /**
     * Purpose: If autocomplete dropdown is open, simulates a click on active item
     *          Otherwise, simulates clicking on submit button
     * @param {Event} e : native JS event 
     * @param {Integer} indexOfFocus : index of currently focused autocompleted item
     * @param {Array} items : array of autocompleted div items
     * @returns {Integer} : index reset to -1 if submit button, else original index
     */
    handleEnterKey(e, index, items) {
        e.preventDefault();
        if (index > -1 && items) {
            // Simulate click on item
            items[index].click();
        }
         
        this.submitButton.click();
        index = -1;
        
        return index;
    }

    /**
     * Purpose: Closes autocomplete dropdown 
     *          unless user clicked on input field or autocomplete dropdown/items
     * @param {Node} clickedElem : DOM element that user clicked
     */
    closeAllLists(clickedElem) {
        let autocompleteItems = document.getElementsByClassName('autocomplete-items');

        for (let i = 0; i < autocompleteItems.length; i++) {
            let isClickAutoItem = clickedElem === autocompleteItems[i];
            let isClickInputElem = clickedElem === this.inputElem;

            if (!isClickAutoItem && !isClickInputElem) {
                autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
            }
        }
    }

    /**
     * Purpose: Classifies an item as "active"
     * @param {Array} items : array of autocompleted div items
     * @param {Integer} index : index of currently focused autocompleted item
     * @returns {Integer || Boolean} : if there are autocompleted items, returns updated index of currently active
     *                                  Otherwise, return false
     */
    addActive(items, index) {
        if (!items) return false;

        /*start by removing the 'active' class on all items:*/
        this.removeActive(items);

        // Adjust index in a modular fashion that handles negative values
        if (index >= items.length) index = 0;
        if (index < 0) index = (items.length - 1);

        items[index].classList.add('autocomplete-active');
        return index;
      }

    
    /**
     * Purpose: Removes "active" class from all autocomplete items
     * @param {Array} items : array of autocompleted div items
     */
    removeActive(items) {
        for (var i = 0; i < items.length; i++) {
          items[i].classList.remove('autocomplete-active');
        }
      }

      /**
       * Purpose: Creates div elements for each matching autocompleted values
       * @param {Array} arr : array of possible autocompleted values
       * @param {string} val : input text by user
       * @param {Node} itemContainer : DOM element to which we will attach the autocompleted div items
       */
    createItems(arr, val, itemContainer) {
        let index;
        for (index = 0; index < arr.length; index++) {
            let str = arr[index]

            if (this.checkIfStartsTheSame(str, val)) {
                // Create div element for each matching element
                this.createItem(arr, index, val, itemContainer);
            }
        }
    }

    /**
     * Purpose: Creates a div element for each matching autocomplete values
     * @param {Array} arr : array of possible autocompleted values
     * @param {Integer} index : index of currently focused autocompleted item
     * @param {string} val : input text by user
     * @param {Node} itemContainer : DOM element to which we will attach the autocompleted div items
     */
    createItem(arr, index, val, itemContainer) {
        let item = document.createElement('div');

        // Make matching letters bold
        this.makeMatchingLettersBold(item, arr, index, val);
        
        // Insert a input field that will hold the current array item's value
        item.innerHTML += `<input type='hidden' value='${arr[index]}'>`;
        
        // Event listener for click on autocomplete item
        item.addEventListener('click', (e) => {
            // Insert value of autocomplete item into input field
            this.inputElem.value = item.getElementsByTagName('input')[0].value;

            this.submitButton.click();
            index = -1;
            
            this.closeAllLists();
        });

        itemContainer.appendChild(item);
    }

    /**
     * Purpose: Displays matching part of substring as bolded with the rest of the text as normal
     * @param {Node} item : DOM element holding autocompleted item
     * @param {Array} arr : array of all possible autocomplete values 
     * @param {Integer} index : index of currently focused item
     * @param {string} val : input text by user
     */
    makeMatchingLettersBold(item, arr, index, val) {
        let matchingSubstr = arr[index].substr(0, val.length);
        let restOfSubstr = arr[index].substr(val.length);

        item.innerHTML = `<strong>${matchingSubstr}</strong>`;
        item.innerHTML += restOfSubstr;
    }

    /**
     * Purpose: Creates a div element to contain autocompleted items
     * @returns {Node} : DOM element to contain the autocompleted items
     */
    createItemContainer() {
        const itemContainer = document.createElement('div');
        itemContainer.setAttribute('id', this.inputElem.id + '-autocomplete-list');
        itemContainer.setAttribute('class', 'autocomplete-items');
        
        // Append div element as child of autocomplete container
        this.inputElem.parentNode.appendChild(itemContainer);
        return itemContainer;
    }

    /**
     * Purpose: Checks if autocomplete item string starts with the same letters as user input
     * @param {string} str = string of autocomplete item 
     * @param {string} val : input text by user
     * @returns {Boolean} : true if the word at index i of arr starts with the same letters as user input
     */
    checkIfStartsTheSame(str, val) {
        return str.substr(0, val.length).toUpperCase() === val.toUpperCase();
    }
}