/* Magic Mirror
 * Module: MMM-alertRsensors
 *
 * By Andre Pawlowski (sqall) https://alertr.de
 * MIT Licensed.
 */

var mysql = require('mysql');
var NodeHelper = require('node_helper');

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting node helper: " + this.name);	
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		// DEBUG
		//console.log("Notification: " + notification + " Payload: " + payload);

		if(notification === "GET_SENSOR_ALERTS") {

			var connection = mysql.createConnection({
				host: payload.config.host,
				user: payload.config.user,
				password: payload.config.password,
				database: payload.config.database
			});

			connection.connect();

			connection.query('SELECT state, description, timeReceived, dataJson FROM sensorAlerts ORDER BY timeReceived desc LIMIT ?',
				[payload.config.numberSensorAlerts],
				function(err, rows, fields) {

				if(err) {
					return;
				}

				connection.end();

				self.sendSocketNotification("RESULT_SENSOR_ALERTS", {rows: rows});
				
			});

		}

		else if(notification === "GET_SENSORS") {

			var connection = mysql.createConnection({
				host: payload.config.host,
				user: payload.config.user,
				password: payload.config.password,
				database: payload.config.database
			});

			var sensor_obj = {username: payload.username,
				remote_sensor_id: payload.remote_sensor_id,
				show_data: payload.show_data
				};

			connection.connect();

			// Get node id for sensor.
			connection.query('SELECT id FROM nodes WHERE username = ?',
				[sensor_obj.username],
				function(err, rows, fields) {

				if(err) {
					console.log("Error: " + err);
					return;
				}

				node_id = rows[0].id;

				// Get sensor.
				connection.query('SELECT id, description, state, dataType FROM sensors WHERE nodeId = ? and remoteSensorId = ?',
					[node_id, sensor_obj.remote_sensor_id],
					function(err, rows, fields) {

					if(err) {
						console.log("Error: " + err);
						return;
					}

					sensor_obj.sensor_id = rows[0].id;
					sensor_obj.description = rows[0].description;
					sensor_obj.state = rows[0].state;
					sensor_obj.dataType = rows[0].dataType;

					// Get sensor data.
					if(sensor_obj.show_data && sensor_obj.dataType !== 0) {

						var sql_stmt = "";
						if(sensor_obj.dataType === 1) {
							sql_stmt = 'SELECT data FROM sensorsDataInt WHERE sensorId = ?';
						}
						else if(sensor_obj.dataType === 2) {
							sql_stmt = 'SELECT data FROM sensorsDataFloat WHERE sensorId = ?';
						}
						
						// Get sensor data.
						connection.query(sql_stmt,
							[sensor_obj.sensor_id],
							function(err, rows, fields) {

							if(err) {
								console.log("Error: " + err);
								return;
							}

							sensor_obj.data = rows[0].data;

							connection.end();

							self.sendSocketNotification("RESULT_SENSORS", sensor_obj);

						});

					}
					else {

						sensor_obj.data = null;

						connection.end();

						self.sendSocketNotification("RESULT_SENSORS", sensor_obj);

					}

				});

			});

		}

	},

});
