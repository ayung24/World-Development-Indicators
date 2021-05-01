/**
 * Class to store selectedItems
 */
 class Selected {
    /**
     * Class constructor
     * @param {Object} selectedArea = {region: "", country: ""} : holds selected country and/or region of focus
     * @param {Array} selectedComparisonAreas = ["", "", ...] : 
     *                                          list of strings representing countries or regions we wish to compare focusedArea to
     * @param {string} selectedIndicator : indicator that is selected. Default value: POPULATION_TOTAL 
     * @param {Object} selectedTimeInterval = {min, max} : min as lowerBound year and max as upperBound of timeInterval
     *                                                              Default = NULL;
     * @param {Object} dispatcher : d3 dispatcher
     */
    constructor(selectedArea, selectedComparisonAreas, selectedIndicator, selectedTimeInterval, dispatcher) {
        
        this.inputSanitizer = new InputSanitizer();
        this.constants = {countries: new Countries()}
        this.availableIndicators = new Indicators();
        this.regionMapper = new RegionMapper();
        this.area = selectedArea ? selectedArea : {region: 'World', country: ''};
        this.comparisonAreas = selectedComparisonAreas ? selectedComparisonAreas : [];
        this.indicator = selectedIndicator ? selectedIndicator : this.availableIndicators.POPULATION_TOTAL;
        this.timeInterval = selectedTimeInterval ? selectedTimeInterval : {};
        
        this.allSelectedAreas = [];
        this.updateAllSelectedAreas(this.area, this.comparisonAreas);
        
        this.dispatcher = dispatcher;
    }

    /**
     * Purpose: If given country/region is not already in the comparisonAreas list, add to list
     * Note: Will not add currently selected focused country/region to comparison list
     * @param {string} countryOrRegion = country or region that user has added as comparison countries/regions
     */
    addComparisonArea(countryOrRegion) {
        countryOrRegion = this.inputSanitizer.formatCountryOrRegionNames(countryOrRegion);

        let isFocusArea = this.area.region === countryOrRegion || this.area.country === countryOrRegion;
        let isComparisonListFull = this.comparisonAreas.length >= 4;
        let isAlreadyInList = this.comparisonAreas.includes(countryOrRegion);

        if (!isFocusArea && !isComparisonListFull && !isAlreadyInList) {
            // add to list
            this.comparisonAreas.push(countryOrRegion);
        } else if (isComparisonListFull) {
            if (this.dispatcher && this.dispatcherEvents) {
                this.dispatcher.call(this.dispatcherEvents.ERROR_TOO_MANY_COMPARISONS, this);
            }
        }

        // Update allSelectedAreas
        this.updateAllSelectedAreas(this.area, this.comparisonAreas);
    }

    /**
     * Purpose: Removes given country/region from comparisonAreas list
     * @param {string} countryOrRegion = country or region to remove from comparison list
     */
    removeComparisonArea(countryOrRegion) {
        let index = this.comparisonAreas.indexOf(countryOrRegion);
    
        if (index > -1) {
            // Remove from list
            this.comparisonAreas.splice(index, 1);
            
            // Update allSelectedAreas
            this.updateAllSelectedAreas(this.area, this.comparisonAreas);
        }
    }

    /**
     * Purpose: If focusedArea is currently in comparison list, remove from list
     * @param {Object} focusedArea = {region: "", country: ""} : object that holds country or region being selected
     */
    updateComparisonArea(focusedArea) {
        let isFocusCountryInList = this.isFocusCountryInList(focusedArea.country);
        let isFocusRegionInList = this.comparisonAreas.includes(focusedArea.region);
        let index;

        // Remove from list
        if (isFocusCountryInList) {
            index = this.comparisonAreas.indexOf(focusedArea.country);
            this.comparisonAreas.splice(index, 1);
        } else if (isFocusRegionInList) {
            index = this.comparisonAreas.indexOf(focusedArea.region);
            this.comparisonAreas.splice(index, 1);
        } 
    }

    isFocusCountryInList(focusedCountry) {
        if (focusedCountry) {
            for (let comparisonArea of this.comparisonAreas) {
                if (this.constants.countries.isSameCountryName(comparisonArea, focusedCountry)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Purpose: Sets the focusedArea as given area. 
     *          If no region is given, default region is set to "World"
     *          If no country is given, default country is set to ""
     * @param {Object} area = {region: "", country: ""} 
     */
    setArea({region, country}) {
        this.area.region = !region ? this.area.region : this.inputSanitizer.formatCountryOrRegionNames(region);
        this.setCountry(country);

        // If area was previously in Comparison list, remove
        this.updateComparisonArea({region, country})

        // Update allSelectedAreas
        this.updateAllSelectedAreas(this.area, this.comparisonAreas);
    }

    /**
     * Purpose: Adds country as selected area if given country is in currently selected region
     * @param {String} country : Name of country to add as selected (First letter capitalized)
     */
    setCountry(country) {
        if (country) {
            let countriesInSelectedRegion = this.regionMapper.getCountriesOfRegion(this.area.region);
            
            if (countriesInSelectedRegion.includes(country)) {
                this.area.country = country;
            }
        }
    }

    /**
     * Purpose: Sets selected indicator as given indicator
     * @param {string} indicator 
     */
    setIndicator(indicator) {
        if (indicator) {
            this.indicator = indicator;
        }
    }

    /**
     * Purpose: Sets the selected timeInterval to {min, max}
     * @param {Integer} min = lowerBound year (format: YYYY) 
     * @param {Integer} max = upperBound year (format: YYYY)
     */
    setTimeInterval(min, max) {
        if (min && max) {
            this.timeInterval = {min, max};
        }
    }

    /**
     * Purpose: Sets selected area, indicator, and timeInterval
     * @param {Object} area = {region: "", country: ""} 
     * @param {string} indicator 
     * @param {Integer} minYear = lowerBound year (format: YYYY) 
     * @param {Integer} maxYear = upperBound year (format: YYYY)
     */
    setItems(area, indicator, minYear, maxYear) {
        this.setArea(area);
        this.setIndicator(indicator);
        this.setTimeInterval(minYear, maxYear);
    }

    /**
     * Purpose: Updates allSelectedAreas area with focusedArea and comparisonAreas. 
     *          If focusedArea has country, the country is added to the list.
     *          Otherwise, the region of the focusedArea is added instead.
     */
    updateAllSelectedAreas(area, comparisonAreas) {
        let {region, country} = area;

        region = this.inputSanitizer.formatCountryOrRegionNames(region);
        country = this.inputSanitizer.formatCountryOrRegionNames(country);
 
        this.allSelectedAreas = country !== '' ? [country, ...comparisonAreas] : [region, ...comparisonAreas];
    }

    setDispatcher(dispatcher, dispatcherEvents) {
        this.dispatcher = dispatcher;
        this.dispatcherEvents = dispatcherEvents;
    }

}