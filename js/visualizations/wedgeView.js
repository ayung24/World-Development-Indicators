class WedgeView {

    constructor(_data, _selected, _dispatcher, _dispatcherEvents, _constants) {
      this.data = _data;
      this.dispatcher = _dispatcher;
      this.dispatcherEvents = _dispatcherEvents;
      this.indicators = new Indicators();
      this.populationData = _data.filter(d => d.IndicatorName == this.indicators.POPULATION_TOTAL);
      this.selected = _selected;
      this.constants = _constants || {
        regionMapper: new RegionMapper(),
        regions: new Regions(),
        countryCodeMapper: new CountryCodeMapper()
      };
      this.initVis();
    }
  
    // Initialize drawing space for each wedge, plus pie and arc generators
    // Bind event listeners to each table cell
    initVis() {
      let vis = this; 

      const { regionMapper, regions, countryCodeMapper } = vis.constants;
      const allCountryNames = regionMapper.getCountriesOfRegion(regions.WORLD);
      vis.alpha3OfAllCountries = countryCodeMapper.getCountryAlpha3s(allCountryNames);

      this.wedgeWidth = 50;
      this.wedgeHeight = 50;
      this.margin = 5;
      // Add an svg drawing space to each div
      // Bind the div to the CHANGE_INDICATOR event
      this.indicators = new Indicators(); 
      Object.keys(indicators).forEach(d => {
        const div = d3.select('#' + d);
        div.append('svg')
          .attr('width', this.wedgeWidth)
          .attr('height', this.wedgeHeight)
          .append('g')
          .attr('transform', `translate(${this.wedgeWidth/2}, ${this.wedgeHeight/2})`);
        div.on('click', function(event) {
          d3.select("div[selected='true']")
            .attr('selected', 'false');
          d3.select('#' + this.id)
            .attr('selected', 'true')
          vis.dispatcher.call(vis.dispatcherEvents.CHANGE_INDICATOR, this, this.id);
        }); 
      });

      // Initialize pie generator
      this.pie = d3.pie()
        .sort(null)
        .startAngle(0)
        .endAngle(6.28);

      // Intialize arc generators
      this.countryArc = d3.arc()
        .innerRadius(10)
        .outerRadius(15);

      this.worldArc = d3.arc()
        .innerRadius(15)
        .outerRadius(20);

      // Legend
      this.legendArc = d3.arc()
        .innerRadius(2)
        .outerRadius(5);

      const legendData = [65, 35];

      // Add svg drawing spaces for the legend wedges
      d3.selectAll(".leg-wedge")
        .append('svg')
        .attr('width', 10)
        .attr('height', 10)
        .append('g')
        .attr('transform', `translate(5, 5)`);

      d3.select('#leg-country-wedge svg g')
        .data(this.pie(legendData))
        .append('path')
        .attr('class', 'c-arc')
        .attr('num', d => d.index)
        .attr('d', this.legendArc);

      d3.select('#leg-world-wedge svg g')
        .data(this.pie(legendData))
        .append('path')
        .attr('class', 'w-arc')
        .attr('num', d => d.index)
        .attr('d', this.legendArc);

      d3.select('#leg-full-wedge svg g')
        .data(this.pie([100]))
        .append('path')
        .attr('class', 'w-arc')
        .attr('num', d => d.index)
        .attr('d', this.legendArc);

      d3.select('#leg-selected-wedge svg g')
        .data(this.pie(legendData))
        .append('path')
        .attr('class', 'c-arc')
        .style('fill', 'green')
        .attr('num', d => d.index)
        .attr('d', this.legendArc);
    }
  
    // Prepare data, render
    updateVis() {
      // Filter the data to the range of selected years
      const codesOfSelectedCountries = "";
      const filteredDataAllCountries = this.data.filter(d => {
        return this.selected.selectedYears.includes(d.Year) && this.alpha3OfAllCountries.includes(d.CountryCode) && d.CountryCode != "WLD"});

      // Each wedge (indicator) needs three pieces of data from the subset of data within the range of selected years
      // 1. maximum value for that indicator (maxDataMap)
      // 2. average value for the selected country (selectedCountryDataMap)
      // 3. average value for the world (worldAverageDataMap), which is the average of all country's averages
      // https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
      const dataByIndicatorCountryAverage = d3.rollup(filteredDataAllCountries, v => d3.mean(v, i => i.Value), d => d.IndicatorName, d => d.CountryName)
      this.maxDataMap = new Map();
      this.selectedCountryDataMap = new Map();
      this.worldAverageDataMap = new Map();
      dataByIndicatorCountryAverage.forEach((map, indicator) => { 
        let values = Array.from(map.values());
        this.maxDataMap.set(indicator, d3.max(values));
        this.worldAverageDataMap.set(indicator, d3.mean(values));
        this.selectedCountryDataMap.set(indicator, map.get(this.selected.area.country)); 
      }, this);

      this.renderVis();
    }
  
    // Loop through all indicators, rendering wedges for each
    // If no data is available, render nothing
    renderVis() {
      Object.keys(this.indicators).forEach(i => {
        const max = this.maxDataMap.get(this.indicators[i]);
        const countryAvg = this.selectedCountryDataMap.get(this.indicators[i]);
        const worldAvg = this.worldAverageDataMap.get(this.indicators[i]);

        // Bind event listener for tooltip to each wedge
        d3.select('#' + i).on('mouseover', event => { 
          d3.select('#tooltip')
            .attr('display', true)
            .style('top', `${event.clientY}px`)
            .style('left', `${event.clientX}px`)
            .html(`<strong>${this.indicators[i]}</strong><br>
                  <i>${d3.min(this.selected.selectedYears)}-${d3.max(this.selected.selectedYears)}</i>
                <ul>
                  <li>World maximum: ${max ? Number(max.toFixed(0)).toLocaleString() : 'N/A'}</li>
                  <li>World average: ${worldAvg ? Number(worldAvg.toFixed(0)).toLocaleString() : 'N/A'}</li>
                  <li>${this.selected.area.country}'s average: ${countryAvg ? Number(countryAvg.toFixed(0)).toLocaleString() : 'N/A'}</li>
                </ul>`);
        })
        .on('mouseout', event => { 
          d3.select('#tooltip')
            .attr('display', false);
        });

        // Country
        if (max && countryAvg) {
          const countryData = [countryAvg, (max - countryAvg)];
          // https://stackoverflow.com/questions/24118919/how-do-i-get-the-index-number-from-the-array-in-d3/24118970
          d3.select('#' + i + ' svg g')
            .selectAll('.c-arc')
            .data(this.pie(countryData))
            .join(
            enter => enter.append('path')
              .attr('class', 'c-arc')
              .attr('num', d => d.index)
              .attr('d', this.countryArc),
            update => update
              .attr('num', d => d.index)
              .attr('d', this.countryArc),
            exit => exit.remove());
          }

         // World
         if (max && worldAvg) {
          const worldData = [worldAvg, (max - worldAvg)];
          d3.select('#' + i + ' svg g')
            .selectAll('.w-arc')
            .data(this.pie(worldData))
            .join(
            enter => enter.append('path')
                .attr('class', 'w-arc')
                .attr('num', d => d.index)
                .attr('d', this.worldArc),
           update => update
            .attr('num', d => d.index)
            .attr('d', this.worldArc),
           exit => exit.remove());
          }
      });
    }
  }