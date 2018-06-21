function renderText(context, text, x, y) {
    context.save();
    context.beginPath();
    context.fillText(text, x, y);
    context.closePath();
    context.restore();
}

function measure(lat1, lon1, lat2, lon2){
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6378137 * c; // Radius of earth in meters
}

function human(dist) {
	if (dist < 1000) {
		return Math.round(dist) + 'm';
	}
	else {
		return Math.round(dist / 100) / 10 + 'km';
	}
};

window.onload = function () {
	
    var watchRadius = document.body.clientWidth / 2,
        points = [
			{name: 'D', latitude: 52.2354438, longitude: 20.9068757},
			{name: 'P', latitude: 52.2083668, longitude: 20.9570988}
        ],
        canvasPoints = document.querySelector("#points"),
        ctxPoints = canvasPoints.getContext("2d"),
    	oldPosition = {coords: {longitude: 0, latitude: 0}},
    	angleMemory = 0, rotation = 0;
    
    	canvasPoints.width = document.body.clientWidth;
    	canvasPoints.height = canvasPoints.width;
    	ctxPoints.textBaseline = 'middle';
    	ctxPoints.font = '20px Verdana';
    	ctxPoints.textAlign = 'center';
    	ctxPoints.fillStyle = 'hsl(0, 0%, 60%)';

    // update position
    var watchId = navigator.geolocation.watchPosition(function(position){
    	if (position.coords.latitude === oldPosition.coords.latitude && position.coords.longitude === oldPosition.coords.longitude) {
    		return;
    	}
    	
    	ctxPoints.save();

	    // Clear canvas
    	ctxPoints.clearRect(0, 0, ctxPoints.canvas.width, ctxPoints.canvas.height);
    	
    	// Draw points
		for (var i = 0; i < points.length; i++) {
			points[i].x = points[i].longitude - position.coords.longitude;
			points[i].y = position.coords.latitude - points[i].latitude;
			points[i].c = Math.sqrt(Math.pow(points[i].x, 2) + Math.pow(points[i].y, 2));
			points[i].mulC = (watchRadius * 0.90) / points[i].c;
			points[i].dist = measure(position.coords.latitude, position.coords.longitude, points[i].latitude, points[i].longitude);
			points[i].mulD = (watchRadius * (points[i].dist < 10 ? 0.8 : 0.7)) / points[i].c;
			points[i].xC = Math.round(points[i].x * points[i].mulC) + watchRadius;
			points[i].yC = Math.round(points[i].y * points[i].mulC) + watchRadius;
			points[i].xD = Math.round(points[i].x * points[i].mulD) + watchRadius;
			points[i].yD = Math.round(points[i].y * points[i].mulD) + watchRadius;
			renderText(ctxPoints, points[i].name, points[i].xC, points[i].yC);
			renderText(ctxPoints, human(points[i].dist), points[i].xD, points[i].yD);
		}

		ctxPoints.restore();
		
//		navigator.geolocation.clearWatch(watchId);
	}, function(error){
    	console.error('geolocation error');
    	console.log(error);
    }, {enableHighAccuracy: true});
    
	// rotate screen
	window.addEventListener("deviceorientation", function onDeviceOrientation(dataEvent) {
		if (!angleMemory) {
			angleMemory = dataEvent.alpha;
		}
		
		var angle = (dataEvent.alpha + angleMemory) / 2,
			deltaAngle = angleMemory - angle;
		   
		if (Math.abs(deltaAngle) > 180) {
			if (deltaAngle > 0) {
				rotation -= ((360 - angleMemory) + angle);
			}
			else {
				rotation += (angleMemory + (360 - angle));
			}
		}
		else {
			rotation += deltaAngle;
		}
		angleMemory = angle;
		   
		document.querySelector('#north').style['-webkit-transform'] = 'rotate(' + rotation + 'deg)';
       
    }, false);
    
    
};
