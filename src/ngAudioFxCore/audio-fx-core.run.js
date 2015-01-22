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
