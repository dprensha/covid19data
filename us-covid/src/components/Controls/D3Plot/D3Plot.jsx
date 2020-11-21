import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from 'd3';
import './D3Plot.css';

const propTypes = {
    x: PropTypes.array,
    y: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    tickInterval: PropTypes.number,
    scaleMode: PropTypes.string,
    showTooltip: PropTypes.bool
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
        var dataset = null;

        if (this.props.scaleMode === "linear") {
            dataset = this.props.x.map((item, index) => { return { "x": item, "y": this.props.y[index] } });
        }

        else if (this.props.scaleMode === "logarithmic") {
            dataset = this.props.x.map((item, index) => { return { "x": item, "y": this.props.y[index] <= 0 ? 1 : this.props.y[index] } });
        }

        var getDataset = function() {
            return dataset;
        }

        var addThousandSeparators = function(value, formatMagnitude) {
            if(formatMagnitude && Math.abs(Number(value)) >= 1.0e+6) {
                return `${((Math.round(value / 1000)) / 1000).toFixed(2)} M`;
            }
            else if(formatMagnitude && Math.abs(Number(value)) >= 1.0e+3) {
                return `${(Math.round(value / 1.0e+3))}k`;
            }
            else if(Math.abs(Number(value)) < 1000) {
                return Math.round((value + Number.EPSILON) * 100) / 100;
            }
            else {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            
        }

        var parseTime = d3.timeParse("%-m/%-d/%y");
        // 5. X scale will use the index of our data
        var xScale = d3.scaleTime()
            .domain([parseTime(this.props.x[0]), parseTime(this.props.x[this.props.x.length - 1])]) // input
            .range([0, width]); // output

        var yScale = null;
        // 6. Y scale will use the randomly generate number 
        if (this.props.scaleMode === "linear") {
            yScale = d3.scaleLinear()
                .domain([0, Math.max(...this.props.y)]) // input 
                .range([height, 0]); // output 
        }
        else if (this.props.scaleMode === "logarithmic") {
            yScale = d3.scaleLog()
                .base(10)
                .domain([1, Math.max(...this.props.y)]) // input 
                .range([height, 0]); // output 
        }

        var yMax = Math.max(...this.props.y);

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
                //.tickFormat(d3.format(this.props.format))); // Create an axis component with d3.axisLeft
                .tickFormat(d3.format(yMax < 1000 ? "~f" : "~s")));

        svg.selectAll(".line").remove();
        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line); // 11. Calls the line generator 

        var tooltip = d3.select(`#${this.props.id}`).append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        var focus = svg.append("g")
            .attr("id", "focus")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        tooltip.append("div")
            .attr("class", "tooltip-date");

        var tooltipNumber = tooltip.append("div");
        tooltipNumber.append("span")
            .attr("class", "tooltip-title");

        tooltipNumber.append("span")
            .attr("class", "tooltip-number");

        var mousemove = function() {
            var x0 = xScale.invert(d3.mouse(this)[0]);
            var month = x0.getMonth() + 1;
            var date = x0.getDate();
            var year = x0.getFullYear().toString().substr(2, 2);
            var data = getDataset();
            var index = data.map(d => d.x).indexOf(`${month}/${date}/${year}`);

            if(index !== -1) {
                focus.attr("transform", "translate(" + xScale(x0) + "," + yScale(data[index].y) + ")");
                tooltip.attr("style", "left:" + (xScale(x0) + 16 + this.getBoundingClientRect().left) + "px;top:" + (yScale(data[index].y)+this.parentElement.parentElement.parentElement.offsetTop) + "px;");
                tooltip.select(".tooltip-date").text(data[index].x);
                tooltip.select(".tooltip-number").text(addThousandSeparators(data[index].y, true));
            }
        };

        if(this.props.showTooltip) {
            svg.append("rect")
                .attr('id', `rect_${this.props.id}`)
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function () { focus.style("display", null); tooltip.style("display", null); })
                .on("mouseout", function () { focus.style("display", "none"); tooltip.style("display", "none"); })
                .on("mousemove", mousemove);
        }
        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (height/2))
        //     .attr("dy", "1em")
        //     .style("text-anchor", "middle")
        //     .text("Active Cases")

    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(this.props.y) !== JSON.stringify(nextProps.y) || this.props.scaleMode !== nextProps.scaleMode)
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