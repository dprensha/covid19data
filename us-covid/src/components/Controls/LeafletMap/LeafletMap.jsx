import React, { PureComponent, Fragment } from 'react'
import PropTypes from "prop-types";
import { Map, TileLayer, Popup, GeoJSON } from 'react-leaflet';
import D3Plot from '../D3Plot/D3Plot';
import ReactLeafletSearch from "react-leaflet-search";
import LocateControl from './LocateControl';
import WorldGeo from '../../../mapData/WorldGeo.json';
import USGeo from '../../../mapData/USGeo.json';
import AustraliaGeo from '../../../mapData/AustraliaGeo.json';
import CanadaGeo from '../../../mapData/CanadaGeo.json';
import ChinaGeo from '../../../mapData/ChinaGeo.json';
import USCountyGeo from '../../../mapData/USCountyGeo.json';
import styles from './LeafletMap.module.scss';
import './LeafletMap.css';

const propTypes = {
  //from Redux
  entity: PropTypes.object,
  handlePlotClick: PropTypes.func,
  displayDetails: PropTypes.object,
  visualizationMode: PropTypes.string,
  visualizationTitle: PropTypes.string,
  breakpoint: PropTypes.number,
  scaleIncludesNegatives: PropTypes.bool,
  scaleIsExponential: PropTypes.bool,
  dateIndex: PropTypes.number
}

class LeafletMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lat: 20,
      lng: 0,
      zoom: 2,
      popupText: "",
      selectedEntity: this.props.entity,
      dataLabel: "World"
    }

    this.getStyle = this.getStyle.bind(this);
  }

  getEntity = (property) => {
    let entity = this.props.entity.children[property.properties.DISPLAY_NAME];

    if (property.properties.NAME_0 === "Canada") {
      entity = this.props.entity.children["Canada"].children[property.properties.DISPLAY_NAME]
    }

    else if (property.properties.STUSPS) { //USState
      entity = this.props.usCases.children[property.properties.DISPLAY_NAME];
    }

    else if (property.properties.NAME_0 === "China") {
      entity = this.props.entity.children["China"].children[property.properties.DISPLAY_NAME]
    }

    else if (property.properties.NAME_0 === "Australia") {
      entity = this.props.entity.children["Australia"].children[property.properties.DISPLAY_NAME]
    }

    else if (property.properties.COUNTYFP) { //USCounty
      const FIPSLookup = {
        "1": "Alabama",
        "2": "Alaska",
        "4": "Arizona",
        "5": "Arkansas",
        "6": "California",
        "8": "Colorado",
        "9": "Connecticut",
        "10": "Delaware",
        "11": "District of Columbia",
        "12": "Florida",
        "13": "Georgia",
        "15": "Hawaii",
        "16": "Idaho",
        "17": "Illinois",
        "18": "Indiana",
        "19": "Iowa",
        "20": "Kansas",
        "21": "Kentucky",
        "22": "Louisiana",
        "23": "Maine",
        "24": "Maryland",
        "25": "Massachusetts",
        "26": "Michigan",
        "27": "Minnesota",
        "28": "Mississippi",
        "29": "Missouri",
        "30": "Montana",
        "31": "Nebraska",
        "32": "Nevada",
        "33": "New Hampshire",
        "34": "New Jersey",
        "35": "New Mexico",
        "36": "New York",
        "37": "North Carolina",
        "38": "North Dakota",
        "39": "Ohio",
        "40": "Oklahoma",
        "41": "Oregon",
        "42": "Pennsylvania",
        "44": "Rhode Island",
        "45": "South Carolina",
        "46": "South Dakota",
        "47": "Tennessee",
        "48": "Texas",
        "49": "Utah",
        "50": "Vermont",
        "51": "Virginia",
        "53": "Washington",
        "54": "West Virginia",
        "55": "Wisconsin",
        "56": "Wyoming",
        "60": "American Samoa",
        "66": "Guam",
        "69": "Northern Mariana Islands",
        "72": "Puerto Rico",
        "78": "Virgin Islands"
      };
      if (this.props.usCases.children[FIPSLookup[parseInt(property.properties.STATEFP)]]) {
        entity = this.props.usCases.children[FIPSLookup[parseInt(property.properties.STATEFP)]].children[property.properties.DISPLAY_NAME];
      }
      else {
        //Couldn't find the property
        //console.log(property)
      }
    }

    return entity;
  }

  getStyle = (property) => {
    const currentEntity = this.getEntity(property);
    const breakpoint = this.props.breakpoint;
    let visualizationMetric = 0;

    if (this.props.visualizationMode === "activePerCapita") {
      visualizationMetric = currentEntity && currentEntity.yActivePerCapita ? currentEntity.yActivePerCapita[this.props.dateIndex] * 1000 : 0 //activePerCapita
    }

    else if (this.props.visualizationMode === "active") {
      visualizationMetric = currentEntity ? (currentEntity.yActive[this.props.dateIndex]): 0; //active
    }

    else if (this.props.visualizationMode === "mortalityRate") {
      visualizationMetric = currentEntity ? (currentEntity.yDeaths[this.props.dateIndex]) / (currentEntity.yConfirmed[this.props.dateIndex]) * 100 : 0; //mortalityRate
    }

    else if (this.props.visualizationMode === "totalPerCapita") {
      visualizationMetric = currentEntity ? (currentEntity.yConfirmed[this.props.dateIndex] / currentEntity.population * 1000) : 0; //total
    }

    else if (this.props.visualizationMode === "total") {
      visualizationMetric = currentEntity ? (currentEntity.yConfirmed[this.props.dateIndex]) : 0; //total
    }

    else if (this.props.visualizationMode === "deathsPerCapita") {
      visualizationMetric = currentEntity ? (currentEntity.yDeaths[this.props.dateIndex] / currentEntity.population * 100000) : 0; //deaths
    }

    else if (this.props.visualizationMode === "deaths") {
      visualizationMetric = currentEntity ? (currentEntity.yDeaths[this.props.dateIndex]) : 0; //deaths
    }

    else if(this.props.visualizationMode === "activeChangeSevenDay") {
      const keyValue = currentEntity ? currentEntity.yActive[this.props.dateIndex] : 0;
      const baselineValue = currentEntity ? currentEntity.yActive[this.props.dateIndex - 7] : 1;
      visualizationMetric = currentEntity ? (keyValue - baselineValue) / baselineValue * 100 : 0; 
    }

    else if (this.props.visualizationMode === "activeChangeFourteenDay") {
      const keyValue = currentEntity ? currentEntity.yActive[this.props.dateIndex ] : 0;
      const baselineValue = currentEntity ? currentEntity.yActive[this.props.dateIndex - 14] : 1;
      visualizationMetric = currentEntity ? (keyValue - baselineValue) / baselineValue * 100 : 0;
    }


    //const activePerCapita = currentEntity && currentEntity.yConfirmed ? currentEntity.yConfirmed[currentEntity.yConfirmed.length - 1] / parseInt(currentEntity.population) * 1000 : 0;
    let style = { fillColor: "blue", fillOpacity: "0" };

    const positiveScaleCompareValue = (num) => {
      return this.props.scaleIsExponential ? Math.pow(breakpoint * num, 3) : breakpoint * num;
    };
    const stateProvinceCountries = ["US", "Canada", "Australia", "China"];

    if ((this.state.dataLabel === "StateProvince" || this.state.dataLabel === "County") && stateProvinceCountries.includes(property.properties.DISPLAY_NAME)) {

    }

    else {
      if(this.props.scaleIncludesNegatives === false) {
        if (visualizationMetric < positiveScaleCompareValue(1)) { //0-.4
          style = { fillColor: "#0000B0", fillOpacity: ".05" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(2)) { //.4-.8
          style = { fillColor: "#0000B0", fillOpacity: ".1" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(3)) { //.8-1.2
          style = { fillColor: "#0000B0", fillOpacity: ".2" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(4)) { //1.2-1.6
          style = { fillColor: "#0000B0", fillOpacity: ".3" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(5)) {
          style = { fillColor: "#0000B0", fillOpacity: ".4" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(6)) {
          style = { fillColor: "#0000B0", fillOpacity: ".5" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(7)) {
          style = { fillColor: "#0000B0", fillOpacity: ".6" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(8)) {
          style = { fillColor: "#0000B0", fillOpacity: ".7" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(9)) {
          style = { fillColor: "#0000B0", fillOpacity: ".8" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(10)) {
          style = { fillColor: "#0000B0", fillOpacity: ".9" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(11)) {
          style = { fillColor: "#B00000", fillOpacity: ".45" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(12)) {
          style = { fillColor: "#B00000", fillOpacity: ".5" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(13)) {
          style = { fillColor: "#B00000", fillOpacity: ".55" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(14)) {
          style = { fillColor: "#B00000", fillOpacity: ".6" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(15)) {
          style = { fillColor: "#B00000", fillOpacity: ".65" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(16)) {
          style = { fillColor: "#B00000", fillOpacity: ".7" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(17)) {
          style = { fillColor: "#B00000", fillOpacity: ".75" }
        }
        else if (visualizationMetric < positiveScaleCompareValue(18)) {
          style = { fillColor: "#B00000", fillOpacity: ".8" }
        }
        else if (visualizationMetric >= breakpoint * 18) {
          style = { fillColor: "#B00000", fillOpacity: ".85" }
        }
      }
      else {
        if (visualizationMetric < -breakpoint * 9) { //-112.5
          style = { fillColor: "#00B000", fillOpacity: ".95" }
        }
        else if (visualizationMetric < -breakpoint * 8) { //-100
          style = { fillColor: "#00B000", fillOpacity: ".85" }
        }
        else if (visualizationMetric < -breakpoint * 7) { //-87.5
          style = { fillColor: "#00B000", fillOpacity: ".75" }
        }
        else if (visualizationMetric < -breakpoint * 6) { //-75
          style = { fillColor: "#00B000", fillOpacity: ".65" }
        }
        else if (visualizationMetric < -breakpoint * 5) {
          style = { fillColor: "#00B000", fillOpacity: ".55" }
        }
        else if (visualizationMetric < -breakpoint * 4) {
          style = { fillColor: "#00B000", fillOpacity: ".45" }
        }
        else if (visualizationMetric < -breakpoint * 3) {
          style = { fillColor: "#00B000", fillOpacity: ".35" }
        }
        else if (visualizationMetric < -breakpoint * 2) {
          style = { fillColor: "#00B000", fillOpacity: ".25" }
        }
        else if (visualizationMetric <  -breakpoint * 1) {
          style = { fillColor: "#00B000", fillOpacity: ".15" }
        }
        else if (visualizationMetric === 0 ){
          style = { fillColor: "#00B000", fillOpacity: "0"}
        }
        else if (visualizationMetric <  0) {
          style = { fillColor: "#00B000", fillOpacity: ".1" }
        }
        else if (visualizationMetric < breakpoint * 1) {
          style = { fillColor: "#B00000", fillOpacity: ".2" }
        }
        else if (visualizationMetric < breakpoint * 2) {
          style = { fillColor: "#B00000", fillOpacity: ".3" }
        }
        else if (visualizationMetric < breakpoint * 3) {
          style = { fillColor: "#B00000", fillOpacity: ".4" }
        }
        else if (visualizationMetric < breakpoint * 4) {
          style = { fillColor: "#B00000", fillOpacity: ".5" }
        }
        else if (visualizationMetric < breakpoint * 5) {
          style = { fillColor: "#B00000", fillOpacity: ".6" }
        }
        else if (visualizationMetric < breakpoint * 6) {
          style = { fillColor: "#B00000", fillOpacity: ".7" }
        }
        else if (visualizationMetric < breakpoint * 7) {
          style = { fillColor: "#B00000", fillOpacity: ".8" }
        }
        else if (visualizationMetric < breakpoint * 8) {
          style = { fillColor: "#B00000", fillOpacity: ".9" }
        }
        else if (visualizationMetric >= breakpoint * 8) {
          style = { fillColor: "#B00000", fillOpacity: ".98" }
        }
      }
    }

    return style;
  };

  onClickThing = (event) => {
    const entity = this.getEntity(event.layer.feature)

    this.setState({
      selectedEntity: entity ? entity : {
        yActivePerCapita: [0],
        yConfirmed: [0],
        yActive: [0],
        yDeaths: [0],
        title: event.layer.feature.properties.DISPLAY_NAME
      }
    })
  }

  onViewportChanged = (event) => {
    if (event.zoom >= 5) {
      this.setState({
        dataLabel: "County"
      })
    }
    if (event.zoom === 4) {
      this.setState({
        dataLabel: "StateProvince"
      })
    }
    if (event.zoom < 4) {
      this.setState({
        dataLabel: "World"
      })
    }
  }

  addThousandSeparators(value, formatMagnitude) {
    if(!value) { value = 0 }
    if (formatMagnitude && Math.abs(Number(value)) >= 1.0e+9) {
      return `${((Math.round(value / 1000)) / 1000000).toFixed(2)} B`;
    }
    else if (formatMagnitude && Math.abs(Number(value)) >= 1.0e+6) {
      return `${((Math.round(value / 1000)) / 1000).toFixed(2)} M`;
    }
    // else if(formatMagnitude && Math.abs(Number(value)) >= 1.0e+3) {
    //     return `${(Math.round(value / 1.0e+3))} K`;
    // }
    else if (Math.abs(Number(value)) < 1000) {
      return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    else {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  formatPercentage(value) {
    const percentage = Math.round((isNaN(value) ? 0 : value + Number.EPSILON) * 100) / 100;
    return `${this.addThousandSeparators(percentage)}%`;
  }


  render() {
    let tooltipContent = "No data available";
    if (this.state.selectedEntity && this.state.selectedEntity.yActive) {
      const keyValue = this.state.selectedEntity.yActive[this.props.dateIndex];
      const baselineValueSeven = this.state.selectedEntity.yActive[this.props.dateIndex - 7];
      const baselineValueFourteen = this.state.selectedEntity.yActive[this.props.dateIndex - 14];
      let yValue = this.state.selectedEntity.yActive;
      let title = this.props.visualizationTitle;

      if (this.props.visualizationMode === "activePerCapita") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yActivePerCapita.map((val) => val * 1000): []; //activePerCapita
      }
  
      else if (this.props.visualizationMode === "active") {
        yValue = this.state.selectedEntity ? (this.state.selectedEntity.yActive): []; //active
        title = "Active Cases";
      }
  
      else if (this.props.visualizationMode === "mortalityRate") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yDeaths : []; //deaths
        title = "Deaths";
      }
  
      else if (this.props.visualizationMode === "totalPerCapita") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yConfirmed.map((val) => val/this.state.selectedEntity.population * 1000): []; //totalPerCapita
        title = "Total Cases";
      }
  
      else if (this.props.visualizationMode === "total") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yConfirmed : []; //total
        title = "Total Cases";
      }
  
      else if (this.props.visualizationMode === "deathsPerCapita") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yDeaths.map((val) => val/this.state.selectedEntity.population * 100000): []; //deathsPerCapita
      }
  
      else if (this.props.visualizationMode === "deaths") {
        yValue = this.state.selectedEntity ? this.state.selectedEntity.yDeaths : []; //deaths
        title = "Deaths";
      }
  
      else if(this.props.visualizationMode === "activeChangeSevenDay") {
        yValue = this.state.selectedEntity ? (this.state.selectedEntity.yActive): []; //active
        title = "Active Cases";
      }
  
      else if (this.props.visualizationMode === "activeChangeFourteenDay") {
        yValue = this.state.selectedEntity ? (this.state.selectedEntity.yActive): []; //active
        title = "Active Cases";
      }

      tooltipContent = (
        <div>
          <div className={styles.plotTitle}>
            {this.state.selectedEntity.title}
          </div>
          <div className={styles.plotLabel}>{title}</div>
          <D3Plot
              id={this.state.selectedEntity.navigableTitle}
              data={this.state.selectedEntity}
              x={this.state.selectedEntity.x}
              y={yValue}
              width={200}
              height={100}
              tickInterval={4}
              scaleMode={"linear"}
          />
        </div>
      );

      // tooltipContent = (
      //   <table className={styles.popupTable}>
      //     <tbody>
      //       <tr>
      //         <td colSpan="2" className={styles.popupTitle}>{this.state.selectedEntity.title}{this.state.selectedEntity.parent && this.state.selectedEntity.parent.title !== "World" ? `, ${this.state.selectedEntity.parent.title}` : ""}</td>
      //       </tr>
      //       <tr>
      //       <td>
      //           Population
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.addThousandSeparators(this.state.selectedEntity.population, true)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "active" ? {fontWeight: "bold"} : {}}>
      //       <td>
      //           Active Cases
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.addThousandSeparators(this.state.selectedEntity.yActive[this.props.dateIndex], false)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "activeChangeSevenDay" ? {fontWeight: "bold"} : {}}>
      //         <td>
      //           Active Cases 7-Day Change
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.formatPercentage((keyValue - baselineValueSeven) / baselineValueSeven * 100)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "activeChangeFourteenDay" ? {fontWeight: "bold"} : {}}>
      //       <td>
      //           Active Cases 14-Day Change
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.formatPercentage((keyValue - baselineValueFourteen) / baselineValueFourteen * 100)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "activePerCapita" ? {fontWeight: "bold"} : {}}>
      //       <td>
      //           Active Cases Per 1,000
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.addThousandSeparators(this.state.selectedEntity.yActivePerCapita[this.props.dateIndex] * 1000, false)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "total" ? {fontWeight: "bold"} : {}}>
      //         <td>
      //           Total Cases
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.addThousandSeparators(this.state.selectedEntity.yConfirmed[this.props.dateIndex], true)}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "deaths" ? {fontWeight: "bold"} : {}}>
      //         <td>
      //           Deaths
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.addThousandSeparators(this.state.selectedEntity.yDeaths[this.props.dateIndex])}
      //         </td>
      //       </tr>
      //       <tr style={this.props.visualizationMode === "mortalityRate" ? {fontWeight: "bold"} : {}}>
      //       <td>
      //           Mortality Rate
      //           </td>
      //         <td className={styles.popupValue}>
      //           {this.formatPercentage((this.state.selectedEntity.yDeaths[this.props.dateIndex]) / (this.state.selectedEntity.yConfirmed[this.props.dateIndex]) * 100)}
      //         </td>
      //       </tr>
      //     </tbody>
      //   </table>
      // )
    }

    let zoom = 3;
    let lat = 20;
    let long = 0;

    const locateOptions = {
      position: 'topleft',
      flyTo: false,
      drawCircle: false,
      //keepCurrentZoomLevel: false,
      initialZoomLevel: 9,
      strings: {
        title: 'Show my location'
      },
      //onActivate: () => {} // callback before engine starts retrieving locations
    }

    const position = [lat, long]

    let stateProvince = null;
    if (this.state.dataLabel === "StateProvince" || this.state.dataLabel === "County") {
      let us = null;
      if (this.state.dataLabel === "StateProvince") {
        us = (
          <GeoJSON key={`${this.state.dataLabel}2`} data={USGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
            <Popup>
              {tooltipContent}
            </Popup>
          </GeoJSON>
        );
      }
      else {
        us = (
          <GeoJSON key={`${this.state.dataLabel}2`} data={USCountyGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
            <Popup>
              {tooltipContent}
            </Popup>
          </GeoJSON>
        )
      }
      stateProvince = (
        <Fragment>
          <GeoJSON key={`${this.state.dataLabel}1`} data={CanadaGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
            <Popup>
              {tooltipContent}
            </Popup>
          </GeoJSON>
          {us}
          <GeoJSON key={`${this.state.dataLabel}3`} data={AustraliaGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
            <Popup>
              {tooltipContent}
            </Popup>
          </GeoJSON>
          <GeoJSON key={`${this.state.dataLabel}4`} data={ChinaGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
            <Popup>
              {tooltipContent}
            </Popup>
          </GeoJSON>
        </Fragment>
      )
    }

    return (
      <Map center={position} zoom={zoom} height={this.props.height} style={{ height: this.props.height }} onViewportChanged={this.onViewportChanged}
      >
        <TileLayer
          attribution='&amp;copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10">Improve this map</a>'
          //url={`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
          url={`https://api.mapbox.com/styles/v1/dprenshaw/ckdozligj063s1ipgxn71uizr/tiles/256/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        //mapbox://styles/dprenshaw/ckdozligj063s1ipgxn71uizr

        />

        <GeoJSON key={this.state.dataLabel} data={WorldGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
          <Popup style={{ backgroundColor: "red" }}>
            {tooltipContent}
          </Popup>
        </GeoJSON>
        {stateProvince}
        <LocateControl options={locateOptions} />
        <ReactLeafletSearch
          position="topleft"
          inputPlaceholder="Search for a place"
          showMarker={true}
          zoom={7}
          showPopup={false}
          closeResultsOnClick={true}
          openSearchOnLoad={false}
        />
      </Map>
    )
  }
}
LeafletMap.propTypes = propTypes;
export default LeafletMap;