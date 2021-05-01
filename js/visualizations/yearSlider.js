class YearSlider {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _dispatcher, _dispatcherEvents) {
    this.config = {
      parentElement: _config.parentElement,
      width:  50,
      height: 850,
      contextWidth: 30,
      margin: {top: 50, right: 10, bottom: 100, left: 45},
    }
    this.data = _data;
    this.dispatcher = _dispatcher;
    this.dispatcherEvents = _dispatcherEvents;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    const containerWidth = vis.config.width;
    const containerHeight = vis.config.height + vis.config.margin.top;
  
    vis.yScale = d3.scaleTime()
        .rangeRound([0, containerHeight]);
  
    // Initialize axes
    vis.yAxis = d3.axisLeft(vis.yScale)
      .tickPadding(12)
      .tickSizeOuter(0)
      .ticks(52);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', containerWidth)
        .attr('height', containerHeight);

    // Append chart group with x- and y-axes
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(30, 10)`);

    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis slider');

    vis.brushG = vis.chart.append('g')
        .attr('class', 'brush y-brush')
        .attr('id', 'y-brush')
        .attr('transform', `translate(-15, 0)`);

    // Initialize brush component
    vis.brush = d3.brushY()
        .extent([[0, 0], [vis.config.contextWidth, containerHeight]])
        .on("end", (e) => vis.brushended(e));
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    
    vis.yValue = d => d.year;

    // Set the scale input domains
    vis.yScale.domain(d3.extent(vis.data, vis.yValue));
  
    vis.renderVis();
  }

  /**
   * This function contains the D3 code for binding data to visual elements
   */
  renderVis() {
    let vis = this;

    
    // Update the axes
    vis.yAxisG.call(vis.yAxis);

    // Update the brush and define a default position
    const defaultBrushSelection = [vis.yScale(new Date('1990-01-01')), vis.yScale(new Date('2010-01-01'))];
    vis.brushG
        .call(vis.brush)
        .call(vis.brush.move, defaultBrushSelection);
  }

  /**
   * React to brush events
   */
  brushended(event) {
    let vis = this;
    let brushGroup = document.getElementById('y-brush');

    const selection = event.selection;
    if (!event.sourceEvent || !selection) return;

    const d0 = selection.map(vis.yScale.invert)
    const d1 = d0.map(d3.timeYear.round);

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
      d1[0] = d3.timeYear.floor(d0[0]);
      d1[1] = d3.timeYear.offset(d1[0]);
    }

    const selectedYears = [];
    const minYear = d1[0].getFullYear();
    const maxYear = d1[1].getFullYear();
    for (let year = minYear; year <= maxYear; year++) {
      selectedYears.push(year.toString());
    }

    vis.dispatcher.call(vis.dispatcherEvents.FILTER_YEAR, brushGroup, selectedYears);
    d3.select(brushGroup).call(vis.brush.move, d1.map(vis.yScale));
  }
}