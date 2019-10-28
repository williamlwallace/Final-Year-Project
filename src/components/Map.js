import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { 
           interpolateWarm,
           scaleSequential,
       } from 'd3';
import { 
           setMapBounds,
           setMapPickedGridId,
           setMapZoom,
           setOrToggleMapSelectedGridId
       } from '../store/actions/mapActions';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyd2luemVyMCIsImEiOiJjY2FjNTNhZDQyODcyMzQyMmI3N2ZjMzBkYWI2YzdiYyJ9.XEGc-X2AJddP9v8W1wbzEA';

class Map extends Component {
    map = null;
    emptyGeoJsonSource = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [ ]
        }
    };
    state = { mapLoaded: false };
    mercatorBounds = [
        [ -180,  85.05115 ],
        [  180,  85.05115 ],
        [  180, -85.05115 ],
        [ -180, -85.05115 ]
    ];

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/outdoors-v9'
        });
        var theMap = this.map;

        this.map.on('load', () => {
            // initialize the institutionPoints data source
            this.map.addSource('institutionPointSource', JSON.parse(JSON.stringify(this.emptyGeoJsonSource)));

            var heatmapColor = scaleSequential(interpolateWarm).domain([0, 1]);
            this.map.addLayer({
                "id": "keyword-heat",
                "type": "heatmap",
                "source": "institutionPointSource",
                "maxzoom": 9,
                "paint": {
                    // Increase the heatmap weight based on frequency and property weight (result of keyword search)
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "weight"],
                        0, 0,
                        1, 1 // not really interpolating b/c weights are already 0 to 1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 1,
                        9, 4
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 0.5,
                        8, 32
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        6, 1,
                        8, 0
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0, "rgba(110, 64, 170, 0)",
                        0.2, heatmapColor(0.2),
                        0.4, heatmapColor(0.4),
                        0.6, heatmapColor(0.6),
                        0.8, heatmapColor(0.8),
                        1, heatmapColor(1.0)
                    ],
                },
            }, 'waterway-label');
	});

        // Force immediate re-render now that the map is created
        this.setState({mapLoaded : true});
    }

    componentDidUpdate(prevProps) {
        const { pickedGridId, 
		selectedGridId, 
		institutionYearKeywordSearchResult, 
		timelineSelectionStart, 
		timelineSelectionStop, 
		yearFocus } = this.props;
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        const style = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%'
        };

        return (
            <div>
                <div style={style} ref={el => this.mapContainer = el} />
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
        yearFocus: state.timeline.yearFocus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(Map);
