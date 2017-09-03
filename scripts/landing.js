
//Create function to make our selling points appear
var animatePoints= function(){
    //actual function for revealing
        var revealPoint = function(){
            //define the styling for the appear
            $(this).css({
                opacity: 1,
                transform: 'scaleX(1) translateY(0)'
        });
};
    //Reveal EACH of our points with point class by the revealPoint styling
    $.each($('.point'), revealPoint);
    
};
//Once the window is loaded - if Screen is bigger than 950px automatically display points and do not wait for scroll
$(window).load(function() {
    if ($(window).height()>950){
        animatePoints();
    }
    //Set our page to recognize when we scroll a set distance to display our reveal points
var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
        $(window).scroll(function(event){
         if ($(window).scrollTop() >= scrollDistance){
             animatePoints();
         }   
        });  
});