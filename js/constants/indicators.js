/**
 * Class of indicators of interest
 * Stores constant strings to avoid typos and for better coding pratices
 */
class Indicators {
    constructor() {
        // Demographics 
        this.POPULATION_TOTAL = "Population, total",
        this.RURAL_POPULATION = "Rural population",
        this.URBAN_POPULATION = "Urban population",
        this.POPULATION_DENSITY = "Population density (people per sq. km of land area)",
        this.POPULATION_AGES_0_TO_14 = "Population, ages 0-14 (% of total)",
        this.POPULATION_AGES_15_TO_64 = "Population, ages 15-64 (% of total)",
        this.POPULATION_AGES_65_AND_ABOVE = "Population ages 65 and above (% of total)",
        this.AGE_DEPENDENCY_RATIO = "Age dependency ratio (% of working-age population)",
        this.AGE_DEPENDENCY_RATIO_OLD = "Age dependency ratio, old (% of working-age population)"
        this.AGE_DEPENDENCY_RATIO_YOUNG = "Age dependency ratio, young (% of working-age population)",

        // Life/Death/Expectency statistics
        this.DEATH_RATE = "Death rate, crude (per 1,000 people)",
        this.BIRTH_RATE = "Birth rate, crude (per 1,000 people)",
        this.LIFE_EXPECTANCY_TOTAL = "Life expectancy at birth, total (years)",
        this.LIFE_EXPECTANCY_MALE = "Life expectancy at birth, male (years)",
        this.LIFE_EXPECTANCY_FEMALE = "Life expectancy at birth, female (years)",

        // Economics
        this.MERCHANDISE_EXPORTS = "Merchandise exports (current US$)",
        this.MERCHANDISE_IMPORTS = "Merchandise imports (current US$)",
        this.EXPORTS_OF_GOODS_AND_SERVICES = "Exports of goods and services (current US$)",
        this.IMPORTS_OF_GOODS_AND_SERVICES = "Imports of goods and services (current US$)",
        this.GDP_PER_CAPITA = "GDP per capita (current US$)",
        this.GNI = "GNI (current US$)",
        this.GROSS_NATIONAL_EXPENDITURE = "Gross national expenditure (current US$)",
        this.INFLATION_GDP_DEFLATOR_ANNUAL_PERCENTAGE = "Inflation, GDP deflator (annual %)",
        this.NET_OFFICIAL_DEVELOPMENT_ASSISTANCE_AND_OFFICIAL_AID_RECEIVED = 
            "Net official development assistance and official aid received (current US$)",
        
        // Education
        this.ENROLMENT_IN_PRIMARY_EDUCATION = "Enrolment in primary education, both sexes (number)",
        this.ENROLMENT_IN_SECONDARY_GENERAL = "Enrolment in secondary general, both sexes (number)",

        // Environmental
        this.AGRICULTURAL_LAND_PERCENT_OF_LAND_AREA = "Agricultural land (% of land area)",
        this.CO2_EMISSIONS_METRIC_TON_PER_CAPITA = "CO2 emissions (metric tons per capita)",

        // Other
        this.MOBILE_CELLULAR_SUBSCRIPTIONS = "Mobile cellular subscriptions",
        this.MOBILE_CELLULAR_SUBSCRIPTIONS_PER_100_PEOPLE = "Mobile cellular subscriptions (per 100 people)"
    }

    /**
     * Purpose: To return an array of all indicators of interest
     * @returns {Array} of strings
     */
    getAllIndicatorsOfInterest() {
        return Object.values(this);
    }
}