/**
 * Class to hold our chosen colour palette
 * Notes: 
 *    - Palette chosen from: https://coolors.co/540d6e-ee4266-ffd23f-3bceac-0ead69
 */
class ColourPalette {
    constructor() {
        this.PURPLE = '#540d6e';
        this.PINK = '#ee4266';
        this.YELLOW ='#ffd23f';
        this.AQUA = '#3bceac';
        this.BLUE = '#1982c4';
    }

    /**
     * Purpose: Returns the colour for the selected focusedArea
     * @returns {string} representing a hex colour
     */
    getFocusedAreaColour() {
        return this.PINK;
    }

    /**
     * Purpose: Returns the colour for the selected comparison areas
     * @returns {string} representing a hex colour
     */
    getComparisonAreaColour() {
        return this.AQUA;
    }

    /**
     * Purpose: Returns an array of colours of palette excluding colour for focusedArea
     * @returns {Array} of strings representing hex colours
     */
    getNonFocusedAreaColour() {
        let focusColour = this.getFocusedAreaColour();
        let allColours = Object.values(this);
        return allColours.filter(colour => colour !== focusColour);
    }
}