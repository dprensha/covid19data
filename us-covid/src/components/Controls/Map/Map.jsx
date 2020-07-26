import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  CanvasMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
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

const Map = ({ width, entityName, long, lat, parentEntityName }) => {
  const [content, setContent] = useState("");
  let coordinates = [long, lat];
  let center = coordinates;
  let projection = "geoMercator";

  let zoom = 1;
  let geoURL = null;
  let strokeWidth = "0.5px";

switch (parentEntityName) {
  case "World": 
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
    break;
  case "Canada": 
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/CanadaTopo.json";
    center = [-94.245, 57.728];
    zoom = 1.4;
    //projection = "geoAlbers"
    break;
  case "Australia":
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/AustraliaTopo.json";
    center = [136.423, -27.986];
    zoom = 1.9;
    //projection = "geoAlbers"
    break;
  case "China":
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/ChinaTopo.json";
    center = [106.185, 38.147];
    zoom = 1.65;
    //projection = "geoAlbers"
    break;
    case "Tennessee":
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
      center = [-86, 36];
      zoom = 16;
      strokeWidth = ".08px";
      //projection = "geoAlbers"
      break;
      case "North Carolina":
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
      center = [-80.1, 35.4];
      zoom = 17;
      strokeWidth = ".08px";
      //projection = "geoAlbers"
      break;
      case "California":
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
      center = [-119, 37];
      zoom = 6;
      strokeWidth = ".08px";
      //projection = "geoAlbers"
      break;
      case "Arizona":
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/US_Counties.json";
      center = [-111.75, 33.71];
      zoom = 10;
      strokeWidth = ".08px";
      //projection = "geoAlbers"
      break;
  case "United States":
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/USTopo.json";
      center =  [-96.949, 38.329];
      //zoom = .4;
      //projection = "geoAlbers";
      zoom = 2.4;
      coordinates = [0, 0];

      if(entityName === "Alaska") {
        center = [-155.949, 64.329];
        zoom = 1.5;
      }

      if(entityName === "Hawaii") {
        center = [-158.949, 20.329];
        zoom = 9;
      }

      break;
  default:
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
    break;
}

let fips = {
  "Alabama"                :  "01",
  "Alaska"                 :  "02",
  "Arizona"                :  "04",
  "Arkansas"               :  "05",
  "California"             :  "06",
  "Colorado"               :  "08",
  "Connecticut"            :  "09",
  "Delaware"               :  "10",
  "District of Columbia"   :  "11",
  "Florida"                :  "12",
  "Geogia"                 :  "13",
  "Hawaii"                 :  "15",
  "Idaho"                  :  "16",
  "Illinois"               :  "17",
  "Indiana"                :  "18",
  "Iowa"                   :  "19",
  "Kansas"                 :  "20",
  "Kentucky"               :  "21",
  "Louisiana"              :  "22",
  "Maine"                  :  "23",
  "Maryland"               :  "24",
  "Massachusetts"          :  "25",
  "Michigan"               :  "26",
  "Minnesota"              :  "27",
  "Mississippi"            :  "28",
  "Missouri"               :  "29",
  "Montana"                :  "30",
  "Nebraska"               :  "31",
  "Nevada"                 :  "32",
  "New Hampshire"          :  "33",
  "New Jersey"             :  "34",
  "New Mexico"             :  "35",
  "New York"               :  "36",
  "North Carolina"         :  "37",
  "North Dakota"           :  "38",
  "Ohio"                   :  "39",
  "Oklahoma"               :  "40",
  "Oregon"                 :  "41",
  "Pennsylvania"           :  "42",
  "Rhode Island"           :  "44",
  "South Carolina"         :  "45",
  "South Dakota"           :  "46",
  "Tennessee"              :  "47",
  "Texas"                  :  "48",
  "Utah"                   :  "49",
  "Vermont"                :  "50",
  "Virginia"               :  "51",
  "Washington"             :  "53",
  "West Virginia"          :  "54",
  "Wisconsin"              :  "55",
  "Wyoming"                :  "56"
}

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
for(var i = 0; i < cities.length; i++) {
  if(cities[i].fields.state === "Tennessee") {
    //pointsList.push({name: cities[i].fields.city, coordinates: cities[i].fields.coordinates})
    pointsList.push(
      <Marker 
        coordinates={[cities[i].fields.coordinates[1], cities[i].fields.coordinates[0]]}
        key={i}
      >
        <circle r={2} fill="#000" style={{transform: "scale(.05)"}} />
        <text style={{transform: "scale(.04)"}}>{cities[i].fields.city}</text>
      </Marker>
    )
  }
}

console.log(pointsList);

  return (
    <>
      <div style={{width: width, margin: "auto"}}>
        <ComposableMap data-tip="" projection={projection} /*projectionConfig={{ scale: 160 }}*/ height={200} width={400} >
          <ZoomableGroup
          center={center}
          zoom={zoom}
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

//Map.propTypes = propTypes;
export default Map;
