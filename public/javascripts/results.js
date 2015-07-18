// hasChanged for backbone
$(document).ready(function() {
	console.log(document.cookie)
 function getCookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }
//  function getCookie(name) {
//   var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
//   var result = regexp.exec(document.cookie);
//   return (result === null) ? null : result[1];
// }
	var value = getCookie('preferences');
	var newValue= value.split(':')
	var goodValue=JSON.parse("[" + newValue[1] + "]");
	// var newValue= '{"'+value[0]+'"'+value+'}'
	// var goodValue=JSON.parse(newValue)
	console.log(goodValue[0].length)
			var ResultsModel = Backbone.Model.extend({
	    	defaults :{'name':'','id':'', 'phone':'','website':'','price':'','rating':''},
	    	details : function (id) {
				var model = this
				console.log(id)
				$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function (details){
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
		var ResultsCollectionView= Backbone.View.extend({
			render: function(arr,index){
				this.$el=$('#prefResults')
				this.$el.append('<div id='+index+'>'+arr+'</div>')
				console.log(this.model)
			}
		})
	// var arr= ["cafe",'gym','park']
	for (var j=0;j<goodValue[0].length;j++){
			var results= new ResultsModel({})
		var resultsCollection = new ResultsCollection([],{model:results});
		var collectionView= new ResultsCollectionView({collection:resultsCollection, model:results })
			for(var h=0;h<1;h++){
			var str=''
			var ids=j;
			console.log(ids)
			for(var k=0;k<goodValue[0].length;k++){
				str+=goodValue[0][k]+'  '
			}
			console.log('div here')
			collectionView.render(str,ids)
		}
	$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+goodValue[0][j]+'+in+Portland&key=AIzaSyA6GqWRLxW7Lxvzunccd_Gg5VtMOVR6Zb4', function(data) {
		console.log(data.results.length)	

	
		// var otherArr =["cafe",'gym','park']
		var value = getCookie('preferences');
		var newValue= value.split(':')
		var goodValue=JSON.parse("[" + newValue[1] + "]");
	
		for(var i=0; i<data.results.length;i++){
			var results= new ResultsModel({});
			results.set({'name': data.results[i].name, 'id': data.results[i].place_id})
			var view = new ResultsView({collection:resultsCollection, model:results })
			var detailedView=new ResultsMiniView({
				model:results	
			});
			view.render();
			console.log(j)
			$('#'+0+'').append(view.$el);	
			// $('#encompass').append(collectionView.$el)
		}	
	});
	}
});


