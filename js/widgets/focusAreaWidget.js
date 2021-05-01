/** 
 * Class to create Country selection dropdown + Region radio buttons
 * */
class FocusAreaWidget {
    /**
     * Class constructor
     * @param {Selected} _selected 
     * @param {Object} _constants = {regionMapper, countries, regions, dispatcherEvents}
     * @param {Object} _dispatcher : d3 dispatcher
     */
    constructor(_selected, _constants, _dispatcher) {
        this.selected = _selected;
        this.regionMapper = _constants.regionMapper;
        this.countries = _constants.countries;
        this.regions = _constants.regions;
        this.dispatcherEvents = _constants.dispatcherEvents;
        this.dispatcher = _dispatcher;
    }

 /**
  * Purpose: Initializes Country dropdown and Region radio buttons
  */
  createSelectFocusArea() {
    // Initialize dropdown + radios
    this.createSelectCountryDropdown();
    this.createRegionRadioButtons();
  
    // Update selected with values from initialized dropdown + radios
    let selectedRegion = this.getSelectedRadioButtonNode().value;
    let selectedCountry = document.getElementById('country-selector').value;
    this.selected.setArea({region: selectedRegion, country: selectedCountry});
  }
  
  /**
   * Purpose: Initializes Country dropdown selection 
   *          with options populated relative to selected region
   */
  createSelectCountryDropdown() {
    let countryList = this.regionMapper.getCountriesOfRegion(selected.area.region);
  
    let parent = document.getElementById('country-selector-container');
  
    this.clearChildNodes(parent);
  
    let select = document.createElement('select');
    select.name = 'country-selector';
    select.id = select.name;
  
    this.appendOptions(countryList, select);
    
    select.addEventListener('change', e => {
      dispatcher.call(this.dispatcherEvents.SELECT_FOCUS_AREA, e, 'country', e.target.value);
    })
  
    parent.appendChild(select);
  }
  
  /**
   * Purpose: Creates and appends an option 
   *          to given select elem for each country in countryList
   * @param {Array} countryList of strings representing countries
   * @param {Object} select is DOM object of element type "select" 
   *                        to which we will attach our options
   */
  appendOptions(countryList, select) {
    for (let country of countryList) {
      let option = document.createElement('option');
      option.value = country;
  
      // Capitalize first letter
      option.text = country.charAt(0).toUpperCase() + country.slice(1);
  
      // Set default selected as Canada when Canada is an option
      if (country === this.countries.CANADA) {
        option.selected = 'selected';
      }
  
      select.appendChild(option);
    }
  }
  
  /**
   * Purpose: Initializes and appends radio buttons for all relevant regions
   */
  createRegionRadioButtons() {
    let regionList = this.regions.getAllRegions();
  
    let parent = document.getElementById('region-selector-container');
    this.clearChildNodes(parent);
  
    for (let region of regionList) {
      this.createRegionRadioButton(region, parent);
    }
  
    let defaultBtn = document.querySelector(`#region-World`);
    defaultBtn.checked = true;
  }
  
  /**
   * Purpose: Creates a new div element to hold a radio button and label for a given region
   *          Appends the new div to parent node
   * @param {string} region : name of region to make radio button for
   * @param {Object} parent = DOM node : parent node to attach radio button + label group to
   */
  createRegionRadioButton(region, parent) {
    let div = document.createElement('div');
    div.className = 'radio-option';

    // Create radio buttons
    let radio = document.createElement('input');
    radio.type = 'radio';
    radio.className = 'radio-button';
    radio.name = 'region';
    radio.id = `region-${region}`;
    radio.value = region;
    radio.addEventListener('change', (e) => {
        this.dispatcher.call(this.dispatcherEvents.SELECT_FOCUS_AREA, e, 'region', e.target.value);
    });

    // Create labels for radio buttons
    let label = document.createElement('label');
    label.className = 'radio-label';
    label.htmlFor = radio.id;
    label.innerHTML = radio.value;

    div.appendChild(radio);
    div.appendChild(label);

    parent.appendChild(div);
  }

  /**
   * Purpose: Removes all child nodes from given parent
   * @param {Object} parentNode 
   */
  clearChildNodes(parentNode) {
    while (parentNode.firstChild) {
      parentNode.firstChild.remove();
    }
  }
  
  /**
   * Purpose: Returns the DOM element of the selected radio input
   * @returns {Object} DOM element or null if none selected
   */
  getSelectedRadioButtonNode () {
    let radios = document.getElementsByClassName('radio-button');
    let selectedButton = null;
  
    for (let radio of radios) {
      if (radio.checked) {
        selectedButton = radio;
      }
    }
  
    return selectedButton;
  }
}