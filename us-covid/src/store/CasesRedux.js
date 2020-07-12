import * as d3 from 'd3';

const requestCases = 'REQUEST_CASES';
const requestCasesFailure = 'REQUEST_CASES_FAILURE';
const receiveCases = 'RECEIVE_CASES';
const RECOVERY_PERIOD_DAYS = 14;
const initialState = { cases: [] };

export const actionCreators = {
    requestCases: () => async (dispatch) => {
        const allData = {
            UID: null,
            x: [],
            yConfirmed: [],
            yDeaths: [],
            yRecovered: [],
            title: "US",
            children: {},
            population: 0
        };

        const populationData = [];

        dispatch({ 
            type: requestCases
        });
        // return fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv')
        // .then((response) => {
        //     let reader = response.body.getReader();
        //     let decoder = new TextDecoder('utf-8');

        //     return reader.read().then(function (result) {
        //         //console.log(d3.csv(decoder.decode(result.value)));
        //         dispatch({
        //             type: receiveCases, payload: d3.csv(decoder.decode(result.value))
        //         });

        //     });
        // });
        Promise.all([
        d3.csv('https://raw.githubusercontent.com/dprensha/covid19data/master/us-census-2019-est.csv', (data) => {
            populationData[data.UID] = data.Population;
        }),
        d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv', (data) => {
            const dates = Object.keys(data).filter(function(key) { return !isNaN(Date.parse(key)) });
            if (Object.keys(allData.children).indexOf(data.Province_State) === -1) {
                allData.children[data.Province_State] = {
                    UID: null,
                    x: [],
                    yConfirmed: [],
                    yDeaths: [],
                    yRecovered: [],
                    yActive: [],
                    title: data.Province_State,
                    navigableTitle: data.Province_State.replace(/[\.\W]/g,''),
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
                    navigableTitle: data.Admin2.replace(/[\.\W]/g,''),
                    parent: allData.children[data.Province_State],
                    population: 0
                };
                
                for(var j = 0; j < dates.length; j++) {
                    allData.children[data.Province_State].x.push(dates[j]);
                    allData.children[data.Province_State].yConfirmed.push(parseInt(data[dates[j]]));
                    //allData.children[data.Province_State].yDeaths.push(parseInt(deathsRow[dates[j]]));

                    allData.children[data.Province_State].children[data.Admin2].x.push(dates[j]);
                    allData.children[data.Province_State].children[data.Admin2].yConfirmed.push(parseInt(data[dates[j]]));
                    if(allData.yConfirmed[j] !== undefined) {allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else {allData.yConfirmed[j] = 0;};
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
                    navigableTitle: data.Admin2.replace(/[\.\W]/g,''),
                    parent: allData.children[data.Province_State],
                    population: 0
                };

                for(var j = 0; j < dates.length; j++) {
                    allData.children[data.Province_State].yConfirmed[j] += (parseInt(data[dates[j]]));
                    if(allData.yConfirmed[j] !== undefined) {allData.yConfirmed[j] += (parseInt(data[dates[j]])) } else {allData.yConfirmed[j] = 0;};
                    allData.children[data.Province_State].children[data.Admin2].x.push(dates[j]);
                    allData.children[data.Province_State].children[data.Admin2].yConfirmed.push(parseInt(data[dates[j]]));
                    //allData.children[data.Province_State].children[data.Admin2].yDeaths.push(parseInt(deathsRow[dates[j]]));
                }
            }
        })
    ])
        .then(() => {
            var sortedKeys = Object.keys(allData.children).sort();
			for (var i = 0; i < sortedKeys.length; i++) {
				allData.children[sortedKeys[i]].yRecovered = allData.children[sortedKeys[i]].yConfirmed.map(function(data, index) {
					if (index < RECOVERY_PERIOD_DAYS) {
						return 0;
					}
					else {
						return allData.children[sortedKeys[i]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
					}
                });
                
                allData.children[sortedKeys[i]].yActive = allData.children[sortedKeys[i]].yConfirmed.map(function(yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].yRecovered[index] });

				var sortedChildKeys = Object.keys(allData.children[sortedKeys[i]].children).sort();
				for(var j = 0; j < sortedChildKeys.length; j++) {
					allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function(data, index) {
                        if (index < RECOVERY_PERIOD_DAYS) {
                            return 0;
                        }
                        else {
                            return allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed[index - RECOVERY_PERIOD_DAYS];
                        }
                    });
                    allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yConfirmed.map(function(yConfirmed, index) { return yConfirmed - allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yRecovered[index] });
                    allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population = populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID];
                    allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActivePerCapita = allData.children[sortedKeys[i]].children[sortedChildKeys[j]].yActive.map(function(yActive) { return yActive / allData.children[sortedKeys[i]].children[sortedChildKeys[j]].population });

                    allData.children[sortedKeys[i]].population += parseInt(populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID]);
                    allData.population += parseInt(populationData[allData.children[sortedKeys[i]].children[sortedChildKeys[j]].UID]);
                }

                allData.children[sortedKeys[i]].yActivePerCapita = allData.children[sortedKeys[i]].yActive.map(function(yActive) { return yActive / allData.children[sortedKeys[i]].population })

                allData.yRecovered = allData.yConfirmed.map(function(data, index) {
					if (index < RECOVERY_PERIOD_DAYS) {
						return 0;
					}
					else {
						return allData.yConfirmed[index - RECOVERY_PERIOD_DAYS];
					}
                });
                allData.yActive = allData.yConfirmed.map(function(yConfirmed, index) { return yConfirmed - allData.yRecovered[index] });
                allData.yActivePerCapita = allData.yActive.map(function(yActive) { return yActive / allData.population });

                allData.x = allData.children[Object.keys(allData.children)[0]].x;
            }
        })
        .then(() => {
            dispatch({
                type: receiveCases, payload: allData
            });
        })
    }


};

export const reducer = (state, action) => {
    state = state || initialState;

    switch(action.type){
        case requestCases: 
            return {
                ...state,
                isFetchingCaseData: true
            };

        case receiveCases:
            return {
                ...state,
                cases: action.payload,
                isFetchingCaseData: false
            };

        case requestCasesFailure:
            return {
                ...state,
                errorMessage: "An error occurred when retrieving data.",
                isErrorSnackbarVisible: true
            };

        default: return state;
    };
};
