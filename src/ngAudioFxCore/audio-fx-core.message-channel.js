(function () {
    "use strict";

    angular.module("ngAudioFxCore")
        .factory("FxMessageChannel", factory);

    factory.$inject = ["FxClass", "$rootScope"];
    function factory(FxClass, $rootScope) {

        var AUDIO_ENDED = "fx.audio.ended";
        var AUDIO_LOADED = "fx.audio.loaded";
        var AUDIO_CONNECTED = "fx.audio.connected";
        var AUDIO_DISCONNECTED = "fx.audio.disconnected";

        var MessageChannel = FxClass.extend({
           constructor: function () {
           },
            audioEnded: audioEnded,
            onAudioEnded: onAudioEnded,
            audioLoaded: audioLoaded,
            onAudioLoaded: onAudioLoaded,
            audioConnected: audioConnected,
            onAudioConnected: onAudioConnected,
            audioDisconnected: audioDisconnected,
            onAudioDisconnected: onAudioDisconnected
        });

        return new MessageChannel();

        function audioEnded (buffer) {
            $rootScope.$broadcast(AUDIO_ENDED, {
                data: buffer
            });
        }

        function onAudioEnded ($scope, handler) {
            $scope.$on(AUDIO_ENDED, function (event, message) {
                handler.call(handler, message.data);
            });
        }

        function audioLoaded (buffer) {
            $rootScope.$broadcast(AUDIO_LOADED, {
                data: buffer
            });
        }

        function onAudioLoaded ($scope, handler) {
            $scope.$on(AUDIO_LOADED, function (event, message) {
                handler.call(handler, message.data);
            });
        }

        function audioConnected (buffer) {
            $rootScope.$broadcast(AUDIO_CONNECTED, {
                data: buffer
            });
        }

        function onAudioConnected ($scope, handler) {
            $scope.$on(AUDIO_CONNECTED, function (event, message) {
                handler.call(handler, message.data);
            });
        }

        function audioDisconnected (buffer) {
            $rootScope.$broadcast(AUDIO_DISCONNECTED, {
                data: buffer
            });
        }

        function onAudioDisconnected ($scope, handler) {
            $scope.$on(AUDIO_DISCONNECTED, function (event, message) {
                handler.call(handler, message.data);
            });
        }
    }
})();