import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import WorldGeo from '../../../../mapData/WorldGeo.json';
import USGeo from '../../../../mapData/USGeo.json';
import AustraliaGeo from '../../../../mapData/AustraliaGeo.json';
import CanadaGeo from '../../../../mapData/CanadaGeo.json';
import ChinaGeo from '../../../../mapData/ChinaGeo.json';
import USCountyGeo from '../../../../mapData/USCountyGeo.json';

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
      console.log(this.props.entity.children[sortedKeys[i]].title);
      if (this.props.entity.children[sortedKeys[i]].yActivePerCapita[this.props.entity.children[sortedKeys[i]].yActive.length - 1] * 1000 > 0) {
        activePerThousand.push(this.props.entity.children[sortedKeys[i]].yActivePerCapita[this.props.entity.children[sortedKeys[i]].yActive.length - 1] * 1000);
      }
    }
    const min = Math.min(...activePerThousand);
    const max = Math.max(...activePerThousand);
    const range = max - min;
    for(let j = 0; j < 6; j++) {
      stops[j] = range / 6 * (j+1);
    }
    
    this.state = {
      lat: 20,
      lng: 0,
      zoom: 2,
      popupText: "",
      selectedEntity: this.props.entity,
      stops: stops
    }
  }

  getStyle = (property) => {
    // if (property.properties.DISPLAY_NAME === "Tennessee") {
    //   return { fillColor: "orange", fillOpacity: ".4" };
    // }
    // else return { fillColor: "blue", fillOpacity: ".2" }
    const currentEntity = this.props.entity.children[property.properties.DISPLAY_NAME];
    const activePerCapita = currentEntity && currentEntity.yActivePerCapita ? currentEntity.yActivePerCapita[this.state.selectedEntity.yActive.length - 1] * 1000 : 0
    let style = { fillColor: "blue", fillOpacity: "0" };
    const { stops } = this.state;

    if(activePerCapita < stops[0]) {
      style = { fillColor: "blue", fillOpacity: ".1" }
    }
    else if(activePerCapita < stops[1]) {
      style = { fillColor: "blue", fillOpacity: ".2" }
    }
    else if(activePerCapita < stops[2]) {
      style = { fillColor: "blue", fillOpacity: ".3" }
    }
    else if(activePerCapita < stops[3]) {
      style = { fillColor: "blue", fillOpacity: ".4" }
    }
    else if(activePerCapita < stops[4]) {
      style = { fillColor: "blue", fillOpacity: ".5" }
    }
    else {
      style = { fillColor: "blue", fillOpacity: ".6" }
    }

    return style;
  };

  onClickThing = (event) => {

    this.setState({
      popupText: event.layer.feature.properties.DISPLAY_NAME,
      selectedEntity: this.props.entity.children[event.layer.feature.properties.DISPLAY_NAME]
    })
  }




  render() {
    



    let tooltipContent = "No data available";
    if (this.state.selectedEntity) {
      tooltipContent = (
        <table>
          <tbody>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>{this.state.popupText}</td>
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
    let zoom = 1;
    let lat = 0;
    let long = 20;
    switch (this.props.entity.title) {
      case "United States":
        data = USGeo; 
        zoom = 5;
        lat = 38;
        long = -94;
        break;
      case "Australia":
        data = AustraliaGeo; 
        zoom = 4;
        lat = -26;
        long = 135;
        break;
      case "Canada":
        data = CanadaGeo; 
        zoom = 4;
        lat = 60;
        long = -95;
        break;
      case "China":
        data = ChinaGeo; 
        zoom = 4;
        lat = 34;
        long = 104
        break;
    }
    if (this.props.entity.parent && this.props.entity.parent.title === "United States") {
      data = USCountyGeo;
      zoom = 5;
      lat = 38;
      long = -94;
    }

    const position = [lat, long]
    return (
      <Map center={position} zoom={zoom} height={this.props.height} style={{ height: this.props.height }}>
        <TileLayer
          attribution='&amp;copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10">Improve this map</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHByZW5zaGF3IiwiYSI6ImNrZGIwY3kzeTB5cHoydXBkOXBhN2F5MzIifQ.yG_odeS3UupdDhn9hVfwTw"
        />
        {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        <GeoJSON data={data} style={this.getStyle} onclick={this.onClickThing} weight={.5}>
          <Popup>
            {tooltipContent}
          </Popup>
        </GeoJSON>
      </Map>
    )
  }
}
LeafletMap.propTypes = propTypes;
export default LeafletMap;