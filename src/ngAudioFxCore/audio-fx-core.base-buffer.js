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