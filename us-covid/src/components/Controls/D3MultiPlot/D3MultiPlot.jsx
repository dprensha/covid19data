import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from 'd3';
import './D3MultiPlot.css';

const propTypes = {
    // x: PropTypes.array,
    // y: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    tickInterval: PropTypes.number,
    // scaleMode: PropTypes.string,
    // showTooltip: PropTypes.bool
    data: PropTypes.array
}

class D3MultiPlot extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

        }
        this.chartRef = React.createRef();
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        // set the dimensions and margins of the graph
        var legendWidth = 200;
        var margin = { top: 24, right: 24, bottom: 56, left: 50 },
            width = this.props.width - margin.left - margin.right - legendWidth,
            height = this.props.height - margin.top - margin.bottom;


        d3.select(`#${this.props.id} > svg`).remove()

        // append the svg object to the body of the page
        var svg = d3.select(`#${this.props.id}`).append("svg")
            .attr("width", width + margin.left + margin.right + legendWidth)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var masterList = [];

        for (var i = 0; i < this.props.data.length; i++) {
            for (var j = 0; j < this.props.data[i].x.length; j++) {
                masterList.push({
                    title: this.props.data[i].title,
                    x: this.props.data[i].x[j],
                    //y: this.props.data[i].yActivePerCapita[j] * 1000
                    y:this.props.data[i].yDeaths[j]
                })
            }
        }

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.title; })
            .entries(masterList);

        // Add X axis --> it is a date format
        var parseTime = d3.timeParse("%-m/%-d/%y");

        var x = d3.scaleLinear()
            .domain(d3.extent(masterList, function (d) { return parseTime(d.x); }))
            .range([0, width]);


        // var x = d3.scaleTime()
        //     .domain([parseTime(test[0].values.x[0]), parseTime(test[0].values.x[test[0].values.x.length - 1])]) // input
        //     .range([0, width]); // output


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom(x)
                    //.ticks(10)
                    .tickFormat(d3.timeFormat("%-m/%-d/%y"))
                    .tickSizeInner(-height)
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(masterList, function (d) { return +d.y; })])
            .range([height, 0]);

        // yScale = d3.scaleLinear()
        // .domain([0, Math.max(...this.props.y)]) // input 
        // .range([height, 0]); // output 

        svg.append("g")
            .attr("class", "axis")
            .call(
                d3.axisLeft(y)
                    .ticks(4)
                    .tickSizeInner(-width)
                    //.tickFormat(d3.format(this.props.format))); // Create an axis component with d3.axisLeft
                    .tickFormat(d3.format(d3.max(masterList, function (d) { return +d.y; }) < 1000 ? "~f" : "~s"))

            );

        // color palette
        var res = sumstat.map(function (d) { return d.title }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            //.range(['#e53935', '#1f77b4', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#039be5', '#00acc1', '#00897b', '#43a047', '#7cb342', '#c0ca33', '#fdd835', '#ffb300'])
            .range(["#7f7f7f", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf"])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("data-legend", function (d) { return d.key })
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(parseTime(d.x)); })
                    .y(function (d) { return y(+d.y); })
                    (d.values)
            })

        var size = 5

        const tooltip = d3.select('#tooltip');
        const tooltipLine = svg.append('line');
        svg.selectAll("legendDots")
            .data(sumstat)
            .enter()
            .append("circle")
            .attr("cx", width + 20)
            .attr("cy", function (d, i) { return 100 + i * (size + 15) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", size)
            .style("fill", function (d) { return color(d.key) })

        // Add one dot in the legend for each name.
        svg.selectAll("legendLabels")
            .data(sumstat)
            .enter()
            .append("text")
            .attr("x", width + 20 + size * 1.4)
            .attr("y", function (d, i) { return 100 + i * (size + 15) + (size) }) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function (d) { return d.key })
            .attr("class", "legendLabel");

        var tipBox = svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip)
            .on('mouseout', removeTooltip);

        function removeTooltip() {
            if (tooltip) tooltip.style('display', 'none');
            if (tooltipLine) tooltipLine.attr('stroke', 'none');
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

        function drawTooltip() {
            const date = new Date(Math.floor((x.invert(d3.mouse(tipBox.node())[0]))));
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(2, 2)}`

            // sumstat.sort((a, b) => {
            //   return b.history.find(h => h.date == date).population - a.history.find(h => h.date == date).population;
            // })  

            tooltipLine.attr('stroke', '#999999')
                .attr('x1', x(date))
                .attr('x2', x(date))
                .attr('y1', 0)
                .attr('y2', height)
                .style("stroke-width", 2);
console.log(d3.event.pageX + 20);
            tooltip.html(dateString)
                .style('display', 'block')
                .attr('left', d3.event.pageX + 20)
                .attr('top', d3.event.pageY - 20)
                .selectAll()
                .data(sumstat).enter()
                .append('div')
                .style('color', d => d.color)
                .html(d => d.key + ': ' + addThousandSeparators(d.values.filter(value => value.x === dateString)[0].y, true));
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) || this.props.scaleMode !== nextProps.scaleMode)
    }

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    render() {
        return (
            <div>
                <div id='tooltip' style={{ position: "absolute", left: "400px", display: "none", backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "5px", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)" }}></div>
                <div id={this.props.id} ref={this.chartRef}></div>
            </div>
        );
    }
}

D3MultiPlot.propTypes = propTypes;
export default D3MultiPlot;