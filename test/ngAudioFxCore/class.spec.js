describe("FxClass", function () {

    beforeEach(angular.mock.module('ngAudioFxCore'));

    xit("should create extendable object", inject(["FxClass", function (FxClass) {
        var Animal = FxClass.extend({
            constructor: function (legs) {
                this.legs = legs;
            },
            walk: function () {
                return "walking with " + this.legs + " legs.";
            }
        });

        expect(Animal.extend).toBeDefined();

        var dog = new Animal(4);
        expect(dog.extend).toBeDefined();
    }]));
});
