class BarChart {

  /**
   * Class constructor with initial configuration
   * @param {Object} _config : object holding configuration settings
   * @param {Array} _data : given data array
   * @param {Selected} _selectedItems : Selected class object holding selectedItem values
   * @param {Object} _dispatcher : d3 dispatcher
   */
  constructor(_config, _data, _selectedItems, _dispatcher, _constants) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 50, right: 290, bottom: 70, left: 60 },
      colour: _config.colour || { selectedCountry: 'blue', comparisonCountry: 'green' },
      legend: _config.legend ||
      {
        width: 180,
        height: 8,
        yPadding: 25,
        colourBox: { width: 12, height: 12 },
        labelText: {
          SELECTED_COUNTRY: 'SelectedCountry',
          OTHER_COUNTRIES: 'OtherCountries'
        }
      },
      tooltip: _config.tooltip || { padding: 15 },
    }
    this.data = _data;
    this.dispatcher = _dispatcher;
    this.constants = _constants || { countries: new Countries(), inputSanitizer: new InputSanitizer() };
    this.selected = _selectedItems;
    this.initVis();
  }

  initVis() {
    let vis = this;
    // Create SVG area, initialize scales and axes

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr('viewBox', `0 0 ${vis.config.containerWidth} ${vis.config.containerHeight}`);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chartArea = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.chart = vis.chartArea.append('g');

    // Initialize scales, axes, static elements, etc.
    vis.initScales();
    vis.initAxes();

    // Append axis groups
    vis.appendAxisGroups();

    // Append separator line for pos vs neg values
    vis.appendSeparatorLine();

    // Append legend group and render legend
    vis.appendLegendGroup();
    vis.renderLegend();

    // Update Vis
    vis.updateVis();

  }

  updateVis() {
    let vis = this;

    // Prepare data
    vis.aggregatedData = vis.aggregateAverages(vis.selected);
    vis.averages = vis.getAllAverages();
    vis.domainHasNeg = vis.hasNegMin(vis.averages);

    // Specificy accessor functions
    vis.xValue = d => vis.constants.inputSanitizer.truncateCountryName(d.key);
    vis.yValue = d => d.avg;

    // Update axis titles
    vis.renderAxisTitles(vis.selected.indicator);

    // Update Scale domains
    vis.updateYScaleDomain();
    vis.updateXScaleDomain();

    // Update separator line
    vis.updateSeparatorLine();

    vis.renderVis();
  }

  renderVis() {
    let vis = this;
    // Bind data to visual elements, update axes
    vis.renderBarElems();

    // Update axes
    vis.renderAxisGroups();

    // Render separator line if applicable
    vis.domainHasNeg ? vis.showSeparatorLine() : vis.hideSeparatorLine();
  }

  /**
   * Purpose: Emphasizes bar of country by changing stroke colour to black
   * @param {string} countryName : country name in format consistent with ./constants/countries.js
   */
  emphasizeBar(countryName) {
    let vis = this;
    const key = vis.constants.countries.getKey(countryName);
    const barClass = `.bar-${key}`;

    d3.selectAll(barClass).attr('stroke', 'black');
  }

  /**
   * Purpose: Resets bar
   * @param {string} countryName : country name in format consistent with ./constants/countries.js
   */
  deEmphasizeBar(countryName) {
    let vis = this;
    const key = vis.constants.countries.getKey(countryName);
    const barClass = `.bar-${key}`;

    d3.selectAll(barClass).attr('stroke', 'none');
  }

  // ------------------------------------------ Helper functions ------------------------------------ //

  /**
   * Purpose: Initializes x- and y-scales
   * Note: Domain is not defined here as they are dynamic
   */
  initScales() {
    let vis = this;

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .paddingInner(0.2)
      .paddingOuter(0.1);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);
  }

  /**
   * Purpose: Initializes x- and y-axes
   */
  initAxes() {
    let vis = this;

    // Replace the 'G' (Giga) SI-prefix of d3 with 'B' to stand for 'Billion' when formatting
    let format = (strInput) => d3.format('.2~s')(strInput).replace(/G/, 'B');

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter([0]);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .tickSize(-vis.width)
      .tickSizeOuter([0])
      .tickPadding(10)
      .tickFormat(format);
  }

  /**
   * Purpose: Appends x- and y-axisGroups to chart
   */
  appendAxisGroups() {
    let vis = this;

    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis x-axis-barchart');

    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis y-axis-barchart');
  }

  /**
   * Purpose: Appends a 'g' element to svg to hold legend
   */
  appendLegendGroup() {
    let vis = this;
    let yOffset = vis.height / 2;
    yOffset += vis.config.margin.top;

    vis.legend = vis.svg.append('g')
      .attr('class', 'legend')
      .attr('width', vis.config.legendWidth)
      .attr('height', vis.config.legendHeight)
      .attr('transform', `translate(${vis.width + vis.config.margin.left + 50}, ${yOffset})`);
  }

  /**
   * Purpose: Renders legend
   */
  renderLegend() {
    let vis = this;

    // Add legend boxes
    vis.renderLegendColourBoxes();
    // Add legend labels
    vis.renderLegendElemLabels();
  }

  /**
   * Purpose: Renders legend's colour boxes
   */
  renderLegendColourBoxes() {
    let vis = this;
    const { SELECTED_COUNTRY, OTHER_COUNTRIES } = vis.config.legend.labelText;
    let labelYOffset = -14;

    vis.legend.selectAll('.legend-box')
      .data([SELECTED_COUNTRY, OTHER_COUNTRIES])
      .join('rect')
      .attr('class', d => `legend-box legend-box-${d}`)
      .attr('x', 0)
      .attr('y', (d, i) => i === 0 ? labelYOffset : labelYOffset += vis.config.legend.yPadding)
      .attr('width', vis.config.legend.colourBox.width)
      .attr('height', vis.config.legend.colourBox.height)
      .style('fill', d => vis.getColourOfLegendBoxes(d));
  }

  /**
   * Purpose: Renders labels for legend's colour boxes
   */
  renderLegendElemLabels() {
    let vis = this;
    const { SELECTED_COUNTRY, OTHER_COUNTRIES } = vis.config.legend.labelText;
    let labelYOffset = -4;

    vis.legend.selectAll('.box-label')
      .data([SELECTED_COUNTRY, OTHER_COUNTRIES])
      .join('text')
      .attr('class', d => `box-label box-label-${d}`)
      .attr('x', () => vis.config.legend.colourBox.width + 10)
      .attr('y', (d, i) => i === 0 ? labelYOffset : labelYOffset += vis.config.legend.yPadding)
      .text(d => d);
  }

  /**
   * Purpose: Renders x- and y-axis titles dynamically using enter-update-exit pattern
   * @param {string} yAxisTitle 
   */
  renderAxisTitles(yAxisTitle) {
    let vis = this;
    let newYAxisTitle = `Average ${yAxisTitle} from ${vis.selected.timeInterval.min}-${vis.selected.timeInterval.max}`;

    if (yAxisTitle) {
      // Append y-axis title to svg
      vis.chartArea.selectAll('.barchart-y-axis-title')
        .data([yAxisTitle])
        .join('text')
        .attr('class', 'axis-title barchart-y-axis-title')
        .attr('y', -vis.config.margin.top + 10)
        .attr('x', -vis.config.margin.left)
        .attr('dy', '.71em')
        .style('text-anchor', 'start')
        .text(newYAxisTitle);
    }
  }

  /**
   * Purpose: Returns a colour based off the country of the data given
   * @param {Object} d = {key: <string>, avg: <Number>} : key is country name 
   * @returns {string} representing a hex colour
   */
  getColourOfLegendBoxes(d) {
    let vis = this;
    let { colour, legend } = vis.config;
    const { SELECTED_COUNTRY, OTHER_COUNTRIES } = legend.labelText;

    switch (d) {
      case SELECTED_COUNTRY:
        return colour.selectedCountry;
      case OTHER_COUNTRIES:
      default:
        return colour.comparisonCountry;
    }
  }

  /**
   * Purpose: Renders x- and y-axis groups
   */
  renderAxisGroups() {
    let vis = this;

    vis.xAxisG
      .call(vis.xAxis)
      .attr('transform', `translate(0 ,${vis.height})`);

    vis.yAxisG
      .call(vis.yAxis);
  }

  /**
   * Purpose: Returns all the averages in the aggregatedData array
   * @returns {Array} of numbers
   */
  getAllAverages() {
    let vis = this;
    return vis.aggregatedData.map(d => d.avg);
  }

  /**
   * Purpose: Returns an array of objects containing 
   *          regions/countries paired with their averages for the indicator of interest
   * @param {Array} selectedAreas
   * @param {string} indicator 
   * @param {Object} timeInterval = {min: YYYY, max: YYYY}
   * @returns {Array} of Objects 
   * Ex. 
   * [
   *    {key: "World", avg: 4019},
   *    {key: "China", avg: 5000},
   *    ...
   * ]
   */
  aggregateAverages(selected) {
    let vis = this;

    let dataOfInterest = vis.filterData(vis.data, selected);

    let aggregated = d3.rollups(dataOfInterest, v => d3.mean(v, d => d.Value), d => d.CountryName);
    aggregated = Array.from(aggregated, ([key, avg]) => ({ key, avg }));

    let res = vis.reAddMissingCountries(aggregated);
    return res;
  }

  /**
   * Purpose: Renders bars using enter-update-exit pattern
   */
  renderBarElems() {
    let vis = this;

    // Create group
    const { barG, barGEnter } = vis.createBarGroup();

    // Append and render grouped elems
    vis.renderBars(barG, barGEnter);
    vis.renderBarLabels(barG, barGEnter);
  }

  /**
   * Purpose: Renders bar labels by appending them to .barG elems using 'enter-update-exit' pattern
   * @param {Selection} barG : d3 selection of .barG elems
   * @param {Selection} barGEnter : d3 selection of .barG.enter().append('g') elems
   */
  renderBarLabels(barG, barGEnter) {
    let vis = this;

    // Round averages and format them with commas for thousands
    let round = (val) => val > 100 ? Math.round(val) : val.toFixed(2);
    let format = (val) => val >= 0 ? d3.format(',')(round(val)) : round(val);

    // Bind data to selection
    const barText = barG.merge(barGEnter).selectAll('.bar-label')
      .data(d => [d], d => d.key);

    // Enter
    const barTextEnter = barText.enter().append('text')
      .attr('class', d => `bar-label bar-label-${vis.constants.countries.getKey(d.key)}`);

    // Enter + Update
    barTextEnter.merge(barText)
      .attr('x', (d) => vis.xScale(vis.xValue(d)) + (vis.xScale.bandwidth() / 2))
      .attr('y', (d) => vis.getYPosOfBarLabel(d))
      .attr('display', d => !d.avg || isNaN(d.avg) ? 'block' : 'none')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text(d => !d.avg || isNaN(d.avg) ? 'N/A' : format(d.avg));

    // Exit
    barText.exit().remove();
  }

  /**
   * Purpose: Renders bars by appending them to .barG elems using 'enter-update-exit' pattern
   * @param {Selection} barG : d3 selection of .barG elems 
   * @param {Selection} barGEnter : d3 selection of .barG.enter().append('g') elems
   */
  renderBars(barG, barGEnter) {
    let vis = this;

    // Bind data to selection
    const bars = barG.merge(barGEnter).selectAll('.bar')
      .data(d => [d], d => d.key);

    // Enter
    const barsEnter = bars.enter().append('rect')
      .attr('class', d => `bar bar-${vis.constants.countries.getKey(d.key)}`);

    // Enter + Update
    barsEnter.merge(bars)
      .attr('x', d => vis.xScale(vis.xValue(d)))
      .attr('y', d => vis.getYPosition(d))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', d => vis.getBarHeight(d))
      .attr('fill', d => vis.getBarColour(d))
      .on('mouseenter', e => vis.handleMouseEnter(e))
      .on('mouseleave', e => vis.handleMouseLeave(e));

    // Exit
    bars.exit().remove();
  }

  /**
   * Purpose: Returns a y-position for a given <d> object
   * @param {Object} d = {key: <string>, avg: <Number>} 
   * @returns {Integer} : y-position on scale for a given object
   */
  getYPosition(d) {
    let vis = this;

    const val = vis.yValue(d);
    const isValNeg = val < 0;

    let yPos = !d || !d.avg || vis.domainHasNeg && isValNeg ? vis.yScale(0) : vis.yScale(val);
    return yPos;
  }

  /**
   * Purpose: Creates (and updates) a group ('g') element to hold bar elements
   *          Uses 'enter-update-exit' pattern
   * @returns { Selection, Selection } : d3 selection of all .barG elements
   */
  createBarGroup() {
    let vis = this;

    // Bind data to selection
    const barG = vis.chart.selectAll('.barG')
      .data(vis.aggregatedData, vis.xValue);

    // Enter
    const barGEnter = barG.enter().append('g')
      .attr('class', 'barG');

    // Enter + Update
    barGEnter.merge(barG);

    // Exit
    barG.exit().remove();

    return { barG, barGEnter };
  }

  /**
   * Purpose: Returns a y-position of bar label
   * @param {Object} d = {key: <string>, avg: <Number>}
   * @returns {Integer} : y-position of bar label
   */
  getYPosOfBarLabel(d) {
    let vis = this;
    const bottomPaddingOffset = 5;

    let yPos;

    if (!d.avg) {
      yPos = vis.getYPosition(d) - bottomPaddingOffset * 2;
      return yPos ? yPos : vis.height + bottomPaddingOffset * 2;
    }
    
    // Else 
    yPos = vis.getYPosition(d) + 15;

    if (vis.domainHasNeg && isNaN(d.avg)) {
      yPos = vis.getYPosition({ avg: 0 }) - (bottomPaddingOffset * 2)
    } else if (yPos > vis.height) {
      yPos = vis.getYPosition(d) - bottomPaddingOffset;
    }

    return yPos ? yPos : vis.height - bottomPaddingOffset;
  }

  /**
   * Purpose: Returns colour depending on state/status of bar/bar data
   * @param {Object} data = ex. {key: "World", avg: 4019} 
   */
  getBarColour(data) {
    let vis = this;

    let isSelectedArea = data.key === vis.selected.area.country
      || data.key === vis.selected.area.region;

    return isSelectedArea ?
      vis.config.colour.selectedCountry : vis.config.colour.comparisonCountry;
  }

  /**
   * Purpose: Returns a calculated height for country's bar
   * @param {Object} data = ex. {key: "Canada", avg: 0}
   * @returns {Number} : height of bar
   */
  getBarHeight(data) {
    let vis = this;
    const val = vis.yValue(data);
    const max = d3.max(vis.averages);
    let height;

    if (vis.domainHasNeg) {
      height = val < 0 ? vis.height - vis.yScale(0) : vis.yScale(0) - vis.yScale(val);
    } else {
      height = max === 0 ? vis.height - vis.yScale(0) : vis.yScale(0) - vis.yScale(val);
    }

    height = height ? height : 0;
    return height;
  }

  /**
   * Purpose: Returns a filtered array containing only items that fit the selectedItems
   * @param {Array} dataArr 
   * @param {Selected} selectedItems 
   * @returns {Array} of objects
   */
  filterData(dataArr, selectedItems) {
    let { allSelectedAreas, indicator, timeInterval } = selectedItems;
    let isWithinTimeInterval = d => d.Year >= timeInterval.min && d.Year <= timeInterval.max;

    let filtered = dataArr.filter(d => allSelectedAreas.includes(d.CountryName)
      && d.IndicatorName === indicator
      && isWithinTimeInterval(d));

    return filtered;
  }

  /**
   * Purpose: Handles mouseenter event by creating a stroke around target bar 
   *          and calling dispatcher for other chart interactions
   * @param {Event} event : Native JS event (i.e. 'mouseenter')
   */
  handleMouseEnter(event) {
    let vis = this;

    const { labelClass, barClass, countryKey } = vis.getClassesOfBarElems(event);

    // Display value of country
    const targetLabel = vis.chart.selectAll(labelClass);
    targetLabel.attr('display', 'block');

    // Emphasize target bar
    const targetBar = vis.chart.selectAll(barClass);
    targetBar.attr('stroke', 'black');

    // Dispatch dispatchEvent
    const country = vis.constants.countries[countryKey];
    dispatcher.call(dispatcherEvents.BAR_HOVER, vis, country);
  }

  /**
   * Purpose: Returns the classes of the bar that triggered the event and its label
   * @param {Event} event : native JS event (i.e. 'mouseenter'/'mouseleave')
   * @returns {Object} = {labelClass: <string>, barClass: <string>}
   */
  getClassesOfBarElems(event) {
    const { target } = event;
    const classes = target.className.baseVal.split(' ');
    const countryKey = classes[1].split('-')[1];

    const labelClass = `.bar-label-${countryKey}`;
    const barClass = `.bar-${countryKey}`;
    return { labelClass, barClass, countryKey };
  }

  /**
   * Purpose: Handles mouseleave event by removing strokes from target bar 
   *          and calling dispatcher for other chart interactions
   * @param {Event} event : Native JS event (i.e. 'mouseleave')
   */
  handleMouseLeave(event) {
    let vis = this;

    const { target } = event;
    const classes = target.className.baseVal.split(' ');
    const countryKey = classes[1].split('-')[1];
    const targetLabel = `.bar-label-${countryKey}`;

    // Hide value of country unless value is 'N/A'
    const label = vis.chart.select(targetLabel);
    label.text() === 'N/A' ? null : label.attr('display', 'none');

    // Remove stroke emphasis of any bar
    const bars = d3.selectAll('.bar');
    bars.attr('stroke', 'none')
      .attr('stroke-width', 2);

    // Dispatch dispatchEvent
    const country = vis.constants.countries[countryKey];
    dispatcher.call(dispatcherEvents.BAR_UNHOVER, vis, country);
  }

  /**
   * Purpose: Creates a horizontal line to separate neg and positive y-values 
   */
  appendSeparatorLine() {
    let vis = this;

    vis.chartArea.append('line')
      .attr('class', 'separator')
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .attr('x1', 0)
      .attr('x2', vis.width)
      .style('visibility', 'hidden');
  }

  /**
   * Purpose: Updates y1 and y2 positioning of separator line
   */
  updateSeparatorLine() {
    let vis = this;
    let separator = vis.chartArea.selectAll('.separator');
    separator
      .attr('y1', vis.getYPosition({ avg: 0 })) //so that the line passes through the y 0
      .attr('y2', vis.getYPosition({ avg: 0 })) //so that the line passes through the y 0
  }

  /**
   * Purpose: updates domain of yScale
   */
  updateYScaleDomain() {
    let vis = this;
    let [min, max] = d3.extent(vis.averages);

    // Handle edge cases and when min is greater than 0
    min = min > 0 || !min ? 0 : min;
    max = max ? max : 0;

    vis.yScale.domain([min, max]);
  }

  /**
   * Purpose: updates domain of yScale and truncates country names
   */
  updateXScaleDomain() {
    let vis = this;

    const { inputSanitizer } = vis.constants;
    const { allSelectedAreas } = vis.selected;
    let truncatedCountryNames = [];

    for (let selectedCountry of allSelectedAreas) {
      let truncatedName = inputSanitizer.truncateCountryName(selectedCountry);
      truncatedCountryNames.push(truncatedName);
    }

    vis.xScale.domain(truncatedCountryNames);
  }

  /**
   * Purpose: Displays horizontal separator of neg and pos y-values
   */
  showSeparatorLine() {
    let vis = this;

    vis.chartArea.selectAll('.separator')
      .style('visibility', 'visible');
  }

  /**
   * Purpose: Hides horizontal separator of neg and pos y-values
   */
  hideSeparatorLine() {
    let vis = this;

    vis.chartArea.selectAll('.separator')
      .style('visibility', 'hidden');
  }

  /**
   * Purpose: Returns true if given averages array has a negative average
   * @param {Array} averages : Array of aggregated data (i.e. {key: <string>, avg: <Number>})
   * @returns {Boolean} : true if minimum given array has a negative avg
   */
  hasNegMin(averages) {
    let vis = this;

    averages = averages ? averages : vis.getAllAverages();
    return d3.min(averages) < 0;
  }

  /**
   * Purpose: Returns a new array of aggregated data for all selected countries
   *          Array includes selected countries whose data is missing in dataset for this aggregation
   * @param {Array} aggregated : array of aggregated data in format {key: <string>, avg: <Number>}
   * @returns {Array} of aggregated data for all selected countries - including countries with missing data
   */
  reAddMissingCountries(aggregated) {
    let vis = this;

    const { allSelectedAreas } = vis.selected;
    let isMissingData = aggregated.length < allSelectedAreas.length;

    if (!isMissingData) {
      return aggregated
    }

    let res = [];
    let added = [];

    // For each selected country
    for (let i = 0; i < allSelectedAreas.length; i++) {
      const selectedCountry = allSelectedAreas[i];

      // Re-add matching data from aggregated array
      vis.addMatchingData(aggregated, selectedCountry, added, res);

      // If country is missing from aggregated, create new object with {key: selectedCountry, avg: null}
      vis.addMissingData(added, selectedCountry, res);
    }

    return res;
  }

  /**
   * Purpose: Creates an object {key: selectedCountry, avg: null} to add to resulting array
   * @param {Array} added : array of strings (i.e. countries that have already been added to new array)
   * @param {string} selectedCountry : name of a selected country
   * @param {Array} res : array we're modifying
   */
  addMissingData(added, selectedCountry, res) {
    if (!added.includes(selectedCountry)) {
      // No match in aggregated array
      const item = { key: selectedCountry, avg: null };
      added.push(selectedCountry);
      res.push(item);
    }
  }

  /**
   * Purpose: adds aggregated data of selected country into resulting array
   * @param {Array} aggregated : array of aggregated data with missing data
   * @param {string} selectedCountry : name of a selected country
   * @param {Array} added : array of strings (i.e. countries that have already been added to new array)
   * @param {Array} res : array we're modifying
   */
  addMatchingData(aggregated, selectedCountry, added, res) {
    for (let j = 0; j < aggregated.length; j++) {
      const aggregatedItem = aggregated[j];

      const isAlreadyAdded = added.includes(selectedCountry);
      const isMatch = selectedCountry === aggregatedItem.key;

      if (isMatch && !isAlreadyAdded) {
        added.push(selectedCountry);
        res.push(aggregatedItem);
      }
    }
  }


}