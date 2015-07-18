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
                console.log(row);
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

$(document).ready(function() {
	console.log(document.cookie)
 	function getCookie(name) {
	    var re = new RegExp(name + "=([^;]+)");
	    var value = re.exec(document.cookie);
	    return (value != null) ? unescape(value[1]) : null;
  	}
	var value = getCookie('preferences');
	var newValue= value.split(':');
	var goodValue=JSON.parse("[" + newValue[1] + "]");
	console.log(goodValue[0].length);
	for (var j=0;j<goodValue[0].length;j++){
		$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+goodValue[0][j]+'+in+Portland&key=AIzaSyCxvlbUfh0iI6DcR9Na8vJSPqEO6Mje200', function(data) {	
			var ResultsModel = Backbone.Model.extend({
	    		defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':''},
	    		details : function (id) {
					var model = this;
					console.log(id);
					$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyCxvlbUfh0iI6DcR9Na8vJSPqEO6Mje200', function (details){
						console.log(details.result);
						model.set({'phone':details.result.formatted_phone_number,'website': details.result.website,'price': details.result.price_level,'rating': details.result.rating});
						console.log('endJSON')
					}) 
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
				render: function(arr){
					this.$el=$('#encompass');
					this.$el.html('<span>'+arr+'</span>');
				}
			});
			var results= new ResultsModel({});
			var resultsCollection = new ResultsCollection([results]);
			var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results});
			var value = getCookie('preferences');
			var newValue= value.split(':');
			var goodValue=JSON.parse("[" + newValue[1] + "]");
			for(var h=0;h<1;h++) {
				var str='';
				for(var k=0;k<goodValue[0].length;k++) {
					str+=goodValue[0][k]+'  ';
				}
				collectionView.render(str);
			}
			for(var i=0; i<data.results.length;i++) {
				var results= new ResultsModel({});
				results.set({'name': data.results[i].name, 'id': data.results[i].place_id});
				var view = new ResultsView({collection:resultsCollection, model:results});
				var detailedView=new ResultsMiniView({
					model:results	
				});
				view.render();
				
				$('#prefResults').append(view.$el);	
			}	
		});
	}
	var preferenceModel = new PreferenceModel();
	var preferenceView = new PreferenceView({model: preferenceModel});
	preferenceView.render();
});