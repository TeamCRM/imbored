
var prefArr =["amusement_park","art_gallery","aquarium","bowling_alley","movie_theater","campground","cafe","restaurant","library","museum","park","shopping_mall","stadium","zoo","university","swimming","spa","hiking","book_store","night_club"]



for(var i=0;i<prefArr.length;i++){
    $(".prefs").append('<input type="checkbox" name="'+i+'" >'+prefArr[i]+'</br>')
}











