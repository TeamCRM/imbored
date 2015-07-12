// Currently using fake data to get the model to work.
// var resultsModel = Backbone.Model.extend({
//   defaults : {
//   	"name": "",
//   	"isOpen": false,
//   	"location": "",
//   	"phoneNum": '832-555-2121',
//   	"priceLevel": "",
//   	"rating": 1.0,
//   	"url": ""
//   },
//   initialize : function () {
//     this.fetch();
//   }  
// });
var keywords = [
	"restaurant"
];

var resultsView = Backbone.View.extend({
	render: function() {
		for(var i = 0; i<keywords.length; i++) {
			var keywordResults = this.collection.byType(keywords[i]);
			var titleDiv = '<div class="resultTitle">'+ keywords[i] +'</div><ul>';
			for(var j = 0; j<keywordResults.length; j++) {
				var place = keywordResults[j];
				var placeName = place.get('name');
				var price = place.get('price_level');
				var rating = place.get('rating');
				var url = place.get('url');
				titleDiv += '<li><span>' + price + '</span><a href="'+url+'">' + placeName + '</a><span>' + rating + '</span></li>';
			}
			titleDiv += '</ul>';
		}
		this.$el.html(titleDiv);
	}
})


$(document).ready(function() {
	$.getJSON('/javascripts/example.JSON', function(data) {
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
		for(var i = 0; i<data.results.length; i++) {
			var place = new Backbone.Model(data.results[i]);
			c.add(place);
		}
		var view = new resultsView({ collection : c});

		view.render();

		$('#prefResults').append(view.$el);
	});
});