(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxIterator", factory);

    factory.$inject = ["FxClass"];
    function factory (FxClass) {

        return FxClass.extend({
            constructor: function (data) {
                this.data = data;
                this._index = 0;
            },
            next: function () {
                var item;
                if (!this.hasNext()) {
                    return null;
                }
                item = this.data[this._index];
                this._index++;
                return item;
            },
            hasNext: function () {
                return this._index < this.length();
            },
            rewind: function () {
                this._index = 0;
                return this.data[this._index];
            },
            current: function () {
                return this.data[this._index];
            },
            pluck: function (props) {
                var currentItem = this.data[this._index];
                var item = {};
                for (var prop in props) {
                    if (props.hasOwnProperty(prop)) {
                        if (currentItem.hasOwnProperty(prop)) {
                            item[props[prop]] = currentItem[props[prop]];
                        }
                    }
                }
                return item;
            },
            prop: function (prop) {
                var currentItem = this.data[this._index];
                console.log(['prop', currentItem, prop]);
                if (!currentItem) { return null; }

                if (!currentItem.hasOwnProperty(prop)) {
                    throw new Error("current item does not contain the '" + prop + "' property.");
                }
                return currentItem[prop];
            },
            length: function () {
                return this.data.length;
            }
        });
    }
})();