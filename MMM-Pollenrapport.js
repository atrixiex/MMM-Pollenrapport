Module.register("MMM-Pollenrapport",{
    // Default module config.
    defaults: {
        url: "https://pollenkoll.se/wp-content/themes/pollenkoll/api/get_cities.php",
        city: 94,
        updateInterval: 6 * 1000 * 60 * 60, //6 hours
        itemsPerRow: 2,
        circleStyleTable: {
                        "L": "c100 p16 small dark green",
                        "L-M": "c100 p33 small dark greenish",
                        "M": "c100 p50 small dark yellow",
                        "M-H": "c100 p66 small dark orangeish",
                        "H": "c100 p83 small dark orange",
                        "H-H+": "c100 p100 small dark red",
                },
    },

        // Override socket notification handler.
        socketNotificationReceived: function(notification, payload) {
                if (notification === "POLLEN_DATA") {
                        Log.info(payload);
                        this.filterPollenData(payload.data);
                }
        },

        filterPollenData: function(data) {
                var newData={};
                                        for(var i = 0; i < data.length; i++) {
                                                var item = data[i];
                                                if(item['cityid'] == this.config.city) {
                                                        var pollen = item['pollen'];
                                                        for(var t = 0; t < pollen.length; t++) {
                                                                if(pollen[t]['day0_value'] !== "i.h.") {
                                                                        var obj = {};
                                                                        var key = pollen[t]['type'];
                                                                        var value = pollen[t]['day0_value'];
																		if (value != "i.u.") {
																			obj[key] = value;
																			newData[key] = value;
																		}
                                                                }
                                                        }
                                                }
                                        }

                        this.pollenData = newData;
                        this.updateDom();
        },


    start: function() {
        Log.info(this.name + " is started!");
        this.pollenData = {};
        var self = this;
        setInterval(function() {
            self.getPollenData();
        }, self.config.updateInterval);
        self.getPollenData();
    },

    getScripts: function() {
        return [
            "moment.js",
        ]
    },

        getStyles: function() {
                        return [
                                this.file("css/circle.css"),
                        ]
        },

    // Override dom generator.
    getDom: function() {
        Log.info("Current pollen data: ");
        Log.info(this.pollenData);
        var wrapper = document.createElement("div");
        if (this.config.itemsPerRow > 0) {
                var count = 0;
                var row = document.createElement("DIV");
                row.setAttribute("class", "clearfix");
                        for (var type in this.pollenData) {
                                count++;
                                row.appendChild(this.createPollenGraph(type, this.pollenData[type]));
                                if(count == this.config.itemsPerRow) {
                                        wrapper.appendChild(row);
                                        count = 0;
                                        row = document.createElement("DIV");
                                        row.setAttribute("class", "clearfix");
                                }
                        }

        }
        else {
                for (var type in this.pollenData) {
                        wrapper.appendChild(this.createPollenGraph(type, this.pollenData[type]));
                }
        }
        return wrapper;
    },

    getPollenData: function(){
        Log.info(new Date() +this.name + " - Getting pollen data");
        this.sendSocketNotification(
                'FETCH_POLLEN_DATA',
                {
                    url: this.config.url,
                    city: this.config.city
                }
            );
    },

        createPollenGraph: function(name, severity){
                Log.info(name);
                Log.info(severity);
                var container = document.createElement("DIV");
                container.setAttribute("class", this.config.circleStyleTable[severity]);
                var content = document.createElement("SPAN");
                content.innerText = name;
                var slice = document.createElement("DIV");
                slice.setAttribute("class", "slice");
                slice.innerHTML = "<div class=\"bar\"></div><div class=\"fill\"></div>";

                container.appendChild(content);
                container.appendChild(slice);

                return container;
        },

    resume: function() {
        this.getPollenData();
    },
});
