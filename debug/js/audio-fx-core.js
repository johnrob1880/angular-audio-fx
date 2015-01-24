(function () {
    "use strict";
    /* jshint maxlen: false */

    angular.module("ngAudioFxCore", []);
})();
(function (window, navigator) {
    "use strict";

    angular.module("ngAudioFxCore").run(run);

    function run() {
        // sanitize AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // sanitize getUserMedia
        navigator.getUserMedia = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;
    }
})(window || {}, navigator || {});

(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("fxUtils", utils);

    function utils() {
        return {
            deepCopy: function (obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        }
    }
})();

(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxClass", factory);

    function factory() {

        var FxClass = {};

        FxClass.extend = function (properties) {
            var superProto = this.prototype || FxClass;
            var proto = Object.create(superProto);
            FxClass.copyOwnTo(properties, proto);

            var ctor = proto.constructor;
            if (!(ctor instanceof Function)) {
                throw new Error("You must define a method 'constructor'");
            }

            // Set up the constructor
            ctor.prototype = proto;
            ctor.super = superProto;
            ctor.extend = this.extend;
            return ctor;
        };

        FxClass.copyOwnTo = function (source, target) {
            Object.getOwnPropertyNames(source).forEach(function (propName) {
               Object.defineProperty(target, propName,
               Object.getOwnPropertyDescriptor(source, propName));
            });
            return target;
        };

        return FxClass;
    }
})();

(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxSharedAudioContext", factory);

    var context;

    function factory () {
        return {
            getContext: function () {
                if (!context) {
                    if (!AudioContext) {
                        throw new Error("AudioContext is not supported in your browser!");
                    }
                    context = new AudioContext();
                }
                return context;
            }
        }
    }
})();
(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory('FxBufferLoader', factory);

    factory.$inject = ["$q", "FxSharedAudioContext"];
    function factory ($q, FxSharedAudioContext) {
        var _cache = {},
            _deferreds = {};

        return {
            _cache: _cache,
            _deferreds: _deferreds,
            /**
             * Loads the audio data from cache or a given url if not cached.
             * @param url
             * @returns {*}
             */
            load: load,
            clearCache: clearCache,
            removeFromCache: removeFromCache,
            _load: _load,
            _decodeAudio: _decodeAudio
        };

        function load (url, xhr) {
            if (_cache[url]) {
                var deferred = $q.defer();
                deferred.resolve(_cache[url]);
                return deferred.promise;
            } else if (_deferreds[url]) {
                return _deferreds[url].promise;
            } else {
                return _load(url, xhr);
            }
        }

        function _load (url, xhr) {

            if (!xhr) { xhr = new XMLHttpRequest(); }

            var deferred = $q.defer();
            _deferreds[url] = deferred;

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                _decodeAudio(xhr.response, deferred, url);
            };
            xhr.onerror = function () {
                deferred.reject("Xhr error", arguments);
            };
            xhr.send();

            return deferred.promise;
        }

        function _decodeAudio (arrayBuffer, deferred, url) {
            FxSharedAudioContext.getContext().decodeAudioData(arrayBuffer, function (buffer) {
                _deferreds[url] = undefined;
                _cache[url] = buffer;
                deferred.resolve(buffer);
            }, function (e) {
                deferred.reject("Error decoding file", e);
            });
        }

        function clearCache () {
            _cache = [];
            _deferreds = [];
        }
        function removeFromCache (url) {
            if (_cache[url]) {
                _cache[url] = undefined;
            }
            if (_deferreds[url]) {
                _deferreds[url] = undefined;
            }
        }
    }
})();

(function () {
    "use strict";



    angular.module("ngAudioFxCore")
        .factory("FxBaseBuffer", factory);

    factory.$inject = ["FxClass"];
    function factory (FxClass) {

        var Presets = FxClass.extend({
            constructor: function (offsetStart, offsetEnd) {
                this.offsetStart = offsetStart || 0;
                this.offsetEnd = offsetEnd || 0;
            },
            copy: function (presets) {
                this.offsetStart = presets && presets.offsetStart;
                this.offsetEnd = presets && presets.offsetEnd;
            }
        });

        var presetDefaults = new Presets(0, 0);

        return FxClass.extend({
            /**
             * Constructor for the base buffer
             * @param presets
             * @param buffer
             * @constructor
             */
            constructor: function (buffer, presets) {
                // check type
                if (Object.prototype.toString.call(buffer) !== "[object AudioBuffer]") {
                    throw new Error("requires a buffer of type AudioBuffer. see https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer")
                }

                this.buffer = buffer;
                this.presets = angular.copy(presetDefaults);
                if (this.presets) {
                    this.presets.copy(presets);
                }
            },
            length: function () {
                return 0;
            }
        });
    }
})();
(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxBuffer", factory);

    factory.$inject = ["FxBaseBuffer"];
    function factory(FxBaseBuffer) {

        var playbackStates = {
            CONNECTED: "CONNECTED",
            DISCONNECTED : "DISCONNECTED",
            PLAYING: "PLAYING",
            PAUSED: "PAUSED"
        };

        return FxBaseBuffer.extend({
            constructor: function (buffer, presets) {

                FxBaseBuffer.call(this, buffer, presets);
                this.playbackState = playbackStates.DISCONNECTED;
            },
            playbackStates: angular.copy(playbackStates),
            connect: function (audioContext, masterGain) {

                this.context = audioContext;
                this.master = masterGain;

                if (!this.context) {
                    this.playbackState = FxBuffer.playbackStates.DISCONNECTED;
                    return;
                }

                this.source = this.context.createBufferSource();
                this.gain = this.context.createGain();
                this.source.buffer = this.buffer;
                this.source.connect(this.gain);

                if (!this.master) {
                    this.playbackState = FxBuffer.playbackStates.DISCONNECTED;
                    return;
                }

                this.gain.connect(this.master);
                this.playbackState = FxBuffer.playbackStates.CONNECTED;
            },
            disconnect: function () {
                this.gain.disconnect();
                this.source.disconnect();
                this.gain =  undefined;
                this.source = undefined;
                this.playbackState = FxBuffer.playbackStates.DISCONNECTED;
            },
            length: function () {
                if (!this.buffer) {
                    return 0;
                }
                console.log(this.buffer);
                return this.buffer.duration;
            },
            play: function (when, offset) {

                if (this.playbackState === playbackStates.DISCONNECTED) {
                    throw new Error("cannot play, buffer is not connected.");
                }

                if (!when) { when = 0; }
                if (!offset) { offset = 0;}

                when = this.context.currentTime + when;
                var duration = this.length();
                this.source.start(when, offset, duration);

                this.playbackState = FxBuffer.playbackStates.PLAYING;
            },
            stop: function () {

                if (this.playbackState !== playbackStates.PLAYING) {
                    return;
                }

                this.source.stop(0);
                this.playbackState = FxBuffer.playbackStates.PAUSED;
            }
        });
    }
})();
