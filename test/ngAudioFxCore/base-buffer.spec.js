describe("FxBaseBuffer", function () {

    var audioCtx,
        buffer,
        presets;

    beforeEach(angular.mock.module('ngAudioFxCore'));

    beforeEach(inject(function(FxSharedAudioContext){
        audioCtx = FxSharedAudioContext.getContext();
        buffer = audioCtx.createBuffer(2, 22050, 44100);
        presets = { offsetStart: 0, offsetEnd: -10 };
    }));

    it("should inherit extend method from FxClass", inject(['FxBaseBuffer', function (FxBaseBuffer) {

        expect(FxBaseBuffer).toBeDefined();
    }]));

    it("should default presets property", inject(['FxBaseBuffer', function (FxBaseBuffer) {

        var inst = new FxBaseBuffer(buffer, presets);

        expect(inst.presets).toBeDefined();
    }]));

    it("should set buffer property", inject(['FxBaseBuffer', function (FxBaseBuffer) {

        var inst = new FxBaseBuffer(buffer, presets);

        expect(inst.buffer).toBeDefined();
        expect(inst.buffer).toBe(buffer);
    }]));

    it("should set presets property", inject(['FxBaseBuffer', function (FxBaseBuffer) {

        var inst = new FxBaseBuffer(buffer, presets);

        expect(inst.presets).toBeDefined();
        expect(inst.presets.offsetStart).toBe(presets.offsetStart);
        expect(inst.presets.offsetEnd).toBe(presets.offsetEnd);
    }]));

    it("length should be inherited and return zero.", inject(['FxBaseBuffer', 'FxBufferLoader', function (FxBaseBuffer) {

        var BufferClass = FxBaseBuffer.extend({
            id: 123
        });
        var inst = new BufferClass(buffer, null);

        expect(inst.length).toBeDefined();
        expect(inst.length()).toEqual(0);
    }]));
});