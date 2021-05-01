class Regions {
    constructor() {
        this.WORLD = 'World',
        this.AFRICA = 'Africa',
        this.ASIA = 'Asia',
        this.EUROPE = 'Europe',
        this.OCEANIA = 'Oceania',
        this.NORTH_AMERICA = 'North America',
        this.SOUTH_AMERICA = 'South America'
    }

    getAllRegions() {
        return Object.values(this);
    }

    getKey(region) {
        let entries = Object.entries(this);
        region = region.toLowerCase().trim();

        for (let entry of entries) {
            let key = entry[0];
            let val = entry[1].toLowerCase().trim();

            if (val === region) {
                return key;
            }
        }

        return null;
    }
}