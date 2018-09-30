var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
        // Subclass start method.
        start: function() {
                console.log("Starting module: " + this.name);
        },

        // Subclass socketNotificationReceived received.
        socketNotificationReceived: function(notification, payload) {

                if (notification === "FETCH_POLLEN_DATA") {
                console.log(new Date()+"pollen helper recived notification"+notification);
                        var that = this;
                        pollenData = {};

                        request({
                                url: payload.url,
                                method: 'GET',
                                headers: {
                                        'Accept': 'application/json'
                                }
                        }, function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                        that.sendSocketNotification('POLLEN_DATA', {
                                                data: JSON.parse(body)
                                        });
                                }
                        });
                }
        },
});