
// hasChanged for backbone
$(document).ready(function() {
	$.getJSON('https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+in+Portland&key=AIzaSyAfvCCGMhH4IKLkmdN6_60Qke093ynDRbc', function(data) {

var ResultsModel = Backbone.Model.extend({
	defaults :{'name':data.results[0].name,'id':data.results[0].place_id, 'phone':'','website':'','price':'','rating':''},
	details : function (id) {
		$.getJSON('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJnWi4GeSglVQRnr6woHCWTIc&key=AIzaSyAfvCCGMhH4IKLkmdN6_60Qke093ynDRbc', function (details){
					this.set('phone',details.formatted_phone_number);
					this.set('website', details.website);
					this.set('price', details.price_level);
					this.set('rating', details.rating);
				}) 
		//Some rendering info in here
	}
})

})

var ResultsView=Backbone.View.extend({
	render: function(){
		var name = this.model.get('name');
		var id = this.model.get('id')
		this.$el.html('<li><button type="button" class="push" data-id="'+id+'">'+name+'</button><div class="detailsView"></div></li>')
		
	},
	initialize: function () {
        this.model.on("change", this.render, this);
    },
    events :{
    	'click button': "getDetails"
    }
    getDetails: function (){
    	console.log("hello")
    	this.model.details();
    }

})	

var ResultsMiniView= Backbone.View.extend({
	render : function (){
		var phone= this.model.get('phone');
		var website = this.model.get('website');
		var price= this.model.get('price');
		var rating= this.model.get('rating')
		this.$el.html('<p>'+phone+' '+website+' '+price+' '+rating+'</p>')
	},
	initialize: function () {
        this.model.on("changedAttributes", this.render, this);
    }    

}) 
var results= new ResultsModel({})
var view = new ResultsView({model:results })
var detailedView=new ResultsMiniView({
	model:results
})
	view.render()


	$('#prefResults').append(view.$el);
	$('.detailsView').append(detailedView.$el);



})	

