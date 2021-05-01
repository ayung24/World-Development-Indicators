class LineChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _selectedItems) {
    this.config = {
      parentElement: _config.parentElement,
      colour: _config.colour ||
      {
        selectedArea: 'blue',
        otherAreas: d3.schemeCategory10,
      },
      circle: { radius: 4.5 },
      line: { strokeWidth: 3 },
      containerWidth: _config.containerWidth || 2700,
      containerHeight: _config.containerHeight || 1200,
      margin: _config.margin || { top: 50, right: 500, bottom: 110, left: 120 }
    }
    this.selected = _selectedItems;
    this.data = _data;
    this.constants = { countries: new Countries() }
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.colorScale = d3.scaleOrdinal()
      .range(vis.config.colour.otherAreas);

    vis.xScale = d3.scaleTime()
      .range([0, vis.width]);

    // yScalePos for positive domains, yScaleNeg for negative domains
    vis.yScalePos = d3.scaleLinear()
      .range([vis.height, 0]);

    vis.yScaleNeg = d3.scaleLinear()
      .range([vis.height, 0]);

    // Initialize axes
    // Replace the 'G' (Giga) SI-prefix of d3 with 'B' to stand for 'Billion' when formatting
    let format = (strInput) => d3.format('.2~s')(strInput).replace(/G/, 'B');

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSize(-vis.height - 4)
      .tickSizeOuter(0)
      .tickPadding(10)
      .tickFormat(d3.timeFormat('%Y'));

    // yAxisPos for positive domains, yAxisNeg for negative domains
    vis.yAxisPos = d3.axisLeft(vis.yScalePos)
      .tickSize(-vis.width - 20)
      .tickSizeOuter(0)
      .tickPadding(10)
      .tickFormat(format);

    vis.yAxisNeg = d3.axisLeft(vis.yScaleNeg)
      .tickSize(-vis.width - 20)
      .tickSizeOuter(0)
      .tickPadding(10)
      .tickFormat(format);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr('viewBox', `0 0 ${vis.config.containerWidth} ${vis.config.containerHeight}`);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis linechart')
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

    vis.lines = vis.chart.append('g')
      .attr('class', 'lines');

    vis.countries = vis.lines.append('g')
      .attr('class', 'countries');

    vis.circles = vis.lines.append('g')
      .attr('class', 'circles')

    vis.legend = vis.chart.append('g')
      .attr('class', 'legend');

    vis.values = vis.chart.append('g')
      .attr('class', 'values');

    vis.yearValue = vis.svg.append('text')
      .attr('class', 'yearValue')
      .attr('y', 30)
      .attr('x', vis.width + 165)
      .attr('dy', '.71em');

    vis.mouseG = vis.lines.append('g')
      .attr('class', 'mouse-over-effects');
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    const parseTime = d3.timeParse("%Y");
    const selectedCountries = vis.selected.allSelectedAreas;
    const selectedIndicator = vis.selected.indicator;
    const selectedYears = vis.selected.selectedYears;
    const filteredSelectedData = vis.data.filter(d => d.IndicatorName === selectedIndicator
      && selectedCountries.includes(d.CountryName) && selectedYears.includes(d.Year));
    vis.negativeDomains = ['Net official development assistance and official aid received (current US$)', 'Inflation, GDP deflator (annual %)'];

    // Group data by country
    const countryGroups = d3.groups(filteredSelectedData, d => d.CountryName);

    // Re-arrange data
    vis.formattedData = [];

    countryGroups.forEach(g => {
      const obj = {
        countryName: g[0],
        values: g[1]
      }
      if (obj.countryName === vis.selected.area.country) {
        vis.formattedData.unshift(obj);
      } else {
        vis.formattedData.push(obj);
      }
    });

    // Specificy x- and y-accessor functions
    vis.xValue = d => d.year;
    vis.yValue = d => d.value;
    vis.colorValue = d => d.countryName;

    // Initialize line generator
    vis.line = d3.line()
      .x(d => vis.xScale(d.year))
      .y(d => {
        if (vis.negativeDomains.includes(vis.selected.indicator)) {
          return vis.yScaleNeg(d.value)
        } else {
          return vis.yScalePos(d.value)
        }
      })
      .defined(d => { return d.value !== null });

    selectedYears.forEach(y => {
      parseTime(y);
    });

    // Set the scale input domains - yScalePos for positive domains, yScaleNeg for negative domains
    vis.colorScale.domain(vis.selected.allSelectedAreas);

    // Check if data is empty
    if (filteredSelectedData.length !== 0) {
      vis.xScale.domain(d3.extent(filteredSelectedData, d => d.year));
      vis.yScalePos.domain([0, d3.max(filteredSelectedData, d => d.value), d3.max(filteredSelectedData, d => d.value)]);
      vis.yScaleNeg.domain(d3.extent(filteredSelectedData, d => d.value), d3.max(filteredSelectedData, d => d.value));
    } else {
      vis.xScale.domain([parseTime(vis.selected.timeInterval.min), parseTime(vis.selected.timeInterval.max)]);
      vis.yScalePos.domain([0, 0]);
      vis.yScaleNeg.domain([0, 0]);
    }
    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Dynamic y-axis title
    vis.chart.selectAll('.y-axis-title')
      .data([vis.selected.indicator])
      .join('text')
      .attr('class', 'y-axis-title')
      .attr('y', -vis.config.margin.top + 5)
      .attr('x', -vis.config.margin.left)
      .attr('dy', '.1em')
      .style('font-weight', 'bold')
      .text('Total ' + vis.selected.indicator);

    // Create legend color boxes
    vis.legend.selectAll('.legend-box')
      .data(vis.selected.allSelectedAreas, d => d)
      .join('rect')
      .attr('class', 'legend-box')
      .attr('x', (d, i) => {
        return (i * 450) + 10;
      })
      .attr('y', vis.config.containerHeight - 30)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', d => vis.getColourForLegend(d));

    // Create country labels for colored boxes
    vis.legend.selectAll('.box-label')
      .data(vis.selected.allSelectedAreas, d => d)
      .join('text')
      .attr('class', 'box-label')
      .attr('x', (d, i) => (i * 450) + 45)
      .attr('y', vis.config.containerHeight - 10)
      .text(d => {
        if (d.length > 13) {
          return d.slice(0, 13) + '...';
        } else {
          return d;
        }
      });

    // Values for comparing countries
    vis.values.selectAll('text')
      .data(vis.formattedData, d => d.values)
      .join('text')
      .attr('class', 'value');

    // Add line path
    vis.countries.selectAll('.line')
      .data(vis.formattedData, d => d.values)
      .join('path')
      .attr('class', d => `line line-${vis.constants.countries.getKey(d.countryName)}`)
      .attr('d', d => vis.line(d.values))
      .style('stroke', d => vis.getColour(d))
      .style('stroke-width', vis.config.line.strokeWidth);

    // Add data points(dots) on line
    vis.circles.selectAll('.circle-group')
      .data(vis.formattedData)
      .join('g')
      .attr('class', 'circle-group')
      .style('fill', d => vis.getColour(d))
      .selectAll('circle')
      .data(d => d.values.filter(d => d.value !== null))
      .join('circle')
      .attr('class', d => `circle circle-${vis.constants.countries.getKey(d.CountryName)}`)
      .attr('r', vis.config.circle.radius)
      .attr('cx', d => vis.xScale(d.year))
      .attr('cy', d => {
        if (vis.negativeDomains.includes(vis.selected.indicator)) {
          return vis.yScaleNeg(d.value)
        } else {
          return vis.yScalePos(d.value)
        }
      });

    const mouseG = vis.mouseG.selectAll('.mouseG')
      .data(vis.formattedData, d => d)
      .join('g')
      .attr('class', 'mouseG');

    const mouseGEnter = mouseG.enter().append('g')
      .attr('class', 'mouseG');

    mouseGEnter.merge(mouseG);

    mouseG.exit().remove();

    // Create black vertical line to follow mouse
    const mouseLine = mouseG.merge(mouseGEnter).selectAll('.mouse-line')
      .data(d => [d], d => d);

    const mouseLineEnter = mouseLine.enter().append('path')
      .attr('class', 'mouse-line');

    mouseLineEnter.merge(mouseLine)
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('display', 'none');

    mouseLine.exit().remove();

    const mousePerLine = vis.mouseG.selectAll('.mouse-per-line')
      .data(vis.formattedData, d => d);

    const mousePerLineEnter = mousePerLine.enter().append('g')
      .attr('class', 'mouse-per-line');

    mousePerLineEnter.merge(mousePerLine);

    mousePerLine.exit().remove();

    const mplCircle = mousePerLine.merge(mousePerLineEnter).selectAll('.mouseCircle')
      .data(d => [d], d => d);

    const mplCircleEnter = mplCircle.enter().append('circle')
      .attr('class', 'mouseCircle');

    // Create data value tracking circle for mouse line
    mplCircleEnter.merge(mplCircle)
      .attr('r', vis.config.circle.radius * 2.5)
      .attr('visibility', 'hidden')
      .style('stroke', d => vis.getColour(d))
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .style('display', 'none');

    mplCircle.exit().remove();

    const mplText = mousePerLine.merge(mousePerLineEnter).selectAll('.mouse-text')
      .data(d => [d], d => d);

    const mplTextEnter = mplText.enter().append('text')
      .attr('class', 'mouse-text');

    mplTextEnter.merge(mplText)
      .attr('transform', `translate(20, 13)`);

    mplText.exit().remove();

    // Append a rect to catch mouse movements on canvas
    const rect = mouseG.merge(mouseGEnter).selectAll('.rect-overlay')
      .data(d => [d], d => d);

    const rectEnter = rect.enter().append('rect')
      .attr('class', 'rect-overlay');

    // Hide mouse line, text and circles on mouse leave, show on mouse enter
    rectEnter.merge(rect)
      .attr('width', vis.width)
      .attr('height', vis.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseleave', () => {
        d3.select('.mouse-line')
          .style('display', 'none');
        d3.selectAll('.mouse-per-line circle')
          .style('display', 'none');
        d3.selectAll('.mouse-per-line text')
          .style('display', 'none');
        d3.selectAll('.value')
          .style('display', 'none');
        d3.select('.yearValue')
          .style('display', 'none');
      })
      .on('mouseenter', () => {
        d3.select('.mouse-line')
          .style('display', 'block');
        d3.selectAll('.mouse-per-line circle')
          .style('display', 'block');
        d3.selectAll('.mouse-per-line text')
          .style('display', 'block');
        d3.selectAll('.value')
          .style('display', 'block');
        d3.select('.yearValue')
          .style('display', 'block');
      })
      .on('mousemove', function (event) {
        const mouse = d3.pointer(event, this)[0];
        const formatNumbers = d3.format(',');

        d3.selectAll('.mouse-per-line')
          .attr('transform', function (d, i) {
            // Get date that corresponds to current mouse x-coordinate
            const xDate = vis.xScale.invert(mouse);
            const bisect = d3.bisector(d => d.year).left;

            // Find nearest data point
            const idx = bisect(d.values, xDate);
            const item = d.values[idx];
            const circle = d3.select(this).selectAll('.mouseCircle');

            if (item) {
              const currentYear = item.Year;

              if (vis.negativeDomains.includes(vis.selected.indicator)) {
                // Get value of data value tracking circles on mouse line
                d3.select(this).select('text')
                  .text(d => item.value !== null || item.value === 0 ?
                    formatNumbers(vis.yScaleNeg.invert(vis.yScaleNeg(item.value)).toFixed(2)) : null);

                // Get values of comparing countries
                d3.select('.values').selectAll('.value')
                  .attr('x', vis.width + 45)
                  .attr('y', (d, i) => {
                    return (i * 50) + 95
                  })
                  .attr('transform', () => {
                    if (currentYear >= vis.selected.selectedYears[Math.round((vis.selected.selectedYears.length - 1) / 2)]) {
                      return `translate(${-vis.width - 30},0)`
                    }
                  })
                  .text(d => d.values[idx].value !== null || d.values[idx].value === 0 ?
                    (d.countryName.length > 13 ? d.countryName.slice(0, 13) + '...' : d.countryName) +
                    ': ' + formatNumbers(vis.yScaleNeg.invert(vis.yScaleNeg(d.values[idx].value)).toFixed(2))
                    : d.countryName + ': N/A');

              } else {
                // Get value of data value tracking circles on mouse line
                d3.select(this).select('text')
                  .text(d => item.value !== null || item.value === 0 ?
                    formatNumbers(vis.yScalePos.invert(vis.yScalePos(item.value)).toFixed(2)) : null);

                // Get values of comparing countries
                d3.select('.values').selectAll('.value')
                  .attr('x', vis.width + 45)
                  .attr('y', (d, i) => {
                    return (i * 50) + 95
                  })
                  .attr('transform', () => {
                    if (currentYear >= vis.selected.selectedYears[Math.round((vis.selected.selectedYears.length - 1) / 2)]) {
                      return `translate(${-vis.width - 30},0)`
                    }
                  })
                  .text(d => d.values[idx].value !== null || d.values[idx].value === 0 ?
                    (d.countryName.length > 13 ? d.countryName.slice(0, 13) + '...' : d.countryName) +
                    ': ' + formatNumbers(vis.yScalePos.invert(vis.yScalePos(d.values[idx].value)).toFixed(2))
                    : d.countryName + ': N/A');
              }

              // Get current year of mouseover
              if (currentYear) {
                d3.select('.yearValue')
                  .attr('transform', () => {
                    if (currentYear >= vis.selected.selectedYears[Math.round((vis.selected.selectedYears.length - 1) / 2)]) {
                      return `translate(${-vis.width - 30}, 5)`
                    }
                  })
                  .text(currentYear);
              }

              // Draws mouse line
              vis.svg.select('.mouse-line')
                .attr('d', function () {
                  var data = 'M' + vis.xScale(item.year) + ',' + vis.height;
                  data += ' ' + vis.xScale(item.year) + ',' + 0;
                  return data;
                });

              // Check if indicator has a negative domain, switch scales if yes
              if (item.value !== null || item.value === 0) {

                // Display tracking circles
                circle.attr('visibility', 'visible');

                if (vis.negativeDomains.includes(vis.selected.indicator)) {
                  return `translate(${vis.xScale(item.year)},${vis.yScaleNeg(item.value)})`;
                } else {
                  return `translate(${vis.xScale(item.year)},${vis.yScalePos(item.value)})`;
                }
              }
            }
            // Don't translate and hide tracking circles if values are null
            circle.attr('visibility', 'hidden');
            return 'translate(0,0)';
          });
      });

    rect.exit().remove();

    // Update the axes depending on domain
    vis.xAxisG.call(vis.xAxis.ticks(d3.timeYear));
    if (vis.negativeDomains.includes(vis.selected.indicator)) {
      vis.yAxisG.call(vis.yAxisNeg)
    } else {
      vis.yAxisG.call(vis.yAxisPos);
    }
  }

  /**
   * Purpose: Toggles target country's elems as active and emphasizes them
   *          De-emphasizes the elems of other countries
   * @param {string} country : Name of Country
   */
  emphasizeLine(country) {
    let vis = this;

    const countryKey = vis.constants.countries.getKey(country);

    vis.toggleElems(countryKey, true);
    vis.emphasizeActiveElems(countryKey);
    vis.deEmphasizeInactiveElems();
  }

  /**
   * Purpose: Toggles country elems as inactive and resets all elems to
   *          default styling
   * @param {string} country : Name of Country
   */
  deEmphasizeLine(country) {
    let vis = this;

    const countryKey = vis.constants.countries.getKey(country);

    vis.toggleElems(countryKey, false);
    vis.resetAllElemStyles();
  }

  // ------------------ Helpers ------------------ //

  /**
   * Purpose: Returns an appropriate colour depending on the given country
   * @param {string} country : Name of Country
   * @returns {string} representing a hex colour
   */
  getColourForLegend(country) {
    let vis = this;

    let isFocusedCountry = vis.constants.countries.isSameCountryName(country, vis.selected.area.country);

    if (isFocusedCountry) {
      return vis.config.colour.selectedArea;
    } else {
      return vis.colorScale(country);
    }
  }

  /**
   * Purpose: Returns an appropriate colour depending on country of given object
   * @param {Object} d = { countryName: <string>, values: <Array of data objects>}
   * @returns {string} representing a hex colour
   */
  getColour(d) {
    let vis = this;

    let isFocusedCountry = d.countryName.toLowerCase().trim() === vis.selected.area.country.toLowerCase().trim();

    if (isFocusedCountry) {
      return vis.config.colour.selectedArea;
    } else {
      return vis.colorScale(vis.colorValue(d));
    }
  }

  /**
   * Purpose: Returns all elems of class <className> that is inactive
   * @param {string} className : class of elem to check (format: ".<className>")
   * @param {string} activeClassName : toggled elem's active class (format: "<activeClassName>")
   * @returns {Selection} : d3 selection 
   */
  getInactiveElems(className, activeClassName) {
    let vis = this;

    return vis.lines.selectAll(className).filter(function () {
      return !this.classList.contains(activeClassName);
    })
  }

  /**
   * Purpose: Makes inactive elems more transparent
   */
  deEmphasizeInactiveElems() {
    let vis = this;

    let opacityOfInactive = 0.25;

    const inactiveLines = vis.getInactiveElems('.line', 'active-line');
    inactiveLines.attr('opacity', opacityOfInactive);

    const inactiveCircles = vis.getInactiveElems('.circle', 'active-circle');
    inactiveCircles.attr('opacity', opacityOfInactive);
  }

  /**
   * Purpose: Toggles country that matches <countryKey> as active and 
   *          Styles its relevant elems to emphasize them
   */
  emphasizeActiveElems() {
    let vis = this;

    const activeCircles = vis.circles.selectAll(`.active-circle`);
    const activeLine = vis.countries.selectAll(`.active-line`);

    //Emphasize elems
    activeCircles
      .attr('r', vis.config.circle.radius * 1.5)
      .attr('opacity', 1);

    activeLine
      .attr('opacity', 1)
      .style('stroke-width', vis.config.line.strokeWidth * 2);
  }

  /**
   * Purpose: Resets all the line and circles to default styles
   */
  resetAllElemStyles() {
    let vis = this;

    const lines = vis.countries.selectAll('.line');
    lines
      .attr('opacity', 1)
      .style('stroke-width', vis.config.line.strokeWidth);

    const circles = vis.circles.selectAll('.circle');
    circles
      .attr('opacity', 1)
      .attr('r', vis.config.circle.radius);
  }

  /**
   * Purpose: Toggles the elems of given <countryKey> as active or inactive
   * @param {string} countryKey : key of country as defined in ./constants/countries.js
   * @param {Boolean} toggleSetting : true to toggle active; false for inactive
   */
  toggleElems(countryKey, toggleSetting) {
    let vis = this;

    const line = vis.countries.selectAll(`.line-${countryKey}`);
    line.classed('active-line', toggleSetting);

    const circle = vis.circles.selectAll(`.circle-${countryKey}`);
    circle.classed('active-circle', toggleSetting);
  }
}