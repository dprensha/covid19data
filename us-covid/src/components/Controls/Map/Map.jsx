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
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".5px"}`,
                    },
                    hover: {
                      fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".5px"}`,
                      outline: "none"
                    },
                    pressed: {
                      fill: `${(geo.properties.DISPLAY_NAME === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.DISPLAY_NAME === entityName) ? "none" : ".5px"}`,
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
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {/* <span>{content}</span> */}
    </>
  );
};

//Map.propTypes = propTypes;
export default Map;
