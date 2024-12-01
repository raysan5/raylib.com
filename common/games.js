$(document).ready(function() {
    
    // Init fancybox
    $('.fancybox').fancybox();

    var exampleName = [ 
        'classic_arkanoid',
        'classic_missile_commander',
        'classic_gorilas',
        'classic_snake',
        'classic_asteroids',
        'classic_asteroids_survival',
        'classic_pang',
        'classic_space_invaders',
        'classic_floppy',
        'classic_tetris',
        'game_drturtle',
        'game_just_do',
        'game_skully_escape',
        'game_koala_seasons',
        'game_light_my_ritual',
        'game_wave_collector',
        'game_transmission',
        'game_roomba',
        'game_repair',
        'game_retro_maze_3d'];

    var exampleDesc = [
        'arkanoid',
        'missile commander',
        'gorilas',
        'snake',
        'asteroids',
        'asteroids survival',
        'pang',
        'space invaders',
        'floppy',
        'tetris',
        'Dr Turtle & Mr Gamera',
        'JUST DO',
        'Skully Escape',
        'Koala Seasons',
        'LIGHT MY RITUAL',
        'Wave Collector',
        'Transmission Mission',
        'Cat vs Roomba',
        'RE-PAIR',
        'RETRO MAZE 3D'];

    for (var i = 0; i < exampleName.length; i++)
    {
        var filterType = exampleName[i].substring(0, exampleName[i].indexOf("_"));
        
        var linkTag;
        
        if (filterType == 'classic') linkTag = '<a class="fancybox fancybox.iframe" href="games/classics/loader.html?name=' + exampleName[i] + '" title="' + exampleDesc[i] + '">';
        else if (filterType == 'game') linkTag = '<a target="_blank" href="games/' + exampleName[i].substring(5) + '.html" title="' + exampleDesc[i] + '">';

        $('#container').append(
            '<div class="mix f' + filterType + '">' + linkTag +
            '<img width="400" height="225" src="../games/img/' + exampleName[i] + '.png"><div class="extext"><p>' + exampleDesc[i] + '</p></div></a>' +
            '</div>');

        $('#container a .extext').hide();
    }

    // Instantiate MixItUp:
	$('#container').mixItUp();

    $("#container a").hover(
        function(){ $(this).find(".extext").show(); },
        function(){ $(this).find(".extext").hide(); });

/*
    $("#container a img").hover(
        function() { $(this).stop().animate({ opacity:0.6 }, 200, "easeOutQuad" ); },
        function() { $(this).stop().animate({ opacity:0 }, 200, "easeOutQuad" ); }
    )
*/
});
