function renderText(context, text, x, y) {
    context.save();
    context.beginPath();
    context.fillText(text, x, y);
    context.closePath();
    context.restore();
}

window.onload = function () {
	
    var watchRadius = document.body.clientWidth / 2,
        points = [
			{name: 'D', latitude: 52.2354438, longitude: 20.9068757},
			{name: 'P', latitude: 52.2084517, longitude: 20.9554352}
        ],
        canvasPoints = document.querySelector("#points"),
        ctxPoints = canvasPoints.getContext("2d");
    
    	canvasPoints.width = document.body.clientWidth;
    	canvasPoints.height = canvasPoints.width;
    	ctxPoints.textBaseline = 'middle';
    	ctxPoints.font = '20px Verdana';
    	ctxPoints.textAlign = 'center';
    	ctxPoints.fillStyle = 'hsl(0, 0%, 60%)';

    var watchId = navigator.geolocation.watchPosition(function(position){
		for (var i = 0; i < points.length; i++) {
			points[i].x = points[i].longitude - position.coords.longitude;
			points[i].y = position.coords.latitude - points[i].latitude;
			points[i].c = Math.sqrt(Math.pow(points[i].x, 2) + Math.pow(points[i].y, 2));
			points[i].mul = (watchRadius * 0.85) / points[i].c;
			renderText(ctxPoints, points[i].name, Math.round(points[i].x * points[i].mul) + watchRadius, Math.round(points[i].y * points[i].mul) + watchRadius);
		}
		
		navigator.geolocation.clearWatch(watchId);
	}, function(error){
    	console.error('geolocation error');
    	console.log(error);
    }, {enableHighAccuracy: true});
    
    
    
};
