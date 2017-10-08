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
      //Check 21 set default volume here because no song playing, this is base level
      var $volumeFill =$('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});
      
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      //Check 20 Refactor for Play Song
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();
    } 
    //If This is the song that is playing right now
    else if (currentlyPlayingSongNumber === songNumber) {
      if (!currentSoundFile.isPaused()){
        currentSoundFile.pause();
        $('.main-controls .play-pause').html(playerBarPlayButton);
        $(this).html(playButtonTemplate);
      }
      //Check 20 refactor for playing and pausing songs
      else if (currentSoundFile.isPaused()){
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
          $(this).html(pauseButtonTemplate);
          $('main-controls .play-pause').html(playerBarPauseButton);
      }
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
  if (currentSoundFile){
    currentSoundFile.stop();
  }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    //check 20 Assign new sound object passed in via audioUrl attached to currentSongFromAlbum
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    //check 20 Settings Object - formats lists acceptable fomats and preload says load the song as soon as the page loads
        formats: ['mp3'],
        preload: true
    });
  setVolume(currentVolume);
};

//Check 21 seek uses the buzz setTime method to change position in a song to specified time
var seek = function (time){
  if (currentSoundFile){
    currentSoundFile.setTime(time);
  }
}

var setVolume = function(volume){
  if (currentSoundFile){
    currentSoundFile.setVolume(volume);
  }
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

var updateSeekBarWhileSongPlays = function () {
  if (currentSoundFile){
    //Check 21 bind the timeUpdate event to currentSoundFile, timeUpdate is custom Buzz event that fires repeatedly while time elapses during playback
    currentSoundFile.bind('timeupdate', function (event) {
    //Check 21 new method for calculating seekBarFillRatio.  Use Buzz's getTime() to get the current time of the song and getDuration() method for getting total length of song, both values return in seconds.
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};
var updateSeekPercentage = function($seekBar, seekBarFillRatio){
  //Check 21 Multiply by 100 to find a percentage
  var offsetXPercent = seekBarFillRatio * 100;
  //Check 21 Makes sure our percentage cannot be Less than 0 and no more than 100
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  //Check 21 convert our percentage to a string and add % to end, then set the width of the .fill and the left value of the .thumb class - CSS interprets the value as a percent instead of a unit-less number between 0-100
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
  //Check 21 use jQuery to find all DOM elements with a class of seekBar contained in the playerBar element - returns song seek and volume control
  var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event){
      //Check 21 set pageX a jQuery specific event value holding the X coordinate that event occurs at then we subtract the offset of the seek bar held in $this from the left side.
      var offsetX = event.pageX - $(this).offset().left;
      var barWidth = $(this).width();
      //Check 21 divide offsetX by the width of the entire bar to calculate the seekBarFillRatio
      var seekBarFillRatio = offsetX / barWidth;
      //Check 21 Conditional to check parent
       if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
      //Check 21 pass $this as the seekBar argument and seekBarFillRatio as eponymous argument to updateSeekBarPercentage
      updateSeekPercentage($(this), seekBarFillRatio);
    });
      //Check 21 Find elements with class of thumb inside our seekBars and add event listener for mousedown event
       $seekBars.find('.thumb').mousedown(function(event) {
      //Check 21 making $this equal to thumb node that was clicked.  Helps determine which bar dispatched the event songSeek or volumeControl then use parent method to select immediate parent of the node which is whichever seek thumb belongs to
         var $seekBar = $(this).parent();
 
         // Introduces new way to track events with bind event.  allows us to namespace event listeners, handler is identical to the click behavior.  we used mousemove event to $document to make sure that we can drag the thumb after mousedown even when the mouse leaves the seek bar.
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
 
        //Check 21 conditional
           if ($seekBar.parent().attr('class') == 'seek-control'){
             seek(seekBarFillRatio * currentSoundFile.getDuration());
           }
           else {
             setVolume(seekBarFillRatio)
           }
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // Check 21 bind the mouseUp Event uses unbind which ends the previous bind event.
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
};
//Object to keep track of index for which song is played on the Album
var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};
//Function that checks current song index, and increments by one to go to the next track
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
 
    currentSongIndex++;
    currentSoundFile.play();
//If this is the last song, revert to the first song on the album
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

//Variable which stores the currentlyPlayingSong Number
    var lastSongNumber = currentlyPlayingSongNumber;

 //Converting index to song number by adding 1 to it and storing that value
    //Assignment 19
    setSong(currentSongIndex+1);
    currentSoundFile.play();

    //Update Player to display correct song
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

   
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
//check 20 state there is no current buzz song playing
var currentSoundFile = null;
//check 20 state of volume
var currentVolume = 80;
//Previous button is part of main controls and goes to previous song
var $previousButton = $('.main-controls .previous');
//Next button is part of main controls and goes to next song
var $nextButton = $('.main-controls .next');
//Check 20 variable to hold $'.main-controls .play-pause' status
var $currentControlStatus = $('.main-controls .play-pause');
//Check 20 function for play/pause via playerBar
var togglePlayFromPlayerBar = function(){
  var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  
  if (currentSoundFile.isPaused()){
    songNumberCell.html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton)
    currentSoundFile.play();

  }
  else {
    songNumberCell.html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};
//When the page is loaded run this function
$(document).ready(function() {
    //Sets Current Album to our Filler Album
    setCurrentAlbum(albumPicasso);
    //Call the setupSeekBar function
    setupSeekBars();
    //When click previous button, go to previous song
    $previousButton.click(previousSong);
    //when click next button, go to next song
    $nextButton.click(nextSong);
    $currentControlStatus.click(togglePlayFromPlayerBar);
   
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


