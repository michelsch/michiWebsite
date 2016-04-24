angular
.module('app', ['pubnub.angular.service'])

.controller('ChatCtrl', ['$scope', 'Pubnub', function($scope, Pubnub) {
    $scope.messages = [];
    $scope.channel = 'messages-channel';

    $scope.messageContent = '';
    // Generating a random uuid between 1 and 100 using utility function from lodash library.
    $scope.uuid = _.random(1000000).toString();

    // Please signup to PubNub to use your own keys: https://admin.pubnub.com/
    Pubnub.init({
        publish_key: 'pub-c-23115939-e450-4846-9742-8b90f936563d',
        subscribe_key: 'sub-c-a6f251a4-0740-11e6-b422-0619f8945a4f',
        ssl: true,
        uuid: $scope.uuid
    });

    // Fetching a uniq random avatar from the robohash.org service.
    $scope.avatarUrl = function(uuid) {
        return 'http://robohash.org/' + uuid + '?set=set2&bgset=bg2&size=70x70';
    };

    // Send the messages over PubNub Network
    $scope.sendMessage = function() {
       // Don't send an empty message
       if (!$scope.messageContent ||
            $scope.messageContent === '') {
            return;
        }
        Pubnub.publish({
            channel: $scope.channel,
            message: {
                content: $scope.messageContent,
                sender_uuid: $scope.uuid,
                date: new Date()
            },
            callback: function(m) {
                console.log(m);
            }
        });
        // Reset the messageContent input
        $scope.messageContent = '';
    }

    // Send the messages over PubNub Network
    $scope.getPinyin = function() {
       // Don't send an empty message
       if (!$scope.messageContent ||
            $scope.messageContent === '') {
            return;
        }
        $scope.messageContent = $scope.messageContent + '\n' + cjst.chineseToPinyin($scope.messageContent).join(' ')
        Pubnub.publish({
            channel: $scope.channel,
            message: {
                content: $scope.messageContent,
                sender_uuid: $scope.uuid,
                date: new Date()
            },
            callback: function(m) {
                console.log(m);
            }
        });
        // Reset the messageContent input
        $scope.messageContent = '';
    }

    // Subscribe to messages channel
    Pubnub.subscribe({
        channel: $scope.channel,
        triggerEvents: ['callback']
    });

    // Make it possible to scrollDown to the bottom of the messages container
    $scope.scrollDown = function(time) {
        var $elem = $('.collection');
        $('body').animate({
            scrollTop: $elem.height()
        }, time);
    };

    // Listenning to messages sent.
    $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function(ngEvent, m) {
        $scope.$apply(function() {
            $scope.messages.push(m)
        });
        $scope.scrollDown(400);
    });
}]);
