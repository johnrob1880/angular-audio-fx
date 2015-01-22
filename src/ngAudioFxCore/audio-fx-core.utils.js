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
