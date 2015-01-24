describe("FxBufferLoader", function () {
    var rootScope,
        url;

    beforeEach(angular.mock.module("ngAudioFxCore"));

    beforeEach(inject(function($rootScope){
        rootScope = $rootScope;
        url = "assets/audio.mp3";
    }));
    afterEach(inject(function($rootScope){
    }));

    it("load method should return a promise", inject(["FxBufferLoader", function (FxBufferLoader) {

        var promise = FxBufferLoader.load(url);

        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
    }]));

    xit("should call _load", inject(["FxBufferLoader", function (FxBufferLoader) {

        spyOn(FxBufferLoader, "load");

        FxBufferLoader.load(url);

        expect(FxBufferLoader.load).toHaveBeenCalled();

    }]));

    xit("should return from cache when already loaded", inject(["FxBufferLoader", function (FxBufferLoader) {

       var promise = FxBufferLoader.load(url);

        promise.then(function (data) {
            spyOn(FxBufferLoader, "_decodeAudio");

            // second request
            FxBufferLoader.load(url).then(function (data) {
                expect(FxBufferLoader.cache[url]).toBeDefined();
                expect(FxBufferLoader._decodeAudio).not().toHaveBeenCalled();
            });

        });
    }]));

    xit("clearCache should remove cache", inject(["FxBufferLoader", function (FxBufferLoader) {

        var promise = FxBufferLoader.load(url);

        promise.then(function (response) {
            var cached = FxBufferLoader._cache[url];
            expect(cached).toBeDefined();
            expect(cached).toBe(response.data);

            FxBufferLoader.clearCache();

            expect(FxBufferLoader._cache.length).toEqual(0);
        });
    }]));

    xit("removeFromCache should remove cache", inject(["FxBufferLoader", function (FxBufferLoader) {

        var promise = FxBufferLoader.load(url);

        promise.then(function (response) {
            var cached = FxBufferLoader._cache[url];
            expect(cached).toBeDefined();
            expect(cached).toBe(response.data);

            FxBufferLoader.removeFromCache(url);

            expect(FxBufferLoader._cache.length).toEqual(0);
        });
    }]));
});