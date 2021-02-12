/* global Module */

/* Magic Mirror
 * Module: MMM-alertRsensors
 *
 * By Andre Pawlowski (sqall) https://alertr.de
 * MIT Licensed.
 */

// Needs npm install mysql


Module.register("MMM-alertRsensors",{

	// Override dom generator.
	getDom: function() {

		this.getSensors();

		var wrapper = document.createElement("table");
		wrapper.className = "table";

		for(var i = 0; i < this.sensors.length; i++) {
			var sensorWrapper = document.createElement("tr");
			sensorWrapper.className = "tr";

			var descriptionWrapper = document.createElement("td");
			descriptionWrapper.className = "td_desc";
			// Relabel description if it is set.
			if(this.sensors[i].relabel === "") {
				descriptionWrapper.textContent = this.sensors[i].description;
			}
			else {
				descriptionWrapper.textContent = this.sensors[i].relabel;
			}

			var dataWrapper = document.createElement("td");
			dataWrapper.className = "td_data";

			// Output data.
			if(this.sensors[i].show_data && this.sensors[i].dataType !== 0) {

				var data_string = "";
				if(this.sensors[i].dataType === 1) {
					data_string += this.sensors[i].data;
				}
				else if(this.sensors[i].dataType === 2) {
					data_string += this.sensors[i].data.toFixed(2);
				}
				else {
					data_string += this.sensors[i].data;
				}

				// Add unit if it is set.
				if(this.sensors[i].unit !== "") {
					data_string += " ";
					data_string += this.sensors[i].unit
				}

				dataWrapper.textContent = data_string;

			}

			// No data to show, output state.
			else {

				if(this.sensors[i].state === 0) {
					dataWrapper.textContent = "Normal";
				}
				else if(this.sensors[i].state === 1) {
					dataWrapper.textContent = "Triggered";
				}
				else {
					dataWrapper.textContent = "Unknown";
				}
			}

			sensorWrapper.appendChild(descriptionWrapper);
			sensorWrapper.appendChild(dataWrapper);
			wrapper.appendChild(sensorWrapper);
		}

		return wrapper;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Parse sensors from config.
		this.sensors = [];
		for(var i = 0; i < this.config.sensors.length; i++) {

			var relabel = "";
			if(this.config.sensors[i].hasOwnProperty("relabel")) {
				relabel = this.config.sensors[i].relabel;
			}

			this.sensors.push({username: this.config.sensors[i].username,
				client_sensor_id: this.config.sensors[i].client_sensor_id,
				show_data: this.config.sensors[i].show_data,
				description: "",
				state: 0,
				dataType: 0,
				unit: this.config.sensors[i].unit,
				relabel: relabel});
		}

		this.getSensors();

		// Schedule update interval.
		var self = this;
		setInterval(function() {
			self.updateDom();
		}, 3000);
	},

	getSensors: function() {
		Log.info("Getting sensors");

		for(var i = 0; i < this.sensors.length; i++) {

			this.sendSocketNotification("GET_SENSORS",
				{config: this.config,
				username: this.sensors[i].username,
				client_sensor_id: this.sensors[i].client_sensor_id,
				show_data: this.sensors[i].show_data,
				});
		}
	},

	socketNotificationReceived: function(notification, payload) {

		if(notification === "RESULT_SENSORS") {
			Log.info("Received sensor data");

			for(var i = 0; i < this.sensors.length; i++) {

				if(this.sensors[i].username === payload.username
					&& this.sensors[i].client_sensor_id === payload.client_sensor_id) {

					this.sensors[i].sensor_id = payload.sensor_id;
					this.sensors[i].show_data = payload.show_data;
					this.sensors[i].description = payload.description;
					this.sensors[i].state = payload.state;
					this.sensors[i].dataType = payload.dataType;
					this.sensors[i].data = payload.data;
					break;
				}

			}

		}

	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required styles.
	getStyles: function() {
		return ["MMM-alertRsensors.css"];
	},

});
