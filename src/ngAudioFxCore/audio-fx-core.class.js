(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxClass", factory);

    function factory() {

        var FxClass = {};

        FxClass.extend = function (properties) {
            var superProto = this.prototype || FxClass;
            var proto = Object.create(superProto);
            FxClass.copyOwnTo(properties, proto);

            var ctor = proto.constructor;
            if (!(ctor instanceof Function)) {
                throw new Error("You must define a method 'constructor'");
            }

            // Set up the constructor
            ctor.prototype = proto;
            ctor.super = superProto;
            ctor.extend = this.extend;
            return ctor;
        };

        FxClass.copyOwnTo = function (source, target) {
            Object.getOwnPropertyNames(source).forEach(function (propName) {
               Object.defineProperty(target, propName,
               Object.getOwnPropertyDescriptor(source, propName));
            });
            return target;
        };

        return FxClass;
    }
})();
