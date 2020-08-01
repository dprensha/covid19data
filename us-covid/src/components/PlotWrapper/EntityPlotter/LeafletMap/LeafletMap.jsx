import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import WorldGeo from '../../../../mapData/WorldGeo.json';
import USGeo from '../../../../mapData/USGeo.json';

const propTypes = {
  //from Redux
  entity: PropTypes.object,
  handlePlotClick: PropTypes.func,
  displayDetails: PropTypes.object
}

class LeafletMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lat: 20, 
      lng: 0,
      zoom: 2,
      popupText: "",
      selectedEntity: this.props.entity
    }
  }

  getStyle = (property) => {
    if(property.properties.DISPLAY_NAME === "Tennessee") {
    return {fillColor: "orange", fillOpacity: ".6"};
    }
    else return {fillColor: "blue", fillOpacity: ".2"}
  };

  onClickThing = (event) => {

    this.setState({
      popupText: event.layer.feature.properties.DISPLAY_NAME,
      selectedEntity: this.props.entity.children[event.layer.feature.properties.DISPLAY_NAME]
    })
  }

  

  
  render() {

    let tooltipContent = "No data available";
    if(this.state.selectedEntity) {
      tooltipContent = (
<table>
              <tbody>
              <tr>
                <td colSpan="2" style={{textAlign: "center"}}>{this.state.popupText}</td>
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
    if(this.props.entity.title === "United States") {
      data = USGeo;
    }

    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom} height={this.props.height} style={{height: this.props.height}}>
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
            {/* A pretty CSS3 popup. <br /> Easily customizable. */}
            
            {tooltipContent}
          </Popup>
        </GeoJSON>
      </Map>
    )
  }
}
LeafletMap.propTypes = propTypes;
export default LeafletMap;