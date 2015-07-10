var userModel = Backbone.Model.extend({
  defaults : {
    'email' : "",
  	'password' : ''
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
  
  submitForm: function(event) {
    this.model.submitForm(event);
  }
});

$(document).ready( function () {

var registerView = new RegisterView();

});