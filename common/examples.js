$(document).ready(function() {

    // Init fancybox
    $('.fancybox').fancybox();

	function exampleEntry(difficulty, module, base) {
		return {difficulty, module, base, name: module + '_' + base }
	}

	function findExampleByName(examples, targetName) {
		for (var example of examples) {
			if (example.name == targetName) {
				return example
			}
		}
	}

	function findExampleIndexByName(examples, targetName) {
		return examples.findIndex(example => example.name == targetName)
	}

	function applyByFunctionFilter(searchString) {
		var filterText = searchString.toLowerCase()
		if (filterText === "") {
			$('#container').mixItUp('filter', exampleDivs);
			$('#matches_counter').hide();
			return
		}
		$('#matches_counter').show();

		// Using a set to avoid duplicates
		const filteredExampleIndexes = new Set();

		for (var functionName in functionUsages) {
			if (!functionName.toLowerCase().includes(filterText)) continue;

			for (var usage of functionUsages[functionName]) {
				const exampleIndex = findExampleIndexByName(exampleData, usage);
				filteredExampleIndexes.add(exampleIndex);
			}
		}

		// Check all functions and all tags for any match
		for (var functionName in examplesTags) {
			const matchingTags = examplesTags[functionName].filter(tagItem => tagItem.includes(filterText));
			if (matchingTags.length > 0) {
				const exampleIndex = findExampleIndexByName(exampleData, functionName);
				filteredExampleIndexes.add(exampleIndex);
			}
		}

		const filteredDivs = Array.from(filteredExampleIndexes).map(index => exampleDivs[index]);
		$('#container').mixItUp('filter', filteredDivs);
		$('#matches_counter').text(`Found ${filteredExampleIndexes.size} examples`);
	}

//EXAMPLE_DATA_LIST_START
    var exampleData = [
        exampleEntry('⭐☆☆☆', 'core', 'basic_window'),
        exampleEntry('⭐☆☆☆', 'core', 'input_keys'),
        exampleEntry('⭐☆☆☆', 'core', 'input_mouse'),
        exampleEntry('⭐☆☆☆', 'core', 'input_mouse_wheel'),
        exampleEntry('⭐☆☆☆', 'core', 'input_gamepad'),
        exampleEntry('⭐☆☆☆', 'core', 'input_multitouch'),
        exampleEntry('⭐⭐☆☆', 'core', 'input_gestures'),
        exampleEntry('⭐⭐⭐☆', 'core', 'input_gestures_testbed'),
        exampleEntry('⭐⭐☆☆', 'core', 'input_virtual_controls'),
        exampleEntry('⭐⭐☆☆', 'core', '2d_camera'),
        exampleEntry('⭐⭐☆☆', 'core', '2d_camera_mouse_zoom'),
        exampleEntry('⭐⭐⭐☆', 'core', '2d_camera_platformer'),
        exampleEntry('⭐⭐⭐⭐️', 'core', '2d_camera_split_screen'),
        exampleEntry('⭐☆☆☆', 'core', '3d_camera_mode'),
        exampleEntry('⭐☆☆☆', 'core', '3d_camera_free'),
        exampleEntry('⭐⭐☆☆', 'core', '3d_camera_first_person'),
        exampleEntry('⭐⭐⭐☆', 'core', '3d_camera_split_screen'),
        exampleEntry('⭐⭐⭐☆', 'core', '3d_camera_fps'),
        exampleEntry('⭐⭐☆☆', 'core', '3d_picking'),
        exampleEntry('⭐⭐☆☆', 'core', 'world_screen'),
        exampleEntry('⭐⭐⭐☆', 'core', 'window_flags'),
        exampleEntry('⭐⭐☆☆', 'core', 'window_letterbox'),
        exampleEntry('⭐☆☆☆', 'core', 'window_should_close'),
        exampleEntry('⭐⭐⭐☆', 'core', 'custom_logging'),
        exampleEntry('⭐⭐☆☆', 'core', 'drop_files'),
        exampleEntry('⭐☆☆☆', 'core', 'random_values'),
        exampleEntry('⭐⭐☆☆', 'core', 'storage_values'),
        exampleEntry('⭐⭐⭐☆', 'core', 'vr_simulator'),
        exampleEntry('⭐☆☆☆', 'core', 'scissor_test'),
        exampleEntry('⭐☆☆☆', 'core', 'basic_screen_manager'),
        exampleEntry('⭐⭐⭐⭐️', 'core', 'custom_frame_control'),
        exampleEntry('⭐⭐⭐☆', 'core', 'smooth_pixelperfect'),
        exampleEntry('⭐☆☆☆', 'core', 'random_sequence'),
        exampleEntry('⭐⭐⭐☆', 'core', 'automation_events'),
        exampleEntry('⭐⭐☆☆', 'core', 'high_dpi'),
        exampleEntry('⭐☆☆☆', 'shapes', 'basic_shapes'),
        exampleEntry('⭐☆☆☆', 'shapes', 'bouncing_ball'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'colors_palette'),
        exampleEntry('⭐☆☆☆', 'shapes', 'logo_raylib'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'logo_raylib_anim'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'rectangle_scaling'),
        exampleEntry('⭐☆☆☆', 'shapes', 'lines_bezier'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'collision_area'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'following_eyes'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'easings_ball_anim'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'easings_box_anim'),
        exampleEntry('⭐⭐⭐☆', 'shapes', 'easings_rectangle_array'),
        exampleEntry('⭐⭐⭐☆', 'shapes', 'ring_drawing'),
        exampleEntry('⭐⭐⭐☆', 'shapes', 'circle_sector_drawing'),
        exampleEntry('⭐⭐⭐☆', 'shapes', 'rounded_rectangle_drawing'),
        exampleEntry('⭐⭐⭐⭐️', 'shapes', 'top_down_lights'),
        exampleEntry('⭐⭐⭐⭐️', 'shapes', 'rectangle_advanced'),
        exampleEntry('⭐⭐⭐☆', 'shapes', 'splines_drawing'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'digital_clock'),
        exampleEntry('⭐⭐☆☆', 'shapes', 'double_pendulum'),
        exampleEntry('⭐☆☆☆', 'textures', 'logo_raylib'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'srcrec_dstrec'),
        exampleEntry('⭐⭐☆☆', 'textures', 'image_drawing'),
        exampleEntry('⭐⭐☆☆', 'textures', 'image_generation'),
        exampleEntry('⭐☆☆☆', 'textures', 'image_loading'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'image_processing'),
        exampleEntry('⭐⭐☆☆', 'textures', 'image_text'),
        exampleEntry('⭐☆☆☆', 'textures', 'to_image'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'raw_data'),
        exampleEntry('⭐☆☆☆', 'textures', 'particles_blending'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'npatch_drawing'),
        exampleEntry('⭐☆☆☆', 'textures', 'background_scrolling'),
        exampleEntry('⭐⭐☆☆', 'textures', 'sprite_animation'),
        exampleEntry('⭐⭐☆☆', 'textures', 'sprite_button'),
        exampleEntry('⭐⭐☆☆', 'textures', 'sprite_explosion'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'bunnymark'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'mouse_painting'),
        exampleEntry('⭐☆☆☆', 'textures', 'blend_modes'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'tiled_drawing'),
        exampleEntry('⭐☆☆☆', 'textures', 'polygon_drawing'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'fog_of_war'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'gif_player'),
        exampleEntry('⭐⭐⭐⭐️', 'textures', 'image_kernel'),
        exampleEntry('⭐⭐☆☆', 'textures', 'image_channel'),
        exampleEntry('⭐⭐☆☆', 'textures', 'image_rotate'),
        exampleEntry('⭐⭐⭐☆', 'textures', 'textured_curve'),
        exampleEntry('⭐☆☆☆', 'text', 'sprite_fonts'),
        exampleEntry('⭐☆☆☆', 'text', 'font_spritefont'),
        exampleEntry('⭐⭐☆☆', 'text', 'font_filters'),
        exampleEntry('⭐☆☆☆', 'text', 'font_loading'),
        exampleEntry('⭐⭐⭐☆', 'text', 'font_sdf'),
        exampleEntry('⭐☆☆☆', 'text', 'format_text'),
        exampleEntry('⭐⭐☆☆', 'text', 'input_box'),
        exampleEntry('⭐⭐☆☆', 'text', 'writing_anim'),
        exampleEntry('⭐⭐⭐⭐️', 'text', 'rectangle_bounds'),
        exampleEntry('⭐⭐⭐⭐️', 'text', 'unicode_emojis'),
        exampleEntry('⭐⭐⭐⭐️', 'text', 'unicode_ranges'),
        exampleEntry('⭐⭐⭐⭐️', 'text', '3d_drawing'),
        exampleEntry('⭐⭐⭐☆', 'text', 'codepoints_loading'),
        exampleEntry('⭐⭐☆☆', 'models', 'animation'),
        exampleEntry('⭐⭐⭐☆', 'models', 'billboard_rendering'),
        exampleEntry('⭐☆☆☆', 'models', 'box_collisions'),
        exampleEntry('⭐⭐☆☆', 'models', 'cubicmap'),
        exampleEntry('⭐⭐☆☆', 'models', 'first_person_maze'),
        exampleEntry('⭐☆☆☆', 'models', 'geometric_shapes'),
        exampleEntry('⭐⭐☆☆', 'models', 'mesh_generation'),
        exampleEntry('⭐⭐⭐☆', 'models', 'mesh_picking'),
        exampleEntry('⭐☆☆☆', 'models', 'loading'),
        exampleEntry('⭐☆☆☆', 'models', 'loading_gltf'),
        exampleEntry('⭐☆☆☆', 'models', 'loading_vox'),
        exampleEntry('⭐⭐☆☆', 'models', 'loading_m3d'),
        exampleEntry('⭐☆☆☆', 'models', 'orthographic_projection'),
        exampleEntry('⭐⭐⭐☆', 'models', 'point_rendering'),
        exampleEntry('⭐⭐⭐⭐️', 'models', 'rlgl_solar_system'),
        exampleEntry('⭐⭐☆☆', 'models', 'yaw_pitch_roll'),
        exampleEntry('⭐⭐⭐☆', 'models', 'waving_cubes'),
        exampleEntry('⭐☆☆☆', 'models', 'heightmap'),
        exampleEntry('⭐⭐☆☆', 'models', 'skybox_rendering'),
        exampleEntry('⭐⭐☆☆', 'models', 'draw_cube_texture'),
        exampleEntry('⭐⭐⭐☆', 'models', 'gpu_skinning'),
        exampleEntry('⭐⭐⭐⭐️', 'models', 'bone_socket'),
        exampleEntry('⭐⭐☆☆', 'models', 'tesseract_view'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'basic_lighting'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'model_shader'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'shapes_textures'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'custom_uniform'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'postprocessing'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'palette_switch'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'raymarching'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'texture_rendering'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'texture_outline'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'texture_waves'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'julia_set'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'eratosthenes'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'fog_rendering'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'simple_mask'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'hot_reloading'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'mesh_instancing'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'multi_sample2d'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'normal_map'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'spotlight'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'deferred_render'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'hybrid_render'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'texture_tiling'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'shadowmap'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'vertex_displacement'),
        exampleEntry('⭐⭐☆☆', 'shaders', 'write_depth'),
        exampleEntry('⭐⭐⭐⭐️', 'shaders', 'basic_pbr'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'lightmap'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'rounded_rectangle'),
        exampleEntry('⭐⭐⭐☆', 'shaders', 'view_depth'),
        exampleEntry('⭐☆☆☆', 'audio', 'module_playing'),
        exampleEntry('⭐☆☆☆', 'audio', 'music_stream'),
        exampleEntry('⭐⭐⭐☆', 'audio', 'raw_stream'),
        exampleEntry('⭐☆☆☆', 'audio', 'sound_loading'),
        exampleEntry('⭐⭐⭐⭐️', 'audio', 'mixed_processor'),
        exampleEntry('⭐⭐⭐⭐️', 'audio', 'stream_effects'),
        exampleEntry('⭐⭐☆☆', 'audio', 'sound_multi'),
        exampleEntry('⭐⭐☆☆', 'audio', 'sound_positioning')];
//EXAMPLE_DATA_LIST_END

	var exampleDivs = []
    for (var i = 0; i < exampleData.length; i++) {
		var difficulty = exampleData[i].difficulty
        var module = exampleData[i].module;
        var name = exampleData[i].name;
        var description = exampleData[i].base.replaceAll('_', ' ');

		var previewImageURL = `https://raw.githubusercontent.com/raysan5/raylib/master/examples/${module}/${name}.png`
		var exampleLoaderURL = `examples/${module}/loader.html?name=${name}`;

        const exampleDiv = $(
            `<div class="mix f${module}">` +
                `<a class="fancybox fancybox.iframe" href="${exampleLoaderURL}" title="${description}">` +
                `<img width="400" height="225" src="${previewImageURL}"><div class="extext"><p>${description}</p></div></a>` +
                `<div id="difficulty_level">${difficulty}</div>` +
            '</div>')[0];

		exampleDivs.push(exampleDiv);

		$('#container').append(exampleDiv);
        $('#container a .extext').hide();
    }

	const filterFunctionInput = $('#filter_function input');

    var examplesTags = {};
    $.getJSON('examples/examples_tags.json', function(examplesTagsData) {
        // Filter out function usages of examples, which don't have a page
        for (var functionName in examplesTagsData) {
            if (findExampleByName(exampleData, functionName)) {
                examplesTags[functionName] = examplesTagsData[functionName];
            }
        }

        // Do not handle input processing as we will pigyback (add to) the filterFunctionInput
    })
    .fail(function(jqXHR, textStatus, error) {
        const err = textStatus + ". " + error;
        console.error("Error loading examples_tags.json: " + err);
    });

	var functionUsages = {};
	$.getJSON('examples/function_usages.json', function(functionUsagesData) {
		// Filter out function usages of examples, which don't have a page
		for (var functionName in functionUsagesData) {
			functionUsages[functionName] = functionUsagesData[functionName].filter(usage => findExampleByName(exampleData, usage))
		}

		// While the JSON file was loaded, user could have entered text.
		// So apply filter, if it not empty
		if (filterFunctionInput !== '') {
			applyByFunctionFilter(filterFunctionInput.val())
		}

		// From now listen for input update events
		filterFunctionInput.on("input", function(event) {
			applyByFunctionFilter(event.target.value)
		});
	})
    .fail(function(jqXHR, textStatus, error) {
        const err = textStatus + ". " + error;
        console.error("Error loading function_usages.json: " + err);
    });

    // Instantiate MixItUp:
	$('#container').mixItUp();

    $('#container a').hover(
        function(){ $(this).find('.extext').show(); },
        function(){ $(this).find('.extext').hide(); });
});
