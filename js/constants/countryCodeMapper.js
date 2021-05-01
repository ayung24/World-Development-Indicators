class CountryCodeMapper {
    constructor() {
        this.countries = new Countries();

        this.AFGHANISTAN = {
            alpha_3: "AFG",
            countryCode: 4
        };
        this.ALBANIA = {
            alpha_3: "ALB",
            countryCode: 8
        };
        this.ALGERIA = {
            alpha_3: "DZA",
            countryCode: 12
        };
        this.AMERICAN_SAMOA = {
            alpha_3: "ASM",
            countryCode: 16
        };
        this.ANGOLA = {
            alpha_3: "AGO",
            countryCode: 24
        };
        this.ANTIGUA_AND_BARBUDA = {
            alpha_3: "ATG",
            countryCode: 28
        };
        this.ARGENTINA = {
            alpha_3: "ARG",
            countryCode: 32
        };
        this.ARMENIA = {
            alpha_3: "ARM",
            countryCode: 51
        };
        this.ARUBA = {
            alpha_3: "ABW",
            countryCode: 533
        };
        this.AUSTRALIA = {
            alpha_3: "AUS",
            countryCode: 36
        };
        this.AUSTRIA = {
            alpha_3: "AUT",
            countryCode: 40
        };
        this.AZERBAIJAN = {
            alpha_3: "AZE",
            countryCode: 31
        };
        this.BAHAMAS_THE = {
            alpha_3: "BHS",
            countryCode: 44
        };
        this.BAHRAIN = {
            alpha_3: "BHR",
            countryCode: 48
        };
        this.BANGLADESH = {
            alpha_3: "BGD",
            countryCode: 50
        };
        this.BARBADOS = {
            alpha_3: "BRB",
            countryCode: 52
        };
        this.BELARUS = {
            alpha_3: "BLR",
            countryCode: 112
        };
        this.BELGIUM = {
            alpha_3: "BEL",
            countryCode: 56
        };
        this.BELIZE = {
            alpha_3: "BLZ",
            countryCode: 84
        };
        this.BENIN = {
            alpha_3: "BEN",
            countryCode: 204
        };
        this.BERMUDA = {
            alpha_3: "BMU",
            countryCode: 60
        };
        this.BHUTAN = {
            alpha_3: "BTN",
            countryCode: 64
        };
        this.BOLIVIA = {
            alpha_3: "BOL",
            countryCode: 68
        };
        this.BOSNIA_AND_HERZEGOVINA = {
            alpha_3: "BIH",
            countryCode: 70
        };
        this.BOTSWANA = {
            alpha_3: "BWA",
            countryCode: 72
        };
        this.BRAZIL = {
            alpha_3: "BRA",
            countryCode: 76
        };
        this.BRUNEI_DARUSSALAM = {
            alpha_3: "BRN",
            countryCode: 96
        };
        this.BULGARIA = {
            alpha_3: "BGR",
            countryCode: 100
        };
        this.BURKINA_FASO = {
            alpha_3: "BFA",
            countryCode: 854
        };
        this.BURUNDI = {
            alpha_3: "BDI",
            countryCode: 108
        };
        this.CABO_VERDE = {
            alpha_3: "CPV",
            countryCode: 132
        };
        this.CAMBODIA = {
            alpha_3: "KHM",
            countryCode: 116
        };
        this.CAMEROON = {
            alpha_3: "CMR",
            countryCode: 120
        };
        this.CANADA = {
            alpha_3: "CAN",
            countryCode: 124
        };
        this.CAYMAN_ISLANDS = {
            alpha_3: "CYM",
            countryCode: 136
        };
        this.CENTRAL_AFRICAN_REPUBLIC = {
            alpha_3: "CAF",
            countryCode: 140
        };
        this.CHAD = {
            alpha_3: "TCD",
            countryCode: 148
        };
        this.CHILE = {
            alpha_3: "CHL",
            countryCode: 152
        };
        this.CHINA = {
            alpha_3: "CHN",
            countryCode: 156
        };
        this.COLOMBIA = {
            alpha_3: "COL",
            countryCode: 170
        };
        this.COMOROS = {
            alpha_3: "COM",
            countryCode: 174
        };
        this.CONGO_REP = {
            alpha_3: "COG",
            countryCode: 178
        };
        this.COSTA_RICA = {
            alpha_3: "CRI",
            countryCode: 188
        };
        this.COTE_D_IVOIRE = {
            alpha_3: "CIV",
            countryCode: 384
        };
        this.CROATIA = {
            alpha_3: "HRV",
            countryCode: 191
        };
        this.CUBA = {
            alpha_3: "CUB",
            countryCode: 192
        };
        this.CURACAO = {
            alpha_3: "CUW",
            countryCode: 531
        };
        this.CYPRUS = {
            alpha_3: "CYP",
            countryCode: 196
        };
        this.CZECH_REPUBLIC = {
            alpha_3: "CZE",
            countryCode: 203
        };
        this.DENMARK = {
            alpha_3: "DNK",
            countryCode: 208
        };
        this.DJIBOUTI = {
            alpha_3: "DJI",
            countryCode: 262
        };
        this.DOMINICA = {
            alpha_3: "DMA",
            countryCode: 212
        };
        this.DOMINICAN_REPUBLIC = {
            alpha_3: "DOM",
            countryCode: 214
        };
        this.ECUADOR = {
            alpha_3: "ECU",
            countryCode: 218
        };
        this.EGYPT = {
            alpha_3: "EGY",
            countryCode: 818
        };
        this.EL_SALVADOR = {
            alpha_3: "SLV",
            countryCode: 222
        };
        this.EQUATORIAL_GUINEA = {
            alpha_3: "GNQ",
            countryCode: 226
        };
        this.ERITREA = {
            alpha_3: "ERI",
            countryCode: 232
        };
        this.ESTONIA = {
            alpha_3: "EST",
            countryCode: 233
        };
        this.ETHIOPIA = {
            alpha_3: "ETH",
            countryCode: 231
        };
        this.FAEROE_ISLANDS = {
            alpha_3: "FRO",
            countryCode: 234
        };
        this.FIJI = {
            alpha_3: "FJI",
            countryCode: 242
        };
        this.FINLAND = {
            alpha_3: "FIN",
            countryCode: 246
        };
        this.FRANCE = {
            alpha_3: "FRA",
            countryCode: 250
        };
        this.FRENCH_POLYNESIA = {
            alpha_3: "PYF",
            countryCode: 258
        };
        this.GABON = {
            alpha_3: "GAB",
            countryCode: 266
        };
        this.GAMBIA_THE = {
            alpha_3: "GMB",
            countryCode: 270
        };
        this.GEORGIA = {
            alpha_3: "GEO",
            countryCode: 268
        };
        this.GERMANY = {
            alpha_3: "DEU",
            countryCode: 276
        };
        this.GHANA = {
            alpha_3: "GHA",
            countryCode: 288
        };
        this.GREECE = {
            alpha_3: "GRC",
            countryCode: 300
        };
        this.GREENLAND = {
            alpha_3: "GRL",
            countryCode: 304
        };
        this.GRENADA = {
            alpha_3: "GRD",
            countryCode: 308
        };
        this.GUAM = {
            alpha_3: "GUM",
            countryCode: 316
        };
        this.GUATEMALA = {
            alpha_3: "GTM",
            countryCode: 320
        };
        this.GUINEA = {
            alpha_3: "GIN",
            countryCode: 324
        };
        this.GUINEA_BISSAU = {
            alpha_3: "GNB",
            countryCode: 624
        };
        this.GUYANA = {
            alpha_3: "GUY",
            countryCode: 328
        };
        this.HAITI = {
            alpha_3: "HTI",
            countryCode: 332
        };
        this.HONDURAS = {
            alpha_3: "HND",
            countryCode: 340
        };
        this.HONG_KONG_SAR_CHINA = {
            alpha_3: "HKG",
            countryCode: 344
        };
        this.HUNGARY = {
            alpha_3: "HUN",
            countryCode: 348
        };
        this.ICELAND = {
            alpha_3: "ISL",
            countryCode: 352
        };
        this.INDIA = {
            alpha_3: "IND",
            countryCode: 356
        };
        this.INDONESIA = {
            alpha_3: "IDN",
            countryCode: 360
        };
        this.IRAN_ISLAMIC_REP = {
            alpha_3: "IRN",
            countryCode: 364
        };
        this.IRAQ = {
            alpha_3: "IRQ",
            countryCode: 368
        };
        this.IRELAND = {
            alpha_3: "IRL",
            countryCode: 372
        };
        this.ISRAEL = {
            alpha_3: "ISR",
            countryCode: 376
        };
        this.ITALY = {
            alpha_3: "ITA",
            countryCode: 380
        };
        this.JAMAICA = {
            alpha_3: "JAM",
            countryCode: 388
        };
        this.JAPAN = {
            alpha_3: "JPN",
            countryCode: 392
        };
        this.JORDAN = {
            alpha_3: "JOR",
            countryCode: 400
        };
        this.KAZAKHSTAN = {
            alpha_3: "KAZ",
            countryCode: 398
        };
        this.KENYA = {
            alpha_3: "KEN",
            countryCode: 404
        };
        this.KIRIBATI = {
            alpha_3: "KIR",
            countryCode: 296
        };
        this.KOREA_DEMOCRATIC_REPUBLIC_OF = {
            alpha_3: "PRK",
            countryCode: 408
        };
        this.KOREA_REPUBLIC_OF = {
            alpha_3: "KOR",
            countryCode: 410
        };
        this.KUWAIT = {
            alpha_3: "KWT",
            countryCode: 414
        };
        this.KYRGYZ_REPUBLIC = {
            alpha_3: "KGZ",
            countryCode: 417
        };
        this.LAO_PDR = {
            alpha_3: "LAO",
            countryCode: 418
        };
        this.LATVIA = {
            alpha_3: "LVA",
            countryCode: 428
        };
        this.LEBANON = {
            alpha_3: "LBN",
            countryCode: 422
        };
        this.LESOTHO = {
            alpha_3: "LSO",
            countryCode: 426
        };
        this.LIBERIA = {
            alpha_3: "LBR",
            countryCode: 430
        };
        this.LIBYA = {
            alpha_3: "LBY",
            countryCode: 434
        };
        this.LIECHTENSTEIN = {
            alpha_3: "LIE",
            countryCode: 438
        };
        this.LITHUANIA = {
            alpha_3: "LTU",
            countryCode: 440
        };
        this.LUXEMBOURG = {
            alpha_3: "LUX",
            countryCode: 442
        };
        this.MACAO_SAR_CHINA = {
            alpha_3: "MAC",
            countryCode: 446
        };
        this.MACEDONIA_FYR = {
            alpha_3: "MKD",
            countryCode: 807
        };
        this.MADAGASCAR = {
            alpha_3: "MDG",
            countryCode: 450
        };
        this.MALAWI = {
            alpha_3: "MWI",
            countryCode: 454
        };
        this.MALAYSIA = {
            alpha_3: "MYS",
            countryCode: 458
        };
        this.MALDIVES = {
            alpha_3: "MDV",
            countryCode: 462
        };
        this.MALI = {
            alpha_3: "MLI",
            countryCode: 466
        };
        this.MALTA = {
            alpha_3: "MLT",
            countryCode: 470
        };
        this.MARSHALL_ISLANDS = {
            alpha_3: "MHL",
            countryCode: 584
        };
        this.MAURITANIA = {
            alpha_3: "MRT",
            countryCode: 478
        };
        this.MAURITIUS = {
            alpha_3: "MUS",
            countryCode: 480
        };
        this.MEXICO = {
            alpha_3: "MEX",
            countryCode: 484
        };
        this.MICRONESIA_FED_STS = {
            alpha_3: "FSM",
            countryCode: 583
        };
        this.MOLDOVA = {
            alpha_3: "MDA",
            countryCode: 498
        };
        this.MONACO = {
            alpha_3: "MCO",
            countryCode: 492
        };
        this.MONGOLIA = {
            alpha_3: "MNG",
            countryCode: 496
        };
        this.MONTENEGRO = {
            alpha_3: "MNE",
            countryCode: 499
        };
        this.MOROCCO = {
            alpha_3: "MAR",
            countryCode: 504
        };
        this.MOZAMBIQUE = {
            alpha_3: "MOZ",
            countryCode: 508
        };
        this.MYANMAR = {
            alpha_3: "MMR",
            countryCode: 104
        };
        this.NAMIBIA = {
            alpha_3: "NAM",
            countryCode: 516
        };
        this.NEPAL = {
            alpha_3: "NPL",
            countryCode: 524
        };
        this.NETHERLANDS = {
            alpha_3: "NLD",
            countryCode: 528
        };
        this.NEW_CALEDONIA = {
            alpha_3: "NCL",
            countryCode: 540
        };
        this.NEW_ZEALAND = {
            alpha_3: "NZL",
            countryCode: 554
        };
        this.NICARAGUA = {
            alpha_3: "NIC",
            countryCode: 558
        };
        this.NIGER = {
            alpha_3: "NER",
            countryCode: 562
        };
        this.NIGERIA = {
            alpha_3: "NGA",
            countryCode: 566
        };
        this.NORTHERN_MARIANA_ISLANDS = {
            alpha_3: "MNP",
            countryCode: 580
        };
        this.NORWAY = {
            alpha_3: "NOR",
            countryCode: 578
        };
        this.OMAN = {
            alpha_3: "OMN",
            countryCode: 512
        };
        this.PAKISTAN = {
            alpha_3: "PAK",
            countryCode: 586
        };
        this.PALAU = {
            alpha_3: "PLW",
            countryCode: 585
        };
        this.PANAMA = {
            alpha_3: "PAN",
            countryCode: 591
        };
        this.PAPUA_NEW_GUINEA = {
            alpha_3: "PNG",
            countryCode: 598
        };
        this.PARAGUAY = {
            alpha_3: "PRY",
            countryCode: 600
        };
        this.PERU = {
            alpha_3: "PER",
            countryCode: 604
        };
        this.PHILIPPINES = {
            alpha_3: "PHL",
            countryCode: 608
        };
        this.POLAND = {
            alpha_3: "POL",
            countryCode: 616
        };
        this.PORTUGAL = {
            alpha_3: "PRT",
            countryCode: 620
        };
        this.PUERTO_RICO = {
            alpha_3: "PRI",
            countryCode: 630
        };
        this.QATAR = {
            alpha_3: "QAT",
            countryCode: 634
        };
        this.RUSSIAN_FEDERATION = {
            alpha_3: "RUS",
            countryCode: 643
        };
        this.RWANDA = {
            alpha_3: "RWA",
            countryCode: 646
        };
        this.SAMOA = {
            alpha_3: "WSM",
            countryCode: 882
        };
        this.SAN_MARINO = {
            alpha_3: "SMR",
            countryCode: 674
        };
        this.SAO_TOME_AND_PRINCIPE = {
            alpha_3: "STP",
            countryCode: 678
        };
        this.SAUDI_ARABIA = {
            alpha_3: "SAU",
            countryCode: 682
        };
        this.SENEGAL = {
            alpha_3: "SEN",
            countryCode: 686
        };
        this.SERBIA = {
            alpha_3: "SRB",
            countryCode: 688
        };
        this.SEYCHELLES = {
            alpha_3: "SYC",
            countryCode: 690
        };
        this.SIERRA_LEONE = {
            alpha_3: "SLE",
            countryCode: 694
        };
        this.SINGAPORE = {
            alpha_3: "SGP",
            countryCode: 702
        };
        this.SINT_MAARTEN = {
            alpha_3: "SXM",
            countryCode: 534
        };
        this.SLOVAK_REPUBLIC = {
            alpha_3: "SVK",
            countryCode: 703
        };
        this.SLOVENIA = {
            alpha_3: "SVN",
            countryCode: 705
        };
        this.SOLOMON_ISLANDS = {
            alpha_3: "SLB",
            countryCode: 90
        };
        this.SOMALIA = {
            alpha_3: "SOM",
            countryCode: 706
        };
        this.SOUTH_AFRICA = {
            alpha_3: "ZAF",
            countryCode: 710
        };
        this.SOUTH_SUDAN = {
            alpha_3: "SSD",
            countryCode: 728
        };
        this.SPAIN = {
            alpha_3: "ESP",
            countryCode: 724
        };
        this.SRI_LANKA = {
            alpha_3: "LKA",
            countryCode: 144
        };
        this.ST_KITTS_AND_NEVIS = {
            alpha_3: "KNA",
            countryCode: 659
        };
        this.ST_LUCIA = {
            alpha_3: "LCA",
            countryCode: 662
        };
        this.ST_MARTIN_ = {
            alpha_3: "MAF",
            countryCode: 663
        };
        this.ST_VINCENT_AND_THE_GRENADINES = {
            alpha_3: "VCT",
            countryCode: 670
        };
        this.SUDAN = {
            alpha_3: "SDN",
            countryCode: 729
        };
        this.SURINAME = {
            alpha_3: "SUR",
            countryCode: 740
        };
        this.SWAZILAND = {
            alpha_3: "SWZ",
            countryCode: 748
        };
        this.SWEDEN = {
            alpha_3: "SWE",
            countryCode: 752
        };
        this.SWITZERLAND = {
            alpha_3: "CHE",
            countryCode: 756
        };
        this.SYRIAN_ARAB_REPUBLIC = {
            alpha_3: "SYR",
            countryCode: 760
        };
        this.TAJIKISTAN = {
            alpha_3: "TJK",
            countryCode: 762
        };
        this.TANZANIA = {
            alpha_3: "TZA",
            countryCode: 834
        };
        this.THAILAND = {
            alpha_3: "THA",
            countryCode: 764
        };
        this.TOGO = {
            alpha_3: "TGO",
            countryCode: 768
        };
        this.TONGA = {
            alpha_3: "TON",
            countryCode: 776
        };
        this.TRINIDAD_AND_TOBAGO = {
            alpha_3: "TTO",
            countryCode: 780
        };
        this.TUNISIA = {
            alpha_3: "TUN",
            countryCode: 788
        };
        this.TURKEY = {
            alpha_3: "TUR",
            countryCode: 792
        };
        this.TURKMENISTAN = {
            alpha_3: "TKM",
            countryCode: 795
        };
        this.TURKS_AND_CAICOS_ISLANDS = {
            alpha_3: "TCA",
            countryCode: 796
        };
        this.TUVALU = {
            alpha_3: "TUV",
            countryCode: 798
        };
        this.UGANDA = {
            alpha_3: "UGA",
            countryCode: 800
        };
        this.UKRAINE = {
            alpha_3: "UKR",
            countryCode: 804
        };
        this.UNITED_ARAB_EMIRATES = {
            alpha_3: "ARE",
            countryCode: 784
        };
        this.UNITED_KINGDOM = {
            alpha_3: "GBR",
            countryCode: 826
        };
        this.UNITED_STATES = {
            alpha_3: "USA",
            countryCode: 840
        };
        this.URUGUAY = {
            alpha_3: "URY",
            countryCode: 858
        };
        this.UZBEKISTAN = {
            alpha_3: "UZB",
            countryCode: 860
        };
        this.VANUATU = {
            alpha_3: "VUT",
            countryCode: 548
        };
        this.VENEZUELA_RB = {
            alpha_3: "VEN",
            countryCode: 862
        };
        this.VIETNAM = {
            alpha_3: "VNM",
            countryCode: 704
        };
        this.VIRGIN_ISLANDS_US = {
            alpha_3: "VIR",
            countryCode: 850
        };
        this.WORLD = {
            alpha_3: "WLD",
            countryCode: null
        };
        this.YEMEN_REPUBLIC_OF = {
            alpha_3: "YEM",
            countryCode: 887
        };
        this.ZAMBIA = {
            alpha_3: "ZMB",
            countryCode: 894
        };
        this.ZIMBABWE = {
            alpha_3: "ZWE",
            countryCode: 716
        }

    }

    /**
     * Purpose: Returns ISO_A3 code of a country given its country name
     * @param {string} country 
     * @returns {string}
     */
    getCountryAlpha3(country) {
        const key = this.countries.getKey(country);
        return this[key].alpha_3;
    }

    /**
     * Purpose: Returns an array of ISO_A3 country codes in the order of the countries given
     * @param {Array} countries = Array of strings representing country names
     * @returns {Array} of strings
     */
    getCountryAlpha3s(countries) {
        let codes = [];
        for (let country of countries) {
            let code = this.getCountryAlpha3(country);
            codes.push(code);
        }
        return codes;
    }

    /**
     * Purpose: Returns country's country code
     * @param {string} country 
     * @returns {Integer} : Country code (3 digit number)
     */
    getCountryNumCode(country) {
        const key = this.countries.getKey(country);
        return this[key].countryCode;
    }

    /**
     * Purpose: Returns an array of 3-digit country codes in the order of the countries given
     * @param {Array} countries = Array of strings representing country names
     * @returns {Array} of Integers
     */
    getCountryNumCodes(countries) {
        let codes = [];
        for (let country of countries) {
            let code = this.getCountryNumCode(country);
            codes.push(code);
        }
        return codes;
    }

    /**
     * Purpose: Returns the equivalent alpha3 (3-letter) country code for given numeric country code
     * @param {Integer} numCode : Numeric country code
     * @returns {string} alpha3 / ISO_3 country code or false if no equivalent code was found
     */
    convertToAlpha3(numCode) {
        const codes = Object.values(this);
        for (let codeObj of codes) {
            let { countryCode, alpha_3 } = codeObj;
            if (countryCode === numCode) {
                return alpha_3;
            }
        }
        return false;
    }

    /**
     * Purpose: Returns the equivalent numeric country code for given alpha3 country code
     * @param {string} alpha3 : alpha3 / ISO_3 (3-lettered) country code
     * @returns {Integer} numeric country code or false if no equivalent country code was found
     */
    convertToNumCode(alpha3) {
        const codes = Object.values(this);
        for (let codeObj of codes) {
            let { countryCode, alpha_3 } = codeObj;
            if (alpha_3 === alpha3) {
                return countryCode;
            }
        }
        return false;
    }

    /**
     * Purpose: Returns an array of all alpha_3 / ISO_3 country codes in dataset
     * @returns {Array} of Strings 
     */
    getAllAlpha3s() {
        let alpha3s = [];
        const codes = Object.values(this);
        for (let codeObj of codes) {
            let { alpha_3 } = codeObj;
            if (alpha_3) alpha3s.push(alpha_3);
        }
        return alpha3s;
    }

    /**
     * Purpose: Returns key of object containing given numeric country code
     * @param {Integer} _countryCode : Numeric country code
     * @returns {string} : matching key in this class or false if none found
     */
    getKey(_countryCode) {
        const entries = Object.entries(this);
        for (let entry of entries) {
            let key = entry[0];
            let codeObj = entry[1];
            let { countryCode } = codeObj;

            if (countryCode === _countryCode) {
                return key;
            }
        }
        return false;
    }

    /**
     * Purpose: Returns an object containing all info for the country of given countryCode
     * @param {Integer} countryCode : Numeric country code
     * @returns {Object} : { countryName, key, countryCode, alpha_3 }
     */
    getAllInfoOfCountry(countryCode) {
        const alpha_3 = this.convertToAlpha3(countryCode);
        const key = this.getKey(countryCode);
        const countryName = this.countries[key];

        return { countryName, key, countryCode, alpha_3 };
    }
}