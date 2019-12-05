import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import mapboxgl from 'mapbox-gl';
import queryString from 'query-string';
import { doInstitutionYearKeywordSearch } from '../store/actions/queryActions';
import { setSearchFieldValue } from '../store/actions/searchFieldActions';
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

    async componentDidMount() {
        const { location, eventBus, doInstitutionYearKeywordSearch, setSearchFieldValue } = this.props;
        const searchVal = queryString.parse(location.search);
        let query = searchVal.q;
        console.log(searchVal);
	if (!query) query = "";

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            //style: 'mapbox://styles/mapbox/outdoors-v9'
            style: 'mapbox://styles/mapbox/dark-v10'
        });
        
        await this.loadMap();

        // if the event bus has been connected then do a query based on url parameters
        if (query) {
            await this.pollEventBusConnected(5000);
            setSearchFieldValue(query);
            doInstitutionYearKeywordSearch();
        } 
        // Force immediate re-render now that the map is created
        this.setState({mapLoaded : true});
    }

    pollEventBusConnected(timeout) {
        var start = Date.now();
        var waitForEventBus = (resolve, reject) => {
            const { eventBus } = this.props;
            if (eventBus) {
                resolve(eventBus);
	    } else if (timeout && (Date.now() - start) >= timeout) {
                reject(new Error("Socket timeout"));
            } else {
                setTimeout(waitForEventBus.bind(this, resolve), 30);
           }
        }
        return new Promise(waitForEventBus);
    }

    componentDidUpdate(prevProps) {
        const { pickedGridId, 
		selectedGridId, 
		institutionYearSearchResult, 
		timelineSelectionStart, 
		timelineSelectionEnd, 
		timelineYearFocus,
	        eventBus,
	        doInstitutionYearKeywordSearch
	} = this.props;
        if (prevProps.institutionYearSearchResult !== institutionYearSearchResult) {
            this.updateInstitutionPointSource();
	}
        if ((prevProps.timelineSelectionStart !== timelineSelectionStart) ||
            (prevProps.timelineSelectionEnd !== timelineSelectionEnd)) {
            this.updateInstitutionPointSource();
        }

        // check if the timeline bar focus has changed
        if (prevProps.timelineYearFocus !== timelineYearFocus) {
            this.updateYearFocusMarkers();
        }

        if (prevProps.selectedGridId !== selectedGridId) {
            this.updateSelectedGridMarker();
	}
        // reload if the eventBus is reset
        //if (prevProps.eventBus !== eventBus) {
            //doInstitutionYearKeywordSearch();
	//};
    }

    componentWillUnmount() {
        this.map.remove();
    }

    async loadMap() {
        return new Promise((resolve, reject) => {
          var theMap = this.map;
          const pulsingDotSize = 96;
          const dotSize = 16;

          const dot = {
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
                const radius = dotSize / 2;
                const context = this.context;

                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius-1, 0, Math.PI * 2);
                context.fillStyle = 'rgba(50, 128, 50, 1)';
                context.strokeStyle = 'white';
                //context.lineWidth = 1 + 2 * (1 - t);
                context.lineWidth = 2;
                context.fill();
                context.stroke();

                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // return `true` to let the map know that the image was updated
                return true;
            }
	  };

          const pulsingDot = {
            width: pulsingDotSize,
            height: pulsingDotSize,
            data: new Uint8Array(pulsingDotSize * pulsingDotSize * 4),

            onAdd: function() {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            render: function() {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = pulsingDotSize / 2 * 0.3;
                const outerRadius = pulsingDotSize / 2 * 0.7 * t + radius;
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
                context.lineWidth = 2 + 4 * (1 - t);
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
            // initialize the timeline yearFocusMarkers data source
            this.map.addSource('yearFocusMarkerPointSource', JSON.parse(JSON.stringify(this.emptyGeoJsonSource)));
            // initialize the selectedGrid data source
            this.map.addSource('selectedGridPointSource', JSON.parse(JSON.stringify(this.emptyGeoJsonSource)));

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

            // add dots for grids with publications on focused year on timeline
            this.map.addImage('dot', dot, { pixelRatio: 2 });
            this.map.addLayer({
                "id": "yearFocusDots",
                "type": "symbol",
                "source": "yearFocusMarkerPointSource",
                "layout": {
                    "icon-image": "dot",
                    "icon-allow-overlap": true
                }
            });

            // add pulsing dot for selected grid
            this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
            this.map.addLayer({
                "id": "selectedGridDot",
                "type": "symbol",
                "source": "selectedGridPointSource",
                "layout": {
                    "icon-image": "pulsing-dot"
                }
            });

            resolve(true);
	  });

        });
    }

    updateInstitutionPointSource() {
        const { institutionYearSearchResult, timelineSelectionStart, timelineSelectionEnd } = this.props;
	if ((institutionYearSearchResult == null) || (institutionYearSearchResult["features"] == null)) {
            try {
                this.map.getSource("institutionPointSource").setData({ "type": "FeatureCollection", "features": [] });
            } catch (e) { }
            console.log("update");
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

    updateSelectedGridMarker() {
        const { selectedGridId, institutionYearSearchResult } = this.props;
        console.log("update selected grid marker");
	console.log(selectedGridId);
        let gridGeoJson = { "type": "FeatureCollection", "features": [] };
        if (selectedGridId !== null) {
            let grid = institutionYearSearchResult["features"].find( (p) => {
                return p["properties"]["gridId"] == selectedGridId;
            });
	    console.log(grid);
            if (grid !== null) {
                gridGeoJson = { "type": "FeatureCollection", "features": [grid] };
            }
        }
	console.log(gridGeoJson);
        this.map.getSource("selectedGridPointSource").setData(gridGeoJson);
    }

    updateYearFocusMarkers() {
        const { institutionYearSearchResult, timelineYearFocus } = this.props;
        let pcGeoJson = { "type": "FeatureCollection", "features": [] };
        if (timelineYearFocus !== null) {
            let pcFiltered = institutionYearSearchResult["features"].filter( (p) => {
                for (const year in p["properties"]["scoresByYear"]) {
                    if (+year === +timelineYearFocus) {
                       return true;
                    }
		}
                return false;
	    });
            pcGeoJson = { "type": "FeatureCollection" };
            pcGeoJson["features"] = pcFiltered;
	}
        this.map.getSource('yearFocusMarkerPointSource').setData(pcGeoJson);
        this.map.triggerRepaint();
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
        timelineYearFocus: state.timeline.yearFocus,
        eventBus: state.eventBus.eventBus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        setOrToggleSelectedGridId: (gridId) => { dispatch(setOrToggleMapSelectedGridId(gridId)) },
        setSearchFieldValue: (value) => { dispatch(setSearchFieldValue(value)) },
        doInstitutionYearKeywordSearch: () => { dispatch(doInstitutionYearKeywordSearch()) },
    });
}

export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(Map));
