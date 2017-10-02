//States contents of each Song Row and makes it contain Song #, Name, and Duration
var createSongRow = function (songNumber, songName, songLength) {
    var template =
        //Uses Table Formatting so each item will have a cell
  '    <tr class = "album-view-song-item">'
+ '     <td class= "song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
+ '     <td class = "song-item-title">' + songName + '</td>'
+ '     <td class = "song-item-duration">' + songLength + '</td>'
+ '    </tr>';

    

// Create template for song list
   var $row = $(template);
    var clickHandler = function(){
        var songNumber = parseInt($(this).attr('data-song-number'));
//If a song is playing
	if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
//If song playing is not this song
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		setSong(songNumber);
        updatePlayerBarSong();
	} 
//If This is the song that is playing right now
        else if (currentlyPlayingSongNumber === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
	}
};
// If hovering over
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
// Song isn't Playing so show Play Button              
        if (songNumber !== currentlyPlayingSongNumber) {
            //Set Cell to Play Button
            songNumberCell.html(playButtonTemplate);
        }
    };
//When the mouse leaves    
    var offHover = function(event){
        //assign a variable from searching the entire dom for all itons with son-item-number class
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
//Song isn't Currently playing so display song number
        if (songNumber !== currentlyPlayingSongNumber) {
            //Set Cell to Song Number
            songNumberCell.html(songNumber);
}
};
    //Call click action based on song number
    $row.find('.song-item-number').click(clickHandler);
    //Action based on hover or leaving the hover
    $row.hover(onHover, offHover);
    //Return the row as it should be displayed
    return $row;
};

//Assignment from checkpoint 19    
// Create Set Song Function - Takes one arguement songNumber will return currentlyPlayingSongNumber and              currentSongFromAlbum
var setSong = function(songNumber){
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
};
    
var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

//Sets up the Current Album that is selected
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    //Creates Jquery objects based on classes
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    //Set text and attributes for the objects
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
//Creates a new song row for each track, with track number, title, song, and duration
    for (var i=0; i < album.songs.length; i++){
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};
//Object to keep track of index for which song is played on the Album
var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};
//Function that checks current song index, and increments by one to go to the next track
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
 
    currentSongIndex++;
//If this is the last song, revert to the first song on the album
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

//Variable which stores the currentlyPlayingSong Number
    var lastSongNumber = currentlyPlayingSongNumber;

 //Converting index to song number by adding 1 to it and storing that value
    //Assignment 19
    setSong(currentSongIndex+1);
   

    //Update Player to display correct song
    updatePlayerBarSong();

    // Jquery objects to hold values of the next and previous cells locations
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    //Assign pause button to currently playing track
    $nextSongNumberCell.html(pauseButtonTemplate);
    //Assign song number to the previous song
    $lastSongNumberCell.html(lastSongNumber);
};
//Function to implement the previous song button by deducting 1 from the index
var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  
    currentSongIndex--;
//If at the beginning of the album move to end of the album on previous click
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

  //Variable to keep track of the current song or last song played
    var lastSongNumber = currentlyPlayingSongNumber;

//Add one to song index in order to find song number and save that value
    //Assignment 19
    setSong(currentSongIndex+1);
    

   
    updatePlayerBarSong();
//Call the Pause button for the main controls
    $('.main-controls .play-pause').html(playerBarPauseButton);
//Search through DOM for songItemNumber with value of currentlyPlayingSongNumber
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
//Search through DOM for songItemNumber with value of lastSongNumber    
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
//Create a function to update the music player
var updatePlayerBarSong = function(){
   //Update Song title, artist, the mobile display for song and artist, as well as implement the pause button //since a song is playing
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};
//Create Templates for Play and Pause Buttons as well as call the Spans to show the icons.
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton ='<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//State of Playing Song
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
//Previous button is part of main controls and goes to previous song
var $previousButton = $('.main-controls .previous');
//Next button is part of main controls and goes to next song
var $nextButton = $('.main-controls .next');

//When the page is loaded run this function
$(document).ready(function() {
    //Sets Current Album to our Filler Album
    setCurrentAlbum(albumPicasso);
    //When click previous button, go to previous song
    $previousButton.click(previousSong);
    //when click next button, go to next song
    $nextButton.click(nextSong);
   
});

 
// Comment Out Non Functional Code
//   var albums = [albumPicasso, albumMarconi, albumDracarys];
//    var index = 1;
//    albumImage.addEventListener("click", function(event){
//        setCurrentAlbum(albums[index]);
//        index++;
//        if (index == albums.length){
//            index = 0;
//       }
//  });


