// Global objects
let barChart, yearSlider, lineChart, data, filteredData, wedgeView;

// Initialize global constants
const indicators = new Indicators();
const selected = new Selected();
const regionMapper = new RegionMapper();
const regions = new Regions();
const countries = new Countries();
const dispatcherEvents = new DispatcherEvents();
const warningType = new WarningType();
const colourPalette = new ColourPalette();
const parseTime = d3.timeParse("%Y");

// Initialize dispatcher that is used to orchestrate events
const dispatcher = d3.dispatch(
  dispatcherEvents.FILTER_YEAR,
  dispatcherEvents.CHANGE_INDICATOR,
  dispatcherEvents.SELECT_FOCUS_AREA,
  dispatcherEvents.SELECT_COMPARISON_ITEM,
  dispatcherEvents.DELETE_COMPARISON_ITEM,
  dispatcherEvents.BAR_HOVER,
  dispatcherEvents.BAR_UNHOVER,
  dispatcherEvents.MAP_ITEM_HOVER,
  dispatcherEvents.MAP_ITEM_UNHOVER,
  dispatcherEvents.ERROR_TOO_MANY_COMPARISONS
);

selected.setDispatcher(dispatcher, dispatcherEvents);

const focusedAreaWidget = new FocusAreaWidget(
  selected,
  {
    regionMapper,
    countries,
    regions,
    dispatcherEvents
  },
  dispatcher,
);

const comparisonWidget = new ComparisonWidget(
  selected,
  {
    regionMapper,
    countries,
    regions,
    dispatcherEvents,
    warningType
  },
  dispatcher,
);

/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('data/Dataset.csv').then(_data => {
  data = _data;

  data.forEach(d => {
    d.year = parseTime(d.Year);
    d.value = d.Value !== 'NULL' ? +d.Value : null;
    d.Value = d.Value !== 'NULL' ? +d.Value : null;
  });

  // Set default selected items
  setDefaultSelectedItems();

  // Initialize select country/region for focused area
  focusedAreaWidget.createSelectFocusArea();
  comparisonWidget.updateComparisonSection();

  // Initialize map view
  d3.json("data/countries.json").then(countries => {

    countries.features.forEach(d => {
      // Convert string to int;
      d.id = parseInt(d.id);
    });

    map = new GeoMap({
      parentElement: "#map"
    }, data, countries, selected, dispatcher, dispatcherEvents);
    map.updateVis();
  });

  // Initialize the wedge view
  wedgeView = new WedgeView(data, selected, dispatcher, dispatcherEvents);
  wedgeView.updateVis();

  // Initialize bar chart
  barChart = new BarChart({
    parentElement: '#barchart',
    colour: {
      selectedCountry: colourPalette.getFocusedAreaColour(),
      comparisonCountry: colourPalette.getComparisonAreaColour(),
    }
  }, data, selected);

  // Initialize line chart
  lineChart = new LineChart({
    parentElement: '#linechart',
    colour: {
      selectedArea: colourPalette.getFocusedAreaColour(),
      otherAreas: colourPalette.getNonFocusedAreaColour()
    }
  }, data, selected);

  // Initialize and render time slider
  yearSlider = new YearSlider({ parentElement: '#slider' }, data, dispatcher, dispatcherEvents);
  yearSlider.updateVis();

  // Show linechart
  lineChart.updateVis();
});

// ----------------- Dispatcher -------------------- //

dispatcher.on(dispatcherEvents.FILTER_YEAR, selectedYears => {
  selected.selectedYears = selectedYears;
  selected.setTimeInterval(selectedYears[0], selectedYears[selectedYears.length - 1]);

  map.updateVis();
  wedgeView.updateVis();
  lineChart.updateVis();
  barChart.updateVis();
})

dispatcher.on(dispatcherEvents.SELECT_FOCUS_AREA, (type, value) => {
  updateSelectedArea(type, value);
  comparisonWidget.updateTags();

  wedgeView.updateVis();
  map.updateVis();
  barChart.updateVis();
  lineChart.updateVis();
});

dispatcher.on(dispatcherEvents.CHANGE_INDICATOR, newlySelectedIndicator => {
  selected.indicator = indicators[newlySelectedIndicator];
  comparisonWidget.updateComparisonSection();

  map.updateVis();
  barChart.updateVis();
  lineChart.updateVis();
});

dispatcher.on(dispatcherEvents.SELECT_COMPARISON_ITEM, comparisonItem => {
  selected.addComparisonArea(comparisonItem);
  comparisonWidget.updateTags();

  map.updateVis();
  barChart.updateVis();
  lineChart.updateVis();
})

dispatcher.on(dispatcherEvents.DELETE_COMPARISON_ITEM, comparisonItem => {
  selected.removeComparisonArea(comparisonItem);
  comparisonWidget.updateTags();

  map.updateVis();
  barChart.updateVis();
  lineChart.updateVis();
})

dispatcher.on(dispatcherEvents.BAR_HOVER, countryName => {
  map.emphasizeCountry(countryName);
  lineChart.emphasizeLine(countryName);
})

dispatcher.on(dispatcherEvents.BAR_UNHOVER, countryName => {
  map.deEmphasizeCountry(countryName);
  lineChart.deEmphasizeLine(countryName);
})

dispatcher.on(dispatcherEvents.MAP_ITEM_HOVER, countryName => {
  barChart.emphasizeBar(countryName);
  lineChart.emphasizeLine(countryName);
})

dispatcher.on(dispatcherEvents.MAP_ITEM_UNHOVER, countryName => {
  barChart.deEmphasizeBar(countryName);
  lineChart.deEmphasizeLine(countryName);
})

dispatcher.on(dispatcherEvents.ERROR_TOO_MANY_COMPARISONS, () => {
  comparisonWidget.displayWarning(warningType.TOO_MANY_SELECTED);
})

// ----------------- Helpers -------------------- //

/**
 * Purpose: Updates selected.area with the appropriate values
 * @param {string} type = 'region' if setting region, 'country' if setting country
 * @param {string} value is a capitalized (first letter only) country or region name
 */
let updateSelectedArea = (type, value) => {
  if (type === 'country') {
    selected.setArea({ country: value });
  } else if (type === 'region') {
    handleSelectRegion(value);
  }
}

/**
 * Purpose: Updates the selected object
 *          and updates default country of dropdown list to fit selected region 
 * @param {string} _region = name of region that's selected
 */
let handleSelectRegion = (_region) => {
  selected.setArea({ region: _region });

  // Update dropdown to display only countries of that region
  focusedAreaWidget.createSelectCountryDropdown();

  // Update selected country to the default of updated dropdown
  let selectElem = document.getElementById('country-selector');
  selected.setArea({ country: selectElem.value });
}

/**
 * Purpose: Sets default state for program
 */
let setDefaultSelectedItems = () => {
  // set default timeInterval
  const defaultYears = [...new Set(data.map(d => d.Year))].slice(30,51);
  selected.selectedYears = defaultYears;
  selected.timeInterval = { min: defaultYears[0], max: defaultYears[defaultYears.length - 1] };

  // default indicator
  selected.setIndicator(indicators.POPULATION_TOTAL);
}

