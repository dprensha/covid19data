import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from 'd3';
import styles from './D3Plot.css';

const propTypes = {
    x: PropTypes.array,
    y: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    format: PropTypes.string,
    tickInterval: PropTypes.number
}

class D3Plot extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

        }
        this.chartRef = React.createRef();
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        var margin = { top: 24, right: 12, bottom: 56, left: 48 };
        const { width, height } = this.props;

        var n = this.props.y.length;
        var dataset = this.props.x.map((item, index) => { return { "x": item, "y": this.props.y[index] } });

        var parseTime = d3.timeParse("%-m/%-d/%y");
        // 5. X scale will use the index of our data
        var xScale = d3.scaleTime()
            .domain([parseTime(this.props.x[0]), parseTime(this.props.x[this.props.x.length - 1])]) // input
            .range([0, width]); // output

        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
            .domain([0, Math.max(...this.props.y)]) // input 
            .range([height, 0]); // output 

        // 7. d3's line generator
        var line = d3.line()
            .x(function (d) { return xScale(parseTime(d.x)); }) // set the x values for the line generator
            .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 


            d3.select(`#${this.props.id} > svg`).remove();
        // 1. Add the SVG to the page and employ #2
        var svg = d3.select(`#${this.props.id}`).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // 3. Call the x axis in a group tag
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)
                .ticks(d3.timeWeek.every(this.props.tickInterval))
                .tickSizeInner(-height)
                .tickFormat(d3.timeFormat("%-m/%-d/%y")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)"); // Create an axis component with d3.axisBottom

        svg.selectAll(".y.axis").remove();
        // 4. Call the y axis in a group tag
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)
                .ticks(4)
                .tickSizeInner(-width - margin.left - margin.right)
                .tickFormat(d3.format(this.props.format))); // Create an axis component with d3.axisLeft

        svg.selectAll(".line").remove();
        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line); // 11. Calls the line generator 

        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (height/2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Active Cases")

    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.props.y) !== JSON.stringify(nextProps.y);
    }

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    render() {
        return (
                <div id={this.props.id} ref={this.chartRef}></div>
        );
    }
}

D3Plot.propTypes = propTypes;
export default D3Plot;