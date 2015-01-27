(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxBuffer", factory);

    factory.$inject = ["FxBaseBuffer", "FxMessageChannel", "FxTimer"];
    function factory(FxBaseBuffer, FxMessageChannel, FxTimer) {

        var playbackStates = {
            CONNECTED: "CONNECTED",
            DISCONNECTED : "DISCONNECTED",
            PLAYING: "PLAYING",
            PAUSED: "PAUSED",
            STOPPED: "STOPPED"
        };

        return FxBaseBuffer.extend({
            constructor: function (buffer, presets) {

                FxBaseBuffer.call(this, buffer, presets);
                this.playbackState = playbackStates.DISCONNECTED;
                this.startTime = this.startOffset = 0;
                this.timer = new FxTimer(1000);
                this.timerAction = undefined;
                this.volume = 1;
                this.endTime = this.buffer.duration * 1000;

                this.timer.onTick(function (t) {
                    if (t > this.endTime) {
                        this.stop();
                        this.timer.reset(true);
                        this.endTime = this.buffer.duration * 1000;
                        FxMessageChannel.audioEnded(this);
                    }
                }.bind(this));


                FxMessageChannel.audioLoaded(this);
            },
            playbackStates: angular.copy(playbackStates),
            connect: function (audioContext, masterGain) {

                this.context = audioContext;
                this.master = masterGain;

                if (!this.context || !this.master) {
                    this.playbackState = playbackStates.DISCONNECTED;
                    return;
                }

                this.playbackState = playbackStates.CONNECTED;
                FxMessageChannel.audioConnected(this);
            },
            disconnect: function () {
                this.gain.disconnect(0);
                this.source.disconnect(0);
                this.gain = undefined;
                this.source = undefined;
                this.playbackState = playbackStates.DISCONNECTED;
                FxMessageChannel.audioDisconnected(this);
            },
            length: function () {
                if (!this.buffer) {
                    return 0;
                }
                return this.buffer.duration;
            },
            play: function (when, offset) {

                this.startTime = this.context.currentTime;
                if (this.playbackState === playbackStates.DISCONNECTED) {
                    throw new Error("cannot play, buffer is not connected.");
                }
                if (!when) { when = 0; }
                if (!offset) { offset = 0;}

                when = this.startTime + when;

                this.source = this.context.createBufferSource();
                this.gain = this.context.createGain();
                this.source.buffer = this.buffer;
                this.source.connect(this.gain);

                var start = typeof this.source.start === 'function' ? this.source.start : this.source.noteOn;

                start.call(this.source, when, this.startOffset % this.source.buffer.duration);

                this.timer.start();

                if (this.muted) {
                    this.gain.gain.value = 0;
                } else if (this.volume) {
                    this.gain.gain.value = this.volume;
                }

                this.gain.connect(this.master);
                this.playbackState = playbackStates.PLAYING;
            },
            stop: function () {
                this.timer.stop();
                var stop = typeof this.source.stop === 'function' ? this.source.stop : this.source.noteOff;
                stop.call(this.source, 0);

                this.startOffset = 0;
                this.playbackState = playbackStates.STOPPED;
            },
            pause: function () {
                this.timer.stop();

                if (this.playbackState !== playbackStates.PLAYING) {
                    return;
                }
                var stop = typeof this.source.stop === 'function' ? this.source.stop : this.source.noteOff;
                stop.call(this.source);

                this.startOffset += this.context.currentTime - this.startTime;
                this.playbackState = playbackStates.PAUSED;
            },
            skip: function (value) {
                var currentTime = this.currentPosition(),
                    wasPlaying = this.playbackState === playbackStates.PLAYING;

                console.log(['skip', currentTime, this.startOffset]);
                if (wasPlaying) {
                    this.stop();
                }

                this.startOffset = currentTime + value;
                this.endTime = this.endTime - (value * 1000);

                if (wasPlaying) {
                    if (this.startOffset < 0) {
                        this.startOffset = 0;
                        this.endTime = this.buffer.duration * 1000;
                    }
                    if (this.startOffset < this.buffer.duration) {
                        this.play(0);
                    }
                }
            },
            setVolume: function (level) {
                this.volume = level;
                this.gain.gain.value = level;
            },
            mute: function () {
                if (!this.gain) { return; }
                this.muted = true;
                this.gain.gain.value = 0;
            },
            unmute: function () {
                if (!this.muted) { return; }
                this.muted = false;
                this.gain.gain.value = this.volume;
            },
            currentPosition: function () {
                return this.startOffset + ((this.playbackState === this.playbackStates.PLAYING)
                        ? this.context.currentTime - this.startTime : 0);
            },
            playable: function() {
                return this.playbackState !== this.playbackStates.PLAYING
                    && this.playbackState !== this.playbackStates.DISCONNECTED
                    && this.length() > 0;
            },
            stoppable: function () {
                return this.playbackState === this.playbackStates.PLAYING;
            },
            pauseable: function () {
                return this.playbackState === this.playbackStates.PLAYING;
            }
        });
    }
})();
