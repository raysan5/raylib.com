$(document).ready(function() {
    
    // Init fancybox
    $('.fancybox').fancybox();

    var exampleName = [ 
        'sample_arkanoid',
        'sample_missile_commander',
        'sample_gorilas',
        'sample_snake',
        'sample_asteroids',
        'sample_asteroids_survival',
        'sample_pang',
        'sample_space_invaders',
        'sample_floppy',
        'sample_tetris',
        'game_drturtle',
        'game_just_do',
        'game_skully_escape',
        'game_koala_seasons',
        'game_light_my_ritual',
        'game_wave_collector',
        'game_transmission',
        'game_roomba',
        'game_repair'];

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
        'RE-PAIR'];

    for (var i = 0; i < exampleName.length; i++)
    {
        var filterType = exampleName[i].substring(0, exampleName[i].indexOf("_"));
        
        var linkTag;
        
        if (filterType == 'sample') linkTag = '<a class="fancybox fancybox.iframe" href="games/loader.html?name=' + exampleName[i] + '" title="' + exampleDesc[i] + '">';
        else if (filterType == 'game') linkTag = '<a target="_blank" href="games/' + exampleName[i].substring(5) + '.html" title="' + exampleDesc[i] + '">';
        else if (filterType == 'user')
        {
            switch (exampleName[i])
            {
                case 'user_super_red_rope': linkTag = '<a target="_blank" href="https://kurnic.itch.io/super-red-rope-puzzles" title="' + exampleDesc[i] + '">'; break;
                case 'user_taptojamp': linkTag = '<a target="_blank" href="http://marcmde.github.io/TapToJAmp_v2_0/" title="' + exampleDesc[i] + '">'; break;
                case 'user_funwithsat': linkTag = '<a target="_blank" href="http://marcmde.github.io/FunWithSATCollisions_v_1_0_Browser/" title="' + exampleDesc[i] + '">'; break;
                default: break;
            }
        }
        
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
