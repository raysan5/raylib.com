$(document).ready(function() {

    // Init fancybox
    $('.fancybox').fancybox();

    var exampleName = [
        'core_basic_window',
        'core_basic_screen_manager',
        'core_input_keys',
        'core_input_mouse',
        'core_input_mouse_wheel',
        'core_input_gamepad',
        'core_input_multitouch',
        'core_input_gestures',
        'core_2d_camera',
        'core_2d_camera_platformer',
        'core_2d_camera_mouse_zoom',
        'core_3d_camera_mode',
        'core_3d_camera_free',
        'core_3d_camera_first_person',
        'core_3d_picking',
        'core_world_screen',
        'core_custom_logging',
        'core_window_letterbox',
        'core_drop_files',
        'core_random_values',
        'core_scissor_test',
        'core_storage_values',
        'core_vr_simulator',
        'core_loading_thread',
        'core_quat_conversion',
        'core_window_flags',
        'core_split_screen',
        'core_window_should_close',
        'core_smooth_pixelperfect',
        'core_custom_frame_control',
        'shapes_basic_shapes',
        'shapes_bouncing_ball',
        'shapes_colors_palette',
        'shapes_logo_raylib',
        'shapes_logo_raylib_anim',
        'shapes_rectangle_scaling',
        'shapes_lines_bezier',
        'shapes_collision_area',
        'shapes_following_eyes',
        'shapes_easings_ball_anim',
        'shapes_easings_box_anim',
        'shapes_easings_rectangle_array',
        'shapes_draw_ring',
        'shapes_draw_circle_sector',
        'shapes_draw_rectangle_rounded',
        'shapes_top_down_lights',
        'textures_logo_raylib',
        'textures_mouse_painting',
        'textures_rectangle',
        'textures_srcrec_dstrec',
        'textures_image_drawing',
        'textures_image_generation',
        'textures_image_loading',
        'textures_image_processing',
        'textures_image_text',
        'textures_to_image',
        'textures_raw_data',
        'textures_particles_blending',
        'textures_npatch_drawing',
        'textures_background_scrolling',
        'textures_sprite_button',
        'textures_sprite_explosion',
        'textures_bunnymark',
        'textures_blend_modes',
        'textures_draw_tiled',
        'textures_polygon',
        'textures_gif_player',
        'textures_fog_of_war',
        'text_raylib_fonts',
        'text_font_spritefont',
        'text_font_loading',
        'text_font_filters',
        'text_font_sdf',
        'text_format_text',
        'text_input_box',
        'text_writing_anim',
        'text_rectangle_bounds',
        'text_unicode',
        'text_draw_3d',
        'text_codepoints_loading',
        'models_animation',
        'models_billboard',
        'models_box_collisions',
        'models_cubicmap',
        'models_first_person_maze',
        'models_geometric_shapes',
        'models_mesh_generation',
        'models_mesh_picking',
        'models_loading',
        'models_loading_vox',
        'models_loading_gltf',
        'models_orthographic_projection',
        'models_rlgl_solar_system',
        'models_skybox',
        'models_yaw_pitch_roll',
        'models_heightmap',
        'models_waving_cubes',
        'shaders_model_shader',
        'shaders_shapes_textures',
        'shaders_custom_uniform',
        'shaders_postprocessing',
        'shaders_palette_switch',
        'shaders_raymarching',
        'shaders_texture_drawing',
        'shaders_texture_waves',
        'shaders_texture_outline',
        'shaders_julia_set',
        'shaders_eratosthenes',
        'shaders_basic_lighting',
        'shaders_fog',
        'shaders_simple_mask',
        'shaders_spotlight',
        'shaders_hot_reloading',
        'shaders_mesh_instancing',
        'shaders_multi_sample2d',
        'audio_module_playing',
        'audio_music_stream',
        'audio_raw_stream',
        'audio_sound_loading',
        'audio_multichannel_sound',
        'audio_stream_effects'];

    for (var i = 0; i < exampleName.length; i++)
    {
        var filterType = exampleName[i].substring(0, exampleName[i].indexOf("_"));
        var exampleBase = exampleName[i].slice(exampleName[i].indexOf('_') + 1);
        var exampleDesc = exampleBase.replace('_', ' ');

        $('#container').append(
            '<div class="mix f' + filterType + '">' +
            '<a class="fancybox fancybox.iframe" href="examples/' + filterType + '/' + 'loader.html?name=' + exampleName[i] + '" title="' + exampleDesc + '">' +
            '<img width="400" height="225" src="https://raw.githubusercontent.com/raysan5/raylib/master/examples/' + filterType + '/' + exampleName[i] + '.png"><div class="extext"><p>' + exampleDesc + '</p></div></a>' +
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