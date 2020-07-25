import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  CanvasMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";



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
  const coordinates = [long, lat];
  let center = coordinates;
  let geoURL = null;

switch (parentEntityName) {
  case "World": 
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
    break;
  case "Canada": 
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/CanadaTopo.json";
    center = [-94.245, 56.728]
    break;
  case "Australia":
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/AustraliaTopo.json";
    center = [136.423, -25.986];
    break;
  default:
    geoURL = "https://raw.githubusercontent.com/dprensha/covid19data/InfoMap/topoData/WorldTopo.json";
    break;
}

  return (
    <>
      <div style={{width: width, margin: "auto"}}>
        <ComposableMap data-tip="" projectionConfig={{ scale: 160 }} height={200} width={400} >
          <ZoomableGroup
          center={center}
          zoom={2}
          >
          <Geographies geography={geoURL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  // onMouseEnter={() => {
                  //   const { NAME, POP_EST } = geo.properties;
                  //   setContent(`${NAME} - ${rounded(POP_EST)}`);
                  // }}
                  // onMouseLeave={() => {
                  //   setContent("");
                  // }}
                  style={{
                    default: {
                      fill: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      outline: "none",
                      stroke: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : ".5px"}`,
                    },
                    hover: {
                      fill: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : ".5px"}`,
                      outline: "none"
                    },
                    pressed: {
                      fill: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG || geo.properties.NAME_1 === entityName) ? "none" : ".5px"}`,
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