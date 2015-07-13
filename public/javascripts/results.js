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
	"restaurant", 
	"movies",
	"aquarium",
	"park"
];

var resultsView = Backbone.View.extend({
	render: function() {
		var resultList = _.template('<ul class="resultList"><%= results %></ul>');
		var resultSection = _.template('<li class="resultSection"><div class="resultTitle"><%= title %></div><ul class="resultListings"><%= listings %></ul></li>');
		var resultListing = _.template('<li class="listing"><span><%= price %></span><a href="<%= url %>"><%= name %></a><span><%= rating %></span></li>');
		
		var resultSections = [];
		for(var i = 0; i<keywords.length; i++) {
			
			var keywordResults = this.collection.byType(keywords[i]);
			var resultListings = [];
			for(var j = 0; j<keywordResults.length; j++) {
				
				var place = keywordResults[j];
				var placeName = place.get('name');
				var price = place.get('price_level');
				var rating = place.get('rating');
				var url = place.get('url');
				resultListings.push(resultListing({price: price, name: placeName, url: url, rating: rating}));
			}
			resultSections.push(resultSection({title: keywords[i], listings: resultListings.join('')}));
		}

		this.$el.html(resultList({results: resultSections.join('')}));
	},

	events: {
		'click .resultTitle' : 'dropDown'
	},

	dropDown: function(event) {
		$(event.currentTarget).toggleClass('isOpen').siblings('.resultListings').toggleClass('hidden');
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