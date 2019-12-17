txt = '{"data_type": {"00": {"size": 1, "description": "Digital Input", "resolution": 1}, "01": {"size": 1, "description": "Digital Output", "resolution": 1}, "02": {"size": 2, "description": "Analog Input", "resolution": 0.01}, "03": {"size": 2, "description": "Analog Output", "resolution": 0.01}, "66": {"size": 1, "description": "Presence Sensor", "resolution": 1}, "67": {"size": 2, "description": "Temperature Sensor", "resolution": 0.1}}, "data_chan": {"01": {"description": "Recalibrate Response"}, "02": {"description": "Temperature"}, "03": {"description": "Battery"}, "05": {"description": "PNI Internal"}, "06": {"description": "PNI Internal"}, "15": {"description": "Parking Status"}, "1C": {"description": "Deactivate Response"}, "21": {"description": "Vehicle Count"}, "37": {"description": "Keep-Alive"}, "3F": {"description": "Reboot Response"}}, "uplink": {"01": {"01": {"digit": true, "value": {"00": "failed", "01": "successful"}}}, "02": {"67": {"digit": false, "unit": "\\u00b0C"}}, "03": {"02": {"digit": false, "unit": "V"}}, "15": {"66": {"digit": true, "value": {"00": "vacant", "01": "occupied"}}}, "1C": {"01": {"digit": true, "value": {"01": "done"}}}, "21": {"00": {"digit": false, "unit": "\\ub300", "limit": ["80", "Sensor reboot or recalibration"]}}, "37": {"66": {"digit": true, "value": {"00": "vacant", "01": "occupied"}}, "00": {"digit": false, "unit": "\\ub300", "limit": ["80", "Sensor reboot or recalibration"]}}, "3F": {"01": {"digit": true, "value": {"01": "done"}}}}, "downlink": {}}';

obj = JSON.parse(txt);

function getParsedValue(payload) {
    payload = payload.toUpperCase();
    var payloadList = payload.split(" ");
    var currLoc = 0;
    var values = [];

    while (currLoc < payloadList.length) {
        var _data_chan = payloadList[currLoc];
        currLoc++;
        var _data_type = payloadList[currLoc];
        var _size = obj.data_type[_data_type].size;
        var _value = "";
        var payload = _data_chan + " " + _data_type;
        var parsed = {
            'data_chan': obj.data_chan[_data_chan].description, 
            'data_type': obj.data_type[_data_type].description
        }

        for (var j=1;j<=_size;j++) {
            currLoc++;
            _value += payloadList[currLoc];
            payload += " " + payloadList[currLoc];
        }

        var head = obj.uplink[_data_chan][_data_type];

        if (head.digit) {
            var value = head.value[_value];
        } else {
            if (head.hasOwnProperty('limit')) {
                if(parseInt(_value, 16) == parseInt(head.limit[0], 16) ) {
                    var value = head.limit[1];
                } else if (parseInt(_value, 16) > parseInt(head.limit[0], 16) ){
                    var value = "Invalid"
                } else {
                    var value = parseInt(_value, 16) * obj.data_type[_data_type].resolution + head.unit;
                }
            } else {
                var value = parseInt(_value, 16) * obj.data_type[_data_type].resolution + head.unit;
            }
        }
        parsed.value = value;
        parsed.payload = payload;

        values.push(parsed)
        currLoc++;
    }
    console.log(values);
    return values;
}