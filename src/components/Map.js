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
            //style: 'mapbox://styles/mapbox/outdoors-v9'
            style: 'mapbox://styles/mapbox/dark-v10'
        });
        var theMap = this.map;
        const dotSize = 48;
        const pulsingDot = {
            width: dotSize,
            height: dotSize,
            data: new Uint8Array(dotSize * dotSize * 4),

            onAdd: function() {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            render: function() {
                const duration = 3000;
                const t = (performance.now() % duration) / duration;

                const radius = dotSize / 2 * 0.3;
                const outerRadius = dotSize / 2 * 0.5 * t + radius;
                const context = this.context;

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(200, 255, 200,' + (1 - t) + ')';
                context.fill();

                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(50, 128, 50, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 1 + 2 * (1 - t);
                context.fill();
                context.stroke();

                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // keep the map repainting
                theMap.triggerRepaint();
                // return `true` to let the map know that the image was updated
                return true;
            }
        };

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
                        9, 3
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 2,
                        9, 32
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 1,
                        9, 0
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

            this.map.addLayer({
                "id": "grid-circles",
                "type": "circle",
                "source": "institutionPointSource",
                "minzoom": 7,
                "paint": {
                    // Size circle radius by weight and zoom level
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, [
                            "interpolate",
                            ["linear"],
                            ["get", "weight"],
                            0, 1,
                            1, 4
                        ],
                        16, [
                            "interpolate",
                            ["linear"],
                            ["get", "weight"],
                            0, 5,
                            1, 50
                        ]
		    ],
                    // Color circle by weight
                    "circle-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "weight"],
                        0, "rgba(33,102,172,0.6)",
                        1, "rgb(178,24,43)"
                    ],
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    // Transition from heatmap to circle layer by zoom level
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 0,
                        8, 1
                    ]
                }
            }, 'waterway-label');

            this.map.addLayer({
                "id": "institution-labels",
                "type": "symbol",
                "source": "institutionPointSource",
                "minzoom": 7,
                "layout": {
                    "text-field": ['format',
                        ['get', 'name'], { 'font-scale': 0.8 },
                    ],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-anchor": "bottom"
                },
                "paint": {
                    "text-color": "#fdf",
                    //"text-halo-color": "#fff",
                    //"text-halo-width": 1
                },
            });


            // Create logic to handle user input events on map

            // Toggle the selected cell
            this.map.on("click", "grid-circles", (e) => {
                if (e.features.length > 0) {
                    console.log(e.features[0]);
                    this.props.setOrToggleSelectedGridId(e.features[0].properties.id);
                } else {
                    this.props.setOrToggleSelectedGridId(null);
                }
            });

            // Turn off selected cell if click is not on a Grid circle
            this.map.on("click", (e) => {
                let fs = this.map.queryRenderedFeatures(e.point);
                if (fs.length > 0) {
                    let inGridCircle = false;
                    for (var i = 0; i < fs.length; i++) {
                        if (fs[i].layer && fs[i].layer.id && (fs[i].layer.id === "grid-circles")) {
                            inGridCircle = true;
                            break;
                        }
                    }
                    if (!inGridCircle) this.props.setOrToggleSelectedGridId(null);
                } else {
                    this.props.setOrToggleSelectedGridId(null);
                }
            });
	});

        // Force immediate re-render now that the map is created
        this.setState({mapLoaded : true});
    }

    componentDidUpdate(prevProps) {
        const { pickedGridId, 
		selectedGridId, 
		institutionYearSearchResult, 
		timelineSelectionStart, 
		timelineSelectionEnd, 
		yearFocus } = this.props;
        if (prevProps.institutionYearSearchResult !== institutionYearSearchResult) {
            this.updateInstitutionPointSource();
	}
        if ((prevProps.timelineSelectionStart !== timelineSelectionStart) ||
            (prevProps.timelineSelectionEnd !== timelineSelectionEnd)) {
            this.updateInstitutionPointSource();
        }
    }

    componentWillUnmount() {
        this.map.remove();
    }

    updateInstitutionPointSource() {
        const { institutionYearSearchResult, timelineSelectionStart, timelineSelectionEnd } = this.props;

	if ((institutionYearSearchResult == null) || (institutionYearSearchResult["features"] == null)) {
            this.map.getSource("institutionPointSource").setData({ "type": "FeatureCollection", "features": [] });
            return;
	}

        let _start = timelineSelectionStart;
        let _end = timelineSelectionEnd;
        if (timelineSelectionStart === null || timelineSelectionEnd === null) {
            _start = 0;
            _end = 2020;
        }
        let featureCollection = { "type": "FeatureCollection" };
        let maxScore = 0.0;
        let features = institutionYearSearchResult["features"].map ( (f) => {
            let score = 0.0;
            for (const year in f["properties"]["scoresByYear"]) {
                if ((+year >= _start) && (+year <= _end)) {
                    score = score + f["properties"]["scoresByYear"][year]["score"];
                }
            }
            if (maxScore < score) maxScore = score;
            return { "type": "Feature",
		     "geometry": { "type": "Point", "coordinates": f.geometry.coordinates },
                     "properties": { 
                         "weight" : score,
                         "name" : f["properties"]["name"],
                         "id" : f["properties"]["gridId"]
                     } 
            };
	});
        if (maxScore === 0.0) {
            this.map.getSource("institutionPointSource").setData({ "type": "FeatureCollection", "features": [] });
	} else {
            for (var i = 0; i < features.length; i++) {
                features[i]["properties"]["weight"] = features[i]["properties"]["weight"] / maxScore;
            }
            features.sort( (x, y) => {
                if (x["properties"]["weight"] < y["properties"]["weight"]) {
                    return 1;
                } else if (y["properties"]["weight"] > x["properties"]["weight"]) {
                    return -1;
                }
                return 0;
	    });
            featureCollection["features"] = features;
            this.map.getSource("institutionPointSource").setData(featureCollection);
	}
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
        yearSliderSelectionStart: state.yearSlider.selectionStart,
        yearSliderSelectionEnd: state.yearSlider.selectionEnd,
        timelineSelectionStart: state.timeline.selectionStart,
        timelineSelectionEnd:  state.timeline.selectionEnd,
        yearFocus: state.timeline.yearFocus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        setOrToggleSelectedGridId: (gridId) => { dispatch(setOrToggleMapSelectedGridId(gridId)) },
    });
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(Map);
