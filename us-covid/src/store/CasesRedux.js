import * as d3 from 'd3';

const requestGlobalCases = 'REQUEST_GLOBAL_CASES';
const requestGlobalCasesFailure = 'REQUEST_GLOBAL_CASES_FAILURE';
const receiveGlobalCases = 'RECEIVE_GLOBAL_CASES';

const requestUSCases = 'REQUEST_US_CASES';
const requestUSCasesFailure = 'REQUEST_US_CASES_FAILURE';
const receiveUSCases = 'RECEIVE_US_CASES';

const RECOVERY_PERIOD_DAYS = 14;
const VACCINATION_START_DATE = "12/10/20";
const initialState = {
    globalCases: [],
    usCases: []
};

const getDateString = function (daysPrior) {
    const currentTime = new Date();
    const tempDate = new Date();
    if (currentTime.getUTCHours() > 9) {
        tempDate.setDate(currentTime.getDate() - 1 - daysPrior);
    }
    else {
        tempDate.setDate(currentTime.getDate() - 2 - daysPrior);
    }

    const dd = String(tempDate.getDate()).padStart(2, '0');
    const mm = String(tempDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = tempDate.getFullYear();

    return `${mm}-${dd}-${yyyy}`;
}

export const actionCreators = {
    requestGlobalCases: (param) => async (dispatch) => {
        const allData = {
            UID: null,
            x: [],
            yConfirmed: [],
            yDeaths: [],
            yRecovered: [],
            title: "World",
            children: {},
            population: 0
        };

        const populationData = [];
        // const stats = {
        //     current: [],
        //     sevenDay: [],
        //     fourteenDay: []
        // };
        const deaths = [];

        dispatch({
            type: requestGlobalCases
        });
        Promise.all([
            d3.csv('https://raw.githubusercontent.com/dprensha/covid19data/master/world-population-data.csv', (data) => {
                populationData[`${data["Province/State"]}_${data["Country/Region"]}`] = data.Population;
            }),
            // d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${getDateString(0)}.csv`, (data) => {
            //     stats.current[`${data["Province/State"]}_${data["Country/Region"]}`] = {
            //         confirmed: data.Confirmed,
            //         deaths: data.Deaths,
            //         recovered: data.Recovered,
            //         active: data.Active,
            //         peopleTested: data["Total_Test_Results"],
            //         peopleHospitalized: data["People_Hospitalized"],
            //         mortalityRate: data["Case_Fatality_Ratio"],
            //         testingRate: data["Testing_Rate"],
            //         hospitalizationRate: data["Hospitalization_Rate"]
            //     }
            // }),
            // d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${getDateString(7)}.csv`, (data) => {
            //     stats.sevenDay[`${data["Province/State"]}_${data["Country/Region"]}`] = {
            //         confirmed: data.Confirmed,
            //         deaths: data.Deaths,
            //         recovered: data.Recovered,
            //         active: data.Active,
            //         peopleTested: data["Total_Test_Results"],
            //         peopleHospitalized: data["People_Hospitalized"],
            //         mortalityRate: data["Case_Fatality_Ratio"],
            //         testingRate: data["Testing_Rate"],
            //         hospitalizationRate: data["Hospitalization_Rate"]
            //     }
            // }),
            // d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${getDateString(14)}.csv`, (data) => {
            //     stats.fourteenDay[`${data["Province/State"]}_${data["Country/Region"]}`] = {
            //         confirmed: data.Confirmed,
            //         deaths: data.Deaths,
            //         recovered: data.Recovered,
            //         active: data.Active,
            //         peopleTested: data["Total_Test_Results"],
            //         peopleHospitalized: data["People_Hospitalized"],
            //         mortalityRate: data["Case_Fatality_Ratio"],
            //         testingRate: data["Testing_Rate"],
            //         hospitalizationRate: data["Hospitalization_Rate"]
            //     }
            // }),
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv', (data) => {
                if (data["Province/State"] === "" && (data["Country/Region"] === "United Kingdom" || data["Country/Region"] === "Denmark" || data["Country/Region"] === "France" || data["Country/Region"] === "Netherlands" || data["Country/Region"] === "New Zealand")) {
                    data["Province/State"] = `Mainland ${data["Country/Region"]}`
                }
                const dates = Object.keys(data).filter(function(key) { return !isNaN(Date.parse(key)) });
                deaths[`${data["Province/State"]}_${data["Country/Region"]}`] = [];
                for(var j = 0; j < dates.length; j++) {
                    deaths[`${data["Province/State"]}_${data["Country/Region"]}`].push(parseInt(data[dates[j]]));
                }
            }),
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv', (data) => {
                //deal with Denmark, France, Netherlands, United Kingdom
                if (data["Province/State"] === "" && (data["Country/Region"] === "United Kingdom" || data["Country/Region"] === "Denmark" || data["Country/Region"] === "France" || data["Country/Region"] === "Netherlands" || data["Country/Region"] === "New Zealand")) {
                    data["Province/State"] = `Mainland ${data["Country/Region"]}`
                }

                const dates = Object.keys(data).filter(function (key) { return !isNaN(Date.parse(key)) });
                if (Object.keys(allData.children).indexOf(data["Country/Region"]) === -1) {
                    allData.children[data["Country/Region"]] = {
                        UID: null,
                        x: [],
                        yConfirmed: [],
                        yDeaths: [],
                        yRecovered: [],
                        yActive: [],
                        title: data["Country/Region"],
                        navigableTitle: data["Country/Region"].replace(/[\.\W]/g, ''),
                        lat: data["Lat"],
                        long: data["Long"],
                        parent: allData,
                        children: {},
                        population: 0
                    };
                    if (data["Province/State"] !== "") {
                        allData.children[data["Country/Region"]].children[data["Province/State"]] = {
                            UID: data.UID,
                            x: [],
                            yConfirmed: [],
                            yDeaths: [],
                            yRecovered: [],
                            yActive: [],
                            title: data["Province/State"],
                            navigableTitle: data["Province/State"].replace(/[\.\W]/g, ''),
                            parent: allData.children[data["Country/Region"]],
                            lat: data["Lat"],
                            long: data["Long"],
                            population: 0
                        };
                    }

                    for (var j = 0; j < dates.length; j++) {
                        allData.children[data["Country/Region"]].x.push(dates[j]);
                        allData.children[data["Country/Region"]].yConfirmed.push(parseInt(data[dates[j]]));
                        //allData.children[data["Country/Region"]].yDeaths.push(parseInt(deathsRow[dates[j]]));

                        if (data["Province/State"] !== "") {
                            allData.children[data["Country/Region"]].children[data["Province/State"]].x.push(dates[j]);
                            allData.children[data["Country/Region"]].children[data["Province/State"]].yConfirmed.push(parseInt(data[dates[j]]));
                        }
                        if (allData.yConfirmed[j] !== undefined) { allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else { allData.yConfirmed[j] = 0; };
                        //allData.children[data["Country/Region"]].children[data["Province/State"]].yDeaths.push(parseInt(deathsRow[dates[j]]));
                    }
                }

                else if (data["Province/State"] !== "") {
                    allData.children[data["Country/Region"]].children[data["Province/State"]] = {
                        UID: data.UID,
                        x: [],
                        yConfirmed: [],
                        yDeaths: [],
                        yRecovered: [],
                        yActive: [],
                        title: data["Province/State"],
                        navigableTitle: data["Province/State"].replace(/[\.\W]/g, ''),
                        parent: allData.children[data["Country/Region"]],
                        lat: data["Lat"],
                        long: data["Long"],
                        population: 0
                    };

                    for (var j = 0; j < dates.length; j++) {
                        allData.children[data["Country/Region"]].yConfirmed[j] += (parseInt(data[dates[j]]));
                        if (allData.yConfirmed[j] !== undefined) { allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else { allData.yConfirmed[j] = 0; };
                        allData.children[data["Country/Region"]].children[data["Province/State"]].x.push(dates[j]);
                        allData.children[data["Country/Region"]].children[data["Province/State"]].yConfirmed.push(parseInt(data[dates[j]]));
                        //allData.children[data["Country/Region"]].children[data["Province/State"]].yDeaths.push(parseInt(deathsRow[dates[j]]));
                    }
                }
            })
        ])
            .then(() => {
                allData.x = allData.children[Object.keys(allData.children)[0]].x;
                allData.yDeaths = new Array(allData.children[Object.keys(allData.children)[0]].x.length).fill(0);

                var sortedKeys = Object.keys(allData.children).sort();
                for (var i = 0; i < sortedKeys.length; i++) {
                    allData.children[sortedKeys[i]].yRecovered = allData.children[sortedKeys[i]].yConfirmed.map(function (data, index) {
                        if (index < RECOVERY_PERIOD_DAYS) {
                            return 0;
                        }
                        else {
                            return allData.children[sortedKeys[i]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
                        }
                    });

                    allData.children[sortedKeys[i]].yActive = allData.children[sortedKeys[i]].yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].yRecovered[index] });
                    allData.children[sortedKeys[i]].population = populationData[`_${allData.children[sortedKeys[i]].title}`] || 0;
                    allData.children[sortedKeys[i]].yDeaths = deaths[`_${allData.children[sortedKeys[i]].title}`];

                    if(deaths[`_${allData.children[sortedKeys[i]].title}`] === undefined){
                        allData.children[sortedKeys[i]].yDeaths = new Array(allData.children[sortedKeys[i]].yActive.length).fill(0);
                    }

                    var sortedChildKeys = Object.keys(allData.children[sortedKeys[i]].children).sort();
                    for (var j = 0; j < sortedChildKeys.length; j++) {
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function (data, index) {
                            if (index < RECOVERY_PERIOD_DAYS) {
                                return 0;
                            }
                            else {
                                return allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
                            }
                        });
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered[index] });
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population = parseInt(populationData[`${allData.children[sortedKeys[i]].children[sortedChildKeys[j]].title}_${allData.children[sortedKeys[i]].title}`]);
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActivePerCapita = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive.map(function (yActive) { return yActive / allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population });
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yDeaths = deaths[`${allData.children[sortedKeys[i]].children[sortedChildKeys[j]].title}_${allData.children[sortedKeys[i]].title}`];

                        
                         for (var k = 0; k < allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yDeaths.length; k++) {
                             allData.children[sortedKeys[i]].yDeaths[k] += deaths[`${allData.children[sortedKeys[i]].children[sortedChildKeys[j]].title}_${allData.children[sortedKeys[i]].title}`][k];
                         }


                        allData.children[sortedKeys[i]].population += allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population;
                    }
                    allData.population += parseInt(allData.children[sortedKeys[i]].population);
                    allData.children[sortedKeys[i]].yActivePerCapita = allData.children[sortedKeys[i]].yActive.map(function (yActive) { return yActive / allData.children[sortedKeys[i]].population })

                    allData.yRecovered = allData.yConfirmed.map(function (data, index) {
                        if (index < RECOVERY_PERIOD_DAYS) {
                            return 0;
                        }
                        else {
                            return allData.yConfirmed[index - RECOVERY_PERIOD_DAYS];
                        }
                    });
                    allData.yActive = allData.yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.yRecovered[index] });
                    allData.yActivePerCapita = allData.yActive.map(function (yActive) { return yActive / allData.population });

                    allData.x = allData.children[Object.keys(allData.children)[0]].x;

                    for(var k = 0; k < allData.children[sortedKeys[i]].yDeaths.length; k++) {
                        allData.yDeaths[k] += allData.children[sortedKeys[i]].yDeaths[k];
                    }

                }
            })
            .then(() => {
                dispatch({
                    type: receiveGlobalCases, payload: allData
                });
            })
    },

    requestUSCases: () => async (dispatch) => {
        const allData = {
            UID: null,
            x: [],
            yConfirmed: [],
            yDeaths: [],
            yRecovered: [],
            title: "United States",
            children: {},
            population: 0
        };

        const populationData = [];
        const stats = {
            current: [],
            sevenDay: [],
            fourteenDay: []
        };
        const deaths = [];
        const vaccinations = [];

        stats.current["United States"] = {
            peopleTested: 0,
            testedReporting: 0,
            testedReportingPopulation: 0,
            testedReportingTotalCases: 0,
            // peopleHospitalized: 0,
            // hospitalizedReporting: 0,
            // hospitalizedReportingPopulation: 0,
            // hospitalizedReportingTotalCases: 0
        };
        stats.sevenDay["United States"] = {
            peopleTested: 0,
            testedReporting: 0,
            testedReportingPopulation: 0,
            testedReportingTotalCases: 0,
            // peopleHospitalized: 0,
            // hospitalizedReporting: 0,
            // hospitalizedReportingPopulation: 0,
            // hospitalizedReportingTotalCases: 0
        };
        stats.fourteenDay["United States"] = {
            peopleTested: 0,
            testedReporting: 0,
            testedReportingPopulation: 0,
            testedReportingTotalCases: 0,
            // peopleHospitalized: 0,
            // hospitalizedReporting: 0,
            // hospitalizedReportingPopulation: 0,
            // hospitalizedReportingTotalCases: 0
        }

        dispatch({
            type: requestUSCases
        });
        Promise.all([
            d3.csv('https://raw.githubusercontent.com/dprensha/covid19data/master/us-census-2019-est.csv', (data) => {
                populationData[data.UID] = data.Population;
            }),
            d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${getDateString(0)}.csv`, (data) => {
                stats.current[data.Province_State] = {
                    confirmed: data.Confirmed,
                    deaths: data.Deaths,
                    recovered: data.Recovered,
                    active: data.Active,
                    peopleTested: data["Total_Test_Results"],
                    //peopleHospitalized: data["People_Hospitalized"],
                    mortalityRate: data["Case_Fatality_Ratio"],
                    testingRate: data["Testing_Rate"],
                    //hospitalizationRate: data["Hospitalization_Rate"]
                };
                // if(!isNaN(parseInt(data["Total_Test_Results"]))) {
                //     stats.current["United States"].peopleTested += parseInt(data["Total_Test_Results"]);
                //     stats.current["United States"].testedReporting += 1;
                // }

                // if(!isNaN(parseInt(data["People_Hospitalized"]))) {
                //     stats.current["United States"].peopleHospitalized += parseInt(data["People_Hospitalized"]);
                //     stats.current["United States"].hospitalizedReporting += 1;
                // }
            }),
            d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${getDateString(7)}.csv`, (data) => {
                stats.sevenDay[data.Province_State] = {
                    confirmed: data.Confirmed,
                    deaths: data.Deaths,
                    recovered: data.Recovered,
                    active: data.Active,
                    peopleTested: data["Total_Test_Results"],
                    //peopleHospitalized: data["People_Hospitalized"],
                    mortalityRate: data["Case_Fatality_Ratio"],
                    testingRate: data["Testing_Rate"],
                    //hospitalizationRate: data["Hospitalization_Rate"]
                };
                // if(!isNaN(parseInt(data["Total_Test_Results"]))) {
                //     stats.sevenDay["United States"].peopleTested += parseInt(data["Total_Test_Results"]);
                //     stats.sevenDay["United States"].testedReporting += 1;
                // }

                // if(!isNaN(parseInt(data["People_Hospitalized"]))) {
                //     stats.sevenDay["United States"].peopleHospitalized += parseInt(data["People_Hospitalized"]);
                //     stats.sevenDay["United States"].hospitalizedReporting += 1;
                // }
            }),
            d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${getDateString(14)}.csv`, (data) => {
                stats.fourteenDay[data.Province_State] = {
                    confirmed: data.Confirmed,
                    deaths: data.Deaths,
                    recovered: data.Recovered,
                    active: data.Active,
                    peopleTested: data["Total_Test_Results"],
                    //peopleHospitalized: data["People_Hospitalized"],
                    mortalityRate: data["Case_Fatality_Ratio"],
                    testingRate: data["Testing_Rate"],
                    //hospitalizationRate: data["Hospitalization_Rate"]
                };
                // if(!isNaN(parseInt(data["Total_Test_Results"]))) {
                //     stats.fourteenDay["United States"].peopleTested += parseInt(data["Total_Test_Results"]);
                //     stats.fourteenDay["United States"].testedReporting += 1;
                // }

                // if(!isNaN(parseInt(data["People_Hospitalized"]))) {
                //     stats.fourteenDay["United States"].peopleHospitalized += parseInt(data["People_Hospitalized"]);
                //     stats.fourteenDay["United States"].hospitalizedReporting += 1;
                // }
            }),
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv', (data) => {
                const dates = Object.keys(data).filter(function(key) { return !isNaN(Date.parse(key)) });
                deaths[data.UID] = [];
                for(var j = 0; j < dates.length; j++) {
                    deaths[data.UID].push(parseInt(data[dates[j]]));
                }
            }),
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv', (data) => {
                const dates = Object.keys(data).filter(function (key) { return !isNaN(Date.parse(key)) });
                    if (Object.keys(allData.children).indexOf(data.Province_State) === -1) {
                        allData.children[data.Province_State] = {
                            UID: null,
                            x: [],
                            yConfirmed: [],
                            yDeaths: [],
                            yRecovered: [],
                            yActive: [],
                            title: data.Province_State,
                            navigableTitle: data.Province_State.replace(/[\.\W]/g, ''),
                            parent: allData,
                            children: {},
                            population: 0
                        };
                        allData.children[data.Province_State].children[data.Admin2] = {
                            UID: data.UID,
                            x: [],
                            yConfirmed: [],
                            yDeaths: [],
                            yRecovered: [],
                            yActive: [],
                            title: data.Admin2,
                            navigableTitle: data.Admin2.replace(/[\.\W]/g, ''),
                            parent: allData.children[data.Province_State],
                            population: 0
                        };

                        for (var j = 0; j < dates.length; j++) {
                            allData.children[data.Province_State].x.push(dates[j]);
                            allData.children[data.Province_State].yConfirmed.push(parseInt(data[dates[j]]));
                            //allData.children[data.Province_State].yDeaths.push(parseInt(deathsRow[dates[j]]));

                            allData.children[data.Province_State].children[data.Admin2].x.push(dates[j]);
                            allData.children[data.Province_State].children[data.Admin2].yConfirmed.push(parseInt(data[dates[j]]));
                            if (allData.yConfirmed[j] !== undefined) { allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else { allData.yConfirmed[j] = 0; };
                            //allData.children[data.Province_State].children[data.Admin2].yDeaths.push(parseInt(deathsRow[dates[j]]));
                        }
                    }

                    else {
                        allData.children[data.Province_State].children[data.Admin2] = {
                            UID: data.UID,
                            x: [],
                            yConfirmed: [],
                            yDeaths: [],
                            yRecovered: [],
                            yActive: [],
                            title: data.Admin2,
                            navigableTitle: data.Admin2.replace(/[\.\W]/g, ''),
                            parent: allData.children[data.Province_State],
                            population: 0
                        };

                        for (var j = 0; j < dates.length; j++) {
                            allData.children[data.Province_State].yConfirmed[j] += (parseInt(data[dates[j]]));
                            if (allData.yConfirmed[j] !== undefined) { allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else { allData.yConfirmed[j] = 0; };
                            allData.children[data.Province_State].children[data.Admin2].x.push(dates[j]);
                            allData.children[data.Province_State].children[data.Admin2].yConfirmed.push(parseInt(data[dates[j]]));
                            //allData.children[data.Province_State].children[data.Admin2].yDeaths.push(parseInt(deathsRow[dates[j]]));
                        }
                    }
            }),
            d3.csv('https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/us_data/time_series/time_series_covid19_vaccine_us.csv', (data) => {
                const d = new Date(data.Date);

                //if(data["Vaccine_Type"] === "All") {
                    vaccinations.push({
                        date: `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear().toString().substr(2, 2)}`,
                        state: data["Province_State"],
                        //abbreviation: data["stabbr"],
                        //isDashboardAvailable: data["dashboard_available"],
                        allocatedTotal: null,
                        //allocatedModerna: data["doses_alloc_moderna"],
                        //allocatedPfizer: data["doses_alloc_pfizer"],
                        //allocatedUnknown: data["doses_alloc_unknown"],
                        shippedTotal: "0",
                        //shippedModerna: data["doses_shipped_moderna"],
                        //shippedPfizer: data["doses_shipped_pfizer"],
                        //shippedUnknown: data["doses_shipped_unknown"],
                        administeredTotal: data["Doses_admin"],
                        //administeredModerna: data["doses_admin_moderna"],
                        //administeredPfizer: data["doses_admin_pfizer"],
                        //administeredUnknown: data["doses_admin_unknown"],
                        totalPeopleVaccinatedOneDose: data["People_at_least_one_dose"],
                        totalPeopleVaccinatedAllDoses: data["People_fully_vaccinated"],
                        totalAdditionalDoses: data["Total_additional_doses"]

                    })
                //}
            }),
//             fetch("https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=vaccination_data", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "max-age=0",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "none",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });
            // fetch("https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=vaccination_data", {
            //     method: "GET",
            //     mode: "no-cors",
            //     credentials: "omit"
            // })
            // .then(response => response.json())
            // // .then(data =>  {
            // //     console.log(data);
            // // })

        ])
            .then(() => {
                var sortedKeys = Object.keys(allData.children).sort();
                
                allData.x = allData.children[Object.keys(allData.children)[0]].x;
                
                allData.vaccinationX = allData.x.slice(allData.x.indexOf(VACCINATION_START_DATE), allData.x.length);

                allData.vaccinationData = {
                    allocatedTotal: allData.vaccinationX.map(v => 0),
                    administeredTotal: allData.vaccinationX.map(v => 0),
                    totalPeopleVaccinatedOneDose: allData.vaccinationX.map(v => 0),
                    totalPeopleVaccinatedAllDoses: allData.vaccinationX.map(v => 0),
                    totalAdditionalDoses: allData.vaccinationX.map(v => 0)
                };
                
                for (var i = 0; i < sortedKeys.length; i++) {
                    const stateVaccinationList = vaccinations.filter(v => v.state === sortedKeys[i]);
                    allData.children[sortedKeys[i]].vaccinationData = {
                        allocatedTotal: [],
                        administeredTotal: [],
                        totalPeopleVaccinatedOneDose: [],
                        totalPeopleVaccinatedAllDoses: [],
                        totalAdditionalDoses: [],
                    };

                    var markedValue = { allocatedTotal: 0, administeredTotal: 0, totalPeopleVaccinatedOneDose: 0, totalPeopleVaccinatedAllDoses: 0, totalAdditionalDoses: 0 };
                    for(var j = 0; j < allData.vaccinationX.length; j++) {
                        var marked = { allocatedTotal: false, administeredTotal: false, totalPeopleVaccinatedOneDose: false, totalPeopleVaccinatedAllDoses: false, totalAdditionalDoses: false };
                        for(var k = 0; k < stateVaccinationList.length; k++) {
                            if(stateVaccinationList[k].date === allData.vaccinationX[j] && stateVaccinationList[k].allocatedTotal !== "" && !isNaN(parseInt(stateVaccinationList[k].allocatedTotal, 10))) {
                                marked.allocatedTotal = true;
                                markedValue.allocatedTotal = parseInt(stateVaccinationList[k].allocatedTotal, 10);
                                allData.children[sortedKeys[i]].vaccinationData.allocatedTotal.push(markedValue.allocatedTotal);
                                allData.vaccinationData.allocatedTotal[j] += markedValue.allocatedTotal;
                            }
                            if(stateVaccinationList[k].date === allData.vaccinationX[j] && stateVaccinationList[k].administeredTotal !== "" && !isNaN(parseInt(stateVaccinationList[k].administeredTotal, 10))) {
                                marked.administeredTotal = true;
                                markedValue.administeredTotal = parseInt(stateVaccinationList[k].administeredTotal, 10);
                                allData.children[sortedKeys[i]].vaccinationData.administeredTotal.push(markedValue.administeredTotal);
                                allData.vaccinationData.administeredTotal[j] += markedValue.administeredTotal;
                            }
                            if(stateVaccinationList[k].date === allData.vaccinationX[j] && stateVaccinationList[k].totalPeopleVaccinatedOneDose !== "" && !isNaN(parseInt(stateVaccinationList[k].totalPeopleVaccinatedOneDose, 10))) {
                                marked.totalPeopleVaccinatedOneDose = true;
                                markedValue.totalPeopleVaccinatedOneDose = parseInt(stateVaccinationList[k].totalPeopleVaccinatedOneDose, 10);
                                allData.children[sortedKeys[i]].vaccinationData.totalPeopleVaccinatedOneDose.push(markedValue.totalPeopleVaccinatedOneDose);
                                allData.vaccinationData.totalPeopleVaccinatedOneDose[j] += markedValue.totalPeopleVaccinatedOneDose;
                            }
                            if(stateVaccinationList[k].date === allData.vaccinationX[j] && stateVaccinationList[k].totalPeopleVaccinatedAllDoses !== "" && !isNaN(parseInt(stateVaccinationList[k].totalPeopleVaccinatedAllDoses, 10))) {
                                marked.totalPeopleVaccinatedAllDoses = true;
                                markedValue.totalPeopleVaccinatedAllDoses = parseInt(stateVaccinationList[k].totalPeopleVaccinatedAllDoses, 10);
                                allData.children[sortedKeys[i]].vaccinationData.totalPeopleVaccinatedAllDoses.push(markedValue.totalPeopleVaccinatedAllDoses);
                                allData.vaccinationData.totalPeopleVaccinatedAllDoses[j] += markedValue.totalPeopleVaccinatedAllDoses;
                            }
                            if(stateVaccinationList[k].date === allData.vaccinationX[j] && stateVaccinationList[k].totalAdditionalDoses !== "" && !isNaN(parseInt(stateVaccinationList[k].totalAdditionalDoses, 10))) {
                                marked.totalAdditionalDoses = true;
                                markedValue.totalAdditionalDoses = parseInt(stateVaccinationList[k].totalAdditionalDoses, 10);
                                allData.children[sortedKeys[i]].vaccinationData.totalAdditionalDoses.push(markedValue.totalAdditionalDoses);
                                allData.vaccinationData.totalAdditionalDoses[j] += markedValue.totalAdditionalDoses;
                            }
                        }
                        if(!marked.allocatedTotal) {
                            allData.children[sortedKeys[i]].vaccinationData.allocatedTotal.push(markedValue.allocatedTotal);
                            allData.vaccinationData.allocatedTotal[j] += markedValue.allocatedTotal;
                        }
                        if(!marked.administeredTotal) {
                            allData.children[sortedKeys[i]].vaccinationData.administeredTotal.push(markedValue.administeredTotal);
                            allData.vaccinationData.administeredTotal[j] += markedValue.administeredTotal;
                        }
                        if(!marked.totalPeopleVaccinatedOneDose) {
                            allData.children[sortedKeys[i]].vaccinationData.totalPeopleVaccinatedOneDose.push(markedValue.totalPeopleVaccinatedOneDose);
                            allData.vaccinationData.totalPeopleVaccinatedOneDose[j] += markedValue.totalPeopleVaccinatedOneDose;
                        }
                        if(!marked.totalPeopleVaccinatedAllDoses) {
                            allData.children[sortedKeys[i]].vaccinationData.totalPeopleVaccinatedAllDoses.push(markedValue.totalPeopleVaccinatedAllDoses);
                            allData.vaccinationData.totalPeopleVaccinatedAllDoses[j] += markedValue.totalPeopleVaccinatedAllDoses;
                        }
                        if(!marked.totalAdditionalDoses) {
                            allData.children[sortedKeys[i]].vaccinationData.totalAdditionalDoses.push(markedValue.totalAdditionalDoses);
                            allData.vaccinationData.totalAdditionalDoses[j] += markedValue.totalAdditionalDoses;
                        }
                    }

                    allData.children[sortedKeys[i]].yRecovered = allData.children[sortedKeys[i]].yConfirmed.map(function (data, index) {
                        if (index < RECOVERY_PERIOD_DAYS) {
                            return 0;
                        }
                        else {
                            return allData.children[sortedKeys[i]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
                        }
                    });

                    allData.children[sortedKeys[i]].yActive = allData.children[sortedKeys[i]].yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].yRecovered[index] });

                    var sortedChildKeys = Object.keys(allData.children[sortedKeys[i]].children).sort();
                    for (var j = 0; j < sortedChildKeys.length; j++) {
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function (data, index) {
                            if (index < RECOVERY_PERIOD_DAYS) {
                                return 0;
                            }
                            else {
                                return allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
                            }
                        });
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered[index] });
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population = populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID];
                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yDeaths = deaths[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID];
                        
                        for (var k = 0; k < allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yDeaths.length; k++) {
                            allData.children[sortedKeys[i]].yDeaths[k] = allData.children[sortedKeys[i]].yDeaths[k] === undefined ? 0 : allData.children[sortedKeys[i]].yDeaths[k] + deaths[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID][k];
                            allData.yDeaths[k] = allData.yDeaths[k] === undefined ? 0 : allData.yDeaths[k] + deaths[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID][k];
                        }

                        allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActivePerCapita = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive.map(function (yActive) { return yActive / allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population });

                        allData.children[sortedKeys[i]].population += parseInt(populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID]);
                        allData.population += parseInt(populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID]);
                    }

                    allData.children[sortedKeys[i]].yActivePerCapita = allData.children[sortedKeys[i]].yActive.map(function (yActive) { return yActive / allData.children[sortedKeys[i]].population });
                    allData.children[sortedKeys[i]].stats = { current: stats.current[allData.children[sortedKeys[i]].title], sevenDay: stats.sevenDay[allData.children[sortedKeys[i]].title], fourteenDay: stats.fourteenDay[allData.children[sortedKeys[i]].title] };
                
                    if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.current.peopleTested))) {
                        stats.current["United States"].peopleTested += parseInt(allData.children[sortedKeys[i]].stats.current.peopleTested);
                        stats.current["United States"].testedReporting += 1;
                        stats.current["United States"].testedReportingPopulation += allData.children[sortedKeys[i]].population;
                        stats.current["United States"].testedReportingTotalCases += parseInt(stats.current[sortedKeys[i]].confirmed);

                    }
    
                    // if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.current.peopleHospitalized))) {
                    //     stats.current["United States"].peopleHospitalized += parseInt(allData.children[sortedKeys[i]].stats.current.peopleHospitalized);
                    //     stats.current["United States"].hospitalizedReporting += 1;
                    //     stats.current["United States"].hospitalizedReportingPopulation += allData.children[sortedKeys[i]].population;
                    //     stats.current["United States"].hospitalizedReportingTotalCases += parseInt(stats.current[sortedKeys[i]].confirmed);

                    // }

                    if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.sevenDay.peopleTested))) {
                        stats.sevenDay["United States"].peopleTested += parseInt(allData.children[sortedKeys[i]].stats.sevenDay.peopleTested);
                        stats.sevenDay["United States"].testedReporting += 1;
                        stats.sevenDay["United States"].testedReportingPopulation += allData.children[sortedKeys[i]].population;
                        stats.sevenDay["United States"].testedReportingTotalCases += parseInt(stats.sevenDay[sortedKeys[i]].confirmed);
                    }
    
                    // if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.sevenDay.peopleHospitalized))) {
                    //     stats.sevenDay["United States"].peopleHospitalized += parseInt(allData.children[sortedKeys[i]].stats.sevenDay.peopleHospitalized);
                    //     stats.sevenDay["United States"].hospitalizedReporting += 1;
                    //     stats.sevenDay["United States"].hospitalizedReportingPopulation += allData.children[sortedKeys[i]].population;
                    //     stats.sevenDay["United States"].hospitalizedReportingTotalCases += parseInt(stats.sevenDay[sortedKeys[i]].confirmed);
                    // }

                    if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.fourteenDay.peopleTested))) {
                        stats.fourteenDay["United States"].peopleTested += parseInt(allData.children[sortedKeys[i]].stats.fourteenDay.peopleTested);
                        stats.fourteenDay["United States"].testedReporting += 1;
                        stats.fourteenDay["United States"].testedReportingPopulation += allData.children[sortedKeys[i]].population;
                        stats.fourteenDay["United States"].testedReportingTotalCases += parseInt(stats.fourteenDay[sortedKeys[i]].confirmed);
                    }
    
                    // if(!isNaN(parseInt(allData.children[sortedKeys[i]].stats.fourteenDay.peopleHospitalized))) {
                    //     stats.fourteenDay["United States"].peopleHospitalized += parseInt(allData.children[sortedKeys[i]].stats.fourteenDay.peopleHospitalized);
                    //     stats.fourteenDay["United States"].hospitalizedReporting += 1;
                    //     stats.fourteenDay["United States"].hospitalizedReportingPopulation += allData.children[sortedKeys[i]].population;
                    //     stats.fourteenDay["United States"].hospitalizedReportingTotalCases += parseInt(stats.fourteenDay[sortedKeys[i]].confirmed);
                    // }
                
                }

                allData.yRecovered = allData.yConfirmed.map(function (data, index) {
                    if (index < RECOVERY_PERIOD_DAYS) {
                        return 0;
                    }
                    else {
                        return allData.yConfirmed[index - RECOVERY_PERIOD_DAYS];
                    }
                });
                allData.yActive = allData.yConfirmed.map(function (yConfirmed, index) { return yConfirmed - allData.yRecovered[index] });
                allData.yActivePerCapita = allData.yActive.map(function (yActive) { return yActive / allData.population });




                const current = stats.current["United States"];
                //current.hospitalizationRate = current.peopleHospitalized / current.hospitalizedReportingTotalCases * 100;
                current.testingRate = current.peopleTested / current.testedReportingPopulation * 100000;

                const sevenDay = stats.sevenDay["United States"];
                //sevenDay.hospitalizationRate = sevenDay.peopleHospitalized / sevenDay.hospitalizedReportingTotalCases * 100;
                sevenDay.testingRate = sevenDay.peopleTested / sevenDay.testedReportingPopulation * 100000;

                const fourteenDay = stats.fourteenDay["United States"];
                //fourteenDay.hospitalizationRate = fourteenDay.peopleHospitalized / fourteenDay.hospitalizedReportingTotalCases * 100;
                fourteenDay.testingRate = fourteenDay.peopleTested / fourteenDay.testedReportingPopulation * 100000;

                allData.stats = {
                    current: current,
                    sevenDay: sevenDay,
                    fourteenDay: fourteenDay
                };
            })
            .then(() => {
                dispatch({
                    type: receiveUSCases, payload: allData
                });
            });

            // d3.json("https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=vaccination_data", {
            //     method: "GET",
            //     //mode: "no-cors",
            //     //credentials: "omit"
            // })
            // .then((response) => response => response.json())
            // .then(data => console.log(data));
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    switch (action.type) {
        case requestGlobalCases:
            return {
                ...state,
                isFetchingGlobalCaseData: true
            };

        case receiveGlobalCases:
            return {
                ...state,
                globalCases: action.payload,
                isFetchingGlobalCaseData: false
            };

        case requestGlobalCasesFailure:
            return {
                ...state,
                errorMessage: "An error occurred when retrieving data.",
                isErrorSnackbarVisible: true
            };
        case requestUSCases:
            return {
                ...state,
                isFetchingUSCaseData: true
            };

        case receiveUSCases:
            return {
                ...state,
                usCases: action.payload,
                isFetchingUSCaseData: false
            };

        case requestUSCasesFailure:
            return {
                ...state,
                errorMessage: "An error occurred when retrieving data.",
                isErrorSnackbarVisible: true
            };

        default: return state;
    };
};