$(document).ready(function() {

    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    

    var marker = L.circle([0, 0], 10).addTo(map);

    function update() {
    	map.locate({
        setView: true,
        maxZoom: 17
	    });

        function onLocationFound(e) {
        	// console.log(e.latlng);
            var radius = e.accuracy / 2;

            // L.marker(e.latlng).addTo(map)
            //     .bindPopup("You are within " + radius + " meters from this point").openPopup();

            // L.circle(e.latlng, radius).addTo(map);
            marker.setLatLng(e.latlng, radius);
        }


        map.on('locationfound', onLocationFound);
        

    }

    setInterval(update, 1000);


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
