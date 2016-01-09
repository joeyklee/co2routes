$(document).ready(function() {

    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

	// var MapBox = L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	// 	attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	// 	subdomains: 'abcd',
	// 	id: 'joeyklee',
	// 	accessToken: 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw'
	// }).addTo(map);




    


    (function init() {

    		var marker = L.circle([0, 0], 10).addTo(map);

    		function update() {
    		    map.locate({
    		        setView: true,
    		        maxZoom: 16
    		    });
    		    function onLocationFound(e) {
    		        // console.log(e.latlng);
    		        var radius = e.accuracy / 2;
    		        marker.setLatLng(e.latlng, radius);
    		    }
    		    map.on('locationfound', onLocationFound);
    		}
    		setInterval(update, 100);


      

            var studyarea = 'data/studyarea.geojson';
            d3.json(studyarea, function(data) {
                console.log(data);

                function style(feature) {
                    return {
                        weight: 4,
                        color: "#FF3300",
                        opacity: 0.5,
                        fillOpacity: 0
                    };
                };

                L.geoJson(data, {
                    style: style
                }).addTo(map);

            }); // end d3


            var way_1641 = L.layerGroup();
            var way_0205 = L.layerGroup();
            var way_0150 = L.layerGroup();
            var way_0151 = L.layerGroup();
            var way_0108 = L.layerGroup();

            var ifile = {
                "1641": 'data/1641_1.geojson',
                "0205": 'data/0205_1.geojson',
                "0150": 'data/0150_1.geojson',
                "0151": 'data/0151_1.geojson',
                "0108": 'data/0108_1.geojson'
            };
            var waycolor = '#3366FF';

            loadRoute(ifile["1641"], '#7519FF', way_1641);
            loadRoute(ifile["0205"], '#CC33FF', way_0205);
            loadRoute(ifile["0150"], '#006600', way_0150);
            loadRoute(ifile["0151"], '#003366', way_0151);
            loadRouteMulti(ifile["0108"], '#FF0000', way_0108);

            var baseMaps = {
                "1641": way_1641,
                "0205": way_0205,
                "0150": way_0150,
                "0151": way_0151,
                "0108": way_0108
            };

            L.control.layers(baseMaps, null).addTo(map);

            function loadRoute(ifile, waycolor, layerobject) {
                d3.json(ifile, function(data) {
                    // console.log(data.features[0].geometry.coordinates);
                    var coords = data.features[0].geometry.coordinates;

                    var newcoords = [];
                    coords.forEach(function(d) {
                        var temp = [d[1], d[0]];
                        newcoords.push(temp);
                    });

                    var pathPattern = L.polylineDecorator(newcoords, {
                        patterns: [{
                            offset: 0,
                            repeat: 10,
                            symbol: L.Symbol.dash({
                                pixelSize: 5,
                                pathOptions: {
                                    color: waycolor,
                                    weight: 3,
                                    opacity: 0.75
                                }
                            })
                        }, {
                            offset: 25,
                            repeat: 100,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 10,
                                pathOptions: {
                                    color: waycolor,
                                    fillOpacity: 1,
                                    weight: 0
                                }
                            })
                        }]
                    }).addTo(layerobject);
                }); // end d3
            };

            function loadRouteMulti(ifile, waycolor, layerobject) {
                d3.json(ifile, function(data) {
                    // console.log(data.features[0].geometry.coordinates);
                    var coords = data.features[0].geometry.coordinates;

                    var newcoords = [];
                    coords.forEach(function(d) {
                        // console.log(d)
                        d.forEach(function(e) {
                            // console.log(e);
                            var temp = [e[1], e[0]];
                            newcoords.push(temp);
                        })
                    })

                    var pathPattern = L.polylineDecorator(newcoords, {
                        patterns: [{
                            offset: 0,
                            repeat: 10,
                            symbol: L.Symbol.dash({
                                pixelSize: 5,
                                pathOptions: {
                                    color: waycolor,
                                    weight: 3,
                                    opacity: 0.75
                                }
                            })
                        }, {
                            offset: 25,
                            repeat: 100,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 10,
                                pathOptions: {
                                    color: waycolor,
                                    fillOpacity: 1,
                                    weight: 0
                                }
                            })
                        }]
                    }).addTo(layerobject);
                }); // end d3
            };



        })(); // end init()


    // routing instructions
    $("#sensor0108").click(function() {
        getDirections("data/0108_1.geojson");
    })

    $("#sensor0150").click(function() {

        getDirections("data/0150_1.geojson");
    })

    $("#sensor0151").click(function() {

        getDirections("data/0151_1.geojson");
    })

    $("#sensor0205").click(function() {
        getDirections("data/0205_1.geojson");
    })

    $("#sensor1641").click(function() {
        getDirections("data/1641_1.geojson");
    })

    function getDirections(path2file) {
        var baseurl = ["http://map.project-osrm.org/?z=18&center=49.220677%2C-123.070516", "&hl=en&ly=&alt=&df=&srv="]
        d3.json(path2file, function(data) {
            // console.log(data);
            var waypoints = [];
            data.features.forEach(function(val) {
                if (val.geometry.type == "MultiLineString") {
                    val.geometry.coordinates.forEach(function(d) {
                        // console.log(d.length);
                        d.forEach(function(item) {
                            // console.log(item);
                            var output = "&loc=" + parseFloat(item[1].toString().substr(0, 11)) + "%2C" + parseFloat(item[0].toString().substr(0, 11));
                            waypoints.push(output);
                        })
                    });
                } else if (val.geometry.type == "LineString") {
                    val.geometry.coordinates.forEach(function(d) {
                        // console.log(d);
                        var output = "&loc=" + parseFloat(d[1].toString().substr(0, 11)) + "%2C" + parseFloat(d[0].toString().substr(0, 11));
                        waypoints.push(output);
                    });
                }
            })
            var filtered = [];
            for (var i = waypoints.length; i >= 0; i -= 5) {
                filtered.push(waypoints[i]);
            }

            var outurl = baseurl[0] + filtered.join('') + baseurl[1];
            console.log(outurl.toString());
            window.open(outurl.toString());
        });
    }



});
