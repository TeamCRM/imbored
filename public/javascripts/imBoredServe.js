//Preference List Array
var prefArr =["amusement_park","art_gallery","aquarium","bowling_alley","movie_theater","campground","cafe","restaurant","library","museum","park","shopping_mall","stadium","zoo","university","swimming","spa","hiking","book_store","night_club"]


//Register Page: Render Preference Table

var height = 5;
var width = 4;
var html = "";
var counter = 0;

for (var i = 0; i< height; i++) {
	
	html += '<tr>';
	
	for (var j = 0; j< width; j++) {
		
		var tbl = j+counter;
		
		html += '<td ><input type="checkbox" class="prefCheck" name= '+ tbl +'>'+ prefArr[tbl].replace('_', ' ') + '</td>'
	};
	
	html += '</tr>'
	counter += 4
};

$(".prefs").append(html).hide();
$(".buttons").hide();

//Register Page: Check Password Matches and user selects at least one preferenceid

var checkPassword = function() {
	
    if ($('#password').val().length > 0 && $('#password').val() === $('#password_confirm').val()) {

			
			// $('#regSubmit').removeAttr('disabled');
			$('.confirmPass').html('');
			$(".prefs").show()
			$(".buttons").show();
			return true		
		
		} else { 
			
				$(".confirmPass").html("Passwords do not match");
				return false
			}
};

$("#password_confirm").on('keyup', checkPassword);

var prefSelect = function(event) {
	if (event.currentTarget.checked && checkPassword()) {
		$('#regSubmit').removeAttr('disabled');
	}
}
$('.prefCheck').on('click', prefSelect);
