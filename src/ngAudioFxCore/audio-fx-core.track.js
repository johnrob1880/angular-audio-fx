(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxTrack", factory);

    factory.$inject = ["FxClass", "FxMessageChannel"];
    function factory(FxClass, FxMessageChannel) {

        var FxTrackItem = FxClass.extend({
            constructor: function (buffer, position) {
                this.buffer = buffer;
                this.position = position;
            }
        });

        return FxClass.extend({
            constructor: function () {
                this.trackItems = [];
            },
            add: function (buffer, position) {
                if (Object.prototype.toString.call(buffer) !== "[object FxBuffer]") {
                    throw new Error("requires a buffer of type FxBuffer!")
                }
                if (typeof position !== "number") {
                    throw new Error("position must be numeric!");
                }
                var trackItem = new FxTrackItem(buffer, position);
                this.trackItems.push(trackItem);
                return trackItem;
            },
            remove: function (item) {
                this.trackItems.slice(this.trackItems.indexOf(item), 1);
            },
            play: function (when, offset) {
                for (var i in this.trackItems) {
                    if (this.trackItems.hasOwnProperty(i)) {
                        var item = this.trackItems[i];
                        item.buffer.play(item.position);
                    }
                }
            },
            pause: function () {
                for (var i in this.trackItems) {
                    if (this.trackItems.hasOwnProperty(i)) {
                        var item = this.trackItems[i];
                        item.buffer.pause();
                    }
                }
            },
            stop: function () {
                for (var i in this.trackItems) {
                    if (this.trackItems.hasOwnProperty(i)) {
                        var item = this.trackItems[i];
                        item.buffer.stop();
                    }
                }
            }
        });
    }
})();