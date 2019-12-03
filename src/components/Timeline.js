import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { axisBottom,
         axisLeft,
         brushX,
         csv,
         csvParse,
         event,
         max,
         scaleBand,
         scaleLinear, 
         scaleOrdinal,
         scalePow,
         select,
         selectAll,
         stack,
         timeParse,
         arc
       } from 'd3';
import { setTimelineYearFocus,
         setTimelineSelectionStart,
         setTimelineSelectionEnd
       } from '../store/actions/timelineActions';
import './timeline.css';

const styles = theme => ({
  //root: {
  //  ...theme.mixins.gutters(),
  //  paddingTop: theme.spacing.unit * 2,
  //  paddingBottom: theme.spacing.unit * 2,
  //},
  root: {
    boxShadow: 'none',
    margin: '0px', 
    backgroundColor: 'rgba(255,255,255,0.7)',
    position: 'absolute',
    width: '960px',
    bottom: 0,
    left: 0,
    //right: 0,
    padding: '10px', 
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 20,
  },
});

const margin = {
    right: 10,
    left: 20,
    top: 10,
    bottom: 30
};

const height = 200 - margin.top - margin.bottom;
const width = 960 - margin.left - margin.right;
const x = scaleBand().range([0, width]).padding(0.1);
const y = scaleLinear().range([height, 0]);

export function yearLabel(index) {
    index = +index;
    if (index >= 0) {
        return index.toString();
    } else {
        return index.toString() + " BCE";
    }
}

class Timeline extends Component {

    componentDidMount() {
        this.svg = select("#tlsvg");
        this.barchart = this.svg.attr("class", "barchart")
                                .attr("width", "100%")
                                .attr("height", height + margin.top + margin.bottom)
                                .attr("y", height - height - 100)
                                .append("g");
    }

    updateBarChart(data) {
        const { setTimelineSelectionStart, setTimelineSelectionEnd, setTimelineYearFocus } = this.props;
        this.svg.selectAll("g").remove();
        if (data) {
            this.barchart = this.svg.append("g");
            let tmin = 1960;
            let tmax = 2020;
            let brushYearStart = "1960";
            let brushYearEnd = "2020";
            this.brushYears = this.barchart.append("g");
            this.brushYears.append("text")
                           .attr("id", "brushYears")
                           .classed("yearText", true)
                           .text(brushYearStart + " - " + brushYearEnd)
                           .attr("x", 35)
                           .attr("y", 12);
            let barData = [];
            for (let i = tmin; i <= tmax; i++) {
                let d = {
                    "name": yearLabel(i),
                    "idx": i,
                }
                if (data.tbars[i] == null) {
                    d.value = 0.0;
                } else {
                    d.value = data.tbars[i];
                }
                barData.push(d);
            }
            x.domain(barData.map(function (d) {
                return d.name;
            }));
            y.domain([0, max(barData, (d) => { return d.value; } )]);

            this.x_axis = axisBottom(x);
            this.barchart.append("g")
                         .attr("class", "x axis")
                         .style("fill", "#000")
                         .attr("transform", "translate(0," + height + ")")
                         .call(this.x_axis)
                         .selectAll("text")
                         .style("text-anchor", "end")
                         .attr("dx", "-.8em")
                         .attr("dy", ".15em")
                         .attr("transform", "rotate(-65)");

            this.brush = brushX().extent([[0, 0], [width, height]])
                                 .on("brush", this.brushmove)
                                 .on("end", () => {
                if (!event.sourceEvent) return;
                if (event.selection === null) {
                    select("#brushYears").text(brushYearStart + " - " + brushYearEnd);
                    setTimelineSelectionStart(null);
                    setTimelineSelectionEnd(null);
                    return;
                }
                var domain = x.domain();
                var paddingOuter = x(domain[0]);
                var eachBand = x.step();
                var selectStart = event.selection[0];
                var indexStart = Math.floor((selectStart - paddingOuter) / eachBand);
                var valueStart = domain[Math.max(0,Math.min(indexStart, domain.length-1))];
                var selectEnd = event.selection[1];
                var indexEnd = Math.floor((selectEnd - paddingOuter) / eachBand);
                var valueEnd = domain[Math.max(0,Math.min(indexEnd, domain.length-1))];

                // Update start and end years in upper right-hand corner of the map
                select("#brushYears").text(valueStart === valueEnd ? valueStart : valueStart + " - " + valueEnd);
                setTimelineSelectionStart(indexStart + tmin);
                setTimelineSelectionEnd(indexEnd + tmin);
            });

            this.arc = arc().outerRadius(height / 15)
                            .startAngle(0)
                            .endAngle( (d, i) => { return i ? -Math.PI : Math.PI; });

            this.brushg = this.barchart.append("g")
                                       .attr("class", "brush")
                                       .call(this.brush);

            this.brushg.selectAll(".resize")
                       .append("path")
                       .attr("transform", "translate(0," +  height / 2 + ")")
                       .attr("d", this.arc);

            this.brushg.selectAll("rect")
                       .attr("height", height);

            this.barchart.append("g")
                         .attr("class", "freq")
                         .style("fill", "#7E57C2")
                         .style("stroke", "#CCE5E5")
                         .selectAll("rect")
                         .data(barData)
                         .enter().append("rect")
                         .attr("class", "bar")
                         .attr("x", (d) => {
                             return x(d.name);
                         })
                         .attr("y", (d) => {
                             return y(d.value);
                         })
                         .attr("width", x.bandwidth())
                         .attr("height", (d) => {
                             return height - y(d.value);
                         })
                         .attr("id", (d) => {
                             return d["idx"];
                         })
                         .on("mouseover", function() {
                             select(this)
                                 .style("stroke", "red");
                             setTimelineYearFocus(select(this).attr("id"));
                         })
                         .on("click", function() {
                             console.log("clicked: "+select(this).attr("id"));
                         })
                         .on("dblclick", function() {
                             console.log("double clicked: "+select(this).attr("id"));
                         })
                         .on("mouseout", function(d, i) {
                             select(this)
                                 .style("stroke", "#CCE5E5");
                             setTimelineYearFocus(null);
                         });
	}
    }

    brushmove() {
        if (!event.sourceEvent || event.sourceEvent.type === "brush") return;
        var domain = x.domain();
        var paddingOuter = x(domain[0]);
        var eachBand = x.step();
        var selectStart = event.selection[0];
        var indexStart = Math.floor((selectStart - paddingOuter) / eachBand);
        //var valueStart = domain[Math.max(0,Math.min(indexStart, domain.length-1))];
        var valueStart = domain[Math.max(0,Math.min(indexStart, domain.length-1))];
        var selectEnd = event.selection[1];
        var indexEnd = Math.floor((selectEnd - paddingOuter) / eachBand);
        var valueEnd = domain[Math.max(0,Math.min(indexEnd, domain.length-1))];
        //var valueEnd = domain[Math.max(0,Math.min(indexEnd, domain.length))];
        select(this).call(event.target.move, [x(valueStart),x(valueEnd)+eachBand-1]);
        //select(this).call(event.target.move, [x(valueStart),x(valueEnd)+eachBand]);
    }

    componentDidUpdate(prevProps) {
        const { institutionYearSearchResult } = this.props;
        if (prevProps.institutionYearSearchResult !== institutionYearSearchResult) {
            this.updateBarChart(institutionYearSearchResult);
        }
    }

    render() {
        const { classes } = this.props;
        return ( 
            <div className={classes.root}>
                <svg id="tlsvg"></svg>
            </div>
	);
    }
}

const mapStateToProps = state => {
    return {
        institutionYearSearchResult: state.queryResults.institutionYearSearchResult,
        pickedGridId: state.map.pickedGridId,
        selectedGridId: state.map.selectedGridId,
        timelineSelectionStart: state.timeline.selectionStart,
        timelineSelectionEnd: state.timeline.selectionEnd,
        timelineYearFocus: state.timeline.yearFocus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        setTimelineSelectionStart: (selection) => { dispatch(setTimelineSelectionStart(selection)) },
        setTimelineSelectionEnd: (selection) => { dispatch(setTimelineSelectionEnd(selection)) },
        setTimelineYearFocus: (focus) => { dispatch(setTimelineYearFocus(focus)) },
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(withStyles(styles)(Timeline));
