import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  CanvasMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "B";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const Map = ({ width, countryName, long, lat }) => {
  const [content, setContent] = useState("");
  const coordinates = [long, lat];
  return (
    <>
      <div style={{width: width, margin: "auto"}}>
        <ComposableMap data-tip="" projectionConfig={{ scale: 160 }} height={200} width={400} >
          <ZoomableGroup
          center={coordinates}
          zoom={1}
          >
          <Geographies geography={geoUrl}>
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
                      fill: `${(geo.properties.NAME_LONG === countryName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      outline: "none",
                      stroke: `${(geo.properties.NAME_LONG === countryName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG === countryName) ? "none" : ".5px"}`,
                    },
                    hover: {
                      fill: `${(geo.properties.NAME_LONG === countryName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.NAME_LONG === countryName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG === countryName) ? "none" : ".5px"}`,
                      outline: "none"
                    },
                    pressed: {
                      fill: `${(geo.properties.NAME_LONG === countryName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      stroke: `${(geo.properties.NAME_LONG === countryName) ? "none" : "#FFF"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG === countryName) ? "none" : ".5px"}`,
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={coordinates}>
            <circle r={4} fill="#F53" />
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