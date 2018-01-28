// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'transmission.data';
    var REMOTE_PACKAGE_BASE = 'transmission.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'resources', true, true);
Module['FS_createPath']('/resources', 'audio', true, true);
Module['FS_createPath']('/resources', 'fonts', true, true);
Module['FS_createPath']('/resources', 'textures', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      }
    };

        var files = metadata.files;
        for (var i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_transmission.data');

    };
    Module['addRunDependency']('datafile_transmission.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 3267, "filename": "/resources/missions.txt"}, {"audio": 1, "start": 3267, "crunched": 0, "end": 26115, "filename": "/resources/audio/fx_batman.ogg"}, {"audio": 1, "start": 26115, "crunched": 0, "end": 40962, "filename": "/resources/audio/fx_button.ogg"}, {"audio": 1, "start": 40962, "crunched": 0, "end": 56626, "filename": "/resources/audio/fx_grab.ogg"}, {"audio": 1, "start": 56626, "crunched": 0, "end": 67324, "filename": "/resources/audio/fx_leave.ogg"}, {"audio": 1, "start": 67324, "crunched": 0, "end": 402211, "filename": "/resources/audio/fx_message.ogg"}, {"audio": 1, "start": 402211, "crunched": 0, "end": 435328, "filename": "/resources/audio/fx_newspaper.ogg"}, {"audio": 1, "start": 435328, "crunched": 0, "end": 469289, "filename": "/resources/audio/fx_place.ogg"}, {"audio": 1, "start": 469289, "crunched": 0, "end": 481889, "filename": "/resources/audio/fx_typing.ogg"}, {"audio": 1, "start": 481889, "crunched": 0, "end": 2425599, "filename": "/resources/audio/music_mission.ogg"}, {"audio": 1, "start": 2425599, "crunched": 0, "end": 3240271, "filename": "/resources/audio/music_title.ogg"}, {"audio": 0, "start": 3240271, "crunched": 0, "end": 3266619, "filename": "/resources/audio/spy_versus_spy.xm"}, {"audio": 0, "start": 3266619, "crunched": 0, "end": 3904917, "filename": "/resources/audio/s_p_y.xm"}, {"audio": 0, "start": 3904917, "crunched": 0, "end": 4030889, "filename": "/resources/fonts/fontTitle.ttf"}, {"audio": 0, "start": 4030889, "crunched": 0, "end": 4260981, "filename": "/resources/fonts/Lora-Bold.ttf"}, {"audio": 0, "start": 4260981, "crunched": 0, "end": 4493453, "filename": "/resources/fonts/Lora-BoldItalic.ttf"}, {"audio": 0, "start": 4493453, "crunched": 0, "end": 4579057, "filename": "/resources/fonts/traveling_typewriter.ttf"}, {"audio": 0, "start": 4579057, "crunched": 0, "end": 4596306, "filename": "/resources/textures/cw_logo.png"}, {"audio": 0, "start": 4596306, "crunched": 0, "end": 4843195, "filename": "/resources/textures/ending_background.png"}, {"audio": 0, "start": 4843195, "crunched": 0, "end": 5617078, "filename": "/resources/textures/ending_newspaper.png"}, {"audio": 0, "start": 5617078, "crunched": 0, "end": 6787210, "filename": "/resources/textures/message_background.png"}, {"audio": 0, "start": 6787210, "crunched": 0, "end": 6948133, "filename": "/resources/textures/message_vignette.png"}, {"audio": 0, "start": 6948133, "crunched": 0, "end": 7763690, "filename": "/resources/textures/mission_background.png"}, {"audio": 0, "start": 7763690, "crunched": 0, "end": 7765085, "filename": "/resources/textures/mission_backline.png"}, {"audio": 0, "start": 7765085, "crunched": 0, "end": 7818781, "filename": "/resources/textures/mission_words.png"}, {"audio": 0, "start": 7818781, "crunched": 0, "end": 8851842, "filename": "/resources/textures/title_background.png"}, {"audio": 0, "start": 8851842, "crunched": 0, "end": 8887763, "filename": "/resources/textures/title_ribbon.png"}, {"audio": 0, "start": 8887763, "crunched": 0, "end": 8895668, "filename": "/resources/textures/words_base.png"}], "remote_package_size": 8895668, "package_uuid": "a5a6f345-6231-45e2-8ca7-11a5a7c70681"});

})();



// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

if (Module['ENVIRONMENT']) {
  if (Module['ENVIRONMENT'] === 'WEB') {
    ENVIRONMENT_IS_WEB = true;
  } else if (Module['ENVIRONMENT'] === 'WORKER') {
    ENVIRONMENT_IS_WORKER = true;
  } else if (Module['ENVIRONMENT'] === 'NODE') {
    ENVIRONMENT_IS_NODE = true;
  } else if (Module['ENVIRONMENT'] === 'SHELL') {
    ENVIRONMENT_IS_SHELL = true;
  } else {
    throw new Error('The provided Module[\'ENVIRONMENT\'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.');
  }
} else {
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = console.log;
  if (!Module['printErr']) Module['printErr'] = console.warn;

  var nodeFS;
  var nodePath;

  Module['read'] = function shell_read(filename, binary) {
    var ret;
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath['normalize'](filename);
      ret = nodeFS['readFileSync'](filename);
    return binary ? ret : ret.toString();
  };

  Module['readBinary'] = function readBinary(filename) {
    var ret = Module['read'](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  if (!Module['thisProgram']) {
    if (process['argv'].length > 1) {
      Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
    } else {
      Module['thisProgram'] = 'unknown-program';
    }
  }

  Module['arguments'] = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  // Currently node will swallow unhandled rejections, but this behavior is
  // deprecated, and in the future it will exit with error status.
  process['on']('unhandledRejection', function(reason, p) {
    Module['printErr']('node.js exiting due to unhandled promise rejection');
    process['exit'](1);
  });

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = function shell_read(f) {
      return read(f);
    };
  } else {
    Module['read'] = function shell_read() { throw 'no read() available' };
  }

  Module['readBinary'] = function readBinary(f) {
    var data;
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof quit === 'function') {
    Module['quit'] = function(status, toThrow) {
      quit(status);
    }
  }
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    Module['readBinary'] = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
    };
  }

  Module['readAsync'] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function shell_print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function shell_printErr(x) {
      console.warn(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (typeof Module['setWindowTitle'] === 'undefined') {
    Module['setWindowTitle'] = function(title) { document.title = title };
  }
}
else {
  // Unreachable because SHELL is dependent on the others
  throw new Error('Unknown runtime environment. Where are we?');
}

if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
if (!Module['thisProgram']) {
  Module['thisProgram'] = './this.program';
}
if (!Module['quit']) {
  Module['quit'] = function(status, toThrow) {
    throw toThrow;
  }
}

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = undefined;



// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

// stack management, and other functionality that is provided by the compiled code,
// should not be used before it is ready
stackSave = stackRestore = stackAlloc = setTempRet0 = getTempRet0 = function() {
  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
};

function staticAlloc(size) {
  assert(!staticSealed);
  var ret = STATICTOP;
  STATICTOP = (STATICTOP + size + 15) & -16;
  return ret;
}

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  if (end >= TOTAL_MEMORY) {
    var success = enlargeMemory();
    if (!success) {
      HEAP32[DYNAMICTOP_PTR>>2] = ret;
      return 0;
    }
  }
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  var ret = size = Math.ceil(size / factor) * factor;
  return ret;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    Module.printErr(text);
  }
}



var functionPointers = new Array(0);

function addFunction(func) {
  for (var i = 0; i < functionPointers.length; i++) {
    if (!functionPointers[i]) {
      functionPointers[i] = func;
      return 2*(1 + i);
    }
  }
  throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
}

function removeFunction(index) {
  functionPointers[(index-2)/2] = null;
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    assert(args.length == sig.length-1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}


function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

var Runtime = {
  // FIXME backwards compatibility layer for ports. Support some Runtime.*
  //       for now, fix it there, then remove it from here. That way we
  //       can minimize any period of breakage.
  dynCall: dynCall, // for SDL2 port
  // helpful errors
  getTempRet0: function() { abort('getTempRet0() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  staticAlloc: function() { abort('staticAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  stackAlloc: function() { abort('stackAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html



//========================================
// Runtime essentials
//========================================

var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

var JSfuncs = {
  // Helpers for cwrap -- it can't refer to Runtime directly because it might
  // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
  // out what the minified function name is.
  'stackSave': function() {
    stackSave()
  },
  'stackRestore': function() {
    stackRestore()
  },
  // type conversion from js to c
  'arrayToC' : function(arr) {
    var ret = stackAlloc(arr.length);
    writeArrayToMemory(arr, ret);
    return ret;
  },
  'stringToC' : function(str) {
    var ret = 0;
    if (str !== null && str !== undefined && str !== 0) { // null string
      // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
      var len = (str.length << 2) + 1;
      ret = stackAlloc(len);
      stringToUTF8(str, ret, len);
    }
    return ret;
  }
};
// For fast lookup of conversion functions
var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

// C calling interface.
function ccall (ident, returnType, argTypes, args, opts) {
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  if (returnType === 'string') ret = Pointer_stringify(ret);
  if (stack !== 0) {
    stackRestore(stack);
  }
  return ret;
}

function cwrap (ident, returnType, argTypes) {
  argTypes = argTypes || [];
  var cfunc = getCFunc(ident);
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = argTypes.every(function(type){ return type === 'number'});
  var numericRet = returnType !== 'string';
  if (numericRet && numericArgs) {
    return cfunc;
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments);
  }
}

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [typeof _malloc === 'function' ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!staticSealed) return staticAlloc(size);
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}

/** @type {function(number, number=)} */
function Pointer_stringify(ptr, length) {
  if (length === 0 || !ptr) return '';
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))>>0)];
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (hasUtf < 128) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return UTF8ToString(ptr);
}

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAP8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  while (u8Array[endPtr]) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;

    var str = '';
    while (1) {
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 0xF8) == 0xF0) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 0xFC) == 0xF8) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
          }
        }
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8,ptr);
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x1FFFFF) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x3FFFFFF) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 0xF8 | (u >> 24);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 0xFC | (u >> 30);
      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      ++len;
    } else if (u <= 0x7FF) {
      len += 2;
    } else if (u <= 0xFFFF) {
      len += 3;
    } else if (u <= 0x1FFFFF) {
      len += 4;
    } else if (u <= 0x3FFFFFF) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

function demangle(func) {
  warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
  return func;
}

function demangleAll(text) {
  var regex =
    /__Z[\w\d_]+/g;
  return text.replace(regex,
    function(x) {
      var y = demangle(x);
      return x === y ? x : (x + ' [' + y + ']');
    });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  var js = jsStackTrace();
  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
  return demangleAll(js);
}

// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBuffer(buf) {
  Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
  staticSealed = false;


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
  HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
}

function checkStackCookie() {
  if (HEAPU32[(STACK_MAX >> 2)-1] != 0x02135467 || HEAPU32[(STACK_MAX >> 2)-2] != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x' + HEAPU32[(STACK_MAX >> 2)-2].toString(16) + ' ' + HEAPU32[(STACK_MAX >> 2)-1].toString(16));
  }
  // Also test the global address 0 for integrity. This check is not compatible with SAFE_SPLIT_MEMORY though, since that mode already tests all address 0 accesses on its own.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) throw 'Runtime error: The application has corrupted its heap memory area (address zero)!';
}

function abortStackOverflow(allocSize) {
  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
}

function abortOnCannotGrowMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
}


function enlargeMemory() {
  abortOnCannotGrowMemory();
}


var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 67108864;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');



// Use a provided buffer, if there is one, or else allocate a new one
if (Module['buffer']) {
  buffer = Module['buffer'];
  assert(buffer.byteLength === TOTAL_MEMORY, 'provided buffer should be ' + TOTAL_MEMORY + ' bytes, but it is ' + buffer.byteLength);
} else {
  // Use a WebAssembly memory where available
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    assert(TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
    Module['wasmMemory'] = new WebAssembly.Memory({ 'initial': TOTAL_MEMORY / WASM_PAGE_SIZE, 'maximum': TOTAL_MEMORY / WASM_PAGE_SIZE });
    buffer = Module['wasmMemory'].buffer;
  } else
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
  assert(buffer.byteLength === TOTAL_MEMORY);
  Module['buffer'] = buffer;
}
updateGlobalBufferViews();


function getTotalMemory() {
  return TOTAL_MEMORY;
}

// Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 0x63736d65; /* 'emsc' */
HEAP16[1] = 0x6373;
if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  checkStackCookie();
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

assert(Math['imul'] && Math['fround'] && Math['clz32'] && Math['trunc'], 'this is a legacy browser, build with LEGACY_VM_SUPPORT');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data



var memoryInitializer = null;






// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}




function integrateWasmJS() {
  // wasm.js has several methods for creating the compiled code module here:
  //  * 'native-wasm' : use native WebAssembly support in the browser
  //  * 'interpret-s-expr': load s-expression code from a .wast and interpret
  //  * 'interpret-binary': load binary wasm and interpret
  //  * 'interpret-asm2wasm': load asm.js code, translate to wasm, and interpret
  //  * 'asmjs': no wasm, just load the asm.js code and use that (good for testing)
  // The method is set at compile time (BINARYEN_METHOD)
  // The method can be a comma-separated list, in which case, we will try the
  // options one by one. Some of them can fail gracefully, and then we can try
  // the next.

  // inputs

  var method = 'native-wasm';

  var wasmTextFile = 'transmission.wast';
  var wasmBinaryFile = 'transmission.wasm';
  var asmjsCodeFile = 'transmission.temp.asm.js';

  if (typeof Module['locateFile'] === 'function') {
    if (!isDataURI(wasmTextFile)) {
      wasmTextFile = Module['locateFile'](wasmTextFile);
    }
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = Module['locateFile'](wasmBinaryFile);
    }
    if (!isDataURI(asmjsCodeFile)) {
      asmjsCodeFile = Module['locateFile'](asmjsCodeFile);
    }
  }

  // utilities

  var wasmPageSize = 64*1024;

  var info = {
    'global': null,
    'env': null,
    'asm2wasm': { // special asm2wasm imports
      "f64-rem": function(x, y) {
        return x % y;
      },
      "debugger": function() {
        debugger;
      }
    },
    'parent': Module // Module inside wasm-js.cpp refers to wasm-js.cpp; this allows access to the outside program.
  };

  var exports = null;


  function mergeMemory(newBuffer) {
    // The wasm instance creates its memory. But static init code might have written to
    // buffer already, including the mem init file, and we must copy it over in a proper merge.
    // TODO: avoid this copy, by avoiding such static init writes
    // TODO: in shorter term, just copy up to the last static init write
    var oldBuffer = Module['buffer'];
    if (newBuffer.byteLength < oldBuffer.byteLength) {
      Module['printErr']('the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here');
    }
    var oldView = new Int8Array(oldBuffer);
    var newView = new Int8Array(newBuffer);


    newView.set(oldView);
    updateGlobalBuffer(newBuffer);
    updateGlobalBufferViews();
  }

  function fixImports(imports) {
    return imports;
  }

  function getBinary() {
    try {
      if (Module['wasmBinary']) {
        return new Uint8Array(Module['wasmBinary']);
      }
      if (Module['readBinary']) {
        return Module['readBinary'](wasmBinaryFile);
      } else {
        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
      }
    }
    catch (err) {
      abort(err);
    }
  }

  function getBinaryPromise() {
    // if we don't have the binary yet, and have the Fetch api, use that
    // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
    if (!Module['wasmBinary'] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
        return getBinary();
      });
    }
    // Otherwise, getBinary should be able to get it synchronously
    return new Promise(function(resolve, reject) {
      resolve(getBinary());
    });
  }

  // do-method functions


  function doNativeWasm(global, env, providedBuffer) {
    if (typeof WebAssembly !== 'object') {
      Module['printErr']('no native wasm support detected');
      return false;
    }
    // prepare memory import
    if (!(Module['wasmMemory'] instanceof WebAssembly.Memory)) {
      Module['printErr']('no native wasm Memory in use');
      return false;
    }
    env['memory'] = Module['wasmMemory'];
    // Load the wasm module and create an instance of using native support in the JS engine.
    info['global'] = {
      'NaN': NaN,
      'Infinity': Infinity
    };
    info['global.Math'] = Math;
    info['env'] = env;
    // handle a generated wasm instance, receiving its exports and
    // performing other necessary setup
    function receiveInstance(instance, module) {
      exports = instance.exports;
      if (exports.memory) mergeMemory(exports.memory);
      Module['asm'] = exports;
      Module["usingWasm"] = true;
      removeRunDependency('wasm-instantiate');
    }
    addRunDependency('wasm-instantiate');

    // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
    // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
    // to any other async startup actions they are performing.
    if (Module['instantiateWasm']) {
      try {
        return Module['instantiateWasm'](info, receiveInstance);
      } catch(e) {
        Module['printErr']('Module.instantiateWasm callback failed with error: ' + e);
        return false;
      }
    }

    // Async compilation can be confusing when an error on the page overwrites Module
    // (for example, if the order of elements is wrong, and the one defining Module is
    // later), so we save Module and check it later.
    var trueModule = Module;
    function receiveInstantiatedSource(output) {
      // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
      // receiveInstance() will swap in the exports (to Module.asm) so they can be called
      assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
      trueModule = null;
      receiveInstance(output['instance'], output['module']);
    }
    function instantiateArrayBuffer(receiver) {
      getBinaryPromise().then(function(binary) {
        return WebAssembly.instantiate(binary, info);
      }).then(receiver).catch(function(reason) {
        Module['printErr']('failed to asynchronously prepare wasm: ' + reason);
        abort(reason);
      });
    }
    // Prefer streaming instantiation if available.
    if (!Module['wasmBinary'] &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, { credentials: 'same-origin' }), info)
        .then(receiveInstantiatedSource)
        .catch(function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          Module['printErr']('wasm streaming compile failed: ' + reason);
          Module['printErr']('falling back to ArrayBuffer instantiation');
          instantiateArrayBuffer(receiveInstantiatedSource);
        });
    } else {
      instantiateArrayBuffer(receiveInstantiatedSource);
    }
    return {}; // no exports yet; we'll fill them in later
  }


  // We may have a preloaded value in Module.asm, save it
  Module['asmPreload'] = Module['asm'];

  // Memory growth integration code

  var asmjsReallocBuffer = Module['reallocBuffer'];

  var wasmReallocBuffer = function(size) {
    var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
    size = alignUp(size, PAGE_MULTIPLE); // round up to wasm page size
    var old = Module['buffer'];
    var oldSize = old.byteLength;
    if (Module["usingWasm"]) {
      // native wasm support
      try {
        var result = Module['wasmMemory'].grow((size - oldSize) / wasmPageSize); // .grow() takes a delta compared to the previous size
        if (result !== (-1 | 0)) {
          // success in native wasm memory growth, get the buffer from the memory
          return Module['buffer'] = Module['wasmMemory'].buffer;
        } else {
          return null;
        }
      } catch(e) {
        console.error('Module.reallocBuffer: Attempted to grow from ' + oldSize  + ' bytes to ' + size + ' bytes, but got error: ' + e);
        return null;
      }
    }
  };

  Module['reallocBuffer'] = function(size) {
    if (finalMethod === 'asmjs') {
      return asmjsReallocBuffer(size);
    } else {
      return wasmReallocBuffer(size);
    }
  };

  // we may try more than one; this is the final one, that worked and we are using
  var finalMethod = '';

  // Provide an "asm.js function" for the application, called to "link" the asm.js module. We instantiate
  // the wasm module at that time, and it receives imports and provides exports and so forth, the app
  // doesn't need to care that it is wasm or olyfilled wasm or asm.js.

  Module['asm'] = function(global, env, providedBuffer) {
    env = fixImports(env);

    // import table
    if (!env['table']) {
      var TABLE_SIZE = Module['wasmTableSize'];
      if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; // works in binaryen interpreter at least
      var MAX_TABLE_SIZE = Module['wasmMaxTableSize'];
      if (typeof WebAssembly === 'object' && typeof WebAssembly.Table === 'function') {
        if (MAX_TABLE_SIZE !== undefined) {
          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, 'maximum': MAX_TABLE_SIZE, 'element': 'anyfunc' });
        } else {
          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, element: 'anyfunc' });
        }
      } else {
        env['table'] = new Array(TABLE_SIZE); // works in binaryen interpreter at least
      }
      Module['wasmTable'] = env['table'];
    }

    if (!env['memoryBase']) {
      env['memoryBase'] = Module['STATIC_BASE']; // tell the memory segments where to place themselves
    }
    if (!env['tableBase']) {
      env['tableBase'] = 0; // table starts at 0 by default, in dynamic linking this will change
    }

    // try the methods. each should return the exports if it succeeded

    var exports;
    exports = doNativeWasm(global, env, providedBuffer);

    if (!exports) abort('no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods');


    return exports;
  };

  var methodHandler = Module['asm']; // note our method handler, as we may modify Module['asm'] later
}

integrateWasmJS();

// === Body ===

var ASM_CONSTS = [function($0, $1) { Module.printErr('bad name in getProcAddress: ' + [Pointer_stringify($0), Pointer_stringify($1)]) }];

function _emscripten_asm_const_iii(code, a0, a1) {
  return ASM_CONSTS[code](a0, a1);
}



STATIC_BASE = GLOBAL_BASE;

STATICTOP = STATIC_BASE + 40448;
/* global initializers */  __ATINIT__.push();







var STATIC_BUMP = 40448;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;

/* no memory initializer */
var tempDoublePtr = STATICTOP; STATICTOP += 16;

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}

// {{PRE_LIBRARY}}


  function ___assert_fail(condition, filename, line, func) {
      abort('Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function']);
    }

  function ___lock() {}

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      else Module.printErr('failed to set errno from JS');
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function (stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              var isPosixPlatform = (process.platform != 'win32'); // Node doesn't offer a direct check, so test by exclusion
  
              var fd = process.stdin.fd;
              if (isPosixPlatform) {
                // Linux and Mac cannot use process.stdin.fd (which isn't set up as sync)
                var usingDevice = false;
                try {
                  fd = fs.openSync('/dev/stdin', 'r');
                  usingDevice = true;
                } catch (e) {}
              }
  
              try {
                bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (usingDevice) { fs.closeSync(fd); }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
  
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function (node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function (node, newCapacity) {
        // If we are asked to expand the size of a file that already exists, revert to using a standard JS array to store the file
        // instead of a typed array. This makes resizing the array more flexible because we can just .push() elements at the back to
        // increase the size.
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
          node.contents = MEMFS.getFileDataAsRegularArray(node);
          node.usedBytes = node.contents.length; // We might be writing to a lazy-loaded file which had overridden this property, so force-reset it.
        }
  
        if (!node.contents || node.contents.subarray) { // Keep using a typed array if creating a new storage, or if old one was a typed array as well.
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
          return;
        }
        // Not using a typed array to back the file storage. Use a standard JS array instead.
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0);
      },resizeFileStorage:function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        if (!req) {
          return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          if (!fileStore.indexNames.contains('timestamp')) {
            fileStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          try {
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
            transaction.onerror = function(e) {
              callback(this.error);
              e.preventDefault();
            };
  
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            var index = store.index('timestamp');
  
            index.openKeyCursor().onsuccess = function(event) {
              var cursor = event.target.result;
  
              if (!cursor) {
                return callback(null, { type: 'remote', db: db, entries: entries });
              }
  
              entries[cursor.primaryKey] = { timestamp: cursor.key };
  
              cursor.continue();
            };
          } catch (e) {
            return callback(e);
          }
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
          // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.chmod(path, entry.mode);
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function(e) {
          done(this.error);
          e.preventDefault();
        };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        flags &= ~0x200000 /*O_PATH*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x800 /*O_NONBLOCK*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x8000 /*O_LARGEFILE*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x80000 /*O_CLOEXEC*/; // Some applications may pass it; it makes no sense for a single process.
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            path = fs.readlinkSync(path);
            path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
            return path;
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // Node.js < 6 compatibility: node errors on 0 length reads
          if (length === 0) return 0;
          // Node.js < 4.5 compatibility: Buffer.from does not support ArrayBuffer
          var buf = Buffer.from ? Buffer.from(buffer.buffer) : new Buffer(buffer.buffer);
          try {
            return fs.readSync(stream.nfd, buf, offset, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },write:function (stream, buffer, offset, length, position) {
          // Node.js < 4.5 compatibility: Buffer.from does not support ArrayBuffer
          var buf = Buffer.from ? Buffer.from(buffer.buffer) : new Buffer(buffer.buffer);
          try {
            return fs.writeSync(stream.nfd, buf, offset, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          return position;
        }}};
  
  var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:function (mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
        var root = WORKERFS.createNode(null, '/', WORKERFS.DIR_MODE, 0);
        var createdParents = {};
        function ensureParent(path) {
          // return the parent node, creating subdirs as necessary
          var parts = path.split('/');
          var parent = root;
          for (var i = 0; i < parts.length-1; i++) {
            var curr = parts.slice(0, i+1).join('/');
            // Issue 4254: Using curr as a node name will prevent the node
            // from being found in FS.nameTable when FS.open is called on
            // a path which holds a child of this node,
            // given that all FS functions assume node names
            // are just their corresponding parts within their given path,
            // rather than incremental aggregates which include their parent's
            // directories.
            if (!createdParents[curr]) {
              createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
            }
            parent = createdParents[curr];
          }
          return parent;
        }
        function base(path) {
          var parts = path.split('/');
          return parts[parts.length-1];
        }
        // We also accept FileList here, by using Array.prototype
        Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
          WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
        });
        (mount.opts["blobs"] || []).forEach(function(obj) {
          WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
        });
        (mount.opts["packages"] || []).forEach(function(pack) {
          pack['metadata'].files.forEach(function(file) {
            var name = file.filename.substr(1); // remove initial slash
            WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack['blob'].slice(file.start, file.end));
          });
        });
        return root;
      },createNode:function (parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
          node.size = contents.size;
          node.contents = contents;
        } else {
          node.size = 4096;
          node.contents = {};
        }
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          return {
            dev: 1,
            ino: undefined,
            mode: node.mode,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: undefined,
            size: node.size,
            atime: new Date(node.timestamp),
            mtime: new Date(node.timestamp),
            ctime: new Date(node.timestamp),
            blksize: 4096,
            blocks: Math.ceil(node.size / 4096),
          };
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rename:function (oldNode, newDir, newName) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },unlink:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rmdir:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readdir:function (node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newName, oldPath) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readlink:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          if (position >= stream.node.size) return 0;
          var chunk = stream.node.contents.slice(position, position + length);
          var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
          buffer.set(new Uint8Array(ab), offset);
          return chunk.size;
        },write:function (stream, buffer, offset, length, position) {
          throw new FS.ErrnoError(ERRNO_CODES.EIO);
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.size;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        }}};
  
  var _stdin=STATICTOP; STATICTOP += 16;;
  
  var _stdout=STATICTOP; STATICTOP += 16;;
  
  var _stderr=STATICTOP; STATICTOP += 16;;var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); }
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); }
            }
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0;
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          console.log('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(err) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(err);
        }
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function (path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != ERRNO_CODES.EEXIST) throw e;
          }
        }
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function (stream) {
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },msync:function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function (stream) {
        return 0;
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto !== 'undefined') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else if (ENVIRONMENT_IS_NODE) {
          // for nodejs
          random_device = function() { return require('crypto')['randomBytes'](1)[0]; };
        } else {
          // default for ES5 platforms
          random_device = function() { return (Math.random()*256)|0; };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function () {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          //Module.printErr(stackTrace()); // useful for debugging
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
          // Node.js compatibility: assigning on this.stack fails on Node 4 (but fixed on Node 8)
          if (this.stack) Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
          if (this.stack) this.stack = demangleAll(this.stack);
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
          'IDBFS': IDBFS,
          'NODEFS': NODEFS,
          'WORKERFS': WORKERFS,
        };
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function (dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function (func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -ERRNO_CODES.ENOTDIR;
          }
          throw e;
        }
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode;
        HEAP32[(((buf)+(16))>>2)]=stat.nlink;
        HEAP32[(((buf)+(20))>>2)]=stat.uid;
        HEAP32[(((buf)+(24))>>2)]=stat.gid;
        HEAP32[(((buf)+(28))>>2)]=stat.rdev;
        HEAP32[(((buf)+(32))>>2)]=0;
        HEAP32[(((buf)+(36))>>2)]=stat.size;
        HEAP32[(((buf)+(40))>>2)]=4096;
        HEAP32[(((buf)+(44))>>2)]=stat.blocks;
        HEAP32[(((buf)+(48))>>2)]=(stat.atime.getTime() / 1000)|0;
        HEAP32[(((buf)+(52))>>2)]=0;
        HEAP32[(((buf)+(56))>>2)]=(stat.mtime.getTime() / 1000)|0;
        HEAP32[(((buf)+(60))>>2)]=0;
        HEAP32[(((buf)+(64))>>2)]=(stat.ctime.getTime() / 1000)|0;
        HEAP32[(((buf)+(68))>>2)]=0;
        HEAP32[(((buf)+(72))>>2)]=stat.ino;
        return 0;
      },doMsync:function (addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags);
      },doMkdir:function (path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function (path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -ERRNO_CODES.EINVAL;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function (path, buf, bufsize) {
        if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function (path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -ERRNO_CODES.EINVAL;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -ERRNO_CODES.EACCES;
        }
        return 0;
      },doDup:function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:0,get:function (varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function () {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      },getStreamFromFD:function () {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream;
      },getSocketFromFD:function () {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket;
      },getSocketAddress:function (allowNull) {
        var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info;
      },get64:function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function () {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // llseek
      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
      // NOTE: offset_high is unused - Emscripten's off_t is 32-bit
      var offset = offset_low;
      FS.llseek(stream, offset, whence);
      HEAP32[((result)>>2)]=stream.position;
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall145(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // readv
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doReadv(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doWritev(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall221(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // fcntl64
      var stream = SYSCALLS.getStreamFromFD(), cmd = SYSCALLS.get();
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -ERRNO_CODES.EINVAL;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        case 12: {
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        }
        case 13:
        case 14:
        case 13:
        case 14:
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -ERRNO_CODES.EINVAL; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        default: {
          return -ERRNO_CODES.EINVAL;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall5(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // open
      var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get() // optional TODO
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)]=0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return -ERRNO_CODES.EINVAL; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0;
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // close
      var stream = SYSCALLS.getStreamFromFD();
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___unlock() {}

  function _abort() {
      Module['abort']();
    }

  
  
  
  
  function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1 /*EM_TIMING_RAF*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
        if (typeof setImmediate === 'undefined') {
          // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
          var setImmediates = [];
          var emscriptenMainLoopMessageId = 'setimmediate';
          function Browser_setImmediate_messageHandler(event) {
            // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
            // so check for both cases.
            if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
              event.stopPropagation();
              setImmediates.shift()();
            }
          }
          addEventListener("message", Browser_setImmediate_messageHandler, true);
          setImmediate = function Browser_emulated_setImmediate(func) {
            setImmediates.push(func);
            if (ENVIRONMENT_IS_WORKER) {
              if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
              Module['setImmediates'].push(func);
              postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
            } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
          }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    }
  
  function _emscripten_get_now() { abort() }function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
      Module['noExitRuntime'] = true;
  
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = func;
      Browser.mainLoop.arg = arg;
  
      var browserIterationFunc;
      if (typeof arg !== 'undefined') {
        browserIterationFunc = function() {
          Module['dynCall_vi'](func, arg);
        };
      } else {
        browserIterationFunc = function() {
          Module['dynCall_v'](func);
        };
      }
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          
          // catches pause/resume main loop from blocker execution
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
          
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0/*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
        checkStackCookie();
  
        // catch pauses from the main loop itself
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
        else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function () {
          Browser.mainLoop.scheduler = null;
          Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
        },resume:function () {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true /* do not set timing and call scheduler, we will do it on the next lines */);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function (func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          try {
            func();
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else {
              if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
              throw e;
            }
          }
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
          
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      function(){};
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          contextHandle = GL.createContext(canvas, contextAttributes);
          if (contextHandle) {
            ctx = GL.getContext(contextHandle).GLctx;
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function (lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === 'undefined') Browser.vrDevice = null;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = document['exitFullscreen'] ||
                                    document['cancelFullScreen'] ||
                                    document['mozCancelFullScreen'] ||
                                    document['msExitFullscreen'] ||
                                    document['webkitCancelFullScreen'] ||
                                    function() {};
            canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) Browser.setFullscreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? function() { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
  
        if (vrDevice) {
          canvasContainer.requestFullscreen({ vrDisplay: vrDevice });
        } else {
          canvasContainer.requestFullscreen();
        }
      },requestFullScreen:function (lockPointer, resizeCanvas, vrDevice) {
          Module.printErr('Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.');
          Browser.requestFullScreen = function(lockPointer, resizeCanvas, vrDevice) {
            return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
          }
          return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
      },nextRAF:0,fakeRequestAnimationFrame:function (func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          Browser.fakeRequestAnimationFrame(func);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           Browser.fakeRequestAnimationFrame;
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:function () {
        Browser.allowAsyncCallbacks = false;
      },resumeAsyncCallbacks:function () { // marks future callbacks as ok to execute, and synchronously runs any remaining ones right now
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks;
          Browser.queuedAsyncCallbacks = [];
          callbacks.forEach(function(func) {
            func();
          });
        }
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        });
      },safeSetTimeout:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setTimeout(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setInterval(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } // drop it on the floor otherwise, next interval will kick in
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll': 
            delta = event.detail;
            break;
          case 'mousewheel': 
            delta = event.wheelDelta;
            break;
          case 'wheel': 
            delta = event['deltaY'];
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
            // just add the mouse delta to the current absolut mouse position
            // FIXME: ideally this should be clamped against the canvas size and zero
            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
            
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            } 
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
        Module['readAsync'](url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function () {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      }};var AL={QUEUE_INTERVAL:25,QUEUE_LOOKAHEAD:0.1,DEVICE_NAME:"Emscripten OpenAL",CAPTURE_DEVICE_NAME:"Emscripten OpenAL capture",ALC_EXTENSIONS:{ALC_SOFT_pause_device:true,ALC_SOFT_HRTF:true},AL_EXTENSIONS:{AL_EXT_float32:true,AL_SOFT_loop_points:true,AL_SOFT_source_length:true,AL_EXT_source_distance_model:true,AL_SOFT_source_spatialize:true},_alcErr:0,alcErr:0,deviceRefCounts:{},alcStringCache:{},paused:false,stringCache:{},contexts:{},currentCtx:null,buffers:{0:{id:0,refCount:0,audioBuf:null,frequency:0,bytesPerSample:2,channels:1,length:0}},paramArray:[],_nextId:1,newId:function () {
        return AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++;
      },freeIds:[],scheduleContextAudio:function (ctx) {
        // If we are animating using the requestAnimationFrame method, then the main loop does not run when in the background.
        // To give a perfect glitch-free audio stop when switching from foreground to background, we need to avoid updating
        // audio altogether when in the background, so detect that case and kill audio buffer streaming if so.
        if (Browser.mainLoop.timingMode === 1 /* EM_TIMING_RAF */ && document['visibilityState'] != 'visible') {
          return;
        }
  
        for (var i in ctx.sources) {
          AL.scheduleSourceAudio(ctx.sources[i]);
        }
      },scheduleSourceAudio:function (src, lookahead) {
        // See comment on scheduleContextAudio above.
        if (Browser.mainLoop.timingMode === 1 /*EM_TIMING_RAF*/ && document['visibilityState'] != 'visible') {
          return;
        }
        if (src.state !== 0x1012 /* AL_PLAYING */) {
          return;
        }
  
        var currentTime = AL.updateSourceTime(src);
  
        var startTime = src.bufStartTime;
        var startOffset = src.bufOffset;
        var bufCursor = src.bufsProcessed;
  
        // Advance past any audio that is already scheduled
        for (var i = 0; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          startTime = audioSrc._startTime + audioSrc._duration;
          startOffset = 0.0;
          bufCursor += audioSrc._skipCount + 1;
        }
  
        if (!lookahead) {
          lookahead = AL.QUEUE_LOOKAHEAD;
        }
        var lookaheadTime = currentTime + lookahead;
        var skipCount = 0;
        while (startTime < lookaheadTime) {
          if (bufCursor >= src.bufQueue.length) {
            if (src.looping) {
              bufCursor %= src.bufQueue.length;
            } else {
              break;
            }
          }
  
          var buf = src.bufQueue[bufCursor % src.bufQueue.length];
          // If the buffer contains no data, skip it
          if (buf.length === 0) {
            skipCount++;
            // If we've gone through the whole queue and everything is 0 length, just give up
            if (skipCount === src.bufQueue.length) {
              break;
            }
          } else {
            var audioSrc = src.context.audioCtx.createBufferSource();
            audioSrc.buffer = buf.audioBuf;
            audioSrc.playbackRate.value = src.playbackRate;
            if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
              audioSrc.loopStart = buf.audioBuf._loopStart;
              audioSrc.loopEnd = buf.audioBuf._loopEnd;
            }
  
            var duration = 0.0;
            // If the source is a looping static buffer, use native looping for gapless playback
            if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
              duration = Number.POSITIVE_INFINITY;
              audioSrc.loop = true;
              if (buf.audioBuf._loopStart) {
                audioSrc.loopStart = buf.audioBuf._loopStart;
              }
              if (buf.audioBuf._loopEnd) {
                audioSrc.loopEnd = buf.audioBuf._loopEnd;
              }
            } else {
              duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
            }
  
            audioSrc._startOffset = startOffset;
            audioSrc._duration = duration;
            audioSrc._skipCount = skipCount;
            skipCount = 0;
  
            audioSrc.connect(src.gain);
  
            if (typeof(audioSrc.start) !== 'undefined') {
              // Sample the current time as late as possible to mitigate drift
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.start(startTime, startOffset);
            } else if (typeof(audioSrc.noteOn) !== 'undefined') {
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.noteOn(startTime);
            }
            audioSrc._startTime = startTime;
            src.audioQueue.push(audioSrc);
  
            startTime += duration;
          }
  
          startOffset = 0.0;
          bufCursor++;
        }
      },updateSourceTime:function (src) {
        var currentTime = src.context.audioCtx.currentTime;
        if (src.state !== 0x1012 /* AL_PLAYING */) {
          return currentTime;
        }
  
        // if the start time is unset, determine it based on the current offset.
        // This will be the case when a source is resumed after being paused, and
        // allows us to pretend that the source actually started playing some time
        // in the past such that it would just now have reached the stored offset.
        if (!isFinite(src.bufStartTime)) {
          src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
          src.bufOffset = 0.0;
        }
  
        var nextStartTime = 0.0;
        while (src.audioQueue.length) {
          var audioSrc = src.audioQueue[0];
          src.bufsProcessed += audioSrc._skipCount;
          nextStartTime = audioSrc._startTime + audioSrc._duration; // n.b. audioSrc._duration already factors in playbackRate, so no divide by src.playbackRate on it.
  
          if (currentTime < nextStartTime) {
            break;
          }
  
          src.audioQueue.shift();
          src.bufStartTime = nextStartTime;
          src.bufOffset = 0.0;
          src.bufsProcessed++;
        }
  
        if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
          // The source has played its entire queue and is non-looping, so just mark it as stopped.
          AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
        } else if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
          // If the source is a looping static buffer, determine the buffer offset based on the loop points
          var buf = src.bufQueue[0];
          if (buf.length === 0) {
            src.bufOffset = 0.0;
          } else {
            var delta = (currentTime - src.bufStartTime) * src.playbackRate;
            var loopStart = buf.audioBuf._loopStart || 0.0;
            var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
            if (loopEnd <= loopStart) {
              loopEnd = buf.audioBuf.duration;
            }
  
            if (delta < loopEnd) {
              src.bufOffset = delta;
            } else {
              src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
            }
          }
        } else if (src.audioQueue[0]) {
          // The source is still actively playing, so we just need to calculate where we are in the current buffer
          // so it can be remembered if the source gets paused.
          src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
        } else {
          // The source hasn't finished yet, but there is no scheduled audio left for it. This can be because
          // the source has just been started/resumed, or due to an underrun caused by a long blocking operation.
          // We need to determine what state we would be in by this point in time so that when we next schedule
          // audio playback, it will be just as if no underrun occurred.
  
          if (src.type !== 0x1028 /* AL_STATIC */ && src.looping) {
            // if the source is a looping buffer queue, let's first calculate the queue duration, so we can
            // quickly fast forward past any full loops of the queue and only worry about the remainder.
            var srcDuration = AL.sourceDuration(src) / src.playbackRate;
            if (srcDuration > 0.0) {
              src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
            }
          }
  
          // Since we've already skipped any full-queue loops if there were any, we just need to find
          // out where in the queue the remaining time puts us, which won't require stepping through the
          // entire queue more than once.
          for (var i = 0; i < src.bufQueue.length; i++) {
            if (src.bufsProcessed >= src.bufQueue.length) {
              if (src.looping) {
                src.bufsProcessed %= src.bufQueue.length;
              } else {
                AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
                break;
              }
            }
  
            var buf = src.bufQueue[src.bufsProcessed];
            if (buf.length > 0) {
              nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
  
              if (currentTime < nextStartTime) {
                src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
                break;
              }
  
              src.bufStartTime = nextStartTime;
            }
  
            src.bufOffset = 0.0;
            src.bufsProcessed++;
          }
        }
  
        return currentTime;
      },cancelPendingSourceAudio:function (src) {
        AL.updateSourceTime(src);
  
        for (var i = 1; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          audioSrc.stop();
        }
  
        if (src.audioQueue.length > 1) {
          src.audioQueue.length = 1;
        }
      },stopSourceAudio:function (src) {
        for (var i = 0; i < src.audioQueue.length; i++) {
          src.audioQueue[i].stop();
        }
        src.audioQueue.length = 0;
      },setSourceState:function (src, state) {
        if (state === 0x1012 /* AL_PLAYING */) {
          if (src.state === 0x1012 /* AL_PLAYING */ || src.state == 0x1014 /* AL_STOPPED */) {
            src.bufsProcessed = 0;
            src.bufOffset = 0.0;
          } else {
          }
  
          AL.stopSourceAudio(src);
  
          src.state = 0x1012 /* AL_PLAYING */;
          src.bufStartTime = Number.NEGATIVE_INFINITY;
          AL.scheduleSourceAudio(src);
        } else if (state === 0x1013 /* AL_PAUSED */) {
          if (src.state === 0x1012 /* AL_PLAYING */) {
            // Store off the current offset to restore with on resume.
            AL.updateSourceTime(src);
            AL.stopSourceAudio(src);
  
            src.state = 0x1013 /* AL_PAUSED */;
          }
        } else if (state === 0x1014 /* AL_STOPPED */) {
          if (src.state !== 0x1011 /* AL_INITIAL */) {
            src.state = 0x1014 /* AL_STOPPED */;
            src.bufsProcessed = src.bufQueue.length;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        } else if (state === 0x1011 /* AL_INITIAL */) {
          if (src.state !== 0x1011 /* AL_INITIAL */) {
            src.state = 0x1011 /* AL_INITIAL */;
            src.bufsProcessed = 0;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        }
      },initSourcePanner:function (src) {
        if (src.type === 0x1030 /* AL_UNDETERMINED */) {
          return;
        }
  
        // Find the first non-zero buffer in the queue to determine the proper format
        var templateBuf = AL.buffers[0];
        for (var i = 0; i < src.bufQueue.length; i++) {
          if (src.bufQueue[i].id !== 0) {
            templateBuf = src.bufQueue[i];
            break;
          }
        }
        // Create a panner if AL_SOURCE_SPATIALIZE_SOFT is set to true, or alternatively if it's set to auto and the source is mono
        if (src.spatialize === 1 /* AL_TRUE */ || (src.spatialize === 2 /* AL_AUTO_SOFT */ && templateBuf.channels === 1)) {
          if (src.panner) {
            return;
          }
          src.panner = src.context.audioCtx.createPanner();
  
          AL.updateSourceGlobal(src);
          AL.updateSourceSpace(src);
  
          src.panner.connect(src.context.gain);
          src.gain.disconnect();
          src.gain.connect(src.panner);
        } else {
          if (!src.panner) {
            return;
          }
  
          src.panner.disconnect();
          src.gain.disconnect();
          src.gain.connect(src.context.gain);
          src.panner = null;
        }
      },updateContextGlobal:function (ctx) {
        for (var i in ctx.sources) {
          AL.updateSourceGlobal(ctx.sources[i]);
        }
      },updateSourceGlobal:function (src) {
        var panner = src.panner;
        if (!panner) {
          return;
        }
  
        panner.refDistance = src.refDistance;
        panner.maxDistance = src.maxDistance;
        panner.rolloffFactor = src.rolloffFactor;
  
        panner.panningModel = src.context.hrtf ? 'HRTF' : 'equalpower';
  
        // Use the source's distance model if AL_SOURCE_DISTANCE_MODEL is enabled
        var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
        switch (distanceModel) {
        case 0 /* AL_NONE */:
          panner.distanceModel = 'inverse';
          panner.refDistance = 3.40282e38 /* FLT_MAX */;
          break;
        case 0xd001 /* AL_INVERSE_DISTANCE */:
        case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          panner.distanceModel = 'inverse';
          break;
        case 0xd003 /* AL_LINEAR_DISTANCE */:
        case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          panner.distanceModel = 'linear';
          break;
        case 0xd005 /* AL_EXPONENT_DISTANCE */:
        case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
          panner.distanceModel = 'exponential';
          break;
        }
      },updateListenerSpace:function (ctx) {
        var listener = ctx.audioCtx.listener;
        if (listener.positionX) {
          listener.positionX.value = listener._position[0];
          listener.positionY.value = listener._position[1];
          listener.positionZ.value = listener._position[2];
        } else {
          listener.setPosition(listener._position[0], listener._position[1], listener._position[2]);
        }
        if (listener.forwardX) {
          listener.forwardX.value = listener._direction[0];
          listener.forwardY.value = listener._direction[1];
          listener.forwardZ.value = listener._direction[2];
          listener.upX.value = listener._up[0];
          listener.upY.value = listener._up[1];
          listener.upZ.value = listener._up[2];
        } else {
          listener.setOrientation(
            listener._direction[0], listener._direction[1], listener._direction[2],
            listener._up[0], listener._up[1], listener._up[2]);
        }
  
        // Update sources that are relative to the listener
        for (var i in ctx.sources) {
          AL.updateSourceSpace(ctx.sources[i]);
        }
      },updateSourceSpace:function (src) {
        if (!src.panner) {
          return;
        }
        var panner = src.panner;
  
        var posX = src.position[0];
        var posY = src.position[1];
        var posZ = src.position[2];
        var dirX = src.direction[0];
        var dirY = src.direction[1];
        var dirZ = src.direction[2];
  
        var listener = src.context.audioCtx.listener;
        var lPosX = listener._position[0];
        var lPosY = listener._position[1];
        var lPosZ = listener._position[2];
  
        // WebAudio does spatialization in world-space coordinates, meaning both the buffer sources and
        // the listener position are in the same absolute coordinate system relative to a fixed origin.
        // By default, OpenAL works this way as well, but it also provides a "listener relative" mode, where
        // a buffer source's coordinate are interpreted not in absolute world space, but as being relative
        // to the listener object itself, so as the listener moves the source appears to move with it
        // with no update required. Since web audio does not support this mode, we must transform the source
        // coordinates from listener-relative space to absolute world space.
        //
        // We do this via affine transformation matrices applied to the source position and source direction.
        // A change-of-basis converts from listener-space displacements to world-space displacements,
        // which must be done for both the source position and direction. Lastly, the source position must be
        // added to the listener position to get the final source position, since the source position represents
        // a displacement from the listener.
        if (src.relative) {
          // Negate the listener direction since forward is -Z.
          var lBackX = -listener._direction[0];
          var lBackY = -listener._direction[1];
          var lBackZ = -listener._direction[2];
          var lUpX = listener._up[0];
          var lUpY = listener._up[1];
          var lUpZ = listener._up[2];
  
          // Normalize the Back vector
          var invMag = 1.0 / Math.sqrt(lBackX * lBackX + lBackY * lBackY + lBackZ * lBackZ);
          lBackX *= invMag;
          lBackY *= invMag;
          lBackZ *= invMag;
  
          // ...and the Up vector
          var invMag = 1.0 / Math.sqrt(lUpX * lUpX + lUpY * lUpY + lUpZ * lUpZ);
          lUpX *= invMag;
          lUpY *= invMag;
          lUpZ *= invMag;
  
          // Calculate the Right vector as the cross product of the Up and Back vectors
          var lRightX = (lUpY * lBackZ - lUpZ * lBackY);
          var lRightY = (lUpZ * lBackX - lUpX * lBackZ);
          var lRightZ = (lUpX * lBackY - lUpY * lBackX);
  
          // Back and Up might not be exactly perpendicular, so the cross product also needs normalization
          var invMag = 1.0 / Math.sqrt(lRightX * lRightX + lRightY * lRightY + lRightZ * lRightZ);
          lRightX *= invMag;
          lRightY *= invMag;
          lRightZ *= invMag;
  
          // Recompute Up from the now orthonormal Right and Back vectors so we have a fully orthonormal basis
          var lUpX = (lBackY * lRightZ - lBackZ * lRightY);
          var lUpY = (lBackZ * lRightX - lBackX * lRightZ);
          var lUpZ = (lBackX * lRightY - lBackY * lRightX);
  
          var oldX = dirX;
          var oldY = dirY;
          var oldZ = dirZ;
  
          // Use our 3 vectors to apply a change-of-basis matrix to the source direction
          dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          var oldX = posX;
          var oldY = posY;
          var oldZ = posZ;
  
          // ...and to the source position
          posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          // The change-of-basis corrects the orientation, but the origin is still the listener.
          // Translate the source position by the listener position to finish.
          posX += lPosX;
          posY += lPosY;
          posZ += lPosZ;
        }
  
        if (panner.positionX) {
          panner.positionX.value = posX;
          panner.positionY.value = posY;
          panner.positionZ.value = posZ;
        } else {
          panner.setPosition(posX, posY, posZ);
        }
        if (panner.orientationX) {
          panner.orientationX.value = dirX;
          panner.orientationY.value = dirY;
          panner.orientationZ.value = dirZ;
        } else {
          panner.setOrientation(dirX, dirY, dirZ);
        }
  
        var oldShift = src.dopplerShift;
        var velX = src.velocity[0];
        var velY = src.velocity[1];
        var velZ = src.velocity[2];
        var lVelX = listener._velocity[0];
        var lVelY = listener._velocity[1];
        var lVelZ = listener._velocity[2];
        if (posX === lPosX && posY === lPosY && posZ === lPosZ
          || velX === lVelX && velY === lVelY && velZ === lVelZ)
        {
          src.dopplerShift = 1.0;
        } else {
          // Doppler algorithm from 1.1 spec
          var speedOfSound = src.context.speedOfSound;
          var dopplerFactor = src.context.dopplerFactor;
  
          var slX = lPosX - posX;
          var slY = lPosY - posY;
          var slZ = lPosZ - posZ;
  
          var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
          var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
          var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
  
          vls = Math.min(vls, speedOfSound / dopplerFactor);
          vss = Math.min(vss, speedOfSound / dopplerFactor);
  
          src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
        }
        if (src.dopplerShift !== oldShift) {
          AL.updateSourceRate(src);
        }
      },updateSourceRate:function (src) {
        if (src.state === 0x1012 /* AL_PLAYING */) {
          // clear scheduled buffers
          AL.cancelPendingSourceAudio(src);
  
          var audioSrc = src.audioQueue[0];
          if (!audioSrc) {
            return; // It is possible that AL.scheduleContextAudio() has not yet fed the next buffer, if so, skip.
          }
  
          var duration;
          if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
            duration = Number.POSITIVE_INFINITY;
          } else {
            // audioSrc._duration is expressed after factoring in playbackRate, so when changing playback rate, need
            // to recompute/rescale the rate to the new playback speed.
            duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
          }
  
          audioSrc._duration = duration;
          audioSrc.playbackRate.value = src.playbackRate;
  
          // reschedule buffers with the new playbackRate
          AL.scheduleSourceAudio(src);
        }
      },sourceDuration:function (src) {
        var length = 0.0;
        for (var i = 0; i < src.bufQueue.length; i++) {
          var audioBuf = src.bufQueue[i].audioBuf;
          length += audioBuf ? audioBuf.duration : 0.0;
        }
        return length;
      },sourceTell:function (src) {
        AL.updateSourceTime(src);
  
        var offset = 0.0;
        for (var i = 0; i < src.bufsProcessed; i++) {
          offset += src.bufQueue[i].audioBuf.duration;
        }
        offset += src.bufOffset;
  
        return offset;
      },sourceSeek:function (src, offset) {
        var playing = src.state == 0x1012 /* AL_PLAYING */;
        if (playing) {
          AL.setSourceState(src, 0x1011 /* AL_INITIAL */);
        }
  
        src.bufsProcessed = 0;
        while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
          offset -= src.bufQueue[src.bufsProcessed].audiobuf.duration;
          src.bufsProcessed++;
        }
  
        src.bufOffset = offset;
        if (playing) {
          AL.setSourceState(src, 0x1012 /* AL_PLAYING */);
        }
      },getGlobalParam:function (funcname, param) {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 0xC000 /* AL_DOPPLER_FACTOR */:
          return AL.currentCtx.dopplerFactor;
        case 0xC003 /* AL_SPEED_OF_SOUND */:
          return AL.currentCtx.speedOfSound;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          return AL.currentCtx.distanceModel;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setGlobalParam:function (funcname, param, value) {
        if (!AL.currentCtx) {
          return;
        }
  
        switch (param) {
        case 0xC000 /* AL_DOPPLER_FACTOR */:
          if (!Number.isFinite(value) || value < 0.0) { // Strictly negative values are disallowed
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.dopplerFactor = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0xC003 /* AL_SPEED_OF_SOUND */:
          if (!Number.isFinite(value) || value <= 0.0) { // Negative or zero values are disallowed
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.speedOfSound = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          switch (value) {
          case 0 /* AL_NONE */:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            AL.currentCtx.distanceModel = value;
            AL.updateContextGlobal(AL.currentCtx);
            break;
          default:
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getListenerParam:function (funcname, param) {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 0x1004 /* AL_POSITION */:
          return AL.currentCtx.audioCtx.listener._position;
        case 0x1006 /* AL_VELOCITY */:
          return AL.currentCtx.audioCtx.listener._velocity;
        case 0x100F /* AL_ORIENTATION */:
          return AL.currentCtx.audioCtx.listener._direction.concat(AL.currentCtx.audioCtx.listener._up);
        case 0x100A /* AL_GAIN */:
          return AL.currentCtx.gain.gain.value;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setListenerParam:function (funcname, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        var listener = AL.currentCtx.audioCtx.listener;
        switch (param) {
        case 0x1004 /* AL_POSITION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener._position[0] = value[0];
          listener._position[1] = value[1];
          listener._position[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0x1006 /* AL_VELOCITY */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener._velocity[0] = value[0];
          listener._velocity[1] = value[1];
          listener._velocity[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0x100A /* AL_GAIN */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.gain.gain.value = value;
          break;
        case 0x100F /* AL_ORIENTATION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])
            || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])
          ) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener._direction[0] = value[0];
          listener._direction[1] = value[1];
          listener._direction[2] = value[2];
          listener._up[0] = value[3];
          listener._up[1] = value[4];
          listener._up[2] = value[5];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getBufferParam:function (funcname, bufferId, param) {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
  
        switch (param) {
        case 0x2001 /* AL_FREQUENCY */:
          return buf.frequency;
        case 0x2002 /* AL_BITS */:
          return buf.bytesPerSample * 8;
        case 0x2003 /* AL_CHANNELS */:
          return buf.channels;
        case 0x2004 /* AL_SIZE */:
          return buf.length * buf.bytesPerSample * buf.channels;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (buf.length === 0) {
            return [0, 0];
          } else {
            return [
              (buf.audioBuf._loopStart || 0.0) * buf.frequency,
              (buf.audioBuf._loopEnd || buf.length) * buf.frequency
            ];
          }
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setBufferParam:function (funcname, bufferId, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        switch (param) {
        case 0x2004 /* AL_SIZE */:
          if (value !== 0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          // Per the spec, setting AL_SIZE to 0 is a legal NOP.
          break;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          if (buf.refCount > 0) {
            AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
            return;
          }
  
          if (buf.audioBuf) {
            buf.audioBuf._loopStart = value[0] / buf.frequency;
            buf.audioBuf._loopEnd = value[1] / buf.frequency;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getSourceParam:function (funcname, sourceId, param) {
        if (!AL.currentCtx) {
          return null;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return null;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          return src.relative;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          return src.coneInnerAngle;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          return src.coneOuterAngle;
        case 0x1003 /* AL_PITCH */:
          return src.pitch;
        case 0x1004 /* AL_POSITION */:
          return src.position;
        case 0x1005 /* AL_DIRECTION */:
          return src.direction;
        case 0x1006 /* AL_VELOCITY */:
          return src.velocity;
        case 0x1007 /* AL_LOOPING */:
          return src.looping;
        case 0x1009 /* AL_BUFFER */:
          if (src.type === 0x1028 /* AL_STATIC */) {
            return src.bufQueue[0].id;
          } else {
            return 0;
          }
        case 0x100A /* AL_GAIN */:
          return src.gain.gain.value;
         case 0x100D /* AL_MIN_GAIN */:
          return src.minGain;
        case 0x100E /* AL_MAX_GAIN */:
          return src.maxGain;
        case 0x1010 /* AL_SOURCE_STATE */:
          return src.state;
        case 0x1015 /* AL_BUFFERS_QUEUED */:
          if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
            return 0;
          } else {
            return src.bufQueue.length;
          }
        case 0x1016 /* AL_BUFFERS_PROCESSED */:
          if ((src.bufQueue.length === 1 && src.bufQueue[0].id === 0) || src.looping) {
            return 0;
          } else {
            return src.bufsProcessed;
          }
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          return src.refDistance;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          return src.rolloffFactor;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          return src.coneOuterGain;
        case 0x1023 /* AL_MAX_DISTANCE */:
          return src.maxDistance;
        case 0x1024 /* AL_SEC_OFFSET */:
          return AL.sourceTell(src);
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency;
          }
          return offset;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
          }
          return offset;
        case 0x1027 /* AL_SOURCE_TYPE */:
          return src.type;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          return src.spatialize;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
          var length = 0;
          var bytesPerFrame = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
            if (src.bufQueue[i].id !== 0) {
              bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
            }
          }
          return length * bytesPerFrame;
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
          var length = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
          }
          return length;
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          return AL.sourceDuration(src);
        case 0xD000 /* AL_DISTANCE_MODEL */:
          return src.distanceModel;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setSourceParam:function (funcname, sourceId, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          if (value === 1 /* AL_TRUE */) {
            src.relative = true;
            AL.updateSourceSpace(src);
          } else if (value === 0 /* AL_FALSE */) {
            src.relative = false;
            AL.updateSourceSpace(src);
          } else {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.coneInnerAngle = value;
          if (src.panner) {
            src.panner.coneInnerAngle = value % 360.0;
          }
          break;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.coneOuterAngle = value;
          if (src.panner) {
            src.panner.coneOuterAngle = value % 360.0;
          }
          break;
        case 0x1003 /* AL_PITCH */:
          if (!Number.isFinite(value) || value <= 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          if (src.pitch === value) {
            break;
          }
  
          src.pitch = value;
          AL.updateSourceRate(src);
          break;
        case 0x1004 /* AL_POSITION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.position[0] = value[0];
          src.position[1] = value[1];
          src.position[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1005 /* AL_DIRECTION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.direction[0] = value[0];
          src.direction[1] = value[1];
          src.direction[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1006 /* AL_VELOCITY */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.velocity[0] = value[0];
          src.velocity[1] = value[1];
          src.velocity[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1007 /* AL_LOOPING */:
          if (value === 1 /* AL_TRUE */) {
            src.looping = true;
            AL.updateSourceTime(src);
            if (src.type === 0x1028 /* AL_STATIC */ && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = true;
              audioSrc._duration = Number.POSITIVE_INFINITY;
            }
          } else if (value === 0 /* AL_FALSE */) {
            src.looping = false;
            var currentTime = AL.updateSourceTime(src);
            if (src.type === 0x1028 /* AL_STATIC */ && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = false;
              audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
              audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
            }
          } else {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        case 0x1009 /* AL_BUFFER */:
          if (src.state === 0x1012 /* AL_PLAYING */ || src.state === 0x1013 /* AL_PAUSED */) {
            AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
            return;
          }
  
          if (value === 0) {
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 1;
            src.bufQueue[0] = AL.buffers[0];
  
            src.bufsProcessed = 0;
            src.type = 0x1030 /* AL_UNDETERMINED */;
          } else {
            var buf = AL.buffers[value];
            if (!buf) {
              AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
              return;
            }
  
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 0;
  
            buf.refCount++;
            src.bufQueue = [buf];
            src.bufsProcessed = 0;
            src.type = 0x1028 /* AL_STATIC */;
          }
  
          AL.initSourcePanner(src);
          AL.scheduleSourceAudio(src);
          break;
        case 0x100A /* AL_GAIN */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.gain.gain.value = value;
          break;
        case 0x100D /* AL_MIN_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > Math.min(src.maxGain, 1.0)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.minGain = value;
          break;
        case 0x100E /* AL_MAX_GAIN */:
          if (!Number.isFinite(value) || value < Math.max(0.0, src.minGain) || value > 1.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.maxGain = value;
          break;
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.refDistance = value;
          if (src.panner) {
            src.panner.refDistance = value;
          }
          break;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.rolloffFactor = value;
          if (src.panner) {
            src.panner.rolloffFactor = value;
          }
          break;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > 1.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.coneOuterGain = value;
          if (src.panner) {
            src.panner.coneOuterGain = value;
          }
          break;
        case 0x1023 /* AL_MAX_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.maxDistance = value;
          if (src.panner) {
            src.panner.maxDistance = value;
          }
          break;
        case 0x1024 /* AL_SEC_OFFSET */:
          if (value < 0.0 || value > AL.sourceDuration(src)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var frequency;
            for (var bufId in src.bufQueue) {
              if (bufId !== 0) {
                frequency = src.bufQueue[bufId].frequency;
                break;
              }
            }
            value /= frequency;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var bytesPerSec;
            for (var bufId in src.bufQueue) {
              if (bufId !== 0) {
                var buf = src.bufQueue[bufId];
                bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
                break;
              }
            }
            value /= bytesPerSec;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          if (value !== 0 /* AL_FALSE */ && value !== 1 /* AL_TRUE */ && value !== 2 /* AL_AUTO_SOFT */) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.spatialize = value;
          AL.initSourcePanner(src);
          break;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
          break;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          switch (value) {
          case 0 /* AL_NONE */:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            src.distanceModel = value;
            if (AL.currentCtx.sourceDistanceModel) {
              AL.updateContextGlobal(AL.currentCtx);
            }
            break;
          default:
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },captures:{},sharedCaptureAudioCtx:null,requireValidCaptureDevice:function (deviceId, funcname) {
        if (deviceId === 0) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        var c = AL.captures[deviceId];
        if (!c) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        var err = c.mediaStreamError;
        if (err) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        return c;
      }};function _alBufferData(bufferId, format, pData, size, freq) {
      if (!AL.currentCtx) {
        return;
      }
      var buf = AL.buffers[bufferId];
      if (!buf) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
      if (freq <= 0) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      var audioBuf = null;
      try {
        switch (format) {
        case 0x1100 /* AL_FORMAT_MONO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
            var channel0 = audioBuf.getChannelData(0);
            for (var i = 0; i < size; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 1;
          buf.length = size;
          break;
        case 0x1101 /* AL_FORMAT_MONO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 1;
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 1;
          buf.length = size >> 1;
          break;
        case 0x1102 /* AL_FORMAT_STEREO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
              channel1[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 2;
          buf.length = size >> 1;
          break;
        case 0x1103 /* AL_FORMAT_STEREO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 1;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
              channel1[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 2;
          buf.length = size >> 2;
          break;
        case 0x10010 /* AL_FORMAT_MONO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 2;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 1;
          buf.length = size >> 2;
          break;
        case 0x10011 /* AL_FORMAT_STEREO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 2;
            for (var i = 0; i < size >> 3; ++i) {
              channel0[i] = HEAPF32[pData++];
              channel1[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 2;
          buf.length = size >> 3;
          break;
        default:
          AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
          return;
        }
        buf.frequency = freq;
        buf.audioBuf = audioBuf;
      } catch (e) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
    }

  function _alDeleteBuffers(count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        /// Deleting the zero buffer is a legal NOP, so ignore it
        if (bufId === 0) {
          continue;
        }
  
        // Make sure the buffer index is valid.
        if (!AL.buffers[bufId]) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
  
        // Make sure the buffer is no longer in use.
        if (AL.buffers[bufId].refCount) {
          AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        if (bufId === 0) {
          continue;
        }
  
        AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
        delete AL.buffers[bufId];
        AL.freeIds.push(bufId);
      }
    }

  
  function _alSourcei(sourceId, param, value) {
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 0xD000 /* AL_DISTANCE_MODEL */:
        AL.setSourceParam('alSourcei', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcei', sourceId, param, null);
        break;
      }
    }function _alDeleteSources(count, pSourceIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        if (!AL.currentCtx.sources[srcId]) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 0x1014 /* AL_STOPPED */);
        _alSourcei(srcId, 0x1009 /* AL_BUFFER */, 0);
        delete AL.currentCtx.sources[srcId];
        AL.freeIds.push(srcId);
      }
    }

  function _alGenBuffers(count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var buf = {
          deviceId: AL.currentCtx.deviceId,
          id: AL.newId(),
          refCount: 0,
          audioBuf: null,
          frequency: 0,
          bytesPerSample: 2,
          channels: 1,
          length: 0,
        };
        AL.deviceRefCounts[buf.deviceId]++;
        AL.buffers[buf.id] = buf;
        HEAP32[(((pBufferIds)+(i*4))>>2)]=buf.id;
      }
    }

  function _alGenSources(count, pSourceIds) {
      if (!AL.currentCtx) {
        return;
      }
      for (var i = 0; i < count; ++i) {
        var gain = AL.currentCtx.audioCtx.createGain();
        gain.connect(AL.currentCtx.gain);
        var src = {
          context: AL.currentCtx,
          id: AL.newId(),
          type: 0x1030 /* AL_UNDETERMINED */,
          state: 0x1011 /* AL_INITIAL */,
          bufQueue: [AL.buffers[0]],
          audioQueue: [],
          looping: false,
          pitch: 1.0,
          dopplerShift: 1.0,
          gain: gain,
          minGain: 0.0,
          maxGain: 1.0,
          panner: null,
          bufsProcessed: 0,
          bufStartTime: Number.NEGATIVE_INFINITY,
          bufOffset: 0.0,
          relative: false,
          refDistance: 1.0,
          maxDistance: 3.40282e38 /* FLT_MAX */,
          rolloffFactor: 1.0,
          position: [0.0, 0.0, 0.0],
          velocity: [0.0, 0.0, 0.0],
          direction: [0.0, 0.0, 0.0],
          coneOuterGain: 0.0,
          coneInnerAngle: 360.0,
          coneOuterAngle: 360.0,
          distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
          spatialize: 2 /* AL_AUTO_SOFT */,
  
          get playbackRate() {
            return this.pitch * this.dopplerShift;
          }
        };
        AL.currentCtx.sources[src.id] = src;
        HEAP32[(((pSourceIds)+(i*4))>>2)]=src.id;
      }
    }

  function _alGetError() {
      if (!AL.currentCtx) {
        return 0xA004 /* AL_INVALID_OPERATION */;
      } else {
        // Reset error on get.
        var err = AL.currentCtx.err;
        AL.currentCtx.err = 0 /* AL_NO_ERROR */;
        return err;
      }
    }

  function _alGetSourcei(sourceId, param, pValue) {
      var val = AL.getSourceParam('alGetSourcei', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1010 /* AL_SOURCE_STATE */:
      case 0x1015 /* AL_BUFFERS_QUEUED */:
      case 0x1016 /* AL_BUFFERS_PROCESSED */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1027 /* AL_SOURCE_TYPE */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 0xD000 /* AL_DISTANCE_MODEL */:
        HEAP32[((pValue)>>2)]=val;
        break;
      default:
        AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
        return;
      }
    }

  function _alIsExtensionPresent(pExtName) {
      name = Pointer_stringify(pExtName);
  
      return AL.AL_EXTENSIONS[name] ? 1 : 0;
    }

  function _alListener3f(param, value0, value1, value2) {
      switch (param) {
      case 0x1004 /* AL_POSITION */:
      case 0x1006 /* AL_VELOCITY */:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setListenerParam('alListener3f', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListener3f', param, null);
        break;
      }
    }

  function _alListenerf(param, value) {
      switch (param) {
      case 0x100A /* AL_GAIN */:
        AL.setListenerParam('alListenerf', param, value);
        break;
      default:
        AL.setListenerParam('alListenerf', param, null);
        break;
      }
    }

  function _alSource3f(sourceId, param, value0, value1, value2) {
      switch (param) {
      case 0x1004 /* AL_POSITION */:
      case 0x1005 /* AL_DIRECTION */:
      case 0x1006 /* AL_VELOCITY */:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setSourceParam('alSource3f', sourceId, param, AL.paramArray);
        break;
      default:
        AL.setSourceParam('alSource3f', sourceId, param, null);
        break;
      }
    }

  function _alSourcePlay(sourceId) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      AL.setSourceState(src, 0x1012 /* AL_PLAYING */);
    }

  function _alSourceQueueBuffers(sourceId, count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      if (src.type === 0x1028 /* AL_STATIC */) {
        AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
        return;
      }
  
      if (count === 0) {
        return;
      }
  
      // Find the first non-zero buffer in the queue to determine the proper format
      var templateBuf = AL.buffers[0];
      for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufQueue[i].id !== 0) {
          templateBuf = src.bufQueue[i];
          break;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        var buf = AL.buffers[bufId];
        if (!buf) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
  
        // Check that the added buffer has the correct format. If the template is the zero buffer, any format is valid.
        if (templateBuf.id !== 0 && (
          buf.frequency !== templateBuf.frequency
          || buf.bytesPerSample !== templateBuf.bytesPerSample
          || buf.channels !== templateBuf.channels)
        ) {
          AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
        }
      }
  
      // If the only buffer in the queue is the zero buffer, clear the queue before we add anything.
      if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
        src.bufQueue.length = 0;
      }
  
      src.type = 0x1029 /* AL_STREAMING */;
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        var buf = AL.buffers[bufId];
        buf.refCount++;
        src.bufQueue.push(buf);
      }
  
      // if the source is looping, cancel the schedule so we can reschedule the loop order
      if (src.looping) {
        AL.cancelPendingSourceAudio(src);
      }
  
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
    }

  function _alSourceStop(sourceId) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
    }

  function _alSourceUnqueueBuffers(sourceId, count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      if (count === 0) {
        return;
      }
  
      for (var i = 0; i < count; i++) {
        var buf = src.bufQueue.shift();
        buf.refCount--;
        // Write the buffers index out to the return list.
        HEAP32[(((pBufferIds)+(i*4))>>2)]=buf.id;
        src.bufsProcessed--;
      }
  
      /// If the queue is empty, put the zero buffer back in
      if (src.bufQueue.length === 0) {
        src.bufQueue.push(AL.buffers[0]);
      }
  
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
    }

  function _alSourcef(sourceId, param, value) {
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 0x100A /* AL_GAIN */:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        AL.setSourceParam('alSourcef', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcef', sourceId, param, null);
        break;
      }
    }


  function _alcCloseDevice(deviceId) {
      if (!deviceId in AL.deviceRefCounts || AL.deviceRefCounts[deviceId] > 0) {
        return 0 /* ALC_FALSE */;
      }
  
      delete AL.deviceRefCounts[deviceId];
      AL.freeIds.push(deviceId);
      return 1 /* ALC_TRUE */;
    }

  function _alcCreateContext(deviceId, pAttrList) {
      if (!deviceId in AL.deviceRefCounts) {
        AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        return 0;
      }
  
      var options = null;
      var attrs = [];
      var hrtf = null;
      pAttrList >>= 2;
      if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
          attr = HEAP32[pAttrList++];
          attrs.push(attr);
          if (attr === 0) {
            break;
          }
          val = HEAP32[pAttrList++];
          attrs.push(val);
  
          switch (attr) {
          case 0x1007 /* ALC_FREQUENCY */:
            if (!options) {
              options = {};
            }
  
            options.sampleRate = val;
            break;
          case 0x1010 /* ALC_MONO_SOURCES */: // fallthrough
          case 0x1011 /* ALC_STEREO_SOURCES */:
            // Do nothing; these hints are satisfied by default
            break
          case 0x1992 /* ALC_HRTF_SOFT */:
            switch (val) {
              case 0 /* ALC_FALSE */:
                hrtf = false;
                break;
              case 1 /* ALC_TRUE */:
                hrtf = true;
                break;
              case 2 /* ALC_DONT_CARE_SOFT */:
                break;
              default:
                AL.alcErr = 0xA004 /* ALC_INVALID_VALUE */;
                return 0;
            }
            break;
          case 0x1996 /* ALC_HRTF_ID_SOFT */:
            if (val !== 0) {
              AL.alcErr = 0xA004 /* ALC_INVALID_VALUE */;
              return 0;
            }
            break;
          default:
            AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
            return 0;
          }
        }
      }
  
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ac = null;
      try {
        // Only try to pass options if there are any, for compat with browsers that don't support this
        if (options) {
          ac = new AudioContext(options);
        } else {
          ac = new AudioContext();
        }
      } catch (e) {
        if (e.name === 'NotSupportedError') {
          AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
        } else {
          AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        }
  
        return 0;
      }
  
      // Old Web Audio API (e.g. Safari 6.0.5) had an inconsistently named createGainNode function.
      if (typeof(ac.createGain) === 'undefined') {
        ac.createGain = ac.createGainNode;
      }
  
      var gain = ac.createGain();
      gain.connect(ac.destination);
      // Extend the Web Audio API AudioListener object with a few tracking values of our own.
      ac.listener._position = [0.0, 0.0, 0.0];
      ac.listener._velocity = [0.0, 0.0, 0.0];
      ac.listener._direction = [0.0, 0.0, 0.0];
      ac.listener._up = [0.0, 0.0, 0.0];
      var ctx = {
        deviceId: deviceId,
        id: AL.newId(),
        attrs: attrs,
        audioCtx: ac,
        sources: [],
        interval: setInterval(function() { AL.scheduleContextAudio(ctx); }, AL.QUEUE_INTERVAL),
        gain: gain,
        distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
        speedOfSound: 343.3,
        dopplerFactor: 1.0,
        sourceDistanceModel: false,
        hrtf: hrtf || false,
  
        _err: 0,
        get err() {
          return this._err;
        },
        set err(val) {
          // Errors should not be overwritten by later errors until they are cleared by a query.
          if (this._err === 0 /* AL_NO_ERROR */ || val === 0 /* AL_NO_ERROR */) {
            this._err = val;
          }
        }
      };
      AL.deviceRefCounts[deviceId]++;
      AL.contexts[ctx.id] = ctx;
  
      if (hrtf !== null) {
        // Apply hrtf attrib to all contexts for this device
        for (var ctxId in AL.contexts) {
          var c = AL.contexts[ctxId];
          if (c.deviceId === deviceId) {
            c.hrtf = hrtf;
            AL.updateContextGlobal(c);
          }
        }
      }
  
      return ctx.id;
    }

  function _alcDestroyContext(contextId) {
      var ctx = AL.contexts[contextId];
      if (AL.currentCtx === ctx) {
        AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
        return;
      }
  
      // Stop playback, etc
      if (AL.contexts[contextId].interval) {
        clearInterval(AL.contexts[contextId].interval);
      }
      AL.deviceRefCounts[ctx.deviceId]--;
      delete AL.contexts[contextId];
      AL.freeIds.push(contextId);
    }

  function _alcGetContextsDevice(contextId) {
      if (contextId in AL.contexts) {
        return AL.contexts[contextId].deviceId;
      } else {
        return 0;
      }
    }

  function _alcGetCurrentContext() {
      if (AL.currentCtx !== null) {
        return AL.currentCtx.id;
      } else {
        return 0;
      }
    }

  function _alcGetString(deviceId, param) {
      if (AL.alcStringCache[param]) {
        return AL.alcStringCache[param];
      }
  
      var ret;
      switch (param) {
      case 0 /* ALC_NO_ERROR */:
        ret = 'No Error';
        break;
      case 0xA001 /* ALC_INVALID_DEVICE */:
        ret = 'Invalid Device';
        break;
      case 0xA002 /* ALC_INVALID_CONTEXT */:
        ret = 'Invalid Context';
        break;
      case 0xA003 /* ALC_INVALID_ENUM */:
        ret = 'Invalid Enum';
        break;
      case 0xA004 /* ALC_INVALID_VALUE */:
        ret = 'Invalid Value';
        break;
      case 0xA005 /* ALC_OUT_OF_MEMORY */:
        ret = 'Out of Memory';
        break;
      case 0x1004 /* ALC_DEFAULT_DEVICE_SPECIFIER */:
        if (typeof(AudioContext) !== 'undefined' ||
            typeof(webkitAudioContext) !== 'undefined') {
          ret = AL.DEVICE_NAME;
        } else {
          return 0;
        }
        break;
      case 0x1005 /* ALC_DEVICE_SPECIFIER */:
        if (typeof(AudioContext) !== 'undefined' ||
            typeof(webkitAudioContext) !== 'undefined') {
          ret = AL.DEVICE_NAME.concat('\0');
        } else {
          ret = '\0';
        }
        break;
      case 0x311 /* ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER */:
        ret = AL.CAPTURE_DEVICE_NAME;
        break;
      case 0x310 /* ALC_CAPTURE_DEVICE_SPECIFIER */:
        if (deviceId === 0) 
          ret = AL.CAPTURE_DEVICE_NAME.concat('\0');
          else {
          var c = AL.requireValidCaptureDevice(deviceId, 'alcGetString');
          if (!c) {
            return 0;
          }
          ret = c.deviceName;
        }  
        break;
      case 0x1006 /* ALC_EXTENSIONS */:
        if (!deviceId) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return 0;
        }
  
        ret = '';
        for (var ext in AL.ALC_EXTENSIONS) {
          ret = ret.concat(ext);
          ret = ret.concat(' ');
        }
        ret = ret.trim();
        break;
      default:
        AL.alcErr = 0xA003 /* ALC_INVALID_ENUM */;
        return 0;
      }
  
      ret = allocate(intArrayFromString(ret), 'i8', ALLOC_NORMAL);
      AL.alcStringCache[param] = ret;
      return ret;
    }

  function _alcMakeContextCurrent(contextId) {
      if (contextId === 0) {
        AL.currentCtx = null;
        return 0;
      } else {
        AL.currentCtx = AL.contexts[contextId];
        return 1;
      }
    }

  function _alcOpenDevice(pDeviceName) {
      if (pDeviceName) {
        var name = Pointer_stringify(pDeviceName);
        if (name !== AL.DEVICE_NAME) {
          return 0;
        }
      }
  
      if (typeof(AudioContext) !== 'undefined' || typeof(webkitAudioContext) !== 'undefined') {
        var deviceId = AL.newId();
        AL.deviceRefCounts[deviceId] = 0;
        return deviceId;
      } else {
        return 0;
      }
    }

  
  var EGL={errorCode:12288,defaultDisplayInitialized:false,currentContext:0,currentReadSurface:0,currentDrawSurface:0,stringCache:{},setErrorCode:function (code) {
        EGL.errorCode = code;
      },chooseConfig:function (display, attribList, config, config_size, numConfigs) { 
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
          EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
          return 0;
        }
        // TODO: read attribList.
        if ((!config || !config_size) && !numConfigs) {
          EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
          return 0;
        }
        if (numConfigs) {
          HEAP32[((numConfigs)>>2)]=1; // Total number of supported configs: 1.
        }
        if (config && config_size > 0) {
          HEAP32[((config)>>2)]=62002; 
        }
        
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      }};function _eglGetProcAddress(name_) {
      return _emscripten_GetProcAddress(name_);
    }

  var _emscripten_asm_const_int=true;

  
  var JSEvents={keyEvent:0,mouseEvent:0,wheelEvent:0,uiEvent:0,focusEvent:0,deviceOrientationEvent:0,deviceMotionEvent:0,fullscreenChangeEvent:0,pointerlockChangeEvent:0,visibilityChangeEvent:0,touchEvent:0,lastGamepadState:null,lastGamepadStateFrame:null,numGamepadsConnected:0,previousFullscreenElement:null,previousScreenX:null,previousScreenY:null,removeEventListenersRegistered:false,staticInit:function () {
        if (typeof window !== 'undefined') {
          window.addEventListener("gamepadconnected", function() { ++JSEvents.numGamepadsConnected; });
          window.addEventListener("gamepaddisconnected", function() { --JSEvents.numGamepadsConnected; });
          
          // Chromium does not fire the gamepadconnected event on reload, so we need to get the number of gamepads here as a workaround.
          // See https://bugs.chromium.org/p/chromium/issues/detail?id=502824
          var firstState = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null);
          if (firstState) {
            JSEvents.numGamepadsConnected = firstState.length;
          }
        }
      },registerRemoveEventListeners:function () {
        if (!JSEvents.removeEventListenersRegistered) {
        __ATEXIT__.push(function() {
            for(var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
              JSEvents._removeHandler(i);
            }
           });
          JSEvents.removeEventListenersRegistered = true;
        }
      },findEventTarget:function (target) {
        if (target) {
          if (typeof target == "number") {
            target = Pointer_stringify(target);
          }
          if (target == '#window') return window;
          else if (target == '#document') return document;
          else if (target == '#screen') return window.screen;
          else if (target == '#canvas') return Module['canvas'];
  
          if (typeof target == 'string') return document.getElementById(target);
          else return target;
        } else {
          // The sensible target varies between events, but use window as the default
          // since DOM events mostly can default to that. Specific callback registrations
          // override their own defaults.
          return window;
        }
      },deferredCalls:[],deferCall:function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for(var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for(var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        });
  
        JSEvents.deferredCalls.sort(function(x,y) { return x.precedence < y.precedence; });
      },removeDeferredCalls:function (targetFunction) {
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },canPerformEventHandlerRequests:function () {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },runDeferredCalls:function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(this, call.argsList);
        }
      },inEventHandler:0,currentEventHandler:null,eventHandlers:[],isInternetExplorer:function () { return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0; },removeAllHandlersOnTarget:function (target, eventTypeString) {
        for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target && 
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },_removeHandler:function (i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },registerOrRemoveHandler:function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          // Increment nesting count for the event handler.
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          // Process any old deferred calls the user has placed.
          JSEvents.runDeferredCalls();
          // Process the actual event, calls back to user C code handler.
          eventHandler.handlerFunc(event);
          // Process any new deferred calls that were placed right now from this event handler.
          JSEvents.runDeferredCalls();
          // Out of event handler - restore nesting count.
          --JSEvents.inEventHandler;
        }
        
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
      },registerKeyEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.keyEvent) {
          JSEvents.keyEvent = _malloc( 164 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
          stringToUTF8(e.key ? e.key : "", JSEvents.keyEvent + 0, 32);
          stringToUTF8(e.code ? e.code : "", JSEvents.keyEvent + 32, 32);
          HEAP32[(((JSEvents.keyEvent)+(64))>>2)]=e.location;
          HEAP32[(((JSEvents.keyEvent)+(68))>>2)]=e.ctrlKey;
          HEAP32[(((JSEvents.keyEvent)+(72))>>2)]=e.shiftKey;
          HEAP32[(((JSEvents.keyEvent)+(76))>>2)]=e.altKey;
          HEAP32[(((JSEvents.keyEvent)+(80))>>2)]=e.metaKey;
          HEAP32[(((JSEvents.keyEvent)+(84))>>2)]=e.repeat;
          stringToUTF8(e.locale ? e.locale : "", JSEvents.keyEvent + 88, 32);
          stringToUTF8(e.char ? e.char : "", JSEvents.keyEvent + 120, 32);
          HEAP32[(((JSEvents.keyEvent)+(152))>>2)]=e.charCode;
          HEAP32[(((JSEvents.keyEvent)+(156))>>2)]=e.keyCode;
          HEAP32[(((JSEvents.keyEvent)+(160))>>2)]=e.which;
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.keyEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: JSEvents.isInternetExplorer() ? false : true, // MSIE doesn't allow fullscreen and pointerlock requests from key handlers, others do.
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },getBoundingClientRectOrZeros:function (target) {
        return target.getBoundingClientRect ? target.getBoundingClientRect() : { left: 0, top: 0 };
      },fillMouseEventData:function (eventStruct, e, target) {
        HEAPF64[((eventStruct)>>3)]=JSEvents.tick();
        HEAP32[(((eventStruct)+(8))>>2)]=e.screenX;
        HEAP32[(((eventStruct)+(12))>>2)]=e.screenY;
        HEAP32[(((eventStruct)+(16))>>2)]=e.clientX;
        HEAP32[(((eventStruct)+(20))>>2)]=e.clientY;
        HEAP32[(((eventStruct)+(24))>>2)]=e.ctrlKey;
        HEAP32[(((eventStruct)+(28))>>2)]=e.shiftKey;
        HEAP32[(((eventStruct)+(32))>>2)]=e.altKey;
        HEAP32[(((eventStruct)+(36))>>2)]=e.metaKey;
        HEAP16[(((eventStruct)+(40))>>1)]=e.button;
        HEAP16[(((eventStruct)+(42))>>1)]=e.buttons;
        HEAP32[(((eventStruct)+(44))>>2)]=e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || (e.screenX-JSEvents.previousScreenX);
        HEAP32[(((eventStruct)+(48))>>2)]=e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || (e.screenY-JSEvents.previousScreenY);
  
        if (Module['canvas']) {
          var rect = Module['canvas'].getBoundingClientRect();
          HEAP32[(((eventStruct)+(60))>>2)]=e.clientX - rect.left;
          HEAP32[(((eventStruct)+(64))>>2)]=e.clientY - rect.top;
        } else { // Canvas is not initialized, return 0.
          HEAP32[(((eventStruct)+(60))>>2)]=0;
          HEAP32[(((eventStruct)+(64))>>2)]=0;
        }
        if (target) {
          var rect = JSEvents.getBoundingClientRectOrZeros(target);
          HEAP32[(((eventStruct)+(52))>>2)]=e.clientX - rect.left;
          HEAP32[(((eventStruct)+(56))>>2)]=e.clientY - rect.top;        
        } else { // No specific target passed, return 0.
          HEAP32[(((eventStruct)+(52))>>2)]=0;
          HEAP32[(((eventStruct)+(56))>>2)]=0;
        }
        // wheel and mousewheel events contain wrong screenX/screenY on chrome/opera
        // https://github.com/kripken/emscripten/pull/4997
        // https://bugs.chromium.org/p/chromium/issues/detail?id=699956
        if (e.type !== 'wheel' && e.type !== 'mousewheel') {
          JSEvents.previousScreenX = e.screenX;
          JSEvents.previousScreenY = e.screenY;
        }
      },registerMouseEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.mouseEvent) {
          JSEvents.mouseEvent = _malloc( 72 );
        }
        target = JSEvents.findEventTarget(target);
        var handlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.mouseEvent, e, target);
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.mouseEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        // In IE, mousedown events don't either allow deferred calls to be run!
        if (JSEvents.isInternetExplorer() && eventTypeString == 'mousedown') eventHandler.allowsDeferredCalls = false;
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerWheelEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.wheelEvent) {
          JSEvents.wheelEvent = _malloc( 104 );
        }
        target = JSEvents.findEventTarget(target);
        // The DOM Level 3 events spec event 'wheel'
        var wheelHandlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
          HEAPF64[(((JSEvents.wheelEvent)+(72))>>3)]=e["deltaX"];
          HEAPF64[(((JSEvents.wheelEvent)+(80))>>3)]=e["deltaY"];
          HEAPF64[(((JSEvents.wheelEvent)+(88))>>3)]=e["deltaZ"];
          HEAP32[(((JSEvents.wheelEvent)+(96))>>2)]=e["deltaMode"];
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
        // The 'mousewheel' event as implemented in Safari 6.0.5
        var mouseWheelHandlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
          HEAPF64[(((JSEvents.wheelEvent)+(72))>>3)]=e["wheelDeltaX"] || 0;
          HEAPF64[(((JSEvents.wheelEvent)+(80))>>3)]=-(e["wheelDeltaY"] ? e["wheelDeltaY"] : e["wheelDelta"]) /* 1. Invert to unify direction with the DOM Level 3 wheel event. 2. MSIE does not provide wheelDeltaY, so wheelDelta is used as a fallback. */;
          HEAPF64[(((JSEvents.wheelEvent)+(88))>>3)]=0 /* Not available */;
          HEAP32[(((JSEvents.wheelEvent)+(96))>>2)]=0 /* DOM_DELTA_PIXEL */;
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: (eventTypeString == 'wheel') ? wheelHandlerFunc : mouseWheelHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },pageScrollPos:function () {
        if (window.pageXOffset > 0 || window.pageYOffset > 0) {
          return [window.pageXOffset, window.pageYOffset];
        }
        if (typeof document.documentElement.scrollLeft !== 'undefined' || typeof document.documentElement.scrollTop !== 'undefined') {
          return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
        }
        return [document.body.scrollLeft|0, document.body.scrollTop|0];
      },registerUiEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.uiEvent) {
          JSEvents.uiEvent = _malloc( 36 );
        }
  
        if (eventTypeString == "scroll" && !target) {
          target = document; // By default read scroll events on document rather than window.
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
          if (e.target != target) {
            // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
            // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
            // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
            // causing a new scroll, etc..
            return;
          }
          var scrollPos = JSEvents.pageScrollPos();
          HEAP32[((JSEvents.uiEvent)>>2)]=e.detail;
          HEAP32[(((JSEvents.uiEvent)+(4))>>2)]=document.body.clientWidth;
          HEAP32[(((JSEvents.uiEvent)+(8))>>2)]=document.body.clientHeight;
          HEAP32[(((JSEvents.uiEvent)+(12))>>2)]=window.innerWidth;
          HEAP32[(((JSEvents.uiEvent)+(16))>>2)]=window.innerHeight;
          HEAP32[(((JSEvents.uiEvent)+(20))>>2)]=window.outerWidth;
          HEAP32[(((JSEvents.uiEvent)+(24))>>2)]=window.outerHeight;
          HEAP32[(((JSEvents.uiEvent)+(28))>>2)]=scrollPos[0];
          HEAP32[(((JSEvents.uiEvent)+(32))>>2)]=scrollPos[1];
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.uiEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false, // Neither scroll or resize events allow running requests inside them.
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },getNodeNameForTarget:function (target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == window.screen) return '#screen';
        return (target && target.nodeName) ? target.nodeName : '';
      },registerFocusEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.focusEvent) {
          JSEvents.focusEvent = _malloc( 256 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var nodeName = JSEvents.getNodeNameForTarget(e.target);
          var id = e.target.id ? e.target.id : '';
          stringToUTF8(nodeName, JSEvents.focusEvent + 0, 128);
          stringToUTF8(id, JSEvents.focusEvent + 128, 128);
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.focusEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },tick:function () {
        if (window['performance'] && window['performance']['now']) return window['performance']['now']();
        else return Date.now();
      },registerDeviceOrientationEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceOrientationEvent) {
          JSEvents.deviceOrientationEvent = _malloc( 40 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          HEAPF64[((JSEvents.deviceOrientationEvent)>>3)]=JSEvents.tick();
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(8))>>3)]=e.alpha;
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(16))>>3)]=e.beta;
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(24))>>3)]=e.gamma;
          HEAP32[(((JSEvents.deviceOrientationEvent)+(32))>>2)]=e.absolute;
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.deviceOrientationEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerDeviceMotionEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceMotionEvent) {
          JSEvents.deviceMotionEvent = _malloc( 80 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          HEAPF64[((JSEvents.deviceMotionEvent)>>3)]=JSEvents.tick();
          HEAPF64[(((JSEvents.deviceMotionEvent)+(8))>>3)]=e.acceleration.x;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(16))>>3)]=e.acceleration.y;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(24))>>3)]=e.acceleration.z;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(32))>>3)]=e.accelerationIncludingGravity.x;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(40))>>3)]=e.accelerationIncludingGravity.y;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(48))>>3)]=e.accelerationIncludingGravity.z;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(56))>>3)]=e.rotationRate.alpha;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(64))>>3)]=e.rotationRate.beta;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(72))>>3)]=e.rotationRate.gamma;
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.deviceMotionEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },screenOrientation:function () {
        if (!window.screen) return undefined;
        return window.screen.orientation || window.screen.mozOrientation || window.screen.webkitOrientation || window.screen.msOrientation;
      },fillOrientationChangeEventData:function (eventStruct, e) {
        var orientations  = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
        var orientations2 = ["portrait",         "portrait",           "landscape",         "landscape"];
  
        var orientationString = JSEvents.screenOrientation();
        var orientation = orientations.indexOf(orientationString);
        if (orientation == -1) {
          orientation = orientations2.indexOf(orientationString);
        }
  
        HEAP32[((eventStruct)>>2)]=1 << orientation;
        HEAP32[(((eventStruct)+(4))>>2)]=window.orientation;
      },registerOrientationChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.orientationChangeEvent) {
          JSEvents.orientationChangeEvent = _malloc( 8 );
        }
  
        if (!target) {
          target = window.screen; // Orientation events need to be captured from 'window.screen' instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillOrientationChangeEventData(JSEvents.orientationChangeEvent, e);
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.orientationChangeEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        if (eventTypeString == "orientationchange" && window.screen.mozOrientation !== undefined) {
          eventTypeString = "mozorientationchange";
        }
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },fullscreenEnabled:function () {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
      },fillFullscreenChangeEventData:function (eventStruct, e) {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        var isFullscreen = !!fullscreenElement;
        HEAP32[((eventStruct)>>2)]=isFullscreen;
        HEAP32[(((eventStruct)+(4))>>2)]=JSEvents.fullscreenEnabled();
        // If transitioning to fullscreen, report info about the element that is now fullscreen.
        // If transitioning to windowed mode, report info about the element that just was fullscreen.
        var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
        var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
        var id = (reportedElement && reportedElement.id) ? reportedElement.id : '';
        stringToUTF8(nodeName, eventStruct + 8, 128);
        stringToUTF8(id, eventStruct + 136, 128);
        HEAP32[(((eventStruct)+(264))>>2)]=reportedElement ? reportedElement.clientWidth : 0;
        HEAP32[(((eventStruct)+(268))>>2)]=reportedElement ? reportedElement.clientHeight : 0;
        HEAP32[(((eventStruct)+(272))>>2)]=screen.width;
        HEAP32[(((eventStruct)+(276))>>2)]=screen.height;
        if (isFullscreen) {
          JSEvents.previousFullscreenElement = fullscreenElement;
        }
      },registerFullscreenChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.fullscreenChangeEvent) {
          JSEvents.fullscreenChangeEvent = _malloc( 280 );
        }
  
        if (!target) {
          target = document; // Fullscreen change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillFullscreenChangeEventData(JSEvents.fullscreenChangeEvent, e);
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.fullscreenChangeEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },resizeCanvasForFullscreen:function (target, strategy) {
        var restoreOldStyle = __registerRestoreOldStyle(target);
        var cssWidth = strategy.softFullscreen ? window.innerWidth : screen.width;
        var cssHeight = strategy.softFullscreen ? window.innerHeight : screen.height;
        var rect = target.getBoundingClientRect();
        var windowedCssWidth = rect.right - rect.left;
        var windowedCssHeight = rect.bottom - rect.top;
        var windowedRttWidth = target.width;
        var windowedRttHeight = target.height;
  
        if (strategy.scaleMode == 3) {
          __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
          cssWidth = windowedCssWidth;
          cssHeight = windowedCssHeight;
        } else if (strategy.scaleMode == 2) {
          if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
            var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
            __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
            cssHeight = desiredCssHeight;
          } else {
            var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
            __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
            cssWidth = desiredCssWidth;
          }
        }
  
        // If we are adding padding, must choose a background color or otherwise Chrome will give the
        // padding a default white color. Do it only if user has not customized their own background color.
        if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
        // IE11 does the same, but requires the color to be set in the document body.
        if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
        // Firefox always shows black letterboxes independent of style color.
  
        target.style.width = cssWidth + 'px';
        target.style.height = cssHeight + 'px';
  
        if (strategy.filteringMode == 1) {
          target.style.imageRendering = 'optimizeSpeed';
          target.style.imageRendering = '-moz-crisp-edges';
          target.style.imageRendering = '-o-crisp-edges';
          target.style.imageRendering = '-webkit-optimize-contrast';
          target.style.imageRendering = 'optimize-contrast';
          target.style.imageRendering = 'crisp-edges';
          target.style.imageRendering = 'pixelated';
        }
  
        var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? window.devicePixelRatio : 1;
        if (strategy.canvasResolutionScaleMode != 0) {
          target.width = cssWidth * dpiScale;
          target.height = cssHeight * dpiScale;
          if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, target.width, target.height);
        }
        return restoreOldStyle;
      },requestFullscreen:function (target, strategy) {
        // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
        if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
          JSEvents.resizeCanvasForFullscreen(target, strategy);
        }
  
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.msRequestFullscreen) {
          target.msRequestFullscreen();
        } else if (target.mozRequestFullScreen) {
          target.mozRequestFullScreen();
        } else if (target.mozRequestFullscreen) {
          target.mozRequestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
          if (typeof JSEvents.fullscreenEnabled() === 'undefined') {
            return -1;
          } else {
            return -3;
          }
        }
  
        if (strategy.canvasResizedCallback) {
          Module['dynCall_iiii'](strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData);
        }
  
        return 0;
      },fillPointerlockChangeEventData:function (eventStruct, e) {
        var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
        var isPointerlocked = !!pointerLockElement;
        HEAP32[((eventStruct)>>2)]=isPointerlocked;
        var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
        var id = (pointerLockElement && pointerLockElement.id) ? pointerLockElement.id : '';
        stringToUTF8(nodeName, eventStruct + 4, 128);
        stringToUTF8(id, eventStruct + 132, 128);
      },registerPointerlockChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.pointerlockChangeEvent) {
          JSEvents.pointerlockChangeEvent = _malloc( 260 );
        }
  
        if (!target) {
          target = document; // Pointer lock change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillPointerlockChangeEventData(JSEvents.pointerlockChangeEvent, e);
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.pointerlockChangeEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerPointerlockErrorEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
          target = document; // Pointer lock events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, 0, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },requestPointerLock:function (target) {
        if (target.requestPointerLock) {
          target.requestPointerLock();
        } else if (target.mozRequestPointerLock) {
          target.mozRequestPointerLock();
        } else if (target.webkitRequestPointerLock) {
          target.webkitRequestPointerLock();
        } else if (target.msRequestPointerLock) {
          target.msRequestPointerLock();
        } else {
          // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
          // or if the whole browser just doesn't support the feature.
          if (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) {
            return -3;
          } else {
            return -1;
          }
        }
        return 0;
      },fillVisibilityChangeEventData:function (eventStruct, e) {
        var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
        var visibilityState = visibilityStates.indexOf(document.visibilityState);
  
        HEAP32[((eventStruct)>>2)]=document.hidden;
        HEAP32[(((eventStruct)+(4))>>2)]=visibilityState;
      },registerVisibilityChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.visibilityChangeEvent) {
          JSEvents.visibilityChangeEvent = _malloc( 8 );
        }
  
        if (!target) {
          target = document; // Visibility change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillVisibilityChangeEventData(JSEvents.visibilityChangeEvent, e);
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.visibilityChangeEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerTouchEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.touchEvent) {
          JSEvents.touchEvent = _malloc( 1684 );
        }
  
        target = JSEvents.findEventTarget(target);
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var touches = {};
          for(var i = 0; i < e.touches.length; ++i) {
            var touch = e.touches[i];
            touches[touch.identifier] = touch;
          }
          for(var i = 0; i < e.changedTouches.length; ++i) {
            var touch = e.changedTouches[i];
            touches[touch.identifier] = touch;
            touch.changed = true;
          }
          for(var i = 0; i < e.targetTouches.length; ++i) {
            var touch = e.targetTouches[i];
            touches[touch.identifier].onTarget = true;
          }
          
          var ptr = JSEvents.touchEvent;
          HEAP32[(((ptr)+(4))>>2)]=e.ctrlKey;
          HEAP32[(((ptr)+(8))>>2)]=e.shiftKey;
          HEAP32[(((ptr)+(12))>>2)]=e.altKey;
          HEAP32[(((ptr)+(16))>>2)]=e.metaKey;
          ptr += 20; // Advance to the start of the touch array.
          var canvasRect = Module['canvas'] ? Module['canvas'].getBoundingClientRect() : undefined;
          var targetRect = JSEvents.getBoundingClientRectOrZeros(target);
          var numTouches = 0;
          for(var i in touches) {
            var t = touches[i];
            HEAP32[((ptr)>>2)]=t.identifier;
            HEAP32[(((ptr)+(4))>>2)]=t.screenX;
            HEAP32[(((ptr)+(8))>>2)]=t.screenY;
            HEAP32[(((ptr)+(12))>>2)]=t.clientX;
            HEAP32[(((ptr)+(16))>>2)]=t.clientY;
            HEAP32[(((ptr)+(20))>>2)]=t.pageX;
            HEAP32[(((ptr)+(24))>>2)]=t.pageY;
            HEAP32[(((ptr)+(28))>>2)]=t.changed;
            HEAP32[(((ptr)+(32))>>2)]=t.onTarget;
            if (canvasRect) {
              HEAP32[(((ptr)+(44))>>2)]=t.clientX - canvasRect.left;
              HEAP32[(((ptr)+(48))>>2)]=t.clientY - canvasRect.top;
            } else {
              HEAP32[(((ptr)+(44))>>2)]=0;
              HEAP32[(((ptr)+(48))>>2)]=0;            
            }
            HEAP32[(((ptr)+(36))>>2)]=t.clientX - targetRect.left;
            HEAP32[(((ptr)+(40))>>2)]=t.clientY - targetRect.top;
            
            ptr += 52;
  
            if (++numTouches >= 32) {
              break;
            }
          }
          HEAP32[((JSEvents.touchEvent)>>2)]=numTouches;
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.touchEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },fillGamepadEventData:function (eventStruct, e) {
        HEAPF64[((eventStruct)>>3)]=e.timestamp;
        for(var i = 0; i < e.axes.length; ++i) {
          HEAPF64[(((eventStruct+i*8)+(16))>>3)]=e.axes[i];
        }
        for(var i = 0; i < e.buttons.length; ++i) {
          if (typeof(e.buttons[i]) === 'object') {
            HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i].value;
          } else {
            HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i];
          }
        }
        for(var i = 0; i < e.buttons.length; ++i) {
          if (typeof(e.buttons[i]) === 'object') {
            HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i].pressed;
          } else {
            HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i] == 1.0;
          }
        }
        HEAP32[(((eventStruct)+(1296))>>2)]=e.connected;
        HEAP32[(((eventStruct)+(1300))>>2)]=e.index;
        HEAP32[(((eventStruct)+(8))>>2)]=e.axes.length;
        HEAP32[(((eventStruct)+(12))>>2)]=e.buttons.length;
        stringToUTF8(e.id, eventStruct + 1304, 64);
        stringToUTF8(e.mapping, eventStruct + 1368, 64);
      },registerGamepadEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.gamepadEvent) {
          JSEvents.gamepadEvent = _malloc( 1432 );
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillGamepadEventData(JSEvents.gamepadEvent, e.gamepad);
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.gamepadEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerBeforeUnloadEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var confirmationMessage = Module['dynCall_iiii'](callbackfunc, eventTypeId, 0, userData);
          
          if (confirmationMessage) {
            confirmationMessage = Pointer_stringify(confirmationMessage);
          }
          if (confirmationMessage) {
            e.preventDefault();
            e.returnValue = confirmationMessage;
            return confirmationMessage;
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },battery:function () { return navigator.battery || navigator.mozBattery || navigator.webkitBattery; },fillBatteryEventData:function (eventStruct, e) {
        HEAPF64[((eventStruct)>>3)]=e.chargingTime;
        HEAPF64[(((eventStruct)+(8))>>3)]=e.dischargingTime;
        HEAPF64[(((eventStruct)+(16))>>3)]=e.level;
        HEAP32[(((eventStruct)+(24))>>2)]=e.charging;
      },registerBatteryEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.batteryEvent) {
          JSEvents.batteryEvent = _malloc( 32 );
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillBatteryEventData(JSEvents.batteryEvent, JSEvents.battery());
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, JSEvents.batteryEvent, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerWebGlEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
          target = Module['canvas'];
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var shouldCancel = Module['dynCall_iiii'](callbackfunc, eventTypeId, 0, userData);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }};function _emscripten_exit_pointerlock() {
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(JSEvents.requestPointerLock);
  
      if (document.exitPointerLock) {
        document.exitPointerLock();
      } else if (document.msExitPointerLock) {
        document.msExitPointerLock();
      } else if (document.mozExitPointerLock) {
        document.mozExitPointerLock();
      } else if (document.webkitExitPointerLock) {
        document.webkitExitPointerLock();
      } else {
        return -1;
      }
      return 0;
    }

  
  function __emscripten_sample_gamepad_data() {
      // Polling gamepads generates garbage, so don't do it when we know there are no gamepads connected.
      if (!JSEvents.numGamepadsConnected) return;
  
      // Produce a new Gamepad API sample if we are ticking a new game frame, or if not using emscripten_set_main_loop() at all to drive animation.
      if (Browser.mainLoop.currentFrameNumber !== JSEvents.lastGamepadStateFrame || !Browser.mainLoop.currentFrameNumber) {
        JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : null);
        JSEvents.lastGamepadStateFrame = Browser.mainLoop.currentFrameNumber;
      }
    }function _emscripten_get_gamepad_status(index, gamepadState) {
      __emscripten_sample_gamepad_data();
      if (!JSEvents.lastGamepadState) return -1;
  
      // INVALID_PARAM is returned on a Gamepad index that never was there.
      if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  
      // NO_DATA is returned on a Gamepad index that was removed.
      // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
      // This is because gamepads must keep their original position in the array.
      // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
      if (!JSEvents.lastGamepadState[index]) return -7;
  
      JSEvents.fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
      return 0;
    }

  function _emscripten_get_num_gamepads() {
      // Polling gamepads generates garbage, so don't do it when we know there are no gamepads connected.
      if (!JSEvents.numGamepadsConnected) return 0;
  
      __emscripten_sample_gamepad_data();
      if (!JSEvents.lastGamepadState) return -1;
      return JSEvents.lastGamepadState.length;
    }

  function _emscripten_get_pointerlock_status(pointerlockStatus) {
      if (pointerlockStatus) JSEvents.fillPointerlockChangeEventData(pointerlockStatus);
      if (!document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
        return -1;
      }
      return 0;
    }

  
  var GL={counter:1,lastError:0,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],currentContext:null,offscreenCanvases:{},timerQueriesEXT:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},tempFixedLengthArray:[],packAlignment:4,unpackAlignment:4,init:function () {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
          GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i+1);
        }
  
        // For functions such as glDrawBuffers, glInvalidateFramebuffer and glInvalidateSubFramebuffer that need to pass a short array to the WebGL API,
        // create a set of short fixed-length arrays to avoid having to generate any garbage when calling those functions.
        for (var i = 0; i < 32; i++) {
          GL.tempFixedLengthArray.push(new Array(i));
        }
      },recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MINI_TEMP_BUFFER_SIZE:256,miniTempBuffer:null,miniTempBufferViews:[0],getSource:function (shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var frag;
          if (length) {
            var len = HEAP32[(((length)+(i*4))>>2)];
            if (len < 0) {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
            } else {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)], len);
            }
          } else {
            frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
          }
          source += frag;
        }
        return source;
      },createContext:function (canvas, webGLContextAttributes) {
        if (typeof webGLContextAttributes['majorVersion'] === 'undefined' && typeof webGLContextAttributes['minorVersion'] === 'undefined') {
          webGLContextAttributes['majorVersion'] = 1;
          webGLContextAttributes['minorVersion'] = 0;
        }
  
  
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
          try {
            if (webGLContextAttributes['majorVersion'] == 1 && webGLContextAttributes['minorVersion'] == 0) {
              ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
            } else if (webGLContextAttributes['majorVersion'] == 2 && webGLContextAttributes['minorVersion'] == 0) {
              ctx = canvas.getContext("webgl2", webGLContextAttributes);
            } else {
              throw 'Unsupported WebGL context version ' + majorVersion + '.' + minorVersion + '!'
            }
          } finally {
            canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e, JSON.stringify(webGLContextAttributes)]);
          return 0;
        }
  
        if (!ctx) return 0;
        var context = GL.registerContext(ctx, webGLContextAttributes);
        return context;
      },registerContext:function (ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes['majorVersion'],
          GLctx: ctx
        };
  
  
        // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes['enableExtensionsByDefault'] === 'undefined' || webGLContextAttributes['enableExtensionsByDefault']) {
          GL.initExtensions(context);
        }
        return handle;
      },makeContextCurrent:function (contextHandle) {
        var context = GL.contexts[contextHandle];
        if (!context) return false;
        GLctx = Module.ctx = context.GLctx; // Active WebGL context object.
        GL.currentContext = context; // Active Emscripten GL layer context object.
        return true;
      },getContext:function (contextHandle) {
        return GL.contexts[contextHandle];
      },deleteContext:function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
        GL.contexts[contextHandle] = null;
      },initExtensions:function (context) {
        // If this function is called without a specific context object, init the extensions of the currently active context.
        if (!context) context = GL.currentContext;
  
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
  
        var GLctx = context.GLctx;
  
        context.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist.
  
        if (context.version < 2) {
          // Extension available from Firefox 26 and Google Chrome 30
          var instancedArraysExt = GLctx.getExtension('ANGLE_instanced_arrays');
          if (instancedArraysExt) {
            GLctx['vertexAttribDivisor'] = function(index, divisor) { instancedArraysExt['vertexAttribDivisorANGLE'](index, divisor); };
            GLctx['drawArraysInstanced'] = function(mode, first, count, primcount) { instancedArraysExt['drawArraysInstancedANGLE'](mode, first, count, primcount); };
            GLctx['drawElementsInstanced'] = function(mode, count, type, indices, primcount) { instancedArraysExt['drawElementsInstancedANGLE'](mode, count, type, indices, primcount); };
          }
  
          // Extension available from Firefox 25 and WebKit
          var vaoExt = GLctx.getExtension('OES_vertex_array_object');
          if (vaoExt) {
            GLctx['createVertexArray'] = function() { return vaoExt['createVertexArrayOES'](); };
            GLctx['deleteVertexArray'] = function(vao) { vaoExt['deleteVertexArrayOES'](vao); };
            GLctx['bindVertexArray'] = function(vao) { vaoExt['bindVertexArrayOES'](vao); };
            GLctx['isVertexArray'] = function(vao) { return vaoExt['isVertexArrayOES'](vao); };
          }
  
          var drawBuffersExt = GLctx.getExtension('WEBGL_draw_buffers');
          if (drawBuffersExt) {
            GLctx['drawBuffers'] = function(n, bufs) { drawBuffersExt['drawBuffersWEBGL'](n, bufs); };
          }
        }
  
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays",
                                               "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc",
                                               "WEBKIT_WEBGL_compressed_texture_pvrtc", "WEBGL_compressed_texture_pvrtc",
                                               "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_frag_depth", "EXT_sRGB",
                                               "WEBGL_draw_buffers", "WEBGL_shared_resources", "EXT_shader_texture_lod", "EXT_color_buffer_float"];
  
        function shouldEnableAutomatically(extension) {
          var ret = false;
          automaticallyEnabledExtensions.forEach(function(include) {
            if (extension.indexOf(include) != -1) {
              ret = true;
            }
          });
          return ret;
        }
  
        var exts = GLctx.getSupportedExtensions();
        if (exts && exts.length > 0) {
          GLctx.getSupportedExtensions().forEach(function(ext) {
            if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
              GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
            }
          });
        }
      },populateUniformTable:function (program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1, // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
          maxUniformBlockNameLength: -1 // Lazily computed as well
        };
  
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // Strip off any trailing array specifier we might have got, e.g. "[0]".
          if (name.indexOf(']', name.length-1) !== -1) {
            var ls = name.lastIndexOf('[');
            name = name.slice(0, ls);
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          if (loc != null)
          {
            var id = GL.getNewId(GL.uniforms);
            utable[name] = [u.size, id];
            GL.uniforms[id] = loc;
  
            for (var j = 1; j < u.size; ++j) {
              var n = name + '['+j+']';
              loc = GLctx.getUniformLocation(p, n);
              id = GL.getNewId(GL.uniforms);
  
              GL.uniforms[id] = loc;
            }
          }
        }
      }};function _emscripten_glActiveTexture(x0) { GLctx['activeTexture'](x0) }

  function _emscripten_glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _emscripten_glBindAttribLocation(program, index, name) {
      name = Pointer_stringify(name);
      GLctx.bindAttribLocation(GL.programs[program], index, name);
    }

  function _emscripten_glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
  
      GLctx.bindBuffer(target, bufferObj);
    }

  function _emscripten_glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null);
    }

  function _emscripten_glBindProgramARB() {
  Module['printErr']('missing function: emscripten_glBindProgramARB'); abort(-1);
  }

  function _emscripten_glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null);
    }

  function _emscripten_glBindTexture(target, texture) {
      GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
    }

  function _emscripten_glBindVertexArray(vao) {
      GLctx['bindVertexArray'](GL.vaos[vao]);
    }

  function _emscripten_glBlendColor(x0, x1, x2, x3) { GLctx['blendColor'](x0, x1, x2, x3) }

  function _emscripten_glBlendEquation(x0) { GLctx['blendEquation'](x0) }

  function _emscripten_glBlendEquationSeparate(x0, x1) { GLctx['blendEquationSeparate'](x0, x1) }

  function _emscripten_glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }

  function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) { GLctx['blendFuncSeparate'](x0, x1, x2, x3) }

  function _emscripten_glBufferData(target, size, data, usage) {
      if (!data) {
        GLctx.bufferData(target, size, usage);
      } else {
        GLctx.bufferData(target, HEAPU8.subarray(data, data+size), usage);
      }
    }

  function _emscripten_glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  function _emscripten_glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }

  function _emscripten_glClear(x0) { GLctx['clear'](x0) }

  function _emscripten_glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }

  function _emscripten_glClearDepth(x0) { GLctx['clearDepth'](x0) }

  function _emscripten_glClearDepthf(x0) { GLctx['clearDepth'](x0) }

  function _emscripten_glClearStencil(x0) { GLctx['clearStencil'](x0) }

  function _emscripten_glClientActiveTexture() {
  Module['printErr']('missing function: emscripten_glClientActiveTexture'); abort(-1);
  }

  function _emscripten_glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }

  function _emscripten_glColorPointer() {
  Module['printErr']('missing function: emscripten_glColorPointer'); abort(-1);
  }

  function _emscripten_glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }

  function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
      GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
    }

  function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
      GLctx['compressedTexSubImage2D'](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
    }

  function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }

  function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexSubImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }

  function _emscripten_glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function _emscripten_glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  function _emscripten_glCullFace(x0) { GLctx['cullFace'](x0) }

  function _emscripten_glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
      }
    }

  function _emscripten_glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }

  function _emscripten_glDeleteObjectARB() {
  Module['printErr']('missing function: emscripten_glDeleteObjectARB'); abort(-1);
  }

  function _emscripten_glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
      GL.programInfos[id] = null;
    }

  function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    }

  function _emscripten_glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }

  function _emscripten_glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }

  function _emscripten_glDeleteVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((vaos)+(i*4))>>2)];
        GLctx['deleteVertexArray'](GL.vaos[id]);
        GL.vaos[id] = null;
      }
    }

  function _emscripten_glDepthFunc(x0) { GLctx['depthFunc'](x0) }

  function _emscripten_glDepthMask(flag) {
      GLctx.depthMask(!!flag);
    }

  function _emscripten_glDepthRange(x0, x1) { GLctx['depthRange'](x0, x1) }

  function _emscripten_glDepthRangef(x0, x1) { GLctx['depthRange'](x0, x1) }

  function _emscripten_glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _emscripten_glDisable(x0) { GLctx['disable'](x0) }

  function _emscripten_glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }

  function _emscripten_glDrawArrays(mode, first, count) {
  
      GLctx.drawArrays(mode, first, count);
  
    }

  function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
      GLctx['drawArraysInstanced'](mode, first, count, primcount);
    }

  function _emscripten_glDrawBuffers(n, bufs) {
  
      var bufArray = GL.tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(((bufs)+(i*4))>>2)];
      }
  
      GLctx['drawBuffers'](bufArray);
    }

  function _emscripten_glDrawElements(mode, count, type, indices) {
  
      GLctx.drawElements(mode, count, type, indices);
  
    }

  function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
      GLctx['drawElementsInstanced'](mode, count, type, indices, primcount);
    }

  function _emscripten_glDrawRangeElements() {
  Module['printErr']('missing function: emscripten_glDrawRangeElements'); abort(-1);
  }

  function _emscripten_glEnable(x0) { GLctx['enable'](x0) }

  function _emscripten_glEnableClientState() {
  Module['printErr']('missing function: emscripten_glEnableClientState'); abort(-1);
  }

  function _emscripten_glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }

  function _emscripten_glFinish() { GLctx['finish']() }

  function _emscripten_glFlush() { GLctx['flush']() }

  function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    }

  function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    }

  function _emscripten_glFrontFace(x0) { GLctx['frontFace'](x0) }

  function _emscripten_glFrustum() {
  Module['printErr']('missing function: emscripten_glFrustum'); abort(-1);
  }

  function _emscripten_glGenBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx.createBuffer();
        if (!buffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((buffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.buffers);
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[(((buffers)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenFramebuffers(n, ids) {
      for (var i = 0; i < n; ++i) {
        var framebuffer = GLctx.createFramebuffer();
        if (!framebuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((ids)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.framebuffers);
        framebuffer.name = id;
        GL.framebuffers[id] = framebuffer;
        HEAP32[(((ids)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var renderbuffer = GLctx.createRenderbuffer();
        if (!renderbuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((renderbuffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.renderbuffers);
        renderbuffer.name = id;
        GL.renderbuffers[id] = renderbuffer;
        HEAP32[(((renderbuffers)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var texture = GLctx.createTexture();
        if (!texture) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */); // GLES + EGL specs don't specify what should happen here, so best to issue an error and create IDs with 0.
          while(i < n) HEAP32[(((textures)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.textures);
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[(((textures)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenVertexArrays(n, arrays) {
  
      for (var i = 0; i < n; i++) {
        var vao = GLctx['createVertexArray']();
        if (!vao) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((arrays)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.vaos);
        vao.name = id;
        GL.vaos[id] = vao;
        HEAP32[(((arrays)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenerateMipmap(x0) { GLctx['generateMipmap'](x0) }

  function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
      program = GL.programs[program];
      var info = GLctx.getActiveAttrib(program, index);
      if (!info) return; // If an error occurs, nothing will be written to length, size and type and name.
  
      if (bufSize > 0 && name) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
  
      if (size) HEAP32[((size)>>2)]=info.size;
      if (type) HEAP32[((type)>>2)]=info.type;
    }

  function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
      program = GL.programs[program];
      var info = GLctx.getActiveUniform(program, index);
      if (!info) return; // If an error occurs, nothing will be written to length, size, type and name.
  
      if (bufSize > 0 && name) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
  
      if (size) HEAP32[((size)>>2)]=info.size;
      if (type) HEAP32[((type)>>2)]=info.type;
    }

  function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
      var result = GLctx.getAttachedShaders(GL.programs[program]);
      var len = result.length;
      if (len > maxCount) {
        len = maxCount;
      }
      HEAP32[((count)>>2)]=len;
      for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        assert(id !== -1, 'shader not bound to local id');
        HEAP32[(((shaders)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGetAttribLocation(program, name) {
      program = GL.programs[program];
      name = Pointer_stringify(name);
      return GLctx.getAttribLocation(program, name);
    }

  
  function emscriptenWebGLGet(name_, p, type) {
      // Guard against user passing a null pointer.
      // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
      // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
      // better to report an error instead of doing anything random.
      if (!p) {
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      var ret = undefined;
      switch(name_) { // Handle a few trivial GLES values
        case 0x8DFA: // GL_SHADER_COMPILER
          ret = 1;
          break;
        case 0x8DF8: // GL_SHADER_BINARY_FORMATS
          if (type !== 'Integer' && type !== 'Integer64') {
            GL.recordError(0x0500); // GL_INVALID_ENUM
          }
          return; // Do not write anything to the out pointer, since no binary formats are supported.
        case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
          ret = 0;
          break;
        case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
          // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
          // so implement it ourselves to allow C++ GLES2 code get the length.
          var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
          ret = formats.length;
          break;
      }
  
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof(result)) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(0x0500); // GL_INVALID_ENUM
            return;
          case "object":
            if (result === null) {
              // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
              // can mean an invalid name_, which we need to report as an error
              switch(name_) {
                case 0x8894: // ARRAY_BUFFER_BINDING
                case 0x8B8D: // CURRENT_PROGRAM
                case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                case 0x8CA6: // FRAMEBUFFER_BINDING
                case 0x8CA7: // RENDERBUFFER_BINDING
                case 0x8069: // TEXTURE_BINDING_2D
                case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x0500); // GL_INVALID_ENUM
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 'Integer': HEAP32[(((p)+(i*4))>>2)]=result[i];   break;
                  case 'Float':   HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                  case 'Boolean': HEAP8[(((p)+(i))>>0)]=result[i] ? 1 : 0;    break;
                  default: throw 'internal glGet error, bad type: ' + type;
                }
              }
              return;
            } else if (result instanceof WebGLBuffer ||
                       result instanceof WebGLProgram ||
                       result instanceof WebGLFramebuffer ||
                       result instanceof WebGLRenderbuffer ||
                       result instanceof WebGLTexture) {
              ret = result.name | 0;
            } else {
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
            }
            break;
          default:
            GL.recordError(0x0500); // GL_INVALID_ENUM
            return;
        }
      }
  
      switch (type) {
        case 'Integer64': (tempI64 = [ret>>>0,(tempDouble=ret,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((p)>>2)]=tempI64[0],HEAP32[(((p)+(4))>>2)]=tempI64[1]);    break;
        case 'Integer': HEAP32[((p)>>2)]=ret;    break;
        case 'Float':   HEAPF32[((p)>>2)]=ret;  break;
        case 'Boolean': HEAP8[((p)>>0)]=ret ? 1 : 0; break;
        default: throw 'internal glGet error, bad type: ' + type;
      }
    }function _emscripten_glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Boolean');
    }

  function _emscripten_glGetBufferParameteriv(target, value, data) {
      if (!data) {
        // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
        // if data == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((data)>>2)]=GLctx.getBufferParameter(target, value);
    }

  function _emscripten_glGetError() {
      // First return any GL error generated by the emscripten library_gl.js interop layer.
      if (GL.lastError) {
        var error = GL.lastError;
        GL.lastError = 0/*GL_NO_ERROR*/;
        return error;
      } else { // If there were none, return the GL error from the browser GL context.
        return GLctx.getError();
      }
    }

  function _emscripten_glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Float');
    }

  function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
      var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
      HEAP32[((params)>>2)]=result;
    }

  function _emscripten_glGetInfoLogARB() {
  Module['printErr']('missing function: emscripten_glGetInfoLogARB'); abort(-1);
  }

  function _emscripten_glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Integer');
    }

  function _emscripten_glGetObjectParameterivARB() {
  Module['printErr']('missing function: emscripten_glGetObjectParameterivARB'); abort(-1);
  }

  function _emscripten_glGetPointerv() {
  Module['printErr']('missing function: emscripten_glGetPointerv'); abort(-1);
  }

  function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
  
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _emscripten_glGetProgramiv(program, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
        return;
      }
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        HEAP32[((p)>>2)]=ptable.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program];
          var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
          ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i);
            ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program];
          var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
          ptable.maxUniformBlockNameLength = 0;
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
            ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
      }
    }

  function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)]=GLctx.getRenderbufferParameter(target, pname);
    }

  function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
      HEAP32[((range)>>2)]=result.rangeMin;
      HEAP32[(((range)+(4))>>2)]=result.rangeMax;
      HEAP32[((precision)>>2)]=result.precision;
    }

  function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
      var result = GLctx.getShaderSource(GL.shaders[shader]);
      if (!result) return; // If an error occurs, nothing will be written to length or source.
      if (bufSize > 0 && source) {
        var numBytesWrittenExclNull = stringToUTF8(result, source, bufSize);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _emscripten_glGetShaderiv(shader, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = (source === null || source.length == 0) ? 0 : source.length + 1;
        HEAP32[((p)>>2)]=sourceLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }

  function _emscripten_glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret;
      switch(name_) {
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
        case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
          ret = allocate(intArrayFromString(GLctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F02 /* GL_VERSION */:
          var glVersion = GLctx.getParameter(GLctx.VERSION);
          // return GLES version string corresponding to the version of the WebGL context
          {
            glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
          }
          ret = allocate(intArrayFromString(glVersion), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions();
          var gl_exts = [];
          for (var i = 0; i < exts.length; ++i) {
            gl_exts.push(exts[i]);
            gl_exts.push("GL_" + exts[i]);
          }
          ret = allocate(intArrayFromString(gl_exts.join(' ')), 'i8', ALLOC_NORMAL);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
          // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
            glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
          }
          ret = allocate(intArrayFromString(glslVersion), 'i8', ALLOC_NORMAL);
          break;
        default:
          GL.recordError(0x0500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }

  function _emscripten_glGetTexParameterfv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAPF32[((params)>>2)]=GLctx.getTexParameter(target, pname);
    }

  function _emscripten_glGetTexParameteriv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)]=GLctx.getTexParameter(target, pname);
    }

  function _emscripten_glGetUniformLocation(program, name) {
      name = Pointer_stringify(name);
  
      var arrayOffset = 0;
      // If user passed an array accessor "[index]", parse the array index off the accessor.
      if (name.indexOf(']', name.length-1) !== -1) {
        var ls = name.lastIndexOf('[');
        var arrayIndex = name.slice(ls+1, -1);
        if (arrayIndex.length > 0) {
          arrayOffset = parseInt(arrayIndex);
          if (arrayOffset < 0) {
            return -1;
          }
        }
        name = name.slice(0, ls);
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        return -1;
      }
      var utable = ptable.uniforms;
      var uniformInfo = utable[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
      if (uniformInfo && arrayOffset < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
        return uniformInfo[1]+arrayOffset;
      } else {
        return -1;
      }
    }

  
  function emscriptenWebGLGetUniform(program, location, params, type) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
      if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 'Integer': HEAP32[((params)>>2)]=data; break;
          case 'Float': HEAPF32[((params)>>2)]=data; break;
          default: throw 'internal emscriptenWebGLGetUniform() error, bad type: ' + type;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 'Integer': HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
            case 'Float': HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
            default: throw 'internal emscriptenWebGLGetUniform() error, bad type: ' + type;
          }
        }
      }
    }function _emscripten_glGetUniformfv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 'Float');
    }

  function _emscripten_glGetUniformiv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 'Integer');
    }

  function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
      if (!pointer) {
        // GLES2 specification does not specify how to behave if pointer is a null pointer. Since calling this function does not make sense
        // if pointer == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((pointer)>>2)]=GLctx.getVertexAttribOffset(index, pname);
    }

  
  function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getVertexAttrib(index, pname);
      if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
        HEAP32[((params)>>2)]=data["name"];
      } else if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 'Integer': HEAP32[((params)>>2)]=data; break;
          case 'Float': HEAPF32[((params)>>2)]=data; break;
          case 'FloatToInteger': HEAP32[((params)>>2)]=Math.fround(data); break;
          default: throw 'internal emscriptenWebGLGetVertexAttrib() error, bad type: ' + type;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 'Integer': HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
            case 'Float': HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
            case 'FloatToInteger': HEAP32[(((params)+(i*4))>>2)]=Math.fround(data[i]); break;
            default: throw 'internal emscriptenWebGLGetVertexAttrib() error, bad type: ' + type;
          }
        }
      }
    }function _emscripten_glGetVertexAttribfv(index, pname, params) {
      // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
      // otherwise the results are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 'Float');
    }

  function _emscripten_glGetVertexAttribiv(index, pname, params) {
      // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
      // otherwise the results are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 'FloatToInteger');
    }

  function _emscripten_glHint(x0, x1) { GLctx['hint'](x0, x1) }

  function _emscripten_glIsBuffer(buffer) {
      var b = GL.buffers[buffer];
      if (!b) return 0;
      return GLctx.isBuffer(b);
    }

  function _emscripten_glIsEnabled(x0) { return GLctx['isEnabled'](x0) }

  function _emscripten_glIsFramebuffer(framebuffer) {
      var fb = GL.framebuffers[framebuffer];
      if (!fb) return 0;
      return GLctx.isFramebuffer(fb);
    }

  function _emscripten_glIsProgram(program) {
      program = GL.programs[program];
      if (!program) return 0;
      return GLctx.isProgram(program);
    }

  function _emscripten_glIsRenderbuffer(renderbuffer) {
      var rb = GL.renderbuffers[renderbuffer];
      if (!rb) return 0;
      return GLctx.isRenderbuffer(rb);
    }

  function _emscripten_glIsShader(shader) {
      var s = GL.shaders[shader];
      if (!s) return 0;
      return GLctx.isShader(s);
    }

  function _emscripten_glIsTexture(texture) {
      var texture = GL.textures[texture];
      if (!texture) return 0;
      return GLctx.isTexture(texture);
    }

  function _emscripten_glIsVertexArray(array) {
  
      var vao = GL.vaos[array];
      if (!vao) return 0;
      return GLctx['isVertexArray'](vao);
    }

  function _emscripten_glLineWidth(x0) { GLctx['lineWidth'](x0) }

  function _emscripten_glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }

  function _emscripten_glLoadIdentity(){ throw 'Legacy GL function (glLoadIdentity) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.'; }

  function _emscripten_glLoadMatrixf() {
  Module['printErr']('missing function: emscripten_glLoadMatrixf'); abort(-1);
  }

  function _emscripten_glMatrixMode(){ throw 'Legacy GL function (glMatrixMode) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.'; }

  function _emscripten_glNormalPointer() {
  Module['printErr']('missing function: emscripten_glNormalPointer'); abort(-1);
  }

  function _emscripten_glPixelStorei(pname, param) {
      if (pname == 0x0D05 /* GL_PACK_ALIGNMENT */) {
        GL.packAlignment = param;
      } else if (pname == 0x0cf5 /* GL_UNPACK_ALIGNMENT */) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }

  function _emscripten_glPolygonOffset(x0, x1) { GLctx['polygonOffset'](x0, x1) }

  
  
  function emscriptenWebGLComputeImageSize(width, height, sizePerPixel, alignment) {
      function roundedToNextMultipleOf(x, y) {
        return Math.floor((x + y - 1) / y) * y
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return (height <= 0) ? 0 :
               ((height - 1) * alignedRowSize + plainRowSize);
    }function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
      var sizePerPixel;
      var numChannels;
      switch(format) {
        case 0x1906 /* GL_ALPHA */:
        case 0x1909 /* GL_LUMINANCE */:
        case 0x1902 /* GL_DEPTH_COMPONENT */:
          numChannels = 1;
          break;
        case 0x190A /* GL_LUMINANCE_ALPHA */:
          numChannels = 2;
          break;
        case 0x1907 /* GL_RGB */:
        case 0x8C40 /* GL_SRGB_EXT */:
          numChannels = 3;
          break;
        case 0x1908 /* GL_RGBA */:
        case 0x8C42 /* GL_SRGB_ALPHA_EXT */:
          numChannels = 4;
          break;
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
      switch (type) {
        case 0x1401 /* GL_UNSIGNED_BYTE */:
          sizePerPixel = numChannels*1;
          break;
        case 0x1403 /* GL_UNSIGNED_SHORT */:
        case 0x8D61 /* GL_HALF_FLOAT_OES */:
          sizePerPixel = numChannels*2;
          break;
        case 0x1405 /* GL_UNSIGNED_INT */:
        case 0x1406 /* GL_FLOAT */:
          sizePerPixel = numChannels*4;
          break;
        case 0x84FA /* GL_UNSIGNED_INT_24_8_WEBGL/GL_UNSIGNED_INT_24_8 */:
          sizePerPixel = 4;
          break;
        case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
        case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
        case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
          sizePerPixel = 2;
          break;
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
      var bytes = emscriptenWebGLComputeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
      switch(type) {
        case 0x1401 /* GL_UNSIGNED_BYTE */:
          return HEAPU8.subarray((pixels),(pixels+bytes));
        case 0x1406 /* GL_FLOAT */:
          return HEAPF32.subarray((pixels)>>2,(pixels+bytes)>>2);
        case 0x1405 /* GL_UNSIGNED_INT */:
        case 0x84FA /* GL_UNSIGNED_INT_24_8_WEBGL/GL_UNSIGNED_INT_24_8 */:
          return HEAPU32.subarray((pixels)>>2,(pixels+bytes)>>2);
        case 0x1403 /* GL_UNSIGNED_SHORT */:
        case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
        case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
        case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
        case 0x8D61 /* GL_HALF_FLOAT_OES */:
          return HEAPU16.subarray((pixels)>>1,(pixels+bytes)>>1);
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
    }function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x0500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }

  function _emscripten_glReleaseShaderCompiler() {
      // NOP (as allowed by GLES 2.0 spec)
    }

  function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3) }

  function _emscripten_glRotatef() {
  Module['printErr']('missing function: emscripten_glRotatef'); abort(-1);
  }

  function _emscripten_glSampleCoverage(value, invert) {
      GLctx.sampleCoverage(value, !!invert);
    }

  function _emscripten_glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3) }

  function _emscripten_glShaderBinary() {
      GL.recordError(0x0500/*GL_INVALID_ENUM*/);
    }

  function _emscripten_glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
  
  
      GLctx.shaderSource(GL.shaders[shader], source);
    }

  function _emscripten_glStencilFunc(x0, x1, x2) { GLctx['stencilFunc'](x0, x1, x2) }

  function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) { GLctx['stencilFuncSeparate'](x0, x1, x2, x3) }

  function _emscripten_glStencilMask(x0) { GLctx['stencilMask'](x0) }

  function _emscripten_glStencilMaskSeparate(x0, x1) { GLctx['stencilMaskSeparate'](x0, x1) }

  function _emscripten_glStencilOp(x0, x1, x2) { GLctx['stencilOp'](x0, x1, x2) }

  function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) { GLctx['stencilOpSeparate'](x0, x1, x2, x3) }

  function _emscripten_glTexCoordPointer() {
  Module['printErr']('missing function: emscripten_glTexCoordPointer'); abort(-1);
  }

  function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
  
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    }

  function _emscripten_glTexParameterf(x0, x1, x2) { GLctx['texParameterf'](x0, x1, x2) }

  function _emscripten_glTexParameterfv(target, pname, params) {
      var param = HEAPF32[((params)>>2)];
      GLctx.texParameterf(target, pname, param);
    }

  function _emscripten_glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }

  function _emscripten_glTexParameteriv(target, pname, params) {
      var param = HEAP32[((params)>>2)];
      GLctx.texParameteri(target, pname, param);
    }

  function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    }

  function _emscripten_glUniform1f(location, v0) {
      GLctx.uniform1f(GL.uniforms[location], v0);
    }

  function _emscripten_glUniform1fv(location, count, value) {
  
  
      var view;
      if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[count-1];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*4)>>2);
      }
      GLctx.uniform1fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform1i(location, v0) {
      GLctx.uniform1i(GL.uniforms[location], v0);
    }

  function _emscripten_glUniform1iv(location, count, value) {
  
  
      GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray((value)>>2,(value+count*4)>>2));
    }

  function _emscripten_glUniform2f(location, v0, v1) {
      GLctx.uniform2f(GL.uniforms[location], v0, v1);
    }

  function _emscripten_glUniform2fv(location, count, value) {
  
  
      var view;
      if (2*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[2*count-1];
        for (var i = 0; i < 2*count; i += 2) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*8)>>2);
      }
      GLctx.uniform2fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform2i(location, v0, v1) {
      GLctx.uniform2i(GL.uniforms[location], v0, v1);
    }

  function _emscripten_glUniform2iv(location, count, value) {
  
  
      GLctx.uniform2iv(GL.uniforms[location], HEAP32.subarray((value)>>2,(value+count*8)>>2));
    }

  function _emscripten_glUniform3f(location, v0, v1, v2) {
      GLctx.uniform3f(GL.uniforms[location], v0, v1, v2);
    }

  function _emscripten_glUniform3fv(location, count, value) {
  
  
      var view;
      if (3*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[3*count-1];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*12)>>2);
      }
      GLctx.uniform3fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform3i(location, v0, v1, v2) {
      GLctx.uniform3i(GL.uniforms[location], v0, v1, v2);
    }

  function _emscripten_glUniform3iv(location, count, value) {
  
  
      GLctx.uniform3iv(GL.uniforms[location], HEAP32.subarray((value)>>2,(value+count*12)>>2));
    }

  function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
      GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
    }

  function _emscripten_glUniform4fv(location, count, value) {
  
  
      var view;
      if (4*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[4*count-1];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniform4fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
      GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3);
    }

  function _emscripten_glUniform4iv(location, count, value) {
  
  
      GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray((value)>>2,(value+count*16)>>2));
    }

  function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  
  
      var view;
      if (4*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[4*count-1];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  
  
      var view;
      if (9*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[9*count-1];
        for (var i = 0; i < 9*count; i += 9) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*36)>>2);
      }
      GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  
  
      var view;
      if (16*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[16*count-1];
        for (var i = 0; i < 16*count; i += 16) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
          view[i+9] = HEAPF32[(((value)+(4*i+36))>>2)];
          view[i+10] = HEAPF32[(((value)+(4*i+40))>>2)];
          view[i+11] = HEAPF32[(((value)+(4*i+44))>>2)];
          view[i+12] = HEAPF32[(((value)+(4*i+48))>>2)];
          view[i+13] = HEAPF32[(((value)+(4*i+52))>>2)];
          view[i+14] = HEAPF32[(((value)+(4*i+56))>>2)];
          view[i+15] = HEAPF32[(((value)+(4*i+60))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
      }
      GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }

  function _emscripten_glValidateProgram(program) {
      GLctx.validateProgram(GL.programs[program]);
    }

  function _emscripten_glVertexAttrib1f(x0, x1) { GLctx['vertexAttrib1f'](x0, x1) }

  function _emscripten_glVertexAttrib1fv(index, v) {
  
      GLctx.vertexAttrib1f(index, HEAPF32[v>>2]);
    }

  function _emscripten_glVertexAttrib2f(x0, x1, x2) { GLctx['vertexAttrib2f'](x0, x1, x2) }

  function _emscripten_glVertexAttrib2fv(index, v) {
  
      GLctx.vertexAttrib2f(index, HEAPF32[v>>2], HEAPF32[v+4>>2]);
    }

  function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) { GLctx['vertexAttrib3f'](x0, x1, x2, x3) }

  function _emscripten_glVertexAttrib3fv(index, v) {
  
      GLctx.vertexAttrib3f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2]);
    }

  function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) { GLctx['vertexAttrib4f'](x0, x1, x2, x3, x4) }

  function _emscripten_glVertexAttrib4fv(index, v) {
  
      GLctx.vertexAttrib4f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2], HEAPF32[v+12>>2]);
    }

  function _emscripten_glVertexAttribDivisor(index, divisor) {
      GLctx['vertexAttribDivisor'](index, divisor);
    }

  function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }

  function _emscripten_glVertexPointer(){ throw 'Legacy GL function (glVertexPointer) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.'; }

  function _emscripten_glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }

  function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
      if (!target) target = '#canvas';
      target = JSEvents.findEventTarget(target);
      if (!target) return -4;
      if (!target.requestPointerLock && !target.mozRequestPointerLock && !target.webkitRequestPointerLock && !target.msRequestPointerLock) {
        return -1;
      }
  
      var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  
      // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
      if (!canPerformRequests) {
        if (deferUntilInEventHandler) {
          JSEvents.deferCall(JSEvents.requestPointerLock, 2 /* priority below fullscreen */, [target]);
          return 1;
        } else {
          return -2;
        }
      }
  
      return JSEvents.requestPointerLock(target);
    }

  function _emscripten_set_click_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 4, "click");
      return 0;
    }

  function _emscripten_set_fullscreenchange_callback(target, userData, useCapture, callbackfunc) {
      if (typeof JSEvents.fullscreenEnabled() === 'undefined') return -1;
      if (!target) target = document;
      else {
        target = JSEvents.findEventTarget(target);
        if (!target) return -4;
      }
      JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange");
      JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "mozfullscreenchange");
      JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange");
      JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "msfullscreenchange");
      return 0;
    }

  function _emscripten_set_gamepadconnected_callback(userData, useCapture, callbackfunc) {
      if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
      JSEvents.registerGamepadEventCallback(window, userData, useCapture, callbackfunc, 26, "gamepadconnected");
      return 0;
    }

  function _emscripten_set_gamepaddisconnected_callback(userData, useCapture, callbackfunc) {
      if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
      JSEvents.registerGamepadEventCallback(window, userData, useCapture, callbackfunc, 27, "gamepaddisconnected");
      return 0;
   }

  function _emscripten_set_keypress_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress");
      return 0;
    }


  function _emscripten_set_touchcancel_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel");
      return 0;
    }

  function _emscripten_set_touchend_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend");
      return 0;
    }

  function _emscripten_set_touchmove_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove");
      return 0;
    }

  function _emscripten_set_touchstart_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart");
      return 0;
    }

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  function _glActiveTexture(x0) { GLctx['activeTexture'](x0) }

  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _glBindAttribLocation(program, index, name) {
      name = Pointer_stringify(name);
      GLctx.bindAttribLocation(GL.programs[program], index, name);
    }

  function _glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
  
      GLctx.bindBuffer(target, bufferObj);
    }

  function _glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null);
    }

  function _glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null);
    }

  function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
    }

  function _glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }

  function _glBufferData(target, size, data, usage) {
      if (!data) {
        GLctx.bufferData(target, size, usage);
      } else {
        GLctx.bufferData(target, HEAPU8.subarray(data, data+size), usage);
      }
    }

  function _glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  function _glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }

  function _glClear(x0) { GLctx['clear'](x0) }

  function _glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }

  function _glClearDepthf(x0) { GLctx['clearDepth'](x0) }

  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }

  function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
      GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
    }

  function _glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  function _glCullFace(x0) { GLctx['cullFace'](x0) }

  function _glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
      }
    }

  function _glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }

  function _glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
      GL.programInfos[id] = null;
    }

  function _glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }

  function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }

  function _glDepthFunc(x0) { GLctx['depthFunc'](x0) }

  function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _glDisable(x0) { GLctx['disable'](x0) }

  function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }

  function _glDrawArrays(mode, first, count) {
  
      GLctx.drawArrays(mode, first, count);
  
    }

  function _glDrawElements(mode, count, type, indices) {
  
      GLctx.drawElements(mode, count, type, indices);
  
    }

  function _glEnable(x0) { GLctx['enable'](x0) }

  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }

  function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    }

  function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    }

  function _glFrontFace(x0) { GLctx['frontFace'](x0) }

  function _glGenBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx.createBuffer();
        if (!buffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((buffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.buffers);
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[(((buffers)+(i*4))>>2)]=id;
      }
    }

  function _glGenFramebuffers(n, ids) {
      for (var i = 0; i < n; ++i) {
        var framebuffer = GLctx.createFramebuffer();
        if (!framebuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((ids)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.framebuffers);
        framebuffer.name = id;
        GL.framebuffers[id] = framebuffer;
        HEAP32[(((ids)+(i*4))>>2)]=id;
      }
    }

  function _glGenRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var renderbuffer = GLctx.createRenderbuffer();
        if (!renderbuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((renderbuffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.renderbuffers);
        renderbuffer.name = id;
        GL.renderbuffers[id] = renderbuffer;
        HEAP32[(((renderbuffers)+(i*4))>>2)]=id;
      }
    }

  function _glGenTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var texture = GLctx.createTexture();
        if (!texture) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */); // GLES + EGL specs don't specify what should happen here, so best to issue an error and create IDs with 0.
          while(i < n) HEAP32[(((textures)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.textures);
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[(((textures)+(i*4))>>2)]=id;
      }
    }

  function _glGetAttribLocation(program, name) {
      program = GL.programs[program];
      name = Pointer_stringify(name);
      return GLctx.getAttribLocation(program, name);
    }

  function _glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Float');
    }

  function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
  
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _glGetProgramiv(program, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
        return;
      }
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        HEAP32[((p)>>2)]=ptable.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program];
          var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
          ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i);
            ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program];
          var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
          ptable.maxUniformBlockNameLength = 0;
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
            ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
      }
    }

  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _glGetShaderiv(shader, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = (source === null || source.length == 0) ? 0 : source.length + 1;
        HEAP32[((p)>>2)]=sourceLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }

  function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret;
      switch(name_) {
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
        case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
          ret = allocate(intArrayFromString(GLctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F02 /* GL_VERSION */:
          var glVersion = GLctx.getParameter(GLctx.VERSION);
          // return GLES version string corresponding to the version of the WebGL context
          {
            glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
          }
          ret = allocate(intArrayFromString(glVersion), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions();
          var gl_exts = [];
          for (var i = 0; i < exts.length; ++i) {
            gl_exts.push(exts[i]);
            gl_exts.push("GL_" + exts[i]);
          }
          ret = allocate(intArrayFromString(gl_exts.join(' ')), 'i8', ALLOC_NORMAL);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
          // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
            glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
          }
          ret = allocate(intArrayFromString(glslVersion), 'i8', ALLOC_NORMAL);
          break;
        default:
          GL.recordError(0x0500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }

  function _glGetUniformLocation(program, name) {
      name = Pointer_stringify(name);
  
      var arrayOffset = 0;
      // If user passed an array accessor "[index]", parse the array index off the accessor.
      if (name.indexOf(']', name.length-1) !== -1) {
        var ls = name.lastIndexOf('[');
        var arrayIndex = name.slice(ls+1, -1);
        if (arrayIndex.length > 0) {
          arrayOffset = parseInt(arrayIndex);
          if (arrayOffset < 0) {
            return -1;
          }
        }
        name = name.slice(0, ls);
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        return -1;
      }
      var utable = ptable.uniforms;
      var uniformInfo = utable[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
      if (uniformInfo && arrayOffset < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
        return uniformInfo[1]+arrayOffset;
      } else {
        return -1;
      }
    }

  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }

  function _glPixelStorei(pname, param) {
      if (pname == 0x0D05 /* GL_PACK_ALIGNMENT */) {
        GL.packAlignment = param;
      } else if (pname == 0x0cf5 /* GL_UNPACK_ALIGNMENT */) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }

  function _glReadPixels(x, y, width, height, format, type, pixels) {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x0500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }

  function _glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3) }

  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
  
  
      GLctx.shaderSource(GL.shaders[shader], source);
    }

  function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
  
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    }

  function _glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }

  function _glUniform1i(location, v0) {
      GLctx.uniform1i(GL.uniforms[location], v0);
    }

  function _glUniform4f(location, v0, v1, v2, v3) {
      GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
    }

  function _glUniformMatrix4fv(location, count, transpose, value) {
  
  
      var view;
      if (16*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[16*count-1];
        for (var i = 0; i < 16*count; i += 16) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
          view[i+9] = HEAPF32[(((value)+(4*i+36))>>2)];
          view[i+10] = HEAPF32[(((value)+(4*i+40))>>2)];
          view[i+11] = HEAPF32[(((value)+(4*i+44))>>2)];
          view[i+12] = HEAPF32[(((value)+(4*i+48))>>2)];
          view[i+13] = HEAPF32[(((value)+(4*i+52))>>2)];
          view[i+14] = HEAPF32[(((value)+(4*i+56))>>2)];
          view[i+15] = HEAPF32[(((value)+(4*i+60))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
      }
      GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
    }

  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }

  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }

  function _glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }

  
  var GLFW={Window:function (id, width, height, title, monitor, share) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.fullscreen = false; // Used to determine if app in fullscreen mode
        this.storedX = 0; // Used to store X before fullscreen
        this.storedY = 0; // Used to store Y before fullscreen
        this.width = width;
        this.height = height;
        this.storedWidth = width; // Used to store width before fullscreen
        this.storedHeight = height; // Used to store height before fullscreen
        this.title = title;
        this.monitor = monitor;
        this.share = share;
        this.attributes = GLFW.hints;
        this.inputModes = {
          0x00033001:0x00034001, // GLFW_CURSOR (GLFW_CURSOR_NORMAL)
          0x00033002:0, // GLFW_STICKY_KEYS
          0x00033003:0, // GLFW_STICKY_MOUSE_BUTTONS
        };
        this.buttons = 0;
        this.keys = new Array();
        this.domKeys = new Array();
        this.shouldClose = 0;
        this.title = null;
        this.windowPosFunc = null; // GLFWwindowposfun
        this.windowSizeFunc = null; // GLFWwindowsizefun
        this.windowCloseFunc = null; // GLFWwindowclosefun
        this.windowRefreshFunc = null; // GLFWwindowrefreshfun
        this.windowFocusFunc = null; // GLFWwindowfocusfun
        this.windowIconifyFunc = null; // GLFWwindowiconifyfun
        this.framebufferSizeFunc = null; // GLFWframebuffersizefun
        this.mouseButtonFunc = null; // GLFWmousebuttonfun
        this.cursorPosFunc = null; // GLFWcursorposfun
        this.cursorEnterFunc = null; // GLFWcursorenterfun
        this.scrollFunc = null; // GLFWscrollfun
        this.dropFunc = null; // GLFWdropfun
        this.keyFunc = null; // GLFWkeyfun
        this.charFunc = null; // GLFWcharfun
        this.userptr = null;
      },WindowFromId:function (id) {
        if (id <= 0 || !GLFW.windows) return null;
        return GLFW.windows[id - 1];
      },joystickFunc:null,errorFunc:null,monitorFunc:null,active:null,windows:null,monitors:null,monitorString:null,versionString:null,initialTime:null,extensions:null,hints:null,defaultHints:{131073:0,131074:0,131075:1,131076:1,131077:1,135169:8,135170:8,135171:8,135172:8,135173:24,135174:8,135175:0,135176:0,135177:0,135178:0,135179:0,135180:0,135181:0,135182:0,135183:0,139265:196609,139266:1,139267:0,139268:0,139269:0,139270:0,139271:0,139272:0},DOMToGLFWKeyCode:function (keycode) {
        switch (keycode) {
          // these keycodes are only defined for GLFW3, assume they are the same for GLFW2
          case 0x20:return 32; // DOM_VK_SPACE -> GLFW_KEY_SPACE
          case 0xDE:return 39; // DOM_VK_QUOTE -> GLFW_KEY_APOSTROPHE
          case 0xBC:return 44; // DOM_VK_COMMA -> GLFW_KEY_COMMA
          case 0xAD:return 45; // DOM_VK_HYPHEN_MINUS -> GLFW_KEY_MINUS
          case 0xBD:return 45; // DOM_VK_MINUS -> GLFW_KEY_MINUS
          case 0xBE:return 46; // DOM_VK_PERIOD -> GLFW_KEY_PERIOD
          case 0xBF:return 47; // DOM_VK_SLASH -> GLFW_KEY_SLASH
          case 0x30:return 48; // DOM_VK_0 -> GLFW_KEY_0
          case 0x31:return 49; // DOM_VK_1 -> GLFW_KEY_1
          case 0x32:return 50; // DOM_VK_2 -> GLFW_KEY_2
          case 0x33:return 51; // DOM_VK_3 -> GLFW_KEY_3
          case 0x34:return 52; // DOM_VK_4 -> GLFW_KEY_4
          case 0x35:return 53; // DOM_VK_5 -> GLFW_KEY_5
          case 0x36:return 54; // DOM_VK_6 -> GLFW_KEY_6
          case 0x37:return 55; // DOM_VK_7 -> GLFW_KEY_7
          case 0x38:return 56; // DOM_VK_8 -> GLFW_KEY_8
          case 0x39:return 57; // DOM_VK_9 -> GLFW_KEY_9
          case 0x3B:return 59; // DOM_VK_SEMICOLON -> GLFW_KEY_SEMICOLON
          case 0x3D:return 61; // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
          case 0xBB:return 61; // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
          case 0x41:return 65; // DOM_VK_A -> GLFW_KEY_A
          case 0x42:return 66; // DOM_VK_B -> GLFW_KEY_B
          case 0x43:return 67; // DOM_VK_C -> GLFW_KEY_C
          case 0x44:return 68; // DOM_VK_D -> GLFW_KEY_D
          case 0x45:return 69; // DOM_VK_E -> GLFW_KEY_E
          case 0x46:return 70; // DOM_VK_F -> GLFW_KEY_F
          case 0x47:return 71; // DOM_VK_G -> GLFW_KEY_G
          case 0x48:return 72; // DOM_VK_H -> GLFW_KEY_H
          case 0x49:return 73; // DOM_VK_I -> GLFW_KEY_I
          case 0x4A:return 74; // DOM_VK_J -> GLFW_KEY_J
          case 0x4B:return 75; // DOM_VK_K -> GLFW_KEY_K
          case 0x4C:return 76; // DOM_VK_L -> GLFW_KEY_L
          case 0x4D:return 77; // DOM_VK_M -> GLFW_KEY_M
          case 0x4E:return 78; // DOM_VK_N -> GLFW_KEY_N
          case 0x4F:return 79; // DOM_VK_O -> GLFW_KEY_O
          case 0x50:return 80; // DOM_VK_P -> GLFW_KEY_P
          case 0x51:return 81; // DOM_VK_Q -> GLFW_KEY_Q
          case 0x52:return 82; // DOM_VK_R -> GLFW_KEY_R
          case 0x53:return 83; // DOM_VK_S -> GLFW_KEY_S
          case 0x54:return 84; // DOM_VK_T -> GLFW_KEY_T
          case 0x55:return 85; // DOM_VK_U -> GLFW_KEY_U
          case 0x56:return 86; // DOM_VK_V -> GLFW_KEY_V
          case 0x57:return 87; // DOM_VK_W -> GLFW_KEY_W
          case 0x58:return 88; // DOM_VK_X -> GLFW_KEY_X
          case 0x59:return 89; // DOM_VK_Y -> GLFW_KEY_Y
          case 0x5a:return 90; // DOM_VK_Z -> GLFW_KEY_Z
          case 0xDB:return 91; // DOM_VK_OPEN_BRACKET -> GLFW_KEY_LEFT_BRACKET
          case 0xDC:return 92; // DOM_VK_BACKSLASH -> GLFW_KEY_BACKSLASH
          case 0xDD:return 93; // DOM_VK_CLOSE_BRACKET -> GLFW_KEY_RIGHT_BRACKET
          case 0xC0:return 94; // DOM_VK_BACK_QUOTE -> GLFW_KEY_GRAVE_ACCENT
          
  
          case 0x1B:return 256; // DOM_VK_ESCAPE -> GLFW_KEY_ESCAPE
          case 0x0D:return 257; // DOM_VK_RETURN -> GLFW_KEY_ENTER
          case 0x09:return 258; // DOM_VK_TAB -> GLFW_KEY_TAB
          case 0x08:return 259; // DOM_VK_BACK -> GLFW_KEY_BACKSPACE
          case 0x2D:return 260; // DOM_VK_INSERT -> GLFW_KEY_INSERT
          case 0x2E:return 261; // DOM_VK_DELETE -> GLFW_KEY_DELETE
          case 0x27:return 262; // DOM_VK_RIGHT -> GLFW_KEY_RIGHT
          case 0x25:return 263; // DOM_VK_LEFT -> GLFW_KEY_LEFT
          case 0x28:return 264; // DOM_VK_DOWN -> GLFW_KEY_DOWN
          case 0x26:return 265; // DOM_VK_UP -> GLFW_KEY_UP
          case 0x21:return 266; // DOM_VK_PAGE_UP -> GLFW_KEY_PAGE_UP
          case 0x22:return 267; // DOM_VK_PAGE_DOWN -> GLFW_KEY_PAGE_DOWN
          case 0x24:return 268; // DOM_VK_HOME -> GLFW_KEY_HOME
          case 0x23:return 269; // DOM_VK_END -> GLFW_KEY_END
          case 0x14:return 280; // DOM_VK_CAPS_LOCK -> GLFW_KEY_CAPS_LOCK
          case 0x91:return 281; // DOM_VK_SCROLL_LOCK -> GLFW_KEY_SCROLL_LOCK
          case 0x90:return 282; // DOM_VK_NUM_LOCK -> GLFW_KEY_NUM_LOCK
          case 0x2C:return 283; // DOM_VK_SNAPSHOT -> GLFW_KEY_PRINT_SCREEN
          case 0x13:return 284; // DOM_VK_PAUSE -> GLFW_KEY_PAUSE
          case 0x70:return 290; // DOM_VK_F1 -> GLFW_KEY_F1
          case 0x71:return 291; // DOM_VK_F2 -> GLFW_KEY_F2
          case 0x72:return 292; // DOM_VK_F3 -> GLFW_KEY_F3
          case 0x73:return 293; // DOM_VK_F4 -> GLFW_KEY_F4
          case 0x74:return 294; // DOM_VK_F5 -> GLFW_KEY_F5
          case 0x75:return 295; // DOM_VK_F6 -> GLFW_KEY_F6
          case 0x76:return 296; // DOM_VK_F7 -> GLFW_KEY_F7
          case 0x77:return 297; // DOM_VK_F8 -> GLFW_KEY_F8
          case 0x78:return 298; // DOM_VK_F9 -> GLFW_KEY_F9
          case 0x79:return 299; // DOM_VK_F10 -> GLFW_KEY_F10
          case 0x7A:return 300; // DOM_VK_F11 -> GLFW_KEY_F11
          case 0x7B:return 301; // DOM_VK_F12 -> GLFW_KEY_F12
          case 0x7C:return 302; // DOM_VK_F13 -> GLFW_KEY_F13
          case 0x7D:return 303; // DOM_VK_F14 -> GLFW_KEY_F14
          case 0x7E:return 304; // DOM_VK_F15 -> GLFW_KEY_F15
          case 0x7F:return 305; // DOM_VK_F16 -> GLFW_KEY_F16
          case 0x80:return 306; // DOM_VK_F17 -> GLFW_KEY_F17
          case 0x81:return 307; // DOM_VK_F18 -> GLFW_KEY_F18
          case 0x82:return 308; // DOM_VK_F19 -> GLFW_KEY_F19
          case 0x83:return 309; // DOM_VK_F20 -> GLFW_KEY_F20
          case 0x84:return 310; // DOM_VK_F21 -> GLFW_KEY_F21
          case 0x85:return 311; // DOM_VK_F22 -> GLFW_KEY_F22
          case 0x86:return 312; // DOM_VK_F23 -> GLFW_KEY_F23
          case 0x87:return 313; // DOM_VK_F24 -> GLFW_KEY_F24
          case 0x88:return 314; // 0x88 (not used?) -> GLFW_KEY_F25
          case 0x60:return 320; // DOM_VK_NUMPAD0 -> GLFW_KEY_KP_0
          case 0x61:return 321; // DOM_VK_NUMPAD1 -> GLFW_KEY_KP_1
          case 0x62:return 322; // DOM_VK_NUMPAD2 -> GLFW_KEY_KP_2
          case 0x63:return 323; // DOM_VK_NUMPAD3 -> GLFW_KEY_KP_3
          case 0x64:return 324; // DOM_VK_NUMPAD4 -> GLFW_KEY_KP_4
          case 0x65:return 325; // DOM_VK_NUMPAD5 -> GLFW_KEY_KP_5
          case 0x66:return 326; // DOM_VK_NUMPAD6 -> GLFW_KEY_KP_6
          case 0x67:return 327; // DOM_VK_NUMPAD7 -> GLFW_KEY_KP_7
          case 0x68:return 328; // DOM_VK_NUMPAD8 -> GLFW_KEY_KP_8
          case 0x69:return 329; // DOM_VK_NUMPAD9 -> GLFW_KEY_KP_9
          case 0x6E:return 330; // DOM_VK_DECIMAL -> GLFW_KEY_KP_DECIMAL
          case 0x6F:return 331; // DOM_VK_DIVIDE -> GLFW_KEY_KP_DIVIDE
          case 0x6A:return 332; // DOM_VK_MULTIPLY -> GLFW_KEY_KP_MULTIPLY
          case 0x6D:return 333; // DOM_VK_SUBTRACT -> GLFW_KEY_KP_SUBTRACT
          case 0x6B:return 334; // DOM_VK_ADD -> GLFW_KEY_KP_ADD
          // case 0x0D:return 335; // DOM_VK_RETURN -> GLFW_KEY_KP_ENTER (DOM_KEY_LOCATION_RIGHT)
          // case 0x61:return 336; // DOM_VK_EQUALS -> GLFW_KEY_KP_EQUAL (DOM_KEY_LOCATION_RIGHT)
          case 0x10:return 340; // DOM_VK_SHIFT -> GLFW_KEY_LEFT_SHIFT
          case 0x11:return 341; // DOM_VK_CONTROL -> GLFW_KEY_LEFT_CONTROL
          case 0x12:return 342; // DOM_VK_ALT -> GLFW_KEY_LEFT_ALT
          case 0x5B:return 343; // DOM_VK_WIN -> GLFW_KEY_LEFT_SUPER
          // case 0x10:return 344; // DOM_VK_SHIFT -> GLFW_KEY_RIGHT_SHIFT (DOM_KEY_LOCATION_RIGHT)
          // case 0x11:return 345; // DOM_VK_CONTROL -> GLFW_KEY_RIGHT_CONTROL (DOM_KEY_LOCATION_RIGHT)
          // case 0x12:return 346; // DOM_VK_ALT -> GLFW_KEY_RIGHT_ALT (DOM_KEY_LOCATION_RIGHT)
          // case 0x5B:return 347; // DOM_VK_WIN -> GLFW_KEY_RIGHT_SUPER (DOM_KEY_LOCATION_RIGHT)
          case 0x5D:return 348; // DOM_VK_CONTEXT_MENU -> GLFW_KEY_MENU
          // XXX: GLFW_KEY_WORLD_1, GLFW_KEY_WORLD_2 what are these?
          default:return -1; // GLFW_KEY_UNKNOWN
        };
      },getModBits:function (win) {
        var mod = 0;
        if (win.keys[340]) mod |= 0x0001; // GLFW_MOD_SHIFT
        if (win.keys[341]) mod |= 0x0002; // GLFW_MOD_CONTROL
        if (win.keys[342]) mod |= 0x0004; // GLFW_MOD_ALT
        if (win.keys[343]) mod |= 0x0008; // GLFW_MOD_SUPER
        return mod;
      },onKeyPress:function (event) {
        if (!GLFW.active || !GLFW.active.charFunc) return;
        if (event.ctrlKey || event.metaKey) return;
  
        // correct unicode charCode is only available with onKeyPress event
        var charCode = event.charCode;
        if (charCode == 0 || (charCode >= 0x00 && charCode <= 0x1F)) return;
  
  
        Module['dynCall_vii'](GLFW.active.charFunc, GLFW.active.id, charCode);
      },onKeyChanged:function (keyCode, status) {
        if (!GLFW.active) return;
  
        var key = GLFW.DOMToGLFWKeyCode(keyCode);
        if (key == -1) return;
  
        var repeat = status && GLFW.active.keys[key];
        GLFW.active.keys[key] = status;
        GLFW.active.domKeys[keyCode] = status;
        if (!GLFW.active.keyFunc) return;
  
  
        if (repeat) status = 2; // GLFW_REPEAT
        Module['dynCall_viiiii'](GLFW.active.keyFunc, GLFW.active.id, key, keyCode, status, GLFW.getModBits(GLFW.active));
      },onGamepadConnected:function (event) {
        GLFW.refreshJoysticks();
      },onGamepadDisconnected:function (event) {
        GLFW.refreshJoysticks();
      },onKeydown:function (event) {
        GLFW.onKeyChanged(event.keyCode, 1); // GLFW_PRESS or GLFW_REPEAT
  
        // This logic comes directly from the sdl implementation. We cannot
        // call preventDefault on all keydown events otherwise onKeyPress will
        // not get called
        if (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */) {
          event.preventDefault();
        }
      },onKeyup:function (event) {
        GLFW.onKeyChanged(event.keyCode, 0); // GLFW_RELEASE
      },onBlur:function (event) {
        if (!GLFW.active) return;
  
        for (var i = 0; i < GLFW.active.domKeys.length; ++i) {
          if (GLFW.active.domKeys[i]) {
            GLFW.onKeyChanged(i, 0); // GLFW_RELEASE
          }
        }
      },onMousemove:function (event) {
        if (!GLFW.active) return;
  
        Browser.calculateMouseEvent(event);
  
        if (event.target != Module["canvas"] || !GLFW.active.cursorPosFunc) return;
  
  
        Module['dynCall_vidd'](GLFW.active.cursorPosFunc, GLFW.active.id, Browser.mouseX, Browser.mouseY);
      },DOMToGLFWMouseButton:function (event) {
        // DOM and glfw have different button codes.
        // See http://www.w3schools.com/jsref/event_button.asp.
        var eventButton = event['button'];
        if (eventButton > 0) {
          if (eventButton == 1) {
            eventButton = 2;
          } else {
            eventButton = 1;
          }
        }
        return eventButton;
      },onMouseenter:function (event) {
        if (!GLFW.active) return;
  
        if (event.target != Module["canvas"] || !GLFW.active.cursorEnterFunc) return;
  
        Module['dynCall_vii'](GLFW.active.cursorEnterFunc, GLFW.active.id, 1);
      },onMouseleave:function (event) {
        if (!GLFW.active) return;
  
        if (event.target != Module["canvas"] || !GLFW.active.cursorEnterFunc) return;
  
        Module['dynCall_vii'](GLFW.active.cursorEnterFunc, GLFW.active.id, 0);
      },onMouseButtonChanged:function (event, status) {
        if (!GLFW.active) return;
  
        Browser.calculateMouseEvent(event);
  
        if (event.target != Module["canvas"]) return;
  
        eventButton = GLFW.DOMToGLFWMouseButton(event);
  
        if (status == 1) { // GLFW_PRESS
          GLFW.active.buttons |= (1 << eventButton);
          try {
            event.target.setCapture();
          } catch (e) {}
        } else {  // GLFW_RELEASE
          GLFW.active.buttons &= ~(1 << eventButton);
        }
  
        if (!GLFW.active.mouseButtonFunc) return;
  
  
        Module['dynCall_viiii'](GLFW.active.mouseButtonFunc, GLFW.active.id, eventButton, status, GLFW.getModBits(GLFW.active));
      },onMouseButtonDown:function (event) {
        if (!GLFW.active) return;
        GLFW.onMouseButtonChanged(event, 1); // GLFW_PRESS
      },onMouseButtonUp:function (event) {
        if (!GLFW.active) return;
        GLFW.onMouseButtonChanged(event, 0); // GLFW_RELEASE
      },onMouseWheel:function (event) {
        // Note the minus sign that flips browser wheel direction (positive direction scrolls page down) to native wheel direction (positive direction is mouse wheel up)
        var delta = -Browser.getMouseWheelDelta(event);
        delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1)); // Quantize to integer so that minimum scroll is at least +/- 1.
        GLFW.wheelPos += delta;
  
        if (!GLFW.active || !GLFW.active.scrollFunc || event.target != Module['canvas']) return;
  
  
        var sx = 0;
        var sy = 0;
        if (event.type == 'mousewheel') {
          sx = event.wheelDeltaX;
          sy = event.wheelDeltaY;
        } else {
          sx = event.deltaX;
          sy = event.deltaY;
        }
  
        Module['dynCall_vidd'](GLFW.active.scrollFunc, GLFW.active.id, sx, sy);
  
        event.preventDefault();
      },onCanvasResize:function (width, height) {
        if (!GLFW.active) return;
  
        var resizeNeeded = true;
  
        // If the client is requestiong fullscreen mode
        if (document["fullscreen"] || document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
          GLFW.active.storedX = GLFW.active.x;
          GLFW.active.storedY = GLFW.active.y;
          GLFW.active.storedWidth = GLFW.active.width;
          GLFW.active.storedHeight = GLFW.active.height;
          GLFW.active.x = GLFW.active.y = 0;
          GLFW.active.width = screen.width;
          GLFW.active.height = screen.height;
          GLFW.active.fullscreen = true;
  
        // If the client is reverting from fullscreen mode
        } else if (GLFW.active.fullscreen == true) {
          GLFW.active.x = GLFW.active.storedX;
          GLFW.active.y = GLFW.active.storedY;
          GLFW.active.width = GLFW.active.storedWidth;
          GLFW.active.height = GLFW.active.storedHeight;
          GLFW.active.fullscreen = false;
  
        // If the width/height values do not match current active window sizes
        } else if (GLFW.active.width != width || GLFW.active.height != height) {
            GLFW.active.width = width;
            GLFW.active.height = height;
        } else {
          resizeNeeded = false;
        }
  
        // If any of the above conditions were true, we need to resize the canvas
        if (resizeNeeded) {
          // resets the canvas size to counter the aspect preservation of Browser.updateCanvasDimensions
          Browser.setCanvasSize(GLFW.active.width, GLFW.active.height, true);
          // TODO: Client dimensions (clientWidth/clientHeight) vs pixel dimensions (width/height) of
          // the canvas should drive window and framebuffer size respectfully.
          GLFW.onWindowSizeChanged();
          GLFW.onFramebufferSizeChanged();
        }
      },onWindowSizeChanged:function () {
        if (!GLFW.active) return;
  
        if (!GLFW.active.windowSizeFunc) return;
  
  
        Module['dynCall_viii'](GLFW.active.windowSizeFunc, GLFW.active.id, GLFW.active.width, GLFW.active.height);
      },onFramebufferSizeChanged:function () {
        if (!GLFW.active) return;
  
        if (!GLFW.active.framebufferSizeFunc) return;
  
        Module['dynCall_viii'](GLFW.active.framebufferSizeFunc, GLFW.active.id, GLFW.active.width, GLFW.active.height);
      },requestFullscreen:function () {
        var RFS = Module["canvas"]['requestFullscreen'] ||
                  Module["canvas"]['mozRequestFullScreen'] ||
                  Module["canvas"]['webkitRequestFullScreen'] ||
                  (function() {});
        RFS.apply(Module["canvas"], []);
      },requestFullScreen:function () {
        Module.printErr('GLFW.requestFullScreen() is deprecated. Please call GLFW.requestFullscreen instead.');
        GLFW.requestFullScreen = function() {
          return GLFW.requestFullscreen();
        }
        return GLFW.requestFullscreen();
      },exitFullscreen:function () {
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['webkitCancelFullScreen'] ||
            (function() {});
        CFS.apply(document, []);
      },cancelFullScreen:function () {
        Module.printErr('GLFW.cancelFullScreen() is deprecated. Please call GLFW.exitFullscreen instead.');
        GLFW.cancelFullScreen = function() {
          return GLFW.exitFullscreen();
        }
        return GLFW.exitFullscreen();
      },getTime:function () {
        return _emscripten_get_now() / 1000;
      },setWindowTitle:function (winid, title) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        win.title = Pointer_stringify(title);
        if (GLFW.active.id == win.id) {
          document.title = win.title;
        }
      },setJoystickCallback:function (cbfun) {
        GLFW.joystickFunc = cbfun;
        GLFW.refreshJoysticks();
      },joys:{},lastGamepadState:null,lastGamepadStateFrame:null,refreshJoysticks:function () {
        // Produce a new Gamepad API sample if we are ticking a new game frame, or if not using emscripten_set_main_loop() at all to drive animation.
        if (Browser.mainLoop.currentFrameNumber !== GLFW.lastGamepadStateFrame || !Browser.mainLoop.currentFrameNumber) {
          GLFW.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : null);
          GLFW.lastGamepadStateFrame = Browser.mainLoop.currentFrameNumber;
  
          for (var joy = 0; joy < GLFW.lastGamepadState.length; ++joy) {
            var gamepad = GLFW.lastGamepadState[joy];
  
            if (gamepad) {
              if (!GLFW.joys[joy]) {
                console.log('glfw joystick connected:',joy);
                GLFW.joys[joy] = {
                  id: allocate(intArrayFromString(gamepad.id), 'i8', ALLOC_NORMAL),
                  buttonsCount: gamepad.buttons.length,
                  axesCount: gamepad.axes.length,
                  buttons: allocate(new Array(gamepad.buttons.length), 'i8', ALLOC_NORMAL),
                  axes: allocate(new Array(gamepad.axes.length*4), 'float', ALLOC_NORMAL)
                };
  
                if (GLFW.joystickFunc) {
                  Module['dynCall_vii'](GLFW.joystickFunc, joy, 0x00040001); // GLFW_CONNECTED
                }
              }
  
              var data = GLFW.joys[joy];
  
              for (var i = 0; i < gamepad.buttons.length;  ++i) {
                setValue(data.buttons + i, gamepad.buttons[i].pressed, 'i8');
              }
  
              for (var i = 0; i < gamepad.axes.length; ++i) {
                setValue(data.axes + i*4, gamepad.axes[i], 'float');
              }
            } else {
              if (GLFW.joys[joy]) {
                console.log('glfw joystick disconnected',joy);
  
                if (GLFW.joystickFunc) {
                  Module['dynCall_vii'](GLFW.joystickFunc, joy, 0x00040002); // GLFW_DISCONNECTED
                }
  
                _free(GLFW.joys[joy].id);
                _free(GLFW.joys[joy].buttons);
                _free(GLFW.joys[joy].axes);
  
                delete GLFW.joys[joy];
              }
            }
          }
        }
      },setKeyCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.keyFunc = cbfun;
      },setCharCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.charFunc = cbfun;
      },setMouseButtonCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.mouseButtonFunc = cbfun;
      },setCursorPosCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.cursorPosFunc = cbfun;
      },setScrollCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.scrollFunc = cbfun;
      },setDropCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.dropFunc = cbfun;
      },onDrop:function (event) {
        if (!GLFW.active || !GLFW.active.dropFunc) return;
        if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length == 0) return;
  
        event.preventDefault();
  
        var filenames = allocate(new Array(event.dataTransfer.files.length*4), 'i8*', ALLOC_NORMAL);
        var filenamesArray = [];
        var count = event.dataTransfer.files.length;
  
        // Read and save the files to emscripten's FS
        var written = 0;
        var drop_dir = '.glfw_dropped_files';
        FS.createPath('/', drop_dir);
  
        function save(file) {
          var path = '/' + drop_dir + '/' + file.name.replace(/\//g, '_');
          var reader = new FileReader();
          reader.onloadend = function(e) {
            if (reader.readyState != 2) { // not DONE
              ++written;
              console.log('failed to read dropped file: '+file.name+': '+reader.error);
              return;
            }
  
            var data = e.target.result;
            FS.writeFile(path, new Uint8Array(data), { encoding: 'binary' });
            if (++written === count) {
              Module['dynCall_viii'](GLFW.active.dropFunc, GLFW.active.id, count, filenames);
  
              for (var i = 0; i < filenamesArray.length; ++i) {
                _free(filenamesArray[i]);
              }
              _free(filenames);
            }
          };
          reader.readAsArrayBuffer(file);
  
          var filename = allocate(intArrayFromString(path), 'i8', ALLOC_NORMAL);
          filenamesArray.push(filename);
          setValue(filenames + i*4, filename, 'i8*');
        }
  
        for (var i = 0; i < count; ++i) {
          save(event.dataTransfer.files[i]);
        }
  
        return false;
      },onDragover:function (event) {
        if (!GLFW.active || !GLFW.active.dropFunc) return;
  
        event.preventDefault();
        return false;
      },setWindowSizeCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowSizeFunc = cbfun;
       
      },setWindowCloseCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowCloseFunc = cbfun;
      },setWindowRefreshCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowRefreshFunc = cbfun;
      },onClickRequestPointerLock:function (e) {
        if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
          Module['canvas'].requestPointerLock();
          e.preventDefault();
        }
      },setInputMode:function (winid, mode, value) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        switch(mode) {
          case 0x00033001: { // GLFW_CURSOR
            switch(value) {
              case 0x00034001: { // GLFW_CURSOR_NORMAL
                win.inputModes[mode] = value;
                Module['canvas'].removeEventListener('click', GLFW.onClickRequestPointerLock, true);
                Module['canvas'].exitPointerLock();
                break;
              }
              case 0x00034002: { // GLFW_CURSOR_HIDDEN
                console.log("glfwSetInputMode called with GLFW_CURSOR_HIDDEN value not implemented.");
                break;
              }
              case 0x00034003: { // GLFW_CURSOR_DISABLED
                win.inputModes[mode] = value;
                Module['canvas'].addEventListener('click', GLFW.onClickRequestPointerLock, true);
                Module['canvas'].requestPointerLock();
                break;
              }
              default: {
                console.log("glfwSetInputMode called with unknown value parameter value: " + value + ".");
                break;
              }
            }
            break;
          }
          case 0x00033002: { // GLFW_STICKY_KEYS
            console.log("glfwSetInputMode called with GLFW_STICKY_KEYS mode not implemented.");
            break;
          }
          case 0x00033003: { // GLFW_STICKY_MOUSE_BUTTONS
            console.log("glfwSetInputMode called with GLFW_STICKY_MOUSE_BUTTONS mode not implemented.");
            break;
          }
          default: {
            console.log("glfwSetInputMode called with unknown mode parameter value: " + mode + ".");
            break;
          }
        }
      },getKey:function (winid, key) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return 0;
        return win.keys[key];
      },getMouseButton:function (winid, button) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return 0;
        return (win.buttons & (1 << button)) > 0;
      },getCursorPos:function (winid, x, y) {
        setValue(x, Browser.mouseX, 'double');
        setValue(y, Browser.mouseY, 'double');
      },getMousePos:function (winid, x, y) {
        setValue(x, Browser.mouseX, 'i32');
        setValue(y, Browser.mouseY, 'i32');
      },setCursorPos:function (winid, x, y) {
      },getWindowPos:function (winid, x, y) {
        var wx = 0;
        var wy = 0;
  
        var win = GLFW.WindowFromId(winid);
        if (win) {
          wx = win.x;
          wy = win.y;
        }
  
        setValue(x, wx, 'i32');
        setValue(y, wy, 'i32');
      },setWindowPos:function (winid, x, y) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.x = x;
        win.y = y;
      },getWindowSize:function (winid, width, height) {
        var ww = 0;
        var wh = 0;
  
        var win = GLFW.WindowFromId(winid);
        if (win) {
          ww = win.width;
          wh = win.height;
        }
  
        setValue(width, ww, 'i32');
        setValue(height, wh, 'i32');
      },setWindowSize:function (winid, width, height) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        if (GLFW.active.id == win.id) {
          if (width == screen.width && height == screen.height) {
            GLFW.requestFullscreen();
          } else {
            GLFW.exitFullscreen();
            Browser.setCanvasSize(width, height);
            win.width = width;
            win.height = height;
          }
        }
  
        if (!win.windowSizeFunc) return;
  
  
        Module['dynCall_viii'](win.windowSizeFunc, win.id, width, height);
      },createWindow:function (width, height, title, monitor, share) {
        var i, id;
        for (i = 0; i < GLFW.windows.length && GLFW.windows[i] !== null; i++);
        if (i > 0) throw "glfwCreateWindow only supports one window at time currently";
  
        // id for window
        id = i + 1;
  
        // not valid
        if (width <= 0 || height <= 0) return 0;
  
        if (monitor) {
          GLFW.requestFullscreen();
        } else {
          Browser.setCanvasSize(width, height);
        }
  
        // Create context when there are no existing alive windows
        for (i = 0; i < GLFW.windows.length && GLFW.windows[i] == null; i++);
        if (i == GLFW.windows.length) {
          var contextAttributes = {
            antialias: (GLFW.hints[0x0002100D] > 1), // GLFW_SAMPLES
            depth: (GLFW.hints[0x00021005] > 0),     // GLFW_DEPTH_BITS
            stencil: (GLFW.hints[0x00021006] > 0),   // GLFW_STENCIL_BITS
            alpha: (GLFW.hints[0x00021004] > 0)      // GLFW_ALPHA_BITS 
          }
          Module.ctx = Browser.createContext(Module['canvas'], true, true, contextAttributes);
        }
  
        // If context creation failed, do not return a valid window
        if (!Module.ctx) return 0;
  
        // Get non alive id
        var win = new GLFW.Window(id, width, height, title, monitor, share);
  
        // Set window to array
        if (id - 1 == GLFW.windows.length) {
          GLFW.windows.push(win);
        } else {
          GLFW.windows[id - 1] = win;
        }
  
        GLFW.active = win;
        return win.id;
      },destroyWindow:function (winid) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        if (win.windowCloseFunc)
          Module['dynCall_vi'](win.windowCloseFunc, win.id);
  
        GLFW.windows[win.id - 1] = null;
        if (GLFW.active.id == win.id)
          GLFW.active = null;
  
        // Destroy context when no alive windows
        for (var i = 0; i < GLFW.windows.length; i++)
          if (GLFW.windows[i] !== null) return;
  
        Module.ctx = Browser.destroyContext(Module['canvas'], true, true);
      },swapBuffers:function (winid) {
      },GLFW2ParamToGLFW3Param:function (param) {
        table = {
          0x00030001:0, // GLFW_MOUSE_CURSOR
          0x00030002:0, // GLFW_STICKY_KEYS
          0x00030003:0, // GLFW_STICKY_MOUSE_BUTTONS
          0x00030004:0, // GLFW_SYSTEM_KEYS
          0x00030005:0, // GLFW_KEY_REPEAT
          0x00030006:0, // GLFW_AUTO_POLL_EVENTS
          0x00020001:0, // GLFW_OPENED
          0x00020002:0, // GLFW_ACTIVE
          0x00020003:0, // GLFW_ICONIFIED
          0x00020004:0, // GLFW_ACCELERATED
          0x00020005:0x00021001, // GLFW_RED_BITS
          0x00020006:0x00021002, // GLFW_GREEN_BITS
          0x00020007:0x00021003, // GLFW_BLUE_BITS
          0x00020008:0x00021004, // GLFW_ALPHA_BITS
          0x00020009:0x00021005, // GLFW_DEPTH_BITS
          0x0002000A:0x00021006, // GLFW_STENCIL_BITS
          0x0002000B:0x0002100F, // GLFW_REFRESH_RATE
          0x0002000C:0x00021007, // GLFW_ACCUM_RED_BITS
          0x0002000D:0x00021008, // GLFW_ACCUM_GREEN_BITS
          0x0002000E:0x00021009, // GLFW_ACCUM_BLUE_BITS
          0x0002000F:0x0002100A, // GLFW_ACCUM_ALPHA_BITS
          0x00020010:0x0002100B, // GLFW_AUX_BUFFERS
          0x00020011:0x0002100C, // GLFW_STEREO
          0x00020012:0, // GLFW_WINDOW_NO_RESIZE
          0x00020013:0x0002100D, // GLFW_FSAA_SAMPLES
          0x00020014:0x00022002, // GLFW_OPENGL_VERSION_MAJOR
          0x00020015:0x00022003, // GLFW_OPENGL_VERSION_MINOR
          0x00020016:0x00022006, // GLFW_OPENGL_FORWARD_COMPAT
          0x00020017:0x00022007, // GLFW_OPENGL_DEBUG_CONTEXT
          0x00020018:0x00022008, // GLFW_OPENGL_PROFILE
        };
        return table[param];
      }};function _glfwCreateWindow(width, height, title, monitor, share) {
      return GLFW.createWindow(width, height, title, monitor, share);
    }

  function _glfwDefaultWindowHints() {
      GLFW.hints = GLFW.defaultHints;
    }

  function _glfwDestroyWindow(winid) {
      return GLFW.destroyWindow(winid);
    }

  function _glfwGetCursorPos(winid, x, y) {
      GLFW.getCursorPos(winid, x, y);
    }

  function _glfwGetPrimaryMonitor() {
      return 1;
    }

  function _glfwGetTime() {
      return GLFW.getTime() - GLFW.initialTime;
    }

  function _glfwGetVideoModes(monitor, count) {
      setValue(count, 0, 'i32');
      return 0;
    }

  function _glfwInit() {
      if (GLFW.windows) return 1; // GL_TRUE
  
      GLFW.initialTime = GLFW.getTime();
      GLFW.hints = GLFW.defaultHints;
      GLFW.windows = new Array()
      GLFW.active = null;
  
      window.addEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
      window.addEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
      window.addEventListener("keydown", GLFW.onKeydown, true);
      window.addEventListener("keypress", GLFW.onKeyPress, true);
      window.addEventListener("keyup", GLFW.onKeyup, true);
      window.addEventListener("blur", GLFW.onBlur, true);
      Module["canvas"].addEventListener("mousemove", GLFW.onMousemove, true);
      Module["canvas"].addEventListener("mousedown", GLFW.onMouseButtonDown, true);
      Module["canvas"].addEventListener("mouseup", GLFW.onMouseButtonUp, true);
      Module["canvas"].addEventListener('wheel', GLFW.onMouseWheel, true);
      Module["canvas"].addEventListener('mousewheel', GLFW.onMouseWheel, true);
      Module["canvas"].addEventListener('mouseenter', GLFW.onMouseenter, true);
      Module["canvas"].addEventListener('mouseleave', GLFW.onMouseleave, true);
      Module["canvas"].addEventListener('drop', GLFW.onDrop, true);
      Module["canvas"].addEventListener('dragover', GLFW.onDragover, true);
  
      Browser.resizeListeners.push(function(width, height) {
         GLFW.onCanvasResize(width, height);
      });
      return 1; // GL_TRUE
    }

  function _glfwMakeContextCurrent(winid) {}

  function _glfwSetCharCallback(winid, cbfun) {
      GLFW.setCharCallback(winid, cbfun);
    }

  function _glfwSetCursorEnterCallback(winid, cbfun) {
      var win = GLFW.WindowFromId(winid);
      if (!win) return;
      win.cursorEnterFunc = cbfun;
    }

  function _glfwSetCursorPosCallback(winid, cbfun) {
      GLFW.setCursorPosCallback(winid, cbfun);
    }

  function _glfwSetErrorCallback(cbfun) {
      GLFW.errorFunc = cbfun;
    }

  function _glfwSetKeyCallback(winid, cbfun) {
      GLFW.setKeyCallback(winid, cbfun);
    }

  function _glfwSetMouseButtonCallback(winid, cbfun) {
      GLFW.setMouseButtonCallback(winid, cbfun);
    }

  function _glfwSetScrollCallback(winid, cbfun) {
      GLFW.setScrollCallback(winid, cbfun);
    }

  function _glfwSetWindowIconifyCallback(winid, cbfun) {
      var win = GLFW.WindowFromId(winid);
      if (!win) return;
      win.windowIconifyFunc = cbfun;
    }

  function _glfwSetWindowShouldClose(winid, value) {
      var win = GLFW.WindowFromId(winid);
      if (!win) return;
      win.shouldClose = value;
    }

  function _glfwSetWindowSizeCallback(winid, cbfun) {
      GLFW.setWindowSizeCallback(winid, cbfun);
    }

  function _glfwSwapBuffers(winid) {
      GLFW.swapBuffers(winid);
    }

  function _glfwSwapInterval(interval) {
      interval = Math.abs(interval); // GLFW uses negative values to enable GLX_EXT_swap_control_tear, which we don't have, so just treat negative and positive the same.
      if (interval == 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 0);
      else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, interval);
    }

  function _glfwTerminate() {
      window.removeEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
      window.removeEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
      window.removeEventListener("keydown", GLFW.onKeydown, true);
      window.removeEventListener("keypress", GLFW.onKeyPress, true);
      window.removeEventListener("keyup", GLFW.onKeyup, true);
      window.removeEventListener("blur", GLFW.onBlur, true);
      Module["canvas"].removeEventListener("mousemove", GLFW.onMousemove, true);
      Module["canvas"].removeEventListener("mousedown", GLFW.onMouseButtonDown, true);
      Module["canvas"].removeEventListener("mouseup", GLFW.onMouseButtonUp, true);
      Module["canvas"].removeEventListener('wheel', GLFW.onMouseWheel, true);
      Module["canvas"].removeEventListener('mousewheel', GLFW.onMouseWheel, true);
      Module["canvas"].removeEventListener('mouseenter', GLFW.onMouseenter, true);
      Module["canvas"].removeEventListener('mouseleave', GLFW.onMouseleave, true);
      Module["canvas"].removeEventListener('drop', GLFW.onDrop, true);
      Module["canvas"].removeEventListener('dragover', GLFW.onDragover, true);
  
  
      Module["canvas"].width = Module["canvas"].height = 1;
      GLFW.windows = null;
      GLFW.active = null;
    }

  function _glfwWindowHint(target, hint) {
      GLFW.hints[target] = hint;
    }

   

  function _llvm_exp2_f32(x) {
      return Math.pow(2, x);
    }

  var _llvm_pow_f64=Math_pow;

  function _llvm_stackrestore(p) {
      var self = _llvm_stacksave;
      var ret = self.LLVM_SAVEDSTACKS[p];
      self.LLVM_SAVEDSTACKS.splice(p, 1);
      stackRestore(ret);
    }

  function _llvm_stacksave() {
      var self = _llvm_stacksave;
      if (!self.LLVM_SAVEDSTACKS) {
        self.LLVM_SAVEDSTACKS = [];
      }
      self.LLVM_SAVEDSTACKS.push(stackSave());
      return self.LLVM_SAVEDSTACKS.length-1;
    }

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 

   

   

   

   

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

FS.staticInit();__ATINIT__.unshift(function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() });__ATMAIN__.push(function() { FS.ignorePermissions = false });__ATEXIT__.push(function() { FS.quit() });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
__ATINIT__.unshift(function() { TTY.init() });__ATEXIT__.push(function() { TTY.shutdown() });;
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); var NODEJS_PATH = require("path"); NODEFS.staticInit(); };
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) { Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."); Module["requestFullScreen"] = Module["requestFullscreen"]; Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice) };
  Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) { Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
  Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else if (typeof self === 'object' && self['performance'] && typeof self['performance']['now'] === 'function') {
    _emscripten_get_now = function() { return self['performance']['now'](); };
  } else if (typeof performance === 'object' && typeof performance['now'] === 'function') {
    _emscripten_get_now = function() { return performance['now'](); };
  } else {
    _emscripten_get_now = Date.now;
  };
JSEvents.staticInit();;
var GLctx; GL.init();
DYNAMICTOP_PTR = staticAlloc(4);

STACK_BASE = STACKTOP = alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = alignMemory(STACK_MAX);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

staticSealed = true; // seal the static portion of memory

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

var ASSERTIONS = true;

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}



function nullFunc_ff(x) { Module["printErr"]("Invalid function pointer called with signature 'ff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_fff(x) { Module["printErr"]("Invalid function pointer called with signature 'fff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_i(x) { Module["printErr"]("Invalid function pointer called with signature 'i'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_ii(x) { Module["printErr"]("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_iii(x) { Module["printErr"]("Invalid function pointer called with signature 'iii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_iiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_v(x) { Module["printErr"]("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vd(x) { Module["printErr"]("Invalid function pointer called with signature 'vd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vdd(x) { Module["printErr"]("Invalid function pointer called with signature 'vdd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vdddddd(x) { Module["printErr"]("Invalid function pointer called with signature 'vdddddd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vf(x) { Module["printErr"]("Invalid function pointer called with signature 'vf'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vff(x) { Module["printErr"]("Invalid function pointer called with signature 'vff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vffff(x) { Module["printErr"]("Invalid function pointer called with signature 'vffff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vfi(x) { Module["printErr"]("Invalid function pointer called with signature 'vfi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vi(x) { Module["printErr"]("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vidd(x) { Module["printErr"]("Invalid function pointer called with signature 'vidd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vif(x) { Module["printErr"]("Invalid function pointer called with signature 'vif'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viff(x) { Module["printErr"]("Invalid function pointer called with signature 'viff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vifff(x) { Module["printErr"]("Invalid function pointer called with signature 'vifff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viffff(x) { Module["printErr"]("Invalid function pointer called with signature 'viffff'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_vii(x) { Module["printErr"]("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viif(x) { Module["printErr"]("Invalid function pointer called with signature 'viif'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viii(x) { Module["printErr"]("Invalid function pointer called with signature 'viii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiiiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_viiiiiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiiiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

Module['wasmTableSize'] = 294;

Module['wasmMaxTableSize'] = 294;

function invoke_ff(index,a1) {
  try {
    return Module["dynCall_ff"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_fff(index,a1,a2) {
  try {
    return Module["dynCall_fff"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vd(index,a1) {
  try {
    Module["dynCall_vd"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vdd(index,a1,a2) {
  try {
    Module["dynCall_vdd"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vdddddd(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_vdddddd"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vf(index,a1) {
  try {
    Module["dynCall_vf"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vff(index,a1,a2) {
  try {
    Module["dynCall_vff"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vffff(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_vffff"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vfi(index,a1,a2) {
  try {
    Module["dynCall_vfi"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vidd(index,a1,a2,a3) {
  try {
    Module["dynCall_vidd"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vif(index,a1,a2) {
  try {
    Module["dynCall_vif"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viff(index,a1,a2,a3) {
  try {
    Module["dynCall_viff"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vifff(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_vifff"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viffff(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viffff"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viif(index,a1,a2,a3) {
  try {
    Module["dynCall_viif"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  try {
    Module["dynCall_viiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

Module.asmGlobalArg = {};

Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "abortStackOverflow": abortStackOverflow, "nullFunc_ff": nullFunc_ff, "nullFunc_fff": nullFunc_fff, "nullFunc_i": nullFunc_i, "nullFunc_ii": nullFunc_ii, "nullFunc_iii": nullFunc_iii, "nullFunc_iiii": nullFunc_iiii, "nullFunc_v": nullFunc_v, "nullFunc_vd": nullFunc_vd, "nullFunc_vdd": nullFunc_vdd, "nullFunc_vdddddd": nullFunc_vdddddd, "nullFunc_vf": nullFunc_vf, "nullFunc_vff": nullFunc_vff, "nullFunc_vffff": nullFunc_vffff, "nullFunc_vfi": nullFunc_vfi, "nullFunc_vi": nullFunc_vi, "nullFunc_vidd": nullFunc_vidd, "nullFunc_vif": nullFunc_vif, "nullFunc_viff": nullFunc_viff, "nullFunc_vifff": nullFunc_vifff, "nullFunc_viffff": nullFunc_viffff, "nullFunc_vii": nullFunc_vii, "nullFunc_viif": nullFunc_viif, "nullFunc_viii": nullFunc_viii, "nullFunc_viiii": nullFunc_viiii, "nullFunc_viiiii": nullFunc_viiiii, "nullFunc_viiiiii": nullFunc_viiiiii, "nullFunc_viiiiiii": nullFunc_viiiiiii, "nullFunc_viiiiiiii": nullFunc_viiiiiiii, "nullFunc_viiiiiiiii": nullFunc_viiiiiiiii, "invoke_ff": invoke_ff, "invoke_fff": invoke_fff, "invoke_i": invoke_i, "invoke_ii": invoke_ii, "invoke_iii": invoke_iii, "invoke_iiii": invoke_iiii, "invoke_v": invoke_v, "invoke_vd": invoke_vd, "invoke_vdd": invoke_vdd, "invoke_vdddddd": invoke_vdddddd, "invoke_vf": invoke_vf, "invoke_vff": invoke_vff, "invoke_vffff": invoke_vffff, "invoke_vfi": invoke_vfi, "invoke_vi": invoke_vi, "invoke_vidd": invoke_vidd, "invoke_vif": invoke_vif, "invoke_viff": invoke_viff, "invoke_vifff": invoke_vifff, "invoke_viffff": invoke_viffff, "invoke_vii": invoke_vii, "invoke_viif": invoke_viif, "invoke_viii": invoke_viii, "invoke_viiii": invoke_viiii, "invoke_viiiii": invoke_viiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_viiiiiii": invoke_viiiiiii, "invoke_viiiiiiii": invoke_viiiiiiii, "invoke_viiiiiiiii": invoke_viiiiiiiii, "___assert_fail": ___assert_fail, "___lock": ___lock, "___setErrNo": ___setErrNo, "___syscall140": ___syscall140, "___syscall145": ___syscall145, "___syscall146": ___syscall146, "___syscall221": ___syscall221, "___syscall5": ___syscall5, "___syscall54": ___syscall54, "___syscall6": ___syscall6, "___unlock": ___unlock, "__emscripten_sample_gamepad_data": __emscripten_sample_gamepad_data, "__exit": __exit, "_abort": _abort, "_alBufferData": _alBufferData, "_alDeleteBuffers": _alDeleteBuffers, "_alDeleteSources": _alDeleteSources, "_alGenBuffers": _alGenBuffers, "_alGenSources": _alGenSources, "_alGetError": _alGetError, "_alGetSourcei": _alGetSourcei, "_alIsExtensionPresent": _alIsExtensionPresent, "_alListener3f": _alListener3f, "_alListenerf": _alListenerf, "_alSource3f": _alSource3f, "_alSourcePlay": _alSourcePlay, "_alSourceQueueBuffers": _alSourceQueueBuffers, "_alSourceStop": _alSourceStop, "_alSourceUnqueueBuffers": _alSourceUnqueueBuffers, "_alSourcef": _alSourcef, "_alSourcei": _alSourcei, "_alcCloseDevice": _alcCloseDevice, "_alcCreateContext": _alcCreateContext, "_alcDestroyContext": _alcDestroyContext, "_alcGetContextsDevice": _alcGetContextsDevice, "_alcGetCurrentContext": _alcGetCurrentContext, "_alcGetString": _alcGetString, "_alcMakeContextCurrent": _alcMakeContextCurrent, "_alcOpenDevice": _alcOpenDevice, "_eglGetProcAddress": _eglGetProcAddress, "_emscripten_asm_const_iii": _emscripten_asm_const_iii, "_emscripten_exit_pointerlock": _emscripten_exit_pointerlock, "_emscripten_get_gamepad_status": _emscripten_get_gamepad_status, "_emscripten_get_now": _emscripten_get_now, "_emscripten_get_num_gamepads": _emscripten_get_num_gamepads, "_emscripten_get_pointerlock_status": _emscripten_get_pointerlock_status, "_emscripten_glActiveTexture": _emscripten_glActiveTexture, "_emscripten_glAttachShader": _emscripten_glAttachShader, "_emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation, "_emscripten_glBindBuffer": _emscripten_glBindBuffer, "_emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer, "_emscripten_glBindProgramARB": _emscripten_glBindProgramARB, "_emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer, "_emscripten_glBindTexture": _emscripten_glBindTexture, "_emscripten_glBindVertexArray": _emscripten_glBindVertexArray, "_emscripten_glBlendColor": _emscripten_glBlendColor, "_emscripten_glBlendEquation": _emscripten_glBlendEquation, "_emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate, "_emscripten_glBlendFunc": _emscripten_glBlendFunc, "_emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate, "_emscripten_glBufferData": _emscripten_glBufferData, "_emscripten_glBufferSubData": _emscripten_glBufferSubData, "_emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus, "_emscripten_glClear": _emscripten_glClear, "_emscripten_glClearColor": _emscripten_glClearColor, "_emscripten_glClearDepth": _emscripten_glClearDepth, "_emscripten_glClearDepthf": _emscripten_glClearDepthf, "_emscripten_glClearStencil": _emscripten_glClearStencil, "_emscripten_glClientActiveTexture": _emscripten_glClientActiveTexture, "_emscripten_glColorMask": _emscripten_glColorMask, "_emscripten_glColorPointer": _emscripten_glColorPointer, "_emscripten_glCompileShader": _emscripten_glCompileShader, "_emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D, "_emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D, "_emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D, "_emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D, "_emscripten_glCreateProgram": _emscripten_glCreateProgram, "_emscripten_glCreateShader": _emscripten_glCreateShader, "_emscripten_glCullFace": _emscripten_glCullFace, "_emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers, "_emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers, "_emscripten_glDeleteObjectARB": _emscripten_glDeleteObjectARB, "_emscripten_glDeleteProgram": _emscripten_glDeleteProgram, "_emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers, "_emscripten_glDeleteShader": _emscripten_glDeleteShader, "_emscripten_glDeleteTextures": _emscripten_glDeleteTextures, "_emscripten_glDeleteVertexArrays": _emscripten_glDeleteVertexArrays, "_emscripten_glDepthFunc": _emscripten_glDepthFunc, "_emscripten_glDepthMask": _emscripten_glDepthMask, "_emscripten_glDepthRange": _emscripten_glDepthRange, "_emscripten_glDepthRangef": _emscripten_glDepthRangef, "_emscripten_glDetachShader": _emscripten_glDetachShader, "_emscripten_glDisable": _emscripten_glDisable, "_emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray, "_emscripten_glDrawArrays": _emscripten_glDrawArrays, "_emscripten_glDrawArraysInstanced": _emscripten_glDrawArraysInstanced, "_emscripten_glDrawBuffers": _emscripten_glDrawBuffers, "_emscripten_glDrawElements": _emscripten_glDrawElements, "_emscripten_glDrawElementsInstanced": _emscripten_glDrawElementsInstanced, "_emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements, "_emscripten_glEnable": _emscripten_glEnable, "_emscripten_glEnableClientState": _emscripten_glEnableClientState, "_emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray, "_emscripten_glFinish": _emscripten_glFinish, "_emscripten_glFlush": _emscripten_glFlush, "_emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer, "_emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D, "_emscripten_glFrontFace": _emscripten_glFrontFace, "_emscripten_glFrustum": _emscripten_glFrustum, "_emscripten_glGenBuffers": _emscripten_glGenBuffers, "_emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers, "_emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers, "_emscripten_glGenTextures": _emscripten_glGenTextures, "_emscripten_glGenVertexArrays": _emscripten_glGenVertexArrays, "_emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap, "_emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib, "_emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform, "_emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders, "_emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation, "_emscripten_glGetBooleanv": _emscripten_glGetBooleanv, "_emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv, "_emscripten_glGetError": _emscripten_glGetError, "_emscripten_glGetFloatv": _emscripten_glGetFloatv, "_emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv, "_emscripten_glGetInfoLogARB": _emscripten_glGetInfoLogARB, "_emscripten_glGetIntegerv": _emscripten_glGetIntegerv, "_emscripten_glGetObjectParameterivARB": _emscripten_glGetObjectParameterivARB, "_emscripten_glGetPointerv": _emscripten_glGetPointerv, "_emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog, "_emscripten_glGetProgramiv": _emscripten_glGetProgramiv, "_emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv, "_emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog, "_emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat, "_emscripten_glGetShaderSource": _emscripten_glGetShaderSource, "_emscripten_glGetShaderiv": _emscripten_glGetShaderiv, "_emscripten_glGetString": _emscripten_glGetString, "_emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv, "_emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv, "_emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation, "_emscripten_glGetUniformfv": _emscripten_glGetUniformfv, "_emscripten_glGetUniformiv": _emscripten_glGetUniformiv, "_emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv, "_emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv, "_emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv, "_emscripten_glHint": _emscripten_glHint, "_emscripten_glIsBuffer": _emscripten_glIsBuffer, "_emscripten_glIsEnabled": _emscripten_glIsEnabled, "_emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer, "_emscripten_glIsProgram": _emscripten_glIsProgram, "_emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer, "_emscripten_glIsShader": _emscripten_glIsShader, "_emscripten_glIsTexture": _emscripten_glIsTexture, "_emscripten_glIsVertexArray": _emscripten_glIsVertexArray, "_emscripten_glLineWidth": _emscripten_glLineWidth, "_emscripten_glLinkProgram": _emscripten_glLinkProgram, "_emscripten_glLoadIdentity": _emscripten_glLoadIdentity, "_emscripten_glLoadMatrixf": _emscripten_glLoadMatrixf, "_emscripten_glMatrixMode": _emscripten_glMatrixMode, "_emscripten_glNormalPointer": _emscripten_glNormalPointer, "_emscripten_glPixelStorei": _emscripten_glPixelStorei, "_emscripten_glPolygonOffset": _emscripten_glPolygonOffset, "_emscripten_glReadPixels": _emscripten_glReadPixels, "_emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler, "_emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage, "_emscripten_glRotatef": _emscripten_glRotatef, "_emscripten_glSampleCoverage": _emscripten_glSampleCoverage, "_emscripten_glScissor": _emscripten_glScissor, "_emscripten_glShaderBinary": _emscripten_glShaderBinary, "_emscripten_glShaderSource": _emscripten_glShaderSource, "_emscripten_glStencilFunc": _emscripten_glStencilFunc, "_emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate, "_emscripten_glStencilMask": _emscripten_glStencilMask, "_emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate, "_emscripten_glStencilOp": _emscripten_glStencilOp, "_emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate, "_emscripten_glTexCoordPointer": _emscripten_glTexCoordPointer, "_emscripten_glTexImage2D": _emscripten_glTexImage2D, "_emscripten_glTexParameterf": _emscripten_glTexParameterf, "_emscripten_glTexParameterfv": _emscripten_glTexParameterfv, "_emscripten_glTexParameteri": _emscripten_glTexParameteri, "_emscripten_glTexParameteriv": _emscripten_glTexParameteriv, "_emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D, "_emscripten_glUniform1f": _emscripten_glUniform1f, "_emscripten_glUniform1fv": _emscripten_glUniform1fv, "_emscripten_glUniform1i": _emscripten_glUniform1i, "_emscripten_glUniform1iv": _emscripten_glUniform1iv, "_emscripten_glUniform2f": _emscripten_glUniform2f, "_emscripten_glUniform2fv": _emscripten_glUniform2fv, "_emscripten_glUniform2i": _emscripten_glUniform2i, "_emscripten_glUniform2iv": _emscripten_glUniform2iv, "_emscripten_glUniform3f": _emscripten_glUniform3f, "_emscripten_glUniform3fv": _emscripten_glUniform3fv, "_emscripten_glUniform3i": _emscripten_glUniform3i, "_emscripten_glUniform3iv": _emscripten_glUniform3iv, "_emscripten_glUniform4f": _emscripten_glUniform4f, "_emscripten_glUniform4fv": _emscripten_glUniform4fv, "_emscripten_glUniform4i": _emscripten_glUniform4i, "_emscripten_glUniform4iv": _emscripten_glUniform4iv, "_emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv, "_emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv, "_emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv, "_emscripten_glUseProgram": _emscripten_glUseProgram, "_emscripten_glValidateProgram": _emscripten_glValidateProgram, "_emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f, "_emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv, "_emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f, "_emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv, "_emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f, "_emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv, "_emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f, "_emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv, "_emscripten_glVertexAttribDivisor": _emscripten_glVertexAttribDivisor, "_emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer, "_emscripten_glVertexPointer": _emscripten_glVertexPointer, "_emscripten_glViewport": _emscripten_glViewport, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_emscripten_request_pointerlock": _emscripten_request_pointerlock, "_emscripten_set_click_callback": _emscripten_set_click_callback, "_emscripten_set_fullscreenchange_callback": _emscripten_set_fullscreenchange_callback, "_emscripten_set_gamepadconnected_callback": _emscripten_set_gamepadconnected_callback, "_emscripten_set_gamepaddisconnected_callback": _emscripten_set_gamepaddisconnected_callback, "_emscripten_set_keypress_callback": _emscripten_set_keypress_callback, "_emscripten_set_main_loop": _emscripten_set_main_loop, "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing, "_emscripten_set_touchcancel_callback": _emscripten_set_touchcancel_callback, "_emscripten_set_touchend_callback": _emscripten_set_touchend_callback, "_emscripten_set_touchmove_callback": _emscripten_set_touchmove_callback, "_emscripten_set_touchstart_callback": _emscripten_set_touchstart_callback, "_exit": _exit, "_glActiveTexture": _glActiveTexture, "_glAttachShader": _glAttachShader, "_glBindAttribLocation": _glBindAttribLocation, "_glBindBuffer": _glBindBuffer, "_glBindFramebuffer": _glBindFramebuffer, "_glBindRenderbuffer": _glBindRenderbuffer, "_glBindTexture": _glBindTexture, "_glBlendFunc": _glBlendFunc, "_glBufferData": _glBufferData, "_glBufferSubData": _glBufferSubData, "_glCheckFramebufferStatus": _glCheckFramebufferStatus, "_glClear": _glClear, "_glClearColor": _glClearColor, "_glClearDepthf": _glClearDepthf, "_glCompileShader": _glCompileShader, "_glCompressedTexImage2D": _glCompressedTexImage2D, "_glCreateProgram": _glCreateProgram, "_glCreateShader": _glCreateShader, "_glCullFace": _glCullFace, "_glDeleteBuffers": _glDeleteBuffers, "_glDeleteFramebuffers": _glDeleteFramebuffers, "_glDeleteProgram": _glDeleteProgram, "_glDeleteShader": _glDeleteShader, "_glDeleteTextures": _glDeleteTextures, "_glDepthFunc": _glDepthFunc, "_glDetachShader": _glDetachShader, "_glDisable": _glDisable, "_glDisableVertexAttribArray": _glDisableVertexAttribArray, "_glDrawArrays": _glDrawArrays, "_glDrawElements": _glDrawElements, "_glEnable": _glEnable, "_glEnableVertexAttribArray": _glEnableVertexAttribArray, "_glFramebufferRenderbuffer": _glFramebufferRenderbuffer, "_glFramebufferTexture2D": _glFramebufferTexture2D, "_glFrontFace": _glFrontFace, "_glGenBuffers": _glGenBuffers, "_glGenFramebuffers": _glGenFramebuffers, "_glGenRenderbuffers": _glGenRenderbuffers, "_glGenTextures": _glGenTextures, "_glGetAttribLocation": _glGetAttribLocation, "_glGetFloatv": _glGetFloatv, "_glGetProgramInfoLog": _glGetProgramInfoLog, "_glGetProgramiv": _glGetProgramiv, "_glGetShaderInfoLog": _glGetShaderInfoLog, "_glGetShaderiv": _glGetShaderiv, "_glGetString": _glGetString, "_glGetUniformLocation": _glGetUniformLocation, "_glLinkProgram": _glLinkProgram, "_glPixelStorei": _glPixelStorei, "_glReadPixels": _glReadPixels, "_glRenderbufferStorage": _glRenderbufferStorage, "_glShaderSource": _glShaderSource, "_glTexImage2D": _glTexImage2D, "_glTexParameteri": _glTexParameteri, "_glUniform1i": _glUniform1i, "_glUniform4f": _glUniform4f, "_glUniformMatrix4fv": _glUniformMatrix4fv, "_glUseProgram": _glUseProgram, "_glVertexAttribPointer": _glVertexAttribPointer, "_glViewport": _glViewport, "_glfwCreateWindow": _glfwCreateWindow, "_glfwDefaultWindowHints": _glfwDefaultWindowHints, "_glfwDestroyWindow": _glfwDestroyWindow, "_glfwGetCursorPos": _glfwGetCursorPos, "_glfwGetPrimaryMonitor": _glfwGetPrimaryMonitor, "_glfwGetTime": _glfwGetTime, "_glfwGetVideoModes": _glfwGetVideoModes, "_glfwInit": _glfwInit, "_glfwMakeContextCurrent": _glfwMakeContextCurrent, "_glfwSetCharCallback": _glfwSetCharCallback, "_glfwSetCursorEnterCallback": _glfwSetCursorEnterCallback, "_glfwSetCursorPosCallback": _glfwSetCursorPosCallback, "_glfwSetErrorCallback": _glfwSetErrorCallback, "_glfwSetKeyCallback": _glfwSetKeyCallback, "_glfwSetMouseButtonCallback": _glfwSetMouseButtonCallback, "_glfwSetScrollCallback": _glfwSetScrollCallback, "_glfwSetWindowIconifyCallback": _glfwSetWindowIconifyCallback, "_glfwSetWindowShouldClose": _glfwSetWindowShouldClose, "_glfwSetWindowSizeCallback": _glfwSetWindowSizeCallback, "_glfwSwapBuffers": _glfwSwapBuffers, "_glfwSwapInterval": _glfwSwapInterval, "_glfwTerminate": _glfwTerminate, "_glfwWindowHint": _glfwWindowHint, "_llvm_exp2_f32": _llvm_exp2_f32, "_llvm_pow_f64": _llvm_pow_f64, "_llvm_stackrestore": _llvm_stackrestore, "_llvm_stacksave": _llvm_stacksave, "_time": _time, "emscriptenWebGLComputeImageSize": emscriptenWebGLComputeImageSize, "emscriptenWebGLGet": emscriptenWebGLGet, "emscriptenWebGLGetTexPixelData": emscriptenWebGLGetTexPixelData, "emscriptenWebGLGetUniform": emscriptenWebGLGetUniform, "emscriptenWebGLGetVertexAttrib": emscriptenWebGLGetVertexAttrib, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX };
// EMSCRIPTEN_START_ASM
var asm =Module["asm"]// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);

var real____errno_location = asm["___errno_location"]; asm["___errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____errno_location.apply(null, arguments);
};

var real__emscripten_GetProcAddress = asm["_emscripten_GetProcAddress"]; asm["_emscripten_GetProcAddress"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__emscripten_GetProcAddress.apply(null, arguments);
};

var real__fflush = asm["_fflush"]; asm["_fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__fflush.apply(null, arguments);
};

var real__free = asm["_free"]; asm["_free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__free.apply(null, arguments);
};

var real__llvm_bswap_i32 = asm["_llvm_bswap_i32"]; asm["_llvm_bswap_i32"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__llvm_bswap_i32.apply(null, arguments);
};

var real__main = asm["_main"]; asm["_main"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__main.apply(null, arguments);
};

var real__malloc = asm["_malloc"]; asm["_malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__malloc.apply(null, arguments);
};

var real__memmove = asm["_memmove"]; asm["_memmove"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__memmove.apply(null, arguments);
};

var real__roundf = asm["_roundf"]; asm["_roundf"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__roundf.apply(null, arguments);
};

var real__sbrk = asm["_sbrk"]; asm["_sbrk"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__sbrk.apply(null, arguments);
};

var real__strstr = asm["_strstr"]; asm["_strstr"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__strstr.apply(null, arguments);
};

var real_establishStackSpace = asm["establishStackSpace"]; asm["establishStackSpace"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_establishStackSpace.apply(null, arguments);
};

var real_getTempRet0 = asm["getTempRet0"]; asm["getTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_getTempRet0.apply(null, arguments);
};

var real_setTempRet0 = asm["setTempRet0"]; asm["setTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_setTempRet0.apply(null, arguments);
};

var real_setThrew = asm["setThrew"]; asm["setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_setThrew.apply(null, arguments);
};

var real_stackAlloc = asm["stackAlloc"]; asm["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackAlloc.apply(null, arguments);
};

var real_stackRestore = asm["stackRestore"]; asm["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackRestore.apply(null, arguments);
};

var real_stackSave = asm["stackSave"]; asm["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackSave.apply(null, arguments);
};
Module["asm"] = asm;
var ___errno_location = Module["___errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["___errno_location"].apply(null, arguments) };
var _emscripten_GetProcAddress = Module["_emscripten_GetProcAddress"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_emscripten_GetProcAddress"].apply(null, arguments) };
var _fflush = Module["_fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_fflush"].apply(null, arguments) };
var _free = Module["_free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_free"].apply(null, arguments) };
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments) };
var _main = Module["_main"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_main"].apply(null, arguments) };
var _malloc = Module["_malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_malloc"].apply(null, arguments) };
var _memcpy = Module["_memcpy"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_memcpy"].apply(null, arguments) };
var _memmove = Module["_memmove"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_memmove"].apply(null, arguments) };
var _memset = Module["_memset"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_memset"].apply(null, arguments) };
var _roundf = Module["_roundf"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_roundf"].apply(null, arguments) };
var _sbrk = Module["_sbrk"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_sbrk"].apply(null, arguments) };
var _strstr = Module["_strstr"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_strstr"].apply(null, arguments) };
var establishStackSpace = Module["establishStackSpace"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["establishStackSpace"].apply(null, arguments) };
var getTempRet0 = Module["getTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["getTempRet0"].apply(null, arguments) };
var runPostSets = Module["runPostSets"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["runPostSets"].apply(null, arguments) };
var setTempRet0 = Module["setTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["setTempRet0"].apply(null, arguments) };
var setThrew = Module["setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["setThrew"].apply(null, arguments) };
var stackAlloc = Module["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackAlloc"].apply(null, arguments) };
var stackRestore = Module["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackRestore"].apply(null, arguments) };
var stackSave = Module["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackSave"].apply(null, arguments) };
var dynCall_ff = Module["dynCall_ff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_ff"].apply(null, arguments) };
var dynCall_fff = Module["dynCall_fff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_fff"].apply(null, arguments) };
var dynCall_i = Module["dynCall_i"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_i"].apply(null, arguments) };
var dynCall_ii = Module["dynCall_ii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_ii"].apply(null, arguments) };
var dynCall_iii = Module["dynCall_iii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iii"].apply(null, arguments) };
var dynCall_iiii = Module["dynCall_iiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiii"].apply(null, arguments) };
var dynCall_v = Module["dynCall_v"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_v"].apply(null, arguments) };
var dynCall_vd = Module["dynCall_vd"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vd"].apply(null, arguments) };
var dynCall_vdd = Module["dynCall_vdd"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vdd"].apply(null, arguments) };
var dynCall_vdddddd = Module["dynCall_vdddddd"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vdddddd"].apply(null, arguments) };
var dynCall_vf = Module["dynCall_vf"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vf"].apply(null, arguments) };
var dynCall_vff = Module["dynCall_vff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vff"].apply(null, arguments) };
var dynCall_vffff = Module["dynCall_vffff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vffff"].apply(null, arguments) };
var dynCall_vfi = Module["dynCall_vfi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vfi"].apply(null, arguments) };
var dynCall_vi = Module["dynCall_vi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vi"].apply(null, arguments) };
var dynCall_vidd = Module["dynCall_vidd"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vidd"].apply(null, arguments) };
var dynCall_vif = Module["dynCall_vif"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vif"].apply(null, arguments) };
var dynCall_viff = Module["dynCall_viff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viff"].apply(null, arguments) };
var dynCall_vifff = Module["dynCall_vifff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vifff"].apply(null, arguments) };
var dynCall_viffff = Module["dynCall_viffff"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viffff"].apply(null, arguments) };
var dynCall_vii = Module["dynCall_vii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vii"].apply(null, arguments) };
var dynCall_viif = Module["dynCall_viif"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viif"].apply(null, arguments) };
var dynCall_viii = Module["dynCall_viii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viii"].apply(null, arguments) };
var dynCall_viiii = Module["dynCall_viiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiii"].apply(null, arguments) };
var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiii"].apply(null, arguments) };
var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiii"].apply(null, arguments) };
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments) };
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments) };
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments) };
;



// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;

if (!Module["intArrayFromString"]) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["intArrayToString"]) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["ccall"]) Module["ccall"] = function() { abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["cwrap"]) Module["cwrap"] = function() { abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["setValue"]) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getValue"]) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["allocate"]) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["getMemory"] = getMemory;
if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = function() { abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["AsciiToString"]) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToAscii"]) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF8ToString"]) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF8"]) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF16ToString"]) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF16"]) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF32ToString"]) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF32"]) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["allocateUTF8"]) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stackTrace"]) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPreRun"]) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnInit"]) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPreMain"]) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnExit"]) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPostRun"]) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
if (!Module["FS"]) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
if (!Module["GL"]) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["staticAlloc"]) Module["staticAlloc"] = function() { abort("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["warnOnce"]) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getLEB"]) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getFunctionTables"]) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["registerFunctions"]) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addFunction"]) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["removeFunction"]) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["prettyPrint"]) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["makeBigInt"]) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["dynCall"]) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", { get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", { get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", { get: function() { abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", { get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", { get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });




/**
 * @constructor
 * @extends {Error}
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun']) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  var argv = _malloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8(Module['thisProgram']);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;


  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
      exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      Module.printErr('exception thrown: ' + toLog);
      Module['quit'](1, e);
    }
  } finally {
    calledMain = true;
  }
}




/** @type {function(Array=)} */
function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    ensureInitRuntime();

    preMain();

    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
    }

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (Module['_main'] && shouldRunNow) Module['callMain'](args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function exit(status, implicit) {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in NO_FILESYSTEM
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var flush = FS.quit;
  if (flush) {
    var print = Module['print'];
    var printErr = Module['printErr'];
    var has = false;
    Module['print'] = Module['printErr'] = function(x) {
      has = true;
    }
    try { // it doesn't matter if it fails
      flush(0);
    } catch(e) {}
    Module['print'] = print;
    Module['printErr'] = printErr;
    if (has) {
      warnOnce('stdio streams had content in them that was not flushed. you should set NO_EXIT_RUNTIME to 0 (see the FAQ), or make sure to emit a newline when you printf etc.');
    }
  }

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && Module['noExitRuntime'] && status === 0) {
    return;
  }

  if (Module['noExitRuntime']) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      Module.printErr('exit(' + status + ') called, but NO_EXIT_RUNTIME is set, so halting execution but not exiting the runtime or preventing further async execution (build with NO_EXIT_RUNTIME=0, if you want a true shutdown)');
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  if (ENVIRONMENT_IS_NODE) {
    process['exit'](status);
  }
  Module['quit'](status, new ExitStatus(status));
}
Module['exit'] = exit;

var abortDecorators = [];

function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  if (what !== undefined) {
    Module.print(what);
    Module.printErr(what);
    what = JSON.stringify(what)
  } else {
    what = '';
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '';
  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
  if (abortDecorators) {
    abortDecorators.forEach(function(decorator) {
      output = decorator(output, what);
    });
  }
  throw output;
}
Module['abort'] = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}

Module["noExitRuntime"] = true;

run();

// {{POST_RUN_ADDITIONS}}





// {{MODULE_ADDITIONS}}



