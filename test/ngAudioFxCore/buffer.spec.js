describe("FxBuffer", function () {

    var audioCtx,
        buffer,
        presets;

    beforeEach(angular.mock.module('ngAudioFxCore'));

    beforeEach(inject(function(FxSharedAudioContext){
        audioCtx = FxSharedAudioContext.getContext();
        buffer = audioCtx.createBuffer(2, 22050, 44100);
        presets = { offsetStart: 0, offsetEnd: -10 };
    }));


    it("should inherit extend method from FxClass", inject(["FxBuffer", function (FxBuffer) {
        expect(FxBuffer.extend).toBeDefined();
    }]));

    it("should construct buffer from FxBaseBuffer", inject(["FxBuffer", function (FxBuffer) {
        var inst = new FxBuffer(buffer, presets);

        expect(inst).toBeDefined();
        expect(inst.buffer).toBeDefined();

    }]));

    it("should construct presets from FxBaseBuffer", inject(["FxBuffer", function (FxBuffer) {

        var inst = new FxBuffer(buffer, presets);

        expect(inst).toBeDefined();
        expect(inst.presets.offsetStart).toEqual(presets.offsetStart);
        expect(inst.presets.offsetEnd).toEqual(presets.offsetEnd);

    }]));

    it("should construct buffer from FxBaseBuffer", inject(["FxBuffer", function (FxBuffer) {

        var inst = new FxBuffer(buffer, presets);

        expect(inst).toBeDefined();
        expect(inst.buffer).toBeDefined();

    }]));

    it("should set playbackState to DISCONNECTED on construction", inject(["FxBuffer", function (FxBuffer) {

        var inst = new FxBuffer(buffer, presets);

        expect(inst.playbackState).toEqual("DISCONNECTED");

    }]));

    it("length should return buffer length", inject(["FxBuffer", function (FxBuffer) {
        var url = "assets/audio.mp3",
            channels = 4,
            frameCount = audioCtx.sampleRate * channels,
            buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

        for (var channel = 0; channel < channels; channel++) {
            // This gives us the actual ArrayBuffer that contains the data
            var nowBuffering = buffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }

        var inst = new FxBuffer(buffer, presets);

        expect(inst.length()).toEqual(channels);

    }]));

});