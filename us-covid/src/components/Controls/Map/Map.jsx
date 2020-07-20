import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
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
        <ComposableMap data-tip="" projectionConfig={{ scale: 160 }} >
          <ZoomableGroup
          center={coordinates}
          zoom={2}
          >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME, POP_EST } = geo.properties;
                    setContent(`${NAME} - ${rounded(POP_EST)}`);
                  }}
                  onMouseLeave={() => {
                    setContent("");
                  }}
                  style={{
                    default: {
                      fill: `${(geo.properties.NAME_LONG === countryName) ? "rgb(255,85,51)" : "#D6D6DA"}`,
                      outline: "none",
                      stroke: `${(geo.properties.NAME_LONG === countryName) ? "none" : "#BBB"}`,
                      strokeWidth: `${(geo.properties.NAME_LONG === countryName) ? "none" : "1px"}`,
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
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