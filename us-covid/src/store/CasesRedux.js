import api from "../utilities/API";
import Plotly from 'plotly.js-basic-dist';
import * as d3 from 'd3';
import { dispatch } from "d3";


const requestCases = 'REQUEST_CASES';
const requestCasesFailure = 'REQUEST_CASES_FAILURE';
const receiveCases = 'RECEIVE_CASES';
// const requestTeams = 'REQUEST_TEAMS';
// const requestTeamsFailure = 'REQUEST_TEAMS_FAILURE';
// const receiveTeams = 'RECEIVE_TEAMS';
// const requestFeatures = 'REQUEST_FEATURES';
// const requestFeaturesFailure = 'REQUEST_FEATURES_FAILURE';
// const receiveFeatures = 'RECEIVE_FEATURES';
// const requestDefects = 'REQUEST_DEFECTS';
// const requestDefectsFailure = 'REQUEST_DEFECTS_FAILURE';
// const receiveDefects = 'RECEIVE_DEFECTS';

const rallyAPIErrorMessage = 'Rally API Error';
const RECOVERY_PERIOD_DAYS = 14;

const initialState = { cases: [], teams: [], features: [], defects: [] };

export const actionCreators = {
    requestCases: () => async (dispatch) => {
        const allData = {
            x: [],
            yConfirmed: [],
            yDeaths: [],
            yRecovered: [],
            title: "All States",
            children: {}
        }

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
        d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv', (data) => {
            const dates = Object.keys(data).filter(function(key) { return !isNaN(Date.parse(key)) });
            if (Object.keys(allData.children).indexOf(data.Province_State) === -1) {
                allData.children[data.Province_State] = {
                    x: [],
                    yConfirmed: [],
                    yDeaths: [],
                    yRecovered: [],
                    yActive: [],
                    title: data.Province_State,
                    children: {}
                };
                allData.children[data.Province_State].children[data.Admin2] = {
                    x: [],
                    yConfirmed: [],
                    yDeaths: [],
                    yRecovered: [],
                    yActive: [],
                    title: data.Admin2,
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
                    x: [],
                    yConfirmed: [],
                    yDeaths: [],
                    yRecovered: [],
                    yActive: [],
                    title: data.Admin2,
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
                }
                
                allData.yRecovered = allData.yConfirmed.map(function(data, index) {
					if (index < RECOVERY_PERIOD_DAYS) {
						return 0;
					}
					else {
						return allData.yConfirmed[index - RECOVERY_PERIOD_DAYS];
					}
                });
                allData.yActive = allData.yConfirmed.map(function(yConfirmed, index) { return yConfirmed - allData.yRecovered[index] });

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
            };

        case receiveCases:
            //console.log(action.payload)
            return {
                ...state,
                cases: action.payload
            };

        // case requestTeams: 
        //     return {
        //         ...state
        //     };

        // case receiveTeams:
        //     return {
        //         ...state,
        //         teams: action.payload.QueryResult.Results.map((team) => team.Name)
        //     };

        // case requestFeatures:
        //     return {
        //         ...state,
        //     };

        // case receiveFeatures:
        //     return {
        //         ...state,
        //         features: action.payload.QueryResult.Results.map((feature, index) => { return { id: feature.FormattedID, name: feature.Name, rallyId: feature.ObjectID, rank: index + 1 }})
        //     };

        // case requestDefects:
        //     return {
        //         ...state,
        //     };
    
        // case receiveDefects:
        //     return {
        //         ...state,
        //         defects: action.payload.QueryResult.Results.map((defect) => { return { id: defect.FormattedID, name: defect.Name, rallyId: defect.ObjectID, state: defect.State }})
        //     };


        //failures
        case requestCasesFailure:
            return {
                ...state,
                errorMessage: rallyAPIErrorMessage,
                isErrorSnackbarVisible: true
            };

        // case requestTeamsFailure:
        //     return {
        //         ...state,
        //         errorMessage: rallyAPIErrorMessage,
        //         isErrorSnackbarVisible: true
        //     };

        // case requestFeaturesFailure:
        //     return {
        //         ...state,
        //         errorMessage: rallyAPIErrorMessage,
        //         isErrorSnackbarVisible: true
        //     };

        // case requestDefectsFailure:
        //     return {
        //         ...state,
        //         errorMessage: rallyAPIErrorMessage,
        //         isErrorSnackbarVisible: true
        //     };

        default: return state;
    };
};
