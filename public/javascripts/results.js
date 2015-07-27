var PreferenceModel = Backbone.Model.extend({
	defaults : {
		"amusement_park": false,
		"art_gallery": false,
		"aquarium": false,
		"bowling_alley": false,
		"movie_theater": false,
		"campground": false,
		"cafe": false,
		"restaurant": false,
		"library": false,
		"museum": false,
		"park": false,
		"shopping_mall": false,
		"stadium": false,
		"zoo": false,
		"university": false,
		"swimming": false,
		"spa": false,
		"hiking": false,
		"book_store": false,
		"night_club": false
	}
});

var map;
var infowindow;

var PreferenceView = Backbone.View.extend({
    el: '.xtra',
    initialize: function() {
    	$('body :not(.xtra)').on('click', function() {
    		$('.prefs').addClass('hidden');
    	})
    },
    render: function() {
        _.each(this.model.attributes, function(val, key) {
        	var whatever = val ? "checked" : "";
         	var row = "<label>" + key.replace("_", " ") + "<input type='checkbox' "+ whatever +"></label>";
            $('.prefs').append(row);
        });
        return this;
    },
    events: {
    	'click .prefMenu': 'openPref'
    },
    openPref: function(event) {
    	$('.prefs').toggleClass('hidden');
    	event.stopImmediatePropagation();
    }
});

var WeatherModel = Backbone.Model.extend({
	defaults :{
		'city':'',
		'temp':'', 
		'type':'', 
		'description':'',
		'icon':''
	}
});

var WeatherView = Backbone.View.extend({
	render: function(){
		var city=this.model.get('city');
		var temp=this.model.get('temp');
		var type=this.model.get('type');
		var description=this.model.get('description');
		var icon=this.model.get('icon');
		this.$el=$('.weather');
		this.$el.append('<img src="http://openweathermap.org/img/w/'+icon+'.png"><div class="weatherDetails"><div>'+city+'</div><div class="temp">'+temp.toFixed()+'</div><div>'+type+'</div></div>');
	}
});

$(document).ready(function() {
	var preferenceModel = new PreferenceModel();
	var preferenceView = new PreferenceView({model: preferenceModel});

	$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=Portland,Or&units=imperial', function(data){
			var weatherModel = new WeatherModel({});
			weatherModel.set({'city':data.name,'temp':data.main.temp, 'type':data.weather[0].main, 'description':data.weather[0].description, 'icon':data.weather[0].icon});
			var weatherView = new WeatherView({model: weatherModel});
			weatherView.render();
	});

 	function getCookie(name) {
	    var re = new RegExp(name + "=([^;]+)");
	    var value = re.exec(document.cookie);
	    return (value != null) ? unescape(value[1]) : null;
  	}
	
	var value = getCookie('preferences');
	var newValue= value.split(',');
	
	var ResultsModel = Backbone.Model.extend({
		defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':'','hasCalled': false},
		details : function (id) {
			var model = this
			console.log(id)
			if(!this.get('hasCalled')) {
				$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function (details){
					console.log(details.result)
					model.set({'phone':details.result.formatted_phone_number,'website': details.result.website,'price': details.result.price_level,'rating': details.result.rating, 'hasCalled': true});
				});
			}
		}
	});
			
	var ResultsView=Backbone.View.extend({
		tagName: 'li',
		render: function(){
			var name = this.model.get('name');
			var id = this.model.get('id');
			var className = this.model.get('hasCalled') ? 'beenCalled': "";
			this.$el.html('<button type="button" class="push '+ className +'" data-id="'+id+'">'+name+'</button><br/><div id="detailsView'+id+'" class="deets"></div>');
		},
		initialize: function () {
    		this.model.on("change", this.render, this);
		},
		events :{
			'click .push': "getDetails"
		},
	    getDetails: function (event){
	    	this.model.details($(event.currentTarget).data('id'));
	    }
	});

	var ResultsMiniView= Backbone.View.extend({
		render : function (){
			console.log('MiniRender');
			var phone= this.model.get('phone');
			console.log(phone);
			var website = this.model.get('website');
			console.log(website);
			var price= this.model.get('price');
			var priceClass = 'dollar-signs-' + Math.ceil(price);
			var rating= this.model.get('rating');
			var ratingClass = 'stars-'+ Math.ceil(rating);
			var idz= this.model.get('id');
			console.log(this.model);
			this.$el=$("#detailsView"+idz+"");
			console.log(this.$el);
			this.$el.html('<span class="'+priceClass+'"></span><span class="'+ratingClass+'"></span><span>'+phone+'</span><a href="'+website+'" target="_blank" class="website">Visit Website</a>');
			console.log('Miniend');
		},
		initialize: function () {
	        this.listenTo(this.model,"change", this.render);
	    }    
	});

	var ResultsCollection = Backbone.Collection.extend({
		model: ResultsModel,
		url: '/results',
		initialize: function () {
			this.fetch();
		}
	});
		
	var ResultsCollectionView= Backbone.View.extend({
		el: '#prefResults',
		initialize: function() {},
		render: function(arr,index){
			this.$el.append('<div id='+index+'1><h1 class="sectionLabel">'+arr.replace('_', ' ')+'</h1><div id='+index+' class="map"></div><ul class="renderResults"></ul></div');
			this.renderMap(index);
		},
		renderMap: function(activity){
			var map = new google.maps.Map(document.getElementById(activity), {
				center: {lat: 45.5200, lng: -122.6819},
				zoom: 15
			});
			var newActivity=''+activity+'';
			console.log(newActivity)
			// Search for Google's office in Australia.
			var request = {
				location: map.getCenter(),
				radius: 5000,
				types: [newActivity]
			};
			var here = this
			function createMarker(place) {
				var placeLoc = place.geometry.location;
				var marker = new google.maps.Marker({
					map: map,
					position: place.geometry.location
				});

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(place.name);
					infowindow.open(map, this);
				});
			}

			var infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, function(results, status){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {
			 			createMarker(results[i]);	
					}
				}
			});
		},
		
		events: {
			'click .sectionLabel': 'isOpen'
		},
		
		isOpen: function(event) {
			$(event.currentTarget).parent().toggleClass('isOpen');
			// $('#art_gallery1').children().toggleClass('OpenMap');
		}
	});	
	
	for (var j=0;j<newValue.length;j++){
		var results= new ResultsModel({});
		var resultsCollection = new ResultsCollection([],{model:results});
		var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results });
		var ids=newValue[j];
		collectionView.render(ids,ids);

		preferenceModel.set(ids, true);

		$.getJSON('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=45.5200,-122.6819&radius=5000&types='+newValue[j]+'&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function(data) {
			console.log(data)
			var dat= data.results[0].types[0]
			if(dat==="lodging"){
				dat= "spa"
			}else if(dat==='store'){
				dat= 'cafe'
			}else if(data.results[0].types[0]==='night_club' && data.results[0].types[1]==='bowling_alley'){
				dat = 'bowling_alley'
			}

			
			// console.log(dat)	
			// var otherArr =["cafe",'gym','park']
			var value = getCookie('preferences');
			var newValue= value.split(',')
			// var goodValue=JSON.parse("[" + newValue[1] + "]");
			for(var i=0; i<data.results.length;i++){
				var results= new ResultsModel({});
				results.set({'name': data.results[i].name, 'id': data.results[i].place_id})
				var view = new ResultsView({collection:resultsCollection, model:results })
				var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results })
				var detailedView=new ResultsMiniView({
					model:results	
				});
				view.render();
				// console.log(dat)
				$('#'+dat+'1 ul').append(view.$el);	
				// $('#encompass').append(collectionView.$el)
			}
		});
	}
	
	preferenceView.render();
});

	