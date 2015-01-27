(function () {
    "use strict";

    angular.module("ngAudioFxUI")
        .filter("audioTime", filter);

    function filter() {
        return function (item, format) {
            var time = parseFloat(item),
                hours = Math.floor(time / (60 * 60)),
                minutes = Math.floor(time / 60),
                seconds = Math.floor((time - (minutes * 60))),
                milliseconds = Math.floor((time % 1) * 1000);

            return (format == "00:00:00" ? (("00" + hours).slice(-2) + ":") : "" ) +
                ("00" + minutes).slice(-2) + ":" + ("00" + seconds).slice(-2) +
                (format === "00:00:00.00000" ? "." + ("000" + milliseconds).slice(-3) : "");
        }
    }
})();