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