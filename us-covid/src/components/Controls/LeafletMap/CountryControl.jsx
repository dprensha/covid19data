import React, { Component } from "react";
import { withLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

class CountryControl extends Component {
    componentDidMount() {
        const { options, startDirectly } = this.props;
        const { map } = this.props.leaflet;
    }

    render() {
        return null;
    }
}


export default withLeaflet(CountryControl);