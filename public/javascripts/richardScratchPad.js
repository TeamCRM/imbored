$(document).ready(function() {
	$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+in+Portland&key=AIzaSyC07_kHMce5pVqwyX4B4J7gpu6P9Y43Pl4', function(data) {
		console.log(data)
		console.log('hello')
		var m = Backbone.Model.extend(data.results[0]);
		var C = Backbone.Collection.extend({
		    model : m,
		    url : '/register',
		    initialize: function () {
		        this.fetch();
		   	},
		   	byType: function(keyword) {
		   		filtered = this.filter(function(result) {
		   			return result.get("types").indexOf(keyword) !== -1;
		   		});
		   		return filtered;
		   	}
		});
		var c = new C();
		var idArr= [];
		var map = map = new google.maps.Map(document.getElementById('map-canvas'), {
			    center: {lat: 45.5200, lng: -122.6819},
			    zoom: 15
			});
		var service = new google.maps.places.PlacesService(map);
		for (var j=0; j<data.results.length; j++){
			idArr.push(data.results[j].place_id)
		}
		for(var k=0; k<data.results.length;k++){
			var request= {
      			placeId: data.results[k].place_id
    			}
    			console.log(data.results[k].place_id)
    			  service.getDetails( request, function(details,status){
    			  	console.log(details)
    	   if (status == google.maps.places.PlacesServiceStatus.OK) {
    	   	console.log('hello')
    	   		for(var i = 0; i<data.results.length; i++) {
			var place = new Backbone.Model(details);
			c.add(place);
		}
		var view = new resultsView({ collection : c});
		view.render();
		$('#prefResults').append(view.$el);
		}
		})
 

    		  
    };

		
	});
});
