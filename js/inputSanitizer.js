class InputSanitizer {
    constructor() {
        this.countries = new Countries();
        this.regions = new Regions();
    }
    /**
     * Purpose: Returns country or region name as is standardized by values in constants
     * @param {string} input 
     * @returns {string} formatted string
     */
    formatCountryOrRegionNames(input) {
        let key = this.countries.getKey(input);
        if (key) {
            return this.countries[key];
        }

        key = this.regions.getKey(input);
        if (key) {
            return this.regions[key];
        }

        return null;
    }

    /**
     * Purpose: Returns countryName or truncated countryName depending on countryName's length
     * @param {string} countryName 
     * @returns {string} : countryName if countryName's length is shorter than 13 characters. 
     *                     Otherwise, truncated countryName
     */
    truncateCountryName(countryName) {
        if (!countryName) return null;

        const truncated = countryName.length > 13 ? countryName.slice(0, 13) + '...' : countryName;
        return truncated ? truncated : null;
    }

}