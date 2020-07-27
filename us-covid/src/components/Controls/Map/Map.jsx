import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  CanvasMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { constants } from "../../Utilities";
import { geoAlbersUsa } from "d3-geo";
import { geoAlbers } from "d3-geo";
import { geoEqualEarth } from "d3-geo";



const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "B";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const Map = ({ displayDetails, width, height, entityName, long, lat, parentEntityName, grandparentEntityName }) => {
  const [content, setContent] = useState("");
  let coordinates = [long, lat];
  let center = coordinates;
  let projection = "geoMercator";
  let zoom = 1;
  let geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
  let strokeWidth = "1px";
  let mapConfig = null;

  mapConfig = getMapConfig(parentEntityName, entityName, grandparentEntityName);
  if(mapConfig.geoURL) {
    geoURL = mapConfig.geoURL;
  }
  if(mapConfig.center) {
    center = mapConfig.center;
  }
  if(mapConfig.coordinates) {
    coordinates = mapConfig.coordinates;
  }
  if(mapConfig.zoom) {
    zoom = mapConfig.zoom;
  }
  if(mapConfig.strokeWidth){
    strokeWidth = mapConfig.strokeWidth;
  }

  // switch (parentEntityName) {
  //   case "World":
  //     // geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
  //     // break;
  //     mapConfig = getMapConfig(parentEntityName, entityName);
  //     geoURL = mapConfig.geoURL;
  //     break;
  //   case "Canada":
  //     // geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/CanadaTopo.json";
  //     // center = [-94.245, 57.728];
  //     // zoom = 1.4;
  //     // //projection = "geoAlbers"
  //     mapConfig = getMapConfig(parentEntityName, entityName);
  //     geoURL = mapConfig.geoURL;
  //     center = mapConfig.center;
  //     zoom = mapConfig.zoom;

  //     break;
  //   case "Australia":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/AustraliaTopo.json";
  //     center = [136.423, -27.986];
  //     zoom = 1.9;
  //     //projection = "geoAlbers"
  //     break;
  //   case "China":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/ChinaTopo.json";
  //     center = [106.185, 38.147];
  //     zoom = 1.65;
  //     //projection = "geoAlbers"
  //     break;
  //   case "Tennessee":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
  //     center = [-86, 36];
  //     zoom = 16;
  //     strokeWidth = ".08px";
  //     //projection = "geoAlbers"
  //     break;
  //   case "North Carolina":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
  //     center = [-80.1, 35.4];
  //     zoom = 17;
  //     strokeWidth = ".08px";
  //     //projection = "geoAlbers"
  //     break;
  //   case "California":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
  //     center = [-119, 37];
  //     zoom = 6;
  //     strokeWidth = ".08px";
  //     //projection = "geoAlbers"
  //     break;
  //   case "Arizona":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
  //     center = [-111.75, 33.71];
  //     zoom = 10;
  //     strokeWidth = ".08px";
  //     //projection = "geoAlbers"
  //     break;
  //   case "United States":
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/USTopo.json";
  //     center = [-96.949, 38.329];
  //     //zoom = .4;
  //     //projection = "geoAlbers";
  //     zoom = 2.4;
  //     coordinates = [0, 0];
  //     strokeWidth = "0.5px";

  //     if (entityName === "Alaska") {
  //       center = [-155.949, 64.329];
  //       zoom = 1.5;
  //     }

  //     if (entityName === "Hawaii") {
  //       center = [-158.949, 20.329];
  //       zoom = 9;
  //     }

  //     break;
  //   default:
  //     geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
  //     break;
  //}

  let cities = [
    {


      fields: {
        city: "Knoxville",
        coordinates: [
          35.9606384,
          -83.9207392
        ],
        state: "Tennessee",


        population: 183270
      },
      geometry: {
        type: "Point",
        coordinates: [
          -83.9207392,
          35.9606384
        ]
      },
      record_timestamp: "2017-06-01T10:40:33.222-04:00"
    },
    {


      fields: {
        city: "Kingsport",
        coordinates: [
          36.548434,
          -82.5618186
        ],
        state: "Tennessee",


        population: 52962
      },
      geometry: {
        type: "Point",
        coordinates: [
          -82.5618186,
          36.548434
        ]
      },
      record_timestamp: "2017-06-01T10:40:33.222-04:00"
    },
    {


      fields: {
        city: "Nashville",
        coordinates: [
          36.1626638,
          -86.7816016
        ],
        state: "Tennessee",


        population: 634464
      },
      geometry: {
        type: "Point",
        coordinates: [
          -86.7816016,
          36.1626638
        ]
      },
      record_timestamp: "2017-06-01T10:40:33.222-04:00"
    }
  ];
  let pointsList = [];
  for (var i = 0; i < cities.length; i++) {
    if (cities[i].fields.state === "Tennessee") {
      //pointsList.push({name: cities[i].fields.city, coordinates: cities[i].fields.coordinates})
      pointsList.push(
        <Marker
          coordinates={[cities[i].fields.coordinates[1], cities[i].fields.coordinates[0]]}
          key={i}
        >
          <circle r={2} fill="#000" style={{ transform: "scale(.05)" }} />
          <text style={{ transform: "scale(.04)" }}>{cities[i].fields.city}</text>
        </Marker>
      )
    }
  }

  console.log(pointsList);

  return (
    <>
      <div style={{ width: width, margin: "auto" }}>
        <ComposableMap data-tip="" projection={projection} /*projectionConfig={{ scale: 160 }}*/ height={height} width={width} >
          <ZoomableGroup
            center={center}
            zoom={displayDetails.formFactor === constants.display.formFactors.MOBILE ? zoom*.82 : zoom}
          >
            <Geographies geography={geoURL}>
              {({ geographies, projection }) =>
                geographies.filter(geo => geo.properties.COUNTYFP ? geo.properties.STATEFP === fips[parentEntityName] : true).map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    //projection={projection}
                    // onMouseEnter={() => {
                    //   const { NAME, POP_EST } = geo.properties;
                    //   setContent(`${NAME} - ${rounded(POP_EST)}`);
                    // }}
                    // onMouseLeave={() => {
                    //   setContent("");
                    // }}
                    style={{
                      default: {
                        fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                        outline: "none",
                        stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                        strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : strokeWidth}`,
                      },
                      hover: {
                        fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                        stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                        strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : strokeWidth}`,
                        outline: "none"
                      },
                      pressed: {
                        fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                        stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                        strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : strokeWidth}`,
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
            <Marker coordinates={coordinates}>
              <circle r={2} fill="#F53" />
            </Marker>
            {/* {pointsList} */}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {/* <span>{content}</span> */}
    </>
  );
};

const fips = {
  "Alabama": "01",
  "Alaska": "02",
  "Arizona": "04",
  "Arkansas": "05",
  "California": "06",
  "Colorado": "08",
  "Connecticut": "09",
  "Delaware": "10",
  "District of Columbia": "11",
  "Florida": "12",
  "Geogia": "13",
  "Hawaii": "15",
  "Idaho": "16",
  "Illinois": "17",
  "Indiana": "18",
  "Iowa": "19",
  "Kansas": "20",
  "Kentucky": "21",
  "Louisiana": "22",
  "Maine": "23",
  "Maryland": "24",
  "Massachusetts": "25",
  "Michigan": "26",
  "Minnesota": "27",
  "Mississippi": "28",
  "Missouri": "29",
  "Montana": "30",
  "Nebraska": "31",
  "Nevada": "32",
  "New Hampshire": "33",
  "New Jersey": "34",
  "New Mexico": "35",
  "New York": "36",
  "North Carolina": "37",
  "North Dakota": "38",
  "Ohio": "39",
  "Oklahoma": "40",
  "Oregon": "41",
  "Pennsylvania": "42",
  "Rhode Island": "44",
  "South Carolina": "45",
  "South Dakota": "46",
  "Tennessee": "47",
  "Texas": "48",
  "Utah": "49",
  "Vermont": "50",
  "Virginia": "51",
  "Washington": "53",
  "West Virginia": "54",
  "Wisconsin": "55",
  "Wyoming": "56"
};

const mapConfig = {
  "World": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json",
  },
  "Canada": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/CanadaTopo.json",
    center: [-94.245, 57.728],
    zoom: 1.4
  },
  "Australia": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/AustraliaTopo.json",
    center: [136.423, -27.986],
    zoom: 1.9
  },
  "China": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/ChinaTopo.json",
    center: [106.185, 38.147],
    zoom: 1.65
  },
  "United States": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/USTopo.json",
    center: [-96.949, 38.329],
    zoom: 2.4,
    coordinates: [0, 0],
    strokeWidth: "0.5px",
  },
  "AlaskaState": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/USTopo.json",
    center: [-155.949, 64.329],
    zoom: 1.5,
    coordinates: [0, 0],
    strokeWidth: "0.5px",
  },
  "HawaiiState": {
    geoURL: "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/USTopo.json",
    center: [-158.949, 20.329],
    zoom: 9,
    coordinates: [0, 0],
    strokeWidth: "0.5px",
  },
  // "Tennessee": {
  //   center: [-86, 36],
  //   zoom: 16
  // },
  // "North Carolina": {
  //   center: [-80.1, 35.4],
  //   zoom: 17
  // },
  // "California": {
  //   center: [-119, 37],
  //   zoom: 6
  // },
  // "Arizona": {
  //   center: [-111.75, 33.71],
  //   zoom: 10
  // },

"Alabama": { center: [-86.8287,32.8794], zoom: 12 },
"Alaska": { center: [-152.2782,62.0685], zoom: 1.65 },
"Arizona": { center: [-111.6602,34.2744], zoom: 10 },
"Arkansas": { center: [-92.4426,34.8938], zoom: 16 },
"California": { center: [-119.4696,37.1841], zoom: 6 },
"Colorado": { center: [-105.5478,38.9972], zoom: 14 },
"Connecticut": { center: [-72.7273,41.6219], zoom: 40 },
"Delaware": { center: [-75.505,39.1896], zoom: 40 },
"District of Columbia": { center: [-77.0147,38.9101], zoom: 100 },
"Florida": { center: [-83.4497,27.6305], zoom: 10 },
"Georgia": { center: [-83.4426,32.6415], zoom: 10 }, ///WHY DOESN'T THIS WORK????????????????
"Hawaii": { center: [-156.3737,20.2927], zoom: 10 }, ///Name not unique
"Idaho": { center: [-114.613,45.3509], zoom: 7 },
"Illinois": { center: [-89.1965,40.0417], zoom: 10 },
"Indiana": { center: [-86.2816,39.8942], zoom: 14 },
"Iowa": { center: [-93.496,42.0751], zoom: 17 },
"Kansas": { center: [-98.3804,38.4937], zoom: 17 },
"Kentucky": { center: [-85.7021,37.7347], zoom: 19 },
"Louisiana": { center: [-91.9968,31.0689], zoom: 15.25 },
"Maine": { center: [-69.2428,45.3695], zoom: 12 },
"Maryland": { center: [-77.2909,38.855], zoom: 30 },
"Massachusetts": { center: [-71.8083,42.2596], zoom: 10 },
"Michigan": { center: [-85.4102,44.6467], zoom: 9 },
"Minnesota": { center: [-94.3053,46.3807], zoom: 8.5 },
"Mississippi": { center: [-89.6678,32.7364], zoom: 13 },
"Missouri": { center: [-92.458,38.3566], zoom: 12 },
"Montana": { center: [-109.8333,46.9527], zoom: 10 },
"Nebraska": { center: [-99.7951,41.5378], zoom: 16 },
"Nevada": { center: [-116.6312,38.8289], zoom: 8 },
"New Hampshire": { center: [-71.5811,43.9805], zoom: 20 },
"New Jersey": { center: [-74.6728,40.1907], zoom: 23 },
"New Mexico": { center: [-106.1126,34.3071], zoom: 10.5 },
"New York": { center: [-75.5268,42.8538], zoom: 11.5 },
"North Carolina": { center: [-80.0877,35.5557], zoom: 17 },
"North Dakota": { center: [-100.4659,47.4501], zoom: 15 },
"Ohio": { center: [-82.7937,40.1862], zoom: 16 },
"Oklahoma": { center: [-98.4943,35.5889], zoom: 15 },
"Oregon": { center: [-120.5583,44.0336], zoom: 12 },
"Pennsylvania": { center: [-77.7996,40.9781], zoom: 21 },
"Rhode Island": { center: [-71.5562,41.6762], zoom: 10 },
"South Carolina": { center: [-80.8964,33.9169], zoom: 10 },
"South Dakota": { center: [-100.2263,44.4443], zoom: 10 },
"Tennessee": { center: [-86.3505,35.858], zoom: 16 },
"Texas": { center: [-99.3312,31.4757], zoom: 10 },
"Utah": { center: [-111.6703,39.3055], zoom: 10 },
"Vermont": { center: [-72.6658,44.0687], zoom: 10 },
"Virginia": { center: [-78.8537,37.5215], zoom: 10 },
"Washington": { center: [-120.4472,47.3826], zoom: 10 },
"West Virginia": { center: [-80.6227,38.6409], zoom: 10 },
"Wisconsin": { center: [-89.9941,44.6243], zoom: 10 },
"Wyoming": { center: [-107.5512,42.9957], zoom: 10 },
  
}


const getMapConfig = (parentEntityName, entityName, grandparentEntityName) => {
  
  if (entityName === "Alaska") {
    return mapConfig["AlaskaState"];
  }

  if (entityName === "Hawaii") {
    return mapConfig["HawaiiState"];
  }

  if (grandparentEntityName === "United States") {
    let mc = mapConfig[parentEntityName];
    mc.strokeWidth = "0.05px";
    mc.geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
    return mc;
  }

  return mapConfig[parentEntityName];
};


//Map.propTypes = propTypes;
export default Map;
