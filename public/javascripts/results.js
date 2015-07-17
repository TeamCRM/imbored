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
				console.log('endJSON')
				}) 
			}
		});
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
		});


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
		}); 
		var ResultsCollection = Backbone.Collection.extend({
			model: ResultsModel,
			url: '/results',
			initialize: function () {
				this.fetch();
			}
		});
		var results= new ResultsModel({})
		var resultsCollection = new ResultsCollection([results]);
		for(var i=0; i<data.results.length;i++){
			var results= new ResultsModel({});
			results.set({'name': data.results[i].name, 'id': data.results[i].place_id})
			
			var view = new ResultsView({collection:resultsCollection, model:results })
			var detailedView=new ResultsMiniView({
				model:results	
			});
			view.render()
			$('#prefResults').append(view.$el);	
		}	
	});
});
