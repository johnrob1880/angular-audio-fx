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
