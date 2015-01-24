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
