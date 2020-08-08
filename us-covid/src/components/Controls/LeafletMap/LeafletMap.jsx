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

  getStyle = (property, FIPSLookup) => {
    //console.log(property);
    let currentEntity = this.props.entity.children[property.properties.DISPLAY_NAME];

    if(property.properties.NAME_0 === "Canada") {
      currentEntity = this.props.entity.children["Canada"].children[property.properties.DISPLAY_NAME]
    }

    else if(property.properties.STUSPS) { //USState
      currentEntity = this.props.usCases.children[property.properties.DISPLAY_NAME];
    }

    else if(property.properties.NAME_0 === "China") {
      currentEntity = this.props.entity.children["China"].children[property.properties.DISPLAY_NAME]
    }

    else if(property.properties.NAME_0 === "Australia") {
      currentEntity = this.props.entity.children["Australia"].children[property.properties.DISPLAY_NAME]
    }

    else if(property.properties.COUNTYFP) { //USCounty
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
     if(this.props.usCases.children[FIPSLookup[parseInt(property.properties.STATEFP)]]){
      currentEntity = this.props.usCases.children[FIPSLookup[parseInt(property.properties.STATEFP)]].children[property.properties.DISPLAY_NAME];
     }
     else {
       console.log(property)
     }
    }

    const activePerCapita = currentEntity && currentEntity.yActivePerCapita ? currentEntity.yActivePerCapita[currentEntity.yActivePerCapita.length - 1] * 1000 : 0
    let style = { fillColor: "blue", fillOpacity: "0" };
    const { stops } = this.state;

    const stateProvinceCountries = ["US", "Canada", "Australia", "China"]

    if ((this.state.dataLabel === "StateProvince" || this.state.dataLabel === "County") && stateProvinceCountries.includes(property.properties.DISPLAY_NAME)) {
      
    }
    
    else {

      if (activePerCapita < stops[0]) {
        style = { fillColor: "#0000FF", fillOpacity: ".05" }
      }
      else if (activePerCapita < stops[1]) {
        style = { fillColor: "#0000FF", fillOpacity: ".1" }
      }
      else if (activePerCapita < stops[2]) {
        style = { fillColor: "#0000FF", fillOpacity: ".2" }
      }
      else if (activePerCapita < stops[3]) {
        style = { fillColor: "#0000FF", fillOpacity: ".3" }
      }
      else if (activePerCapita < stops[4]) {
        style = { fillColor: "#0000FF", fillOpacity: ".4" }
      }
      else if (activePerCapita < stops[5]) {
        style = { fillColor: "#0000FF", fillOpacity: ".5" }
      }
      else if (activePerCapita < stops[6]) {
        style = { fillColor: "#0000FF", fillOpacity: ".6" }
      }
      else if (activePerCapita < stops[7]) {
        style = { fillColor: "#0000FF", fillOpacity: ".73" }
      }
      else {
        style = { fillColor: "#0000FF", fillOpacity: ".86" }
      }
    }

    return style;
  };

  onClickThing = (event) => {
    this.setState({
      selectedEntity: this.props.entity.children[event.layer.feature.properties.DISPLAY_NAME] ? this.props.entity.children[event.layer.feature.properties.DISPLAY_NAME] : {
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


  render() {
    let tooltipContent = "No data available";
    if (this.state.selectedEntity && this.state.selectedEntity.yActive) {
      tooltipContent = (
        <table>
          <tbody>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>{this.state.selectedEntity.title}</td>
            </tr>
            <tr>
              <td>
                Active Cases
                </td>
              <td>
                {this.state.selectedEntity.yActive[this.state.selectedEntity.yActive.length - 1]}
              </td>
            </tr>
            <tr>
              <td>
                Active Cases Per 1,000
                </td>
              <td>
                {this.state.selectedEntity.yActivePerCapita[this.state.selectedEntity.yActive.length - 1] * 1000}
              </td>
            </tr>
            <tr>
              <td>
                Total Cases
                </td>
              <td>
                {this.state.selectedEntity.yConfirmed[this.state.selectedEntity.yConfirmed.length - 1]}
              </td>
            </tr>
            <tr>
              <td>
                Deaths
                </td>
              <td>
                {this.state.selectedEntity.yDeaths[this.state.selectedEntity.yDeaths.length - 1]}
              </td>
            </tr>
            <tr>
              <td>
                Mortality Rate
                </td>
              <td>
                {(this.state.selectedEntity.yDeaths[this.state.selectedEntity.yDeaths.length - 1]) / (this.state.selectedEntity.yConfirmed[this.state.selectedEntity.yConfirmed.length - 1]) * 100}
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