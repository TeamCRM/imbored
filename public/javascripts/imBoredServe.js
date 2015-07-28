
var prefArr =["amusement_park","art_gallery","aquarium","bowling_alley","movie_theater","campground","cafe","restaurant","library","museum","park","shopping_mall","stadium","zoo","university","swimming","spa","hiking","book_store","night_club"]

function apinameToFriendlyName(apiname){
	return apiname+"!"
}
var friendlyPrefs= prefArr.map(apinameToFriendlyName)
	

var prefGrid= function(prefArr, colCount){
	var rowCount = Math.ceil(prefArr.length / colCount);
	var happyArr = [];
	for(var i = 0; i<prefArr.length; i+= rowCount) {
		var splitGrid= prefArr.slice(i, rowCount+i);
		happyArr.push(splitGrid);
	}

	return happyArr;
}

var happyArr = prefGrid(friendlyPrefs, 4);
var renderColumn = function (col) {
	return "<tr>" + col.map(renderRow)+ "</tr> \n";

}

var renderRow = function(friendlyPref, i) {
	return "\t <td>" + '<input type="checkbox" name="'+ i +'" >'+ friendlyPref + "</td> \n";
}

console.log(happyArr.map(renderColumn).join("\n"));



var checkPassword = function() {
	console.log('Whatever');
    if($('#password').val().length > 0 && $('#password').val() === $('#password_confirm').val()) {
		$('#submit').removeAttr('disabled');
	}
};


$("#password_confirm").on('keyup', checkPassword);







