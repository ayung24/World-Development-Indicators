# Data Processing

## Table of Contents
  - **[External Resources](#external-resources)**
      - [Data Sources](#data-sources)   
      - [Referenced Material](#referenced-material)
  - **[Tools](#tools)**
  - **[Pre-processing](#pre-processing)**

## External Resources
#### Data Sources
1. [Kaggle: Indicators.csv](https://www.kaggle.com/worldbank/world-development-indicators?select=Indicators.csv)
2. [Kaggle: continents2.csv](https://www.kaggle.com/andradaolteanu/country-mapping-iso-continent-region)
3. [Personally Created Google Sheets: Years](https://docs.google.com/spreadsheets/d/1qVCd1GF66L7wIZHcAGr2FQtYr0I32V1K3377csnTd9k/edit?usp=sharing)

#### Referenced Material
1. [Create Table And Put Data In SQL Server Using CSV File](https://www.c-sharpcorner.com/article/create-table-and-put-data-in-sql-server-using-csv-file/) by Yogeshkumar Hadiya

## Tools
1. Microsoft SQL Server Management Studio (MSSM)
    |   Component Name                               |  Versions          |
    |------------------------------------------------|--------------------|
    |   SQL Server Management Studio				 | 15.0.18369.0       |
    |   SQL Server Management Objects (SMO)			 | 16.100.46041.41    |
    |   Microsoft Analysis Services Client Tools	 | 15.0.19342.0       |
    |   Microsoft Data Access Components (MDAC)		 | 10.0.19041.1       |
    |   Microsoft MSXML						         | 3.0 6.0            |
    |   Microsoft .NET Framework				     | 4.0.30319.42000    |   
    |   Operating System						     | 10.0.19041         |
2. Visual Studios Code
    - version: 1.54.2
3. Google Sheets
    - version: N/A
  

## Pre-processing
1. First, we created a database using MSSM, then, following the steps in [this guide](https://www.c-sharpcorner.com/article/create-table-and-put-data-in-sql-server-using-csv-file/), we created two tables, `Indicators` and `continents2` by importing the "flat files" `Indicators.csv` and `continents2.csv`
   
2. We used a query to filter the rows from the `Indicators` table that did not match the indicators we were interested in. We used the results to create a new `.csv` file called `Dataset.csv`
    ```
    CREATE VIEW Dataset AS
    SELECT * FROM Indicators 
    WHERE IndicatorName = "Demographics"
    OR IndicatorName = "Population, total" 
    OR IndicatorName ="Rural population"
    OR IndicatorName ="Urban population" 
    OR IndicatorName ="Population density (people per sq. km of land area)" 
    OR IndicatorName ="Population, ages 0-14 (% of total)"
    OR IndicatorName ="Population, ages 15-64 (% of total)"
    OR IndicatorName ="Population ages 65 and above (% of total)"
    OR IndicatorName ="Death rate, crude (per 1,000 people)"
    OR IndicatorName ="Birth rate, crude (per 1,000 people)"
    OR IndicatorName = "Life expectancy at birth, total (years)"
    OR IndicatorName = "Life expectancy at birth, male (years)"
    OR IndicatorName = "Life expectancy at birth, female (years)"
    OR IndicatorName = "Age dependency ratio (% of working-age population)"
    OR IndicatorName = "Age dependency ratio, old (% of working-age population)"
    OR IndicatorName = "Age dependency ratio, young (% of working-age population)"
    OR IndicatorName = "Merchandise exports (current US$)" 
    OR IndicatorName = "Merchandise imports (current US$)"
    OR IndicatorName = "GDP per capita (current US$)"
    OR IndicatorName = "Merchandise trade (% of GDP) (goods)"
    OR IndicatorName = "Trade (% of GDP) (goods and services only)"
    OR IndicatorName = "GNI (current US$)" 
    OR IndicatorName = "Gross national expenditure (current US$)"
    OR IndicatorName = "Inflation, GDP deflator (annual %)"
    OR IndicatorName = "Exports of goods and services (current US$)"
    OR IndicatorName = "Imports of goods and services (current US$)"
    OR IndicatorName = "Imports of goods and services (% of GDP)"
    OR IndicatorName = "Net official development assistance and official aid received (current US$)"
    OR IndicatorName = "Enrolment in primary education, both sexes (number)"
    OR IndicatorName = "Enrolment in secondary general, both sexes (number)"
    OR IndicatorName = "Agricultural land (% of land area)"
    OR IndicatorName = "CO2 emissions (metric tons per capita)"
    OR IndicatorName = "Mobile cellular subscriptions"
    OR IndicatorName = "Mobile cellular subscriptions (per 100 people)";
    ```
   
3. We used the new csv file to create a new table (similar to step 1), and created a table called `Dataset`.
   
4. Then, we created a new query in which we created a view by doing a joining the two tables `Dataset` and `continents2` on the country code (i.e. ISO code formed of 3 letters)
    ```
    CREATE VIEW dataset AS
    SELECT CountryName, CountryCode, 
           IndicatorName, IndicatorCode, Year, 
           Value, region AS Region, sub_region AS SubRegion
    FROM Dataset
    LEFT JOIN continents2
    ON CountryCode = alpha_3;
    ```

5. We go on to filter out rows in which the Region is null (i.e. the rows where the CountryName held values that were not true countries but rather were regions grouped by economic status, development, etc.) - with the exception of the row where the `CountryName` held the value "World";
    ```
    SELECT * from dataset
    WHERE (Region is not null or CountryCode='WLD')
    ORDER BY IndicatorName, Year ASC;
    ```

6. We then exported the results to a new `.csv` file. Because the results didn't export the column names, we then opened the newly created file in vscode and manually added the column names. Unfortunately, we realized that we were missing data for some years for some {country, indicator} pairs, thus we continue to refine our data.

7. We import the new results back into MSSM as `DatasetNew` table. Similarily, we create a [new spreadsheet in Google sheets](https://docs.google.com/spreadsheets/d/1qVCd1GF66L7wIZHcAGr2FQtYr0I32V1K3377csnTd9k/edit?usp=sharing) with all years from the minYear (1960) to maxYear (2014) of the Dataset. We import the `Years.csv` into MSSM as its own table `Years`. Finally, we create a new view from the result of doing a full join on our two tables `Years` and `DatasetNew`;

    ```
    CREATE VIEW temp AS
    SELECT DISTINCT d.CountryName, d.CountryCode, 
                    d.IndicatorName, d.IndicatorCode, 
                    y.Year, d.Region, d.SubRegion
    from Years y, DatasetNew d;
   ```

8. We join the new `temp` view with our `DatasetNew` table to create a full dataset with the values of previously missing years set as `'NULL'`. We export the result as `withNulls.csv`. 
   ```
   SELECT temp.CountryName, temp.CountryCode, 
          temp.IndicatorName, temp.IndicatorCode, 
          temp.Year, d.Value, temp.Region, temp.SubRegion
   FROM temp
        LEFT JOIN Dataset d
        ON  d.CountryName = temp.CountryName
            AND temp.IndicatorName = d.IndicatorName
            AND temp.Year = d.Year
            AND temp.Region = d.Region
            AND temp.SubRegion = d.SubRegion
   ORDER BY IndicatorName, temp.Year;
   ```

9. Before we finish and use the new `withNulls.csv` as our data file, we replace `'NULL'` with `NULL` by importing the file as a new table `withNulls` and then running the following SQL script on it:
   ```
   UPDATE withNulls
   SET Value = NULL
   WHERE Value = 'Null'
   ```

10. We save the results as our new `Dataset.csv` and use this file in our project