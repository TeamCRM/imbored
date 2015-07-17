// var map;
// var infowindow;

// var keywords = [
// 	"restaurant", 
// 	"movies",
// 	"aquarium",
// 	"park"
// ];


// var ResultsModel = Backbone.Model.extend({

// })

// var SecondView = Backbone.View.extend({
// 	render: function() {
// 		var phone= this.model.get('phone');
// 		var address= this.model.get('address');
// 		var website= this.model.get('website')
// 		this.$el.html('<li>'+phone+'<span>'+address+'</span><a href='+website+'>'+webiste+'</a></li>')
// 	},
// 	initialize: function () {
//         this.model.on("change", this.render, this);
//     }

// })

// var resultsView = Backbone.View.extend({
// 	render: function() {
// 		var resultList = _.template('<ul class="resultList"><%= results %></ul>');
// 		var resultSection = _.template('<li class="resultSection"><div class="resultTitle"><%= title %></div><ul class="resultListings"><%= listings %></ul></li>');
// 		var resultListing = _.template('<li class="listing"><span><%= price %></span><a href="<%= url %>"><%= name %></a><span><%= rating %></span></li>');
// 		var secondListing=_.template('<li class="secondLink"><span><%= phone %></span><%= address %><span><a href="<%= website %>"><%= website%></a></span></li>');
		
// 		var resultSections = [];
// 		for(var i = 0; i<keywords.length; i++) {
			
// 			var keywordResults = this.collection.byType(keywords[i]);
// 			var resultListings = [];
// 			for(var j = 0; j<keywordResults.length; j++) {
// 				var place = keywordResults[j];
// 				var placeName = place.get('name');
// 				var price = place.get('price_level');
// 				var rating = place.get('rating');
// 				var url = place.get('url');
// 				resultListings.push(resultListing({price: price, name: placeName, url: url, rating: rating}));
// 			}
// 			resultSections.push(resultSection({title: keywords[i], listings: resultListings.join('')}));
// 		}

// 		this.$el.html(resultList({results: resultSections.join('')}));
// 	},

// 	events: {
// 		'click .resultTitle' : 'dropDown',
// 		'click .listing'	 : 'getDets'
// 	},
// 	getDetails : function (id) {
// 				// $.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJnWi4GeSglVQRnr6woHCWTIc&key=AIzaSyC07_kHMce5pVqwyX4B4J7gpu6P9Y43Pl4', function (details){
// 				// 	var phone= details.international_phone_number;
// 				// 	var address = details.formatted_address;
// 				// 	var website = details.website
// 				// }) 
// 			this.model.details()
// 	},

// 	dropDown: function(event) {
// 		$(event.currentTarget).toggleClass('isOpen').siblings('.resultListings').toggleClass('hidden');
// 	}
// })


// $(document).ready(function() {
// 	$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+in+Portland&key=AIzaSyC07_kHMce5pVqwyX4B4J7gpu6P9Y43Pl4', function(data) {
// 		var m = Backbone.Model.extend({
// 			defaults :{'info':data.results[0], 'phone':'','address':'','website':''},

// 			details : function (id) {
// 				$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJnWi4GeSglVQRnr6woHCWTIc&key=AIzaSyC07_kHMce5pVqwyX4B4J7gpu6P9Y43Pl4', function (details){
// 					this.set('phone',details.international_phone_number);
// 					this.set("address", details.formatted_address);
// 					this.set('website', details.website);
// 				}) 
// 				var secondView= new SecondView({model: m});
// 				secondView.render();
// 				$('.listing').append(view.$el);	
// 			}

// 		});
// 		var C = Backbone.Collection.extend({
// 		    model : m,
// 		    url : '/register',
// 		    initialize: function () {
// 		        this.fetch();
// 		   	},
// 		   	byType: function(keyword) {
// 		   		filtered = this.filter(function(result) {
// 		   			return result.get("types").indexOf(keyword) !== -1;
// 		   		});
// 		   		return filtered;
// 		   	}
// 		});

// 		var c = new C();
// 		for(var i = 0; i<data.results.length; i++) {
// 			var place = new Backbone.Model(data.results[i]);
// 			c.add(place);
// 		}
// 		var view = new resultsView({ collection : c});

// 		view.render();

// 		$('#prefResults').append(view.$el);
// 	});
// });
// data.results[i].name  data.results[i].place_id


// hasChanged for backbone
$(document).ready(function() {
	$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+in+Portland&key=AIzaSyCLGyZUzAn-ATeMtqZyW_BwYSIuv9KY7mY', function(data) {
		console.log(data.results)
		var ResultsModel = Backbone.Model.extend({
	defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':''},
	details : function (id) {
		var model = this
		console.log(id)
		$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyCLGyZUzAn-ATeMtqZyW_BwYSIuv9KY7mY', function (details){
			console.log(details.result)
					model.set({'phone':details.result.formatted_phone_number,'website': details.result.website,'price': details.result.price_level,'rating': details.result.rating});
					// model.set('website', details.result.website);
					// model.set('price', details.result.price_level);
					// model.set('rating', details.result.rating);
					console.log('endJSON')
				}) 
		//Some rendering info in here
	}
})

var ResultsView=Backbone.View.extend({
	render: function(){
		var name = this.model.get('name');
		var id = this.model.get('id')
		this.$el.html('<li><button type="button" class="push" data-id="'+id+'">'+name+'</button><div id="detailsView'+id+'"></div></li>')
		
		
	},
	initialize: function () {
        this.model.on("change", this.render, this);
    },
    events :{
    	'click .push': "getDetails"
    },
    getDetails: function (event){
    	console.log("hello")
    	// var views= new ResultsMiniView({model:ResultsModel})
    	this.model.details($(event.currentTarget).data('id'));
    }

})


var ResultsMiniView= Backbone.View.extend({
	render : function (){
		console.log('MiniRender')
		var phone= this.model.get('phone');
		console.log(phone)
		var website = this.model.get('website');
		console.log(website)
		var price= this.model.get('price');
		var rating= this.model.get('rating')
		var idz= this.model.get('id')
		console.log(this.model)
		this.$el=$("#detailsView"+idz+"")
		console.log(this.$el)
		this.$el.html('<span>'+phone+'</span><span> '+website+'</span><span> '+price+'</span><span> '+rating+'</span>')
				console.log('Miniend')
	},
	initialize: function () {
        this.listenTo(this.model,"change", this.render);
    }    

}) 

var ResultsCollection = Backbone.Collection.extend({
	model: ResultsModel,
	url: '/results',
	initialize: function () {
		this.fetch();
	}
})
var results= new ResultsModel({})
var resultsCollection = new ResultsCollection([results]);
for(var i=0; i<data.results.length;i++){


	var results= new ResultsModel({})
	results.set({'name': data.results[i].name, 'id': data.results[i].place_id})
	
	var view = new ResultsView({collection:resultsCollection, model:results })
	var detailedView=new ResultsMiniView({
		model:results	
		})


view.render()
$('#prefResults').append(view.$el);	

}	

})
})

