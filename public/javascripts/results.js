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

var PreferenceView = Backbone.View.extend({
    el: '.xtra',
    initialize: function() {},
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
    openPref: function() {
    	$('.prefs').toggleClass('hidden');
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
	console.log(document.cookie);
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
	var newValue= value.split(':');
	var goodValue=JSON.parse("[" + newValue[1] + "]");
	console.log(goodValue[0][0]);
			
	var ResultsModel = Backbone.Model.extend({
    	defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':''},
    	details : function(id) {
			var model = this;
			console.log(id);
			$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function (details){
					console.log(details.result);
					model.set({'phone':details.result.formatted_phone_number,'website': details.result.website,'price': details.result.price_level,'rating': details.result.rating});
					console.log('endJSON');
			}); 
		}
	});

	var ResultsView=Backbone.View.extend({
		render: function(){
			var name = this.model.get('name');
			var id = this.model.get('id');
			this.$el.html('<li><button type="button" class="push" data-id="'+id+'">'+name+'</button><div id="detailsView'+id+'"></div></li>');
		},
		initialize: function () {
    		this.model.on("change", this.render, this);
		},
		events :{
			'click .push': "getDetails"
		},
	    getDetails: function (event){
	    	console.log("hello");
	    	// var views= new ResultsMiniView({model:ResultsModel})
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
			var rating= this.model.get('rating');
			var idz= this.model.get('id');
			console.log(this.model);
			this.$el=$("#detailsView"+idz+"");
			console.log(this.$el);
			this.$el.html('<span>'+phone+'</span><span> '+website+'</span><span> '+price+'</span><span> '+rating+'</span>');
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
		render: function(arr,index){
			this.$el=$('#prefResults');
			this.$el.append('<div id='+index+'>'+arr+'</div');
			console.log(this.model);
		}
	});	
			
	for (var j=0;j<goodValue[0].length;j++){
		var results= new ResultsModel({});
		var resultsCollection = new ResultsCollection([],{model:results});
		var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results });
		for(var h=0;h<1;h++){
			var str='';
			var ids=goodValue[0][j];
			collectionView.render(ids,ids);
		}
		$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+goodValue[0][j]+'+in+Portland&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function(data) {
			var dat= data.results[0].types[0];
			if(dat==="lodging"){
				dat= "spa"
			}
			console.log(dat);	
			var value = getCookie('preferences');
			var newValue= value.split(':');
			var goodValue=JSON.parse("[" + newValue[1] + "]");
			for(var i=0; i<data.results.length;i++){
				var results= new ResultsModel({});
				results.set({'name': data.results[i].name, 'id': data.results[i].place_id});
				var view = new ResultsView({collection:resultsCollection, model:results});
				var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
				var detailedView=new ResultsMiniView({
					model:results	
				});
			view.render();
			console.log(dat);
			$('#'+dat+'').append(view.$el);	
			}
		});
	}
	var preferenceModel = new PreferenceModel();
	var preferenceView = new PreferenceView({model: preferenceModel});
	preferenceView.render();
});