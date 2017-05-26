# Magic Mirror Module alertR Sensors
This module for the [MagicMirror](https://github.com/MichMich/MagicMirror) shows the state of the sensors of the [alertR monitoring and alarm system](https://github.com/sqall01/alertR).

![MagicMirror](pics/magicmirror.jpg)

# Installation

1. This module needs the alertR Manager Client Database to communicate with the alertR system. Please follow [this tutorial](https://github.com/sqall01/alertR/wiki/Tutorial-ManagerClientDatabase) to install and configure it.

2. This module needs the npm mysql module installed:

```bash
npm install mysql
```

3. Execute the following commands to install the module:

```bash
cd ~/MagicMirror/modules # navigate to module directory of your magic mirror
git clone https://github.com/sqall01/MMM-alertRsensors.git # clone this module
```

4. Add the following into the `modules` section of your `config/config.js` file:

```bash
{
        module: 'MMM-alertRsensors',
        position: 'top_right', // This can be any of the regions
        config: {
        	// See 'Configuration options' for more information
        }
},
```

## Configuration options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>

		<tr>
			<td><code>host</code></td>
			<td>The host the MySQL server is running on.<br />
				<br /><b>Example:</b> <code>'localhost'</code>
			</td>
		</tr>

		<tr>
			<td><code>user</code></td>
			<td>The user to connect to the MySQL server.<br />
				<br /><b>Example:</b> <code>'root'</code>
			</td>
		</tr>

		<tr>
			<td><code>password</code></td>
			<td>The password to connect to the MySQL server.
			</td>
		</tr>

		<tr>
			<td><code>database</code></td>
			<td>The database used by the MySQL server.<br />
				<br /><b>Example:</b> <code>'mm_alertr'</code>
			</td>
		</tr>

		<tr>
			<td><code>sensors</code></td>
			<td>A list of sensors that should be displayed by the mirror.
			</td>
		</tr>

		<tr>
			<td><code>username</code></td>
			<td>Username of the alertR client that provides this sensor.
				This username is used by the alertR client to connect
				to the alertR server.<br />
				<br /><b>Example:</b> <code>'weather_sensor_user'</code>
			</td>
		</tr>

		<tr>
			<td><code>remote_sensor_id</code></td>
			<td>The id that is given by the alertR client to this sensor.
				This id is used to identify the exact sensor that
				should be displayed. Note, this is the id given by the
				client and not the unique id given by the server.<br />
				<br /><b>Example:</b> <code>0</code>
			</td>
		</tr>

		<tr>
			<td><code>show_data</code></td>
			<td>If the sensor holds data like a temperature, this sets
				if the data is shown or just the state of the sensor.<br />
				<br /><b>Example:</b> <code>true</code>
			</td>
		</tr>

		<tr>
			<td><code>unit</code></td>
			<td>If the sensor holds data, this gives the unit of the
				sensor that should be displayed.<br />
				<br /><b>Example:</b> <code>"°C"</code>
			</td>
		</tr>

		<tr>
			<td><code>relabel</code></td>
			<td>This module displays the description of the alertR sensor.
				But if this description is too cryptic to be shown
				on a mirror in your living space, you can relabel it
				with this option. If you do not want to relabel it,
				just set an empty string.<br />
				<br /><b>Example:</b> <code>"Temperature"</code>
				<br /><b>Example:</b> <code>""</code>
			</td>
		</tr>
	</tbody>
</table>

An example configuration could look like this:

```bash
{
        module: 'MMM-alertRsensors',
        position: 'top_right', // This can be any of the regions
        config: {
                host: 'localhost',
                user: 'root',
                password: 'mysqlpassword',
                database: 'mm_alertr',

                sensors: [
                        // Temperature
                        {username: "weather_sensor_user",
                        remote_sensor_id: 0,
                        show_data: true,
                        unit: "°C",
                        relabel: "Temperature"},

                        // Front Door
                        {username: "livingroom_sensor_user",
                        remote_sensor_id: 0,
                        show_data: false,
                        unit: "",
                        relabel: "Front Door"},
                ]
        }
},
```