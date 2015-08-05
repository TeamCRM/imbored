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
		});
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
		function getCookie(name) {
			var re = new RegExp(name + "=([^;]+)");
			var value = re.exec(document.cookie);
			return (value != null) ? unescape(value[1]) : null;
		}

		var value = getCookie('preferences');
		var newValue= value.split(',');
		var lat = getCookie('lat');
		var lng = getCookie('lng');
			// console.log(lat)
			// console.log(lng)

		var preferenceModel = new PreferenceModel();
		var preferenceView = new PreferenceView({model: preferenceModel});

		$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=Portland,Or&units=imperial', function(data){
			var weatherModel = new WeatherModel({});
			weatherModel.set({'city':data.name,'temp':data.main.temp, 'type':data.weather[0].main, 'description':data.weather[0].description, 'icon':data.weather[0].icon});
			var weatherView = new WeatherView({model: weatherModel});
			weatherView.render();
		});


		var ResultsModel = Backbone.Model.extend({
			defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':'','hasCalled': false},
		info: function (activity){
				var lati= Number(lat)
		var lngi= Number(lng)
		var map = new google.maps.Map(document.getElementById(activity), {
			center: {lat: lati, lng: lngi},
			zoom: 14
		});
		var newActivity=''+activity+'';
		var request = {
			location: map.getCenter(),
			radius: 5000,
			types: [newActivity]
		};
			// var here = this
			// function createMarker(place) {
			// 	var placeLoc = place.geometry.location;
			// 	var marker = new google.maps.Marker({
			// 		map: map,
			// 		position: place.geometry.location
			// 	});

			// 	google.maps.event.addListener(marker, 'click', function() {
			// 		infowindow.setContent(place.name);
			// 		infowindow.open(map, this);
			// 	});
			// }

			// var infowindow = new google.maps.InfoWindow();
			console.log(request)
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, function(data, status){
				console.log(status)
				if (status == google.maps.places.PlacesServiceStatus.OK) {
							var me = document.currentScript;
							var newMe= me.src.split('&')
							console.log(newMe[8].split('6s'))
							var goodMe= newMe[8].split('6s')
							console.log(me)
							// var newMe= me.src.split('&')
							console.log(goodMe[1])
							$('#'+goodMe[1]+'1 ul').empty()
					for (var i = 0; i < data.length; i++) {
						var dat= data[0].types[0]
						 // console.log(dat)
						 if(dat==="lodging"){
						 	dat= "spa"
						 }else if(dat==='store'){
						 	dat= 'cafe'
						 }else if(data[0].types[0]==='night_club' && data[0].types[1]==='bowling_alley'){
						 	dat = 'bowling_alley'
						 }else if(data[0].types[0]==='art_gallery' && data[1].types[0]==='art_gallery'){
						 	dat = 'art_gallery'
						 }else if(data[0].types[0]==='art_gallery' && data[0].types[1]==='museum'){
						 	dat = 'museum'
						 }else if(data[0].types[0]==='hospital' && data[0].types[1]==='university'){
						 	dat = 'university'
						 }else if(data[0].types[0]==='bar' && data[0].types[1]==='restaurant'){
						 	dat = 'restaurant'
						 }
						 var value = getCookie('preferences');
						 var newValue= value.split(',');
						// for(var i=0; i<data.results.length;i++){
							var results= new ResultsModel({});
							results.set({'name': data[i].name, 'id': data[i].place_id});
							var view = new ResultsView({collection:resultsCollection, model:results});
							var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
							var detailedView=new ResultsMiniView({
								model:results	
							});
							var me = document.currentScript;
							var newMe= me.src.split('&')
							console.log(newMe[8].split('6s'))
							var goodMe= newMe[8].split('6s')
							console.log(me)
							// var newMe= me.src.split('&')
							console.log(goodMe[1])
							view.render();
							$('#'+goodMe[1]+'1 ul').append(view.$el);
						}
					}else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
							var results= new ResultsModel({});
							var view = new ResultsView({collection:resultsCollection, model:results});
							var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
							var detailedView=new ResultsMiniView({
								model:results	
							});
						
							console.log('Here')
							view.zeroRender();
							var me = document.currentScript;
							var newMe= me.src.split('&')
							console.log(newMe[8].split('6s'))
							var goodMe= newMe[8].split('6s')
							console.log(goodMe[1])
							$('#'+goodMe[1]+'1 ul').html(view.$el);	
					}
				})

			},
			details : function (id) {
				var model = this
				var lati= Number(lat)
				var lngi= Number(lng)
				console.log(id)
				if(!this.get('hasCalled')) {
					var map = new google.maps.Map(document.getElementById('detailsView'+id+""), {
						center: new google.maps.LatLng(lati, lngi),
						zoom: 15
					});
					var request = {
						placeId: id
					};

					var infowindow = new google.maps.InfoWindow();
					var service = new google.maps.places.PlacesService(map);

					service.getDetails(request, function(details, status) {
						console.log(details)
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							model.set({'phone':details.formatted_phone_number,'website': details.website,'price': details.price_level,'rating': details.rating, 'hasCalled': true});
						}
					});
				}
			},
			speak: function(){
				console.log('hello there')
			}
		});



		var ResultsView=Backbone.View.extend({
			// var id = this.model.get('id');
			tagName: 'li',
			render: function(){
				var name = this.model.get('name');
				var id = this.model.get('id');
				var className = this.model.get('hasCalled') ? 'beenCalled': "";
				this.$el.html('<button type="button" class="push '+ className +'" data-id="'+id+'">'+name+'</button><br/><div id="detailsView'+id+'" class="deets"></div>');
				
			},
			zeroRender: function(){
				// $el='<ul class=renderResults></ul>'
				console.log('renderwith nada')
				this.$el.html('<h2>There are no results for this preference in your area.</h2>')
				var idHere= $('h1').innerHTML
				console.log(idHere)
				$(idHere).html(this.$el)
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
				var anchor = website ? '<a href="'+website+'" target="_blank" class="website">Visit Website</a>' : "";
				console.log(this.model);
				this.$el=$("#detailsView"+idz+"");
				console.log(this.$el);
				this.$el.html('<span class="'+priceClass+'"></span><span class="'+ratingClass+'"></span><span>'+phone+'</span>' + anchor);
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
			initialize: function() {

			},
			render: function(arr,index){
				this.$el.append('<div id='+index+'1><h1 class="sectionLabel" data-section="'+index+'">'+arr.replace('_', ' ')+'</h1><div id='+index+' class="map"></div><ul class="renderResults"></ul></div');
				this.$el.on('click', '#'+index+'1 .sectionLabel', this.isOpen.bind(this));

			},
			renderMap: function(activity){
				var lati= Number(lat)
				var lngi= Number(lng)
				var map = new google.maps.Map(document.getElementById(activity), {
					center: {lat: lati, lng: lngi},
					zoom: 12
				});
				var newActivity=''+activity+'';
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
			// console.log(map)
			service.nearbySearch(request, function(results, status){
				// console.log(results)
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {
						createMarker(results[i]);	
					}
				}
			});
		},
		isOpen: function(event) {
			var target = $(event.currentTarget);
			console.log(target)
			target.parent().toggleClass('isOpen');
			this.model.info(target.data('section'))
			this.renderMap(target.data('section'));
		}

	});	
		var HikingModel = Backbone.Model.extend({
			defaults :{'name':'','website':'','hasCalled': false,'renderMini':''}


		});

		var HikingView=Backbone.View.extend({
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
			getDetails: function (){
				this.model.set('renderMini','yes');
			}
		});

		var HikingMiniView= Backbone.View.extend({
			render : function (){
				console.log('MiniRender');
				var website = this.model.get('website');
				console.log(website);
				var idz= this.model.get('id');
				var anchor = website ? '<a href="'+website+'" target="_blank" class="website">Visit Website</a>' : "";
				console.log(this.model);
				this.$el=$("#detailsView"+idz+"");
				console.log(this.$el);
				this.$el.html(anchor);
				console.log('Miniend');
			},
			initialize: function () {
				this.listenTo(this.model,"change", this.render);
			}    
		});

		var HikingCollectionView= Backbone.View.extend({
			el: '#prefResults',
			initialize: function() {

			},
			renderHikeMap: function(){
				$.getJSON('https://outdoor-data-api.herokuapp.com/api.json?api_key=4016165acc967a9800153c77a3528d83&lat='+lat+'&lon='+lng+'&radius=25&callback=?', function(data) {
				console.log(data)
				var myLatlng = new google.maps.LatLng(0, 0);
				var myOptions = {
					zoom: 14,
					center: myLatlng,
					mapTypeId: google.maps.MapTypeId.TERRAIN
				}

				map = new google.maps.Map(document.getElementById('hiking'), myOptions);

				var bounds = new google.maps.LatLngBounds ();
				$.each(data['places'], function(place_id, place_array) {
					var location = new google.maps.LatLng(place_array['lat'], place_array['lon']);
					markerIcon = 'http://www.trailapi.com/ra-content/images/icons/wpt_icons/Default.png';
					createmarker(location, place_array['name'], place_array['name'], markerIcon, 0);
					bounds.extend (location);
				});
				map.fitBounds (bounds);
				for(var i=0; i<data.places.length;i++){
						// console.log(data)
						var results= new HikingModel({});
						if(data.places[i].activities.length !== 0){
							results.set({'name': data.places[i].name, 'website': data.places[i].activities[0].url,'id':data.places[i].unique_id});
							var view = new HikingView({collection:resultsCollection, model:results});
							var collectionView= new HikingCollectionView({collection:resultsCollection, model:results});
							var detailedView=new HikingMiniView({
								model:results	
							});
							view.render();
							$('#hiking1 ul').append(view.$el);
						}else{
							var results= new HikingModel({});
							results.set({'name': data.places[i].name,'id':data.places[i].unique_id});
							var view = new HikingView({collection:resultsCollection, model:results});
							var collectionView= new HikingCollectionView({collection:resultsCollection, model:results});
							var detailedView=new HikingMiniView({
								model:results	
							});
							view.render();
							$('#hiking1 ul').append(view.$el);
						}
						function createmarker (latlng, title, html, icon_image, markerset){
							var infowindow = new google.maps.InfoWindow({
								content: html
							});
							var marker = new google.maps.Marker({
								position: latlng, 
								map: map, 
								title: title,
								icon: icon_image
							});            
							google.maps.event.addListener(marker, 'click', function() {
								infowindow.open(map,marker);
							});

							return;
						} 
					}


				});
						},
						render : function (arr,index){
							this.$el.append('<div id='+index+'1><h1 class="sectionLabel" data-section="'+index+'">'+arr.replace('_', ' ')+'</h1><div id='+index+' class="map"></div><ul class="renderResults"></ul></div');
							this.$el.on('click', '#'+index+'1 .sectionLabel', this.isOpen.bind(this));

						},
						isOpen: function(event) {
							var target = $(event.currentTarget);
							target.parent().toggleClass('isOpen');
							this.renderHikeMap(target.data('section'));
						}
	});	

for (var j=0;j<newValue.length;j++){
	var results= new ResultsModel({});
	var resultsCollection = new ResultsCollection([],{model:results});
	var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results });
	var hiking= new HikingModel({})
	var hikingCollectionView = new HikingCollectionView({collection:resultsCollection, model:results });
	var ids=newValue[j];
	if(newValue[j]== 'hiking'){
		hikingCollectionView.render(ids,ids)
	}else{
		collectionView.render(ids,ids);
	}

	preferenceModel.set(ids, true);
	// if(newValue[j]=='hiking'){
	// 	console.log('No hiking in google api')
	// }else{
	// 	var lati= Number(lat)
	// 	var lngi= Number(lng)
	// 	var map = new google.maps.Map(document.getElementById(newValue[j]), {
	// 		center: {lat: lati, lng: lngi},
	// 		zoom: 14
	// 	});
	// 	var newActivity=''+newValue[j]+'';
	// 	var request = {
	// 		location: map.getCenter(),
	// 		radius: 5000,
	// 		types: [newActivity]
	// 	};
	// 		// var here = this
	// 		// function createMarker(place) {
	// 		// 	var placeLoc = place.geometry.location;
	// 		// 	var marker = new google.maps.Marker({
	// 		// 		map: map,
	// 		// 		position: place.geometry.location
	// 		// 	});

	// 		// 	google.maps.event.addListener(marker, 'click', function() {
	// 		// 		infowindow.setContent(place.name);
	// 		// 		infowindow.open(map, this);
	// 		// 	});
	// 		// }

	// 		// var infowindow = new google.maps.InfoWindow();
	// 		console.log(request)
	// 		var service = new google.maps.places.PlacesService(map);
	// 		service.nearbySearch(request, function(data, status){
	// 			console.log(status)
	// 			if (status == google.maps.places.PlacesServiceStatus.OK) {
	// 				for (var i = 0; i < data.length; i++) {
	// 					var dat= data[0].types[0]
	// 					 // console.log(dat)
	// 					 if(dat==="lodging"){
	// 					 	dat= "spa"
	// 					 }else if(dat==='store'){
	// 					 	dat= 'cafe'
	// 					 }else if(data[0].types[0]==='night_club' && data[0].types[1]==='bowling_alley'){
	// 					 	dat = 'bowling_alley'
	// 					 }else if(data[0].types[0]==='art_gallery' && data[1].types[0]==='art_gallery'){
	// 					 	dat = 'art_gallery'
	// 					 }else if(data[0].types[0]==='art_gallery' && data[0].types[1]==='museum'){
	// 					 	dat = 'museum'
	// 					 }else if(data[0].types[0]==='hospital' && data[0].types[1]==='university'){
	// 					 	dat = 'university'
	// 					 }else if(data[0].types[0]==='bar' && data[0].types[1]==='restaurant'){
	// 					 	dat = 'restaurant'
	// 					 }
	// 					 var value = getCookie('preferences');
	// 					 var newValue= value.split(',');
	// 					// for(var i=0; i<data.results.length;i++){
	// 						var results= new ResultsModel({});
	// 						results.set({'name': data[i].name, 'id': data[i].place_id});
	// 						var view = new ResultsView({collection:resultsCollection, model:results});
	// 						var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
	// 						var detailedView=new ResultsMiniView({
	// 							model:results	
	// 						});
	// 						var me = document.currentScript;
	// 						var newMe= me.src.split('&')
	// 						console.log(newMe[8].split('6s'))
	// 						var goodMe= newMe[8].split('6s')
	// 						console.log(me)
	// 						// var newMe= me.src.split('&')
	// 						console.log(goodMe[1])
	// 						view.render();
	// 						$('#'+goodMe[1]+'1 ul').append(view.$el);
	// 					}
	// 				}else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
	// 						var results= new ResultsModel({});
	// 						var view = new ResultsView({collection:resultsCollection, model:results});
	// 						var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
	// 						var detailedView=new ResultsMiniView({
	// 							model:results	
	// 						});
						
	// 						console.log('Here')
	// 						view.zeroRender();
	// 						var me = document.currentScript;
	// 						var newMe= me.src.split('&')
	// 						console.log(newMe[8].split('6s'))
	// 						var goodMe= newMe[8].split('6s')
	// 						console.log(goodMe[1])
	// 						$('#'+goodMe[1]+'1 ul').append(view.$el);	
	// 				}
	// 			})
				
	// }
}


preferenceView.render();

});

