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
      geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/TN_counties.json";
      center = [-86, 36];
      zoom = 16;
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
              geographies.map(geo => (
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
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".08px"}`,
                    },
                    hover: {
                      fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".08px"}`,
                      outline: "none"
                    },
                    pressed: {
                      fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".08px"}`,
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
          {/* <Marker coordinates={coordinates}>
            <circle r={2} fill="#F53" />
          </Marker> */}
          {pointsList}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {/* <span>{content}</span> */}
    </>
  );
};

//Map.propTypes = propTypes;
export default Map;
