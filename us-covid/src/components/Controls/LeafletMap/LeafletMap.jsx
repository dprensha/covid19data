import React, { PureComponent, Fragment } from 'react'
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import LocateControl from './LocateControl';
import WorldGeo from '../../../mapData/WorldGeo.json';
import USGeo from '../../../mapData/USGeo.json';
import AustraliaGeo from '../../../mapData/AustraliaGeo.json';
import CanadaGeo from '../../../mapData/CanadaGeo.json';
import ChinaGeo from '../../../mapData/ChinaGeo.json';
import USCountyGeo from '../../../mapData/USCountyGeo.json';
import FIPSToState from '../../../utilities/FIPSToState.json';
import styles from './LeafletMap.module.scss';
import './LeafletMap.css';

const propTypes = {
  //from Redux
  entity: PropTypes.object,
  handlePlotClick: PropTypes.func,
  displayDetails: PropTypes.object
}

class LeafletMap extends PureComponent {
  constructor(props) {
    super(props);

    const sortedKeys = Object.keys(this.props.entity.children).sort();
    const activePerThousand = [];
    const stops = [];
    for (let i = 0; i < sortedKeys.length; i++) {
      if (this.props.entity.children[sortedKeys[i]].yActivePerCapita[this.props.entity.children[sortedKeys[i]].yActive.length - 1] * 1000 > 0) {
        activePerThousand.push(this.props.entity.children[sortedKeys[i]].yActivePerCapita[this.props.entity.children[sortedKeys[i]].yActive.length - 1] * 1000);
      }
    }
    const min = Math.min(...activePerThousand);
    const max = Math.max(...activePerThousand);
    const range = max - min;
    for (let j = 0; j < 9; j++) {
      stops[j] = range / 9 * (j + 1);
    }
    // for(let j = 0; j < 9; j++) {
    //   stops[j] = activePerThousand.sort()[((j+1) * sortedKeys.length / 10).toFixed(0)];
    // }
    console.log(stops);
    this.state = {
      lat: 20,
      lng: 0,
      zoom: 2,
      popupText: "",
      selectedEntity: this.props.entity,
      stops: stops,
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
        console.log(property)
      }
    }

    return entity;
  }

  getStyle = (property, FIPSLookup) => {
    const currentEntity = this.getEntity(property);

    const activePerCapita = currentEntity && currentEntity.yActivePerCapita ? currentEntity.yActivePerCapita[currentEntity.yActivePerCapita.length - 1] * 1000 : 0
    let style = { fillColor: "blue", fillOpacity: "0" };
    const { stops } = this.state;

    const stateProvinceCountries = ["US", "Canada", "Australia", "China"]

    if ((this.state.dataLabel === "StateProvince" || this.state.dataLabel === "County") && stateProvinceCountries.includes(property.properties.DISPLAY_NAME)) {

    }

    else {
      const breakpoint = .4;

      if (activePerCapita < breakpoint * 1) { //0-.4
        style = { fillColor: "#0000FF", fillOpacity: ".05" }
      }
      else if (activePerCapita < breakpoint * 2) { //.4-.8
        style = { fillColor: "#0000FF", fillOpacity: ".1" }
      }
      else if (activePerCapita < breakpoint * 3) { //.8-1.2
        style = { fillColor: "#0000FF", fillOpacity: ".2" }
      }
      else if (activePerCapita < breakpoint * 4) { //1.2-1.6
        style = { fillColor: "#0000FF", fillOpacity: ".3" }
      }
      else if (activePerCapita < breakpoint * 5) {
        style = { fillColor: "#0000FF", fillOpacity: ".4" }
      }
      else if (activePerCapita < breakpoint * 6) {
        style = { fillColor: "#0000FF", fillOpacity: ".5" }
      }
      else if (activePerCapita < breakpoint * 7) {
        style = { fillColor: "#0000FF", fillOpacity: ".6" }
      }
      else if (activePerCapita < breakpoint * 8) {
        style = { fillColor: "#0000FF", fillOpacity: ".7" }
      }
      else if (activePerCapita < breakpoint * 9) {
        style = { fillColor: "#0000FF", fillOpacity: ".8" }
      }
      else if (activePerCapita < breakpoint * 10) {
        style = { fillColor: "#0000FF", fillOpacity: ".9" }
      }
      else if (activePerCapita < breakpoint * 11) {
        style = { fillColor: "#B00000", fillOpacity: ".5" }
      }
      else if (activePerCapita < breakpoint * 12) {
        style = { fillColor: "#B00000", fillOpacity: ".55" }
      }
      else if (activePerCapita < breakpoint * 13) {
        style = { fillColor: "#B00000", fillOpacity: ".6" }
      }
      else if (activePerCapita < breakpoint * 14) {
        style = { fillColor: "#B00000", fillOpacity: ".65" }
      }
      else if (activePerCapita < breakpoint * 15) {
        style = { fillColor: "#B00000", fillOpacity: ".7" }
      }
      else if (activePerCapita < breakpoint * 16) {
        style = { fillColor: "#B00000", fillOpacity: ".75" }
      }
      else if (activePerCapita < breakpoint * 17) {
        style = { fillColor: "#B00000", fillOpacity: ".8" }
      }
      else if (activePerCapita < breakpoint * 18) {
        style = { fillColor: "#B00000", fillOpacity: ".85" }
      }
      else {
        style = { fillColor: "#B00000", fillOpacity: ".9" }
      }
    }

    return style;
  };

  onClickThing = (event) => {
    const entity = this.getEntity(event.layer.feature)
    console.log(entity);
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
    console.log(event);

    if (event.zoom >= 6) {
      this.setState({
        dataLabel: "County"
      })
    }
    if (event.zoom === 4 || event.zoom === 5) {
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
    if (formatMagnitude && Math.abs(Number(value)) >= 1.0e+6) {
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
      const title =
        tooltipContent = (
          <table className={styles.popupTable}>
            <tbody>
              <tr>
                <td colSpan="2" className={styles.popupTitle}>{this.state.selectedEntity.title}{this.state.selectedEntity.parent && this.state.selectedEntity.parent.title !== "World" ? `, ${this.state.selectedEntity.parent.title}` : ""}</td>
              </tr>
              <tr>
                <td>
                  Active Cases
                </td>
                <td className={styles.popupValue}>
                  {this.addThousandSeparators(this.state.selectedEntity.yActive[this.state.selectedEntity.yActive.length - 1], false)}
                </td>
              </tr>
              <tr>
                <td>
                  Active Cases Per 1,000
                </td>
                <td className={styles.popupValue}>
                  {this.addThousandSeparators(this.state.selectedEntity.yActivePerCapita[this.state.selectedEntity.yActive.length - 1] * 1000, false)}
                </td>
              </tr>
              <tr>
                <td>
                  Total Cases
                </td>
                <td className={styles.popupValue}>
                  {this.addThousandSeparators(this.state.selectedEntity.yConfirmed[this.state.selectedEntity.yConfirmed.length - 1], true)}
                </td>
              </tr>
              <tr>
                <td>
                  Deaths
                </td>
                <td className={styles.popupValue}>
                  {this.addThousandSeparators(this.state.selectedEntity.yDeaths[this.state.selectedEntity.yDeaths.length - 1])}
                </td>
              </tr>
              <tr>
                <td>
                  Mortality Rate
                </td>
                <td className={styles.popupValue}>
                  {this.formatPercentage((this.state.selectedEntity.yDeaths[this.state.selectedEntity.yDeaths.length - 1]) / (this.state.selectedEntity.yConfirmed[this.state.selectedEntity.yConfirmed.length - 1]) * 100)}
                </td>
              </tr>
            </tbody>
          </table>
        )
    }

    let data = WorldGeo;
    let zoom = 3;
    let lat = 20;
    let long = 0;
    // switch (this.props.entity.title) {
    //   case "United States":
    //     data = USGeo;
    //     zoom = 5;
    //     lat = 38;
    //     long = -94;
    //     break;
    //   case "Australia":
    //     data = AustraliaGeo;
    //     zoom = 4;
    //     lat = -26;
    //     long = 135;
    //     break;
    //   case "Canada":
    //     data = CanadaGeo;
    //     zoom = 4;
    //     lat = 60;
    //     long = -95;
    //     break;
    //   case "China":
    //     data = ChinaGeo;
    //     zoom = 4;
    //     lat = 34;
    //     long = 104
    //     break;
    // }
    // if (this.props.entity.parent && this.props.entity.parent.title === "United States") {
    //   data = USCountyGeo;
    //   zoom = 5;
    //   lat = 38;
    //   long = -94;
    // }

    const locateOptions = {
      position: 'topleft',
      flyTo: false,
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
          url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHByZW5zaGF3IiwiYSI6ImNrZGIwY3kzeTB5cHoydXBkOXBhN2F5MzIifQ.yG_odeS3UupdDhn9hVfwTw"
        //tileSize="512"
        //zoomOffset="-1"
        />
        <GeoJSON key={this.state.dataLabel} data={WorldGeo} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
          <Popup style={{ backgroundColor: "red" }}>
            {tooltipContent}
          </Popup>
        </GeoJSON>
        {stateProvince}
        <LocateControl options={locateOptions} />
      </Map>
    )
  }
}
LeafletMap.propTypes = propTypes;
export default LeafletMap;