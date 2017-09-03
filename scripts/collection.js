//Create function that defines the template for our album collection view
var buildCollectionItemTemplate = function (){
    var template =
  ' <div class=" collection-album-container column fourth ">'
 +'  <img src=" assets/images/album_covers/01.png "/>'
 +'           <div class= "collection-album-info caption">'
 +'               <p>'
 +'                   <a class="album-name" href="album.html"> The Colors </a>'
 +'                       <br/>'
 +'                    <a href="album.html"> Pablo Picasso </a>'
 +'                       <br/>'
 +'                   X Songs'
 +'                       <br/>'
 +'               </p>'
 +'           </div>'
 +'   </div>'
;
    //Display our Template that we created
    return $(template);
};

//When the page is loaded
$(window).load(function(){
    //Container will hold the Images of Album Covers
    var $collectionContainer = $('.album-covers');
    //Start with a clean slate - Empty Container
    $collectionContainer.empty();
    //For the page, start at first album and increment by 1 until we display 12 album images on our collection
    for (var i = 0; i < 12; i++){
        //Actually Build the Collection Album View
        var $newThumbnail = buildCollectionItemTemplate();
        //Append or ADD the new thumbnail to the collection view
        $collectionContainer.append($newThumbnail);
    }
});