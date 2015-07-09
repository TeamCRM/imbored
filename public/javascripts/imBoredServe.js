var userModel = Backbone.Model.extend({
    defaults : {
    	'username' : "",
    	'password' : ''
  //   	'preferences': [
  //   		{
  //   			'acitvityName': 'amusement_park',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'art_gallery',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'aquarium',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'bowling_alley',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'movie_theater',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'campground',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'cafe',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'restaurants',
  //   		    'isPrefered': false 
  //   		},{
  //   			'acitvityName': 'library',
  //   		    'isPrefered': false 
  //   		},{
  //               'acitvityName': 'museum',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'park',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'shopping_mall',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'stadium',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'zoo',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'university',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'swimming',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'hiking',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'book_stores',
  //               'isPrefered': false 
  //           },{
  //               'acitvityName': 'night_club',
  //               'isPrefered': false 
  //           }
		// ]
    },
    initialize : function () {
        this.fetch();
    },   
    submitForm : function() {

    }
});

var RegisterView = Backbone.View.extend({
    el: '#regisForm', 
    initialize: function () {
        
    },
    events : {
        "click button" : "submitForm",
        "keyup #password_confirm" : "checkPassword"
    },
    
    checkPassword: function() {
        if(this.$('#password').val() === this.$('#password_confirm').val()) {

            this.$('#submit').removeAttr('disabled');
    	} else {
    		this.$('#submit').attr('disabled', 'disabled');
    	}
    },
    // setPreference : function(name, isPrefered) {
    //     var preferences = this.get('preferences');
    //     for(var i=0; i<preferences.length; i++) {
    //         if(preferences[i].acitvityName === name) {
    //             preferences[i].isPrefered = isPrefered;
    //             break;
    //         }
    //     }
    //     this.set('preferences', preferences);
    // },
    submitForm: function (event) {
        this.model.submitForm(event);
    }
});

$(document).ready( function () {

var registerView = new RegisterView();

});