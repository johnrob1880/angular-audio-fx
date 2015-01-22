(function (angular) {
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
