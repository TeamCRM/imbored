//Preference List
var prefArr =["amusement_park","art_gallery","aquarium","bowling_alley","movie_theater","campground","cafe","restaurant","library","museum","park","shopping_mall","stadium","zoo","university","swimming","spa","hiking","book_store","night_club"]

//Register Page: Preference Table

// function apinameToFriendlyName(apiname){
// 	return apiname;
// }
// var friendlyPrefs= prefArr.map(apinameToFriendlyName)
// 	
// 
// var prefGrid= function(prefArr, colCount){
// 	var rowCount = Math.ceil(prefArr.length / colCount);
// 	var happyArr = [];
// 	for(var i = 0; i<prefArr.length; i+= rowCount) {
// 		var splitGrid= prefArr.slice(i, rowCount+i);
// 		happyArr.push(splitGrid);
// 	}
// 	return happyArr;
// }
// 
// var happyArr = prefGrid(friendlyPrefs, 5);
// var renderColumn = function(col) {
// 	return "<tr class='prefRow'>" + col.map(renderRow)+ "</tr>";
// }
// 
// var renderRow = function(friendlyPref, i) {
// 	return "<td>" + '<input type="checkbox" name="'+ i +'" >'+ friendlyPref.replace('_', ' ') + "</td>";
// }

var height = 5
var width = 4
var html = ""
var counter= 0
for(var i= 0; i< height; i++) {
	html+= '<tr>'

	for(var j= 0; j< width; j++) {
		var mult = j+counter;
		console.log(mult)
		html += '<td ><label><input type=checkbox name= '+ mult +'>'+ prefArr[mult].replace('_', ' ') + '</label></td>'
	
	}
	html += '</tr>'
	counter += 4
}
console.log(html)
$(".prefs").append(html);

// console.log(happyArr.map(renderColumn).join("\n"));

//Login Check Password 
var checkPassword = function() {
	console.log('Whatever');
    if($('#password').val().length > 0 && $('#password').val() === $('#password_confirm').val()) {
		$('#submit').removeAttr('disabled');
	}
};


$("#password_confirm").on('keyup', checkPassword);







