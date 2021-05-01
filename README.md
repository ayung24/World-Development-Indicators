# CPSC 436V Project : World Development Indicators

## Notes to/for the TA:
- Visualization designed for larger screens (preferably 1920px x 1080px and above). (Though there is some responsiveness for smaller screens, it's not 100% completely responsive)
- [Project Structure & Implementation below](#project-file-structure)

## Table of Contents
- [CPSC 436V Project : World Development Indicators](#cpsc-436v-project--world-development-indicators)
  - [Notes to/for the TA:](#notes-tofor-the-ta)
  - [Table of Contents](#table-of-contents)
  - [The Team](#the-team)
  - [Overview](#overview)
    - [Goal and Purpose](#goal-and-purpose)
  - [Dataset](#dataset)
    - [Sources](#sources)
    - [Pre-processing](#pre-processing)
  - [Implementation](#implementation)
    - [Project File Structure](#project-file-structure)
    - [Current Status (as of April 14, 2021)](#current-status-as-of-april-14-2021)
      - [High-level Tasks (Not fully inclusive)](#high-level-tasks-not-fully-inclusive)
        - [**Complete:**](#complete)
        - [**Todo's from M2**](#todos-from-m2)
        - [**Stretch Goals**](#stretch-goals)
  - [External Resources](#external-resources)
    - [Data Sources](#data-sources)
    - [Referenced Material](#referenced-material)
        - [Data Processing](#data-processing)
        - [Map](#map)
        - [Year slider](#year-slider)
        - [Multi-line chart](#multi-line-chart)
        - [Comparison Section](#comparison-section)
        - [Styling](#styling)
        - [Colour Palette](#colour-palette)
        - [Scrolling](#scrolling)
  
## The Team
Group 24:
| Team Member | Github Id (School's) |
|-------------|----------------------|
|Amy          | amy2400              |
|Brett        | bpasula              |
|Jacqueline   | yjackie              |

## Overview
### Goal and Purpose
Inequality is, sadly, pervasive throughout all domains of life - and countries are not exempt. Countries fall under the categories of “developed” vs “developing”, with “developed” countries seeking to expand their sphere of influence by donating and funding the development of those that are “developing”. But what does that mean, exactly? What are the factors that determine whether a country is *"developed"* or *"developing"*, and how do countries fare on each indicator of development?

The data visualization for this project leverages data consolidated from the World Bank and seeks to allow users to explore the different regions of the world and see how well they do in different areas of development as compared to a global average. Furthermore, we hope to allow users to investigate similarities or discrepancies between different areas of the world by juxtapositioning countries of interest in terms of indicators of development. 

Demo:
 - <img src="https://media.github.students.cs.ubc.ca/user/3011/files/3527bb80-9d46-11eb-94e2-41636a897483" width="700px">

## Dataset
### Sources
- [Kaggle: Indicators.csv](https://www.kaggle.com/worldbank/world-development-indicators?select=Indicators.csv)
- [Kaggle: continents2.csv](https://www.kaggle.com/andradaolteanu/country-mapping-iso-continent-region)

### Pre-processing
1. Filtered dataset `Indicators.csv` of all rows containing irrelevant `IndicatorName` values and created a temporary dataset `Dataset.csv` that held the results
2. Joined two datasets (`Dataset.csv` and `continents2.csv`)
3. From the result of the join, removed all rows that assigned anything other than a country to `CountryName` column (unless the value was "World")
4. Finally, we populate missing years for {country, indicator} pairs and set the values as `NULL`
5. **Note:** _For a more detailed breakdown of how we pre-processed our data, please refer to [the `README.md` in ./data](./data/README.md)_


## Implementation
### Project File Structure
Our project repo separates all visual components where the bar chart, line chart, map and wedges have their own css file. General styling all belongs in the style.css file. All stylesheets are under the `css` folder.

In our `js` folder, we have a `constants`, `widgets` and `visualizations` folder. The `constants` folder contains all constants used in our project. These constants include our colour palette colors, indicator names, country names, and our mappers. 

The `widgets` folder contains all the code for our selectors. The selectors include the selector for comparison areas and selecting the focus country. 

The `visualizations` folder contains all code for our visualizations which include: bar chart, line chart, map, wedges and year slider. 

Aside from these three folders, all other files such as libraries and util classes reside in the `js` file. 

A util file of particular use is `selected.js`. We created a new class in `selected.js` which keeps track of which values are currently selected. The selector class holds the value of selected country of focus and its region, selected comparison countries, selected indicators and selected time interval. This class is instantiated once in `main.js`, and that instance of the `selected` object is then fed into and shared across all views. When the instance of `selected` is updated and the view's `updateVis()` method gets called, the view updates as appropriate to reflect the change (if related to that view).

```
📦436v-project_g8y9a_r6s1b_s4g1b
┣ 📂css
 ┃ ┣ 📜barChart.css
 ┃ ┣ 📜comparisonWidget.css
 ┃ ┣ 📜focusAreaWidget.css
 ┃ ┣ 📜leaflet.css
 ┃ ┣ 📜lineChart.css
 ┃ ┣ 📜map.css
 ┃ ┣ 📜style.css
 ┃ ┣ 📜wedges.css
 ┃ ┗ 📜yearSlider.css
 ┣ 📂data
 ┃ ┣ 📜countries.json 
 ┃ ┣ 📜Dataset.csv
 ┃ ┗ 📜README.md
 ┣ 📂images
 ┃ ┣ ...
 ┣ 📂js
 ┃ ┣ 📂constants
 ┃ ┃ ┣ 📜colourPalette.js
 ┃ ┃ ┣ 📜countries.js
 ┃ ┃ ┣ 📜countryCodeMapper.js
 ┃ ┃ ┣ 📜dispatcherEvents.js
 ┃ ┃ ┣ 📜indicators.js
 ┃ ┃ ┣ 📜keyEventMapper.js
 ┃ ┃ ┣ 📜regionMapper.js
 ┃ ┃ ┣ 📜regions.js
 ┃ ┃ ┗ 📜warningType.js
 ┃ ┣ 📂visualizations
 ┃ ┃ ┣ 📜barChart.js
 ┃ ┃ ┣ 📜geoMap.js
 ┃ ┃ ┣ 📜lineChart.js
 ┃ ┃ ┣ 📜wedgeView.js
 ┃ ┃ ┗ 📜yearSlider.js
 ┃ ┣ 📂widgets
 ┃ ┃ ┣ 📜autocomplete.js
 ┃ ┃ ┣ 📜comparisonWidget.js
 ┃ ┃ ┗ 📜focusAreaWidget.js
 ┃ ┣ 📜d3.v6.min.js
 ┃ ┣ 📜inputSanitizer.js
 ┃ ┣ 📜leaflet.js
 ┃ ┣ 📜leaflet.js.map
 ┃ ┣ 📜main.js
 ┃ ┗ 📜selected.js
 ┣ 📜.gitignore
 ┣ 📜index.html
 ┗ 📜README.md
 ```

### Current Status (as of April 14, 2021)
#### High-level Tasks (Not fully inclusive)
##### **Complete:**
- [x] View: Choropleth Map (Basic)
- [x] View: Pie Wedges (Basic)
- [x] View: Bar-chart (Basic)
- [x] View: Line-chart (Basic)
- [x] View/UI widget: Year slider
- [x] UI widget: Select Country Dropdown + Radio Buttons
- [x] UI widget: Select Comparison Countries + Tags
- [x] Link: Select Country --> Bar-chart, Line-chart, Wedges
- [x] Link: Select Comparison --> Bar-chart, Line-chart
- [x] Link: Wedges (Select Indicator) --> Bar-chart, Line-chart, Map
- [x] Link: Year slider (Select Time Interval) --> Bar-chart, Line-chart, Wedges, Map
##### **Todo's from M2**
- [x] Link: Select Country --> Map
- [x] Link: Bar-chart --> Line-chart
- [ ] ~~Widget: Bar-chart tooltip~~ (Changed to displaying value when hover on bar)
- [x] Widget: Wedge tooltip
- [x] BugFix: Stacked rendering of Line-chart's y-axis title
- [x] UI: Warning message when adding over 4 comparison countries
- [x] UI: Warning when trying to add invalid country as comparison country
- [x] UI: Move year slider to left and change to vertical slider
- [x] Others

##### **Stretch Goals**
- [x] Link: Bar-chart --> Map 
- [ ] Link: Wedge (ability to select more than one indicator?)
- [x] UI: Styling
- [x] Others


## External Resources
### Data Sources
- See [Dataset: Sources](#data-sources)
- [World Map Topojson](https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json)

### Referenced Material
##### Data Processing
- [Create Table And Put Data In SQL Server Using CSV File](https://www.c-sharpcorner.com/article/create-table-and-put-data-in-sql-server-using-csv-file/) 

##### Map
- [How-to add a Leaflet map](https://gis.stackexchange.com/questions/182442/whats-the-most-appropriate-way-to-load-mapbox-studio-tiles-in-leaflet)
- [436V Leaflet example](https://codesandbox.io/s/vigilant-worker-9ohh6?file=/js/main.js )
- [Countries GeoJSON](https://datahub.io/core/geo-countries)
- [Loading GeoJSON files in Leaflet with leaflet-ajax](https://gis.stackexchange.com/questions/68489/loading-external-geojson-file-into-leaflet-map)
- [StackOverflow: Auto-zoom to a Polygon in Leaflet](https://stackoverflow.com/a/42843325)
- [Leaflet: GeoJSON layer documentation](https://leafletjs.com/reference-1.7.1.html#geojson)
- [Stack Exchange: Create FeatureCollection from GeoJSON...](https://gis.stackexchange.com/questions/300331/create-featurecollection-from-geojson-containing-list-of-features)
- [Stack Exchange: Getting bounds of layer group in leaflet](https://gis.stackexchange.com/questions/180678/how-do-i-get-the-bounds-of-a-layergroup-in-leaflet/180680)
- [Github: Horizontal Lines in World](https://github.com/topojson/topojson/issues/242#issuecomment-327823284)
- [Observable: Intro to leaflet+d3 + interactivity](https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity)

##### Year slider
- [D3 brushing linking](https://codesandbox.io/s/github/UBC-InfoVis/2021-436V-examples/tree/master/d3-brushing-linking)
- [D3 snapping brush](https://observablehq.com/@d3/brush-snapping)

##### Multi-line chart
- [D3 Mouseover Multi-line Chart](https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91)
- [Multi-line Chart Example](https://codesandbox.io/s/5ylwv650lx)
- [Tooltip tracking by data points](https://stackoverflow.com/questions/42080051/d3-single-and-multi-line-chart-tooltips)

##### Comparison Section
- [W3School: How To - Autocomplete](https://www.w3schools.com/howto/howto_js_autocomplete.asp)
- [Slack Overflow: Chrome ignores autocomplete="off"](https://stackoverflow.com/questions/12374442/chrome-ignores-autocomplete-off/32578659#32578659)
- [W3School: How To - Contact Chips](https://www.w3schools.com/howto/howto_css_contact_chips.asp)

##### Styling
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [A Simple Way to Make D3.js Charts Responsive](https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b)
- [D3-format](https://github.com/d3/d3-format#format)
- [D3: Formatting tick value. To show B (Billion) instead of G (Giga)](https://stackoverflow.com/a/40774969)
- [Viewbox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)
- [Observable: Rounding 'rect' element borders](https://bl.ocks.org/mbostock/1424037)

##### Colour Palette
- [Cooler.co](https://coolors.co/.) for choosing a colour palette
- [Cooler: Link to choosen colour palette](https://coolors.co/540d6e-ee4266-ffd23f-3bceac-1982c4)
- [ColBlinder](https://www.color-blindness.com/coblis-color-blindness-simulator/) as a Colour Blindness Simulator

##### Scrolling
- [Smooth scrolling](https://css-tricks.com/snippets/jquery/smooth-scrolling/)
