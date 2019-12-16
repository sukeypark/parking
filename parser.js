txt = '{"data_type": {"00": {"size": 1, "description": "Digital Input", "resolution": 1}, "01": {"size": 1, "description": "Digital Output", "resolution": 1}, "02": {"size": 2, "description": "Analog Input", "resolution": 0.01}, "03": {"size": 2, "description": "Analog Output", "resolution": 0.01}, "66": {"size": 1, "description": "Presence Sensor", "resolution": 1}, "67": {"size": 2, "description": "Temperature Sensor", "resolution": 0.1}}, "data_chan": {"01": {"description": "Recalibrate Response"}, "02": {"description": "Temperature"}, "03": {"description": "Battery"}, "05": {"description": "PNI Internal"}, "06": {"description": "PNI Internal"}, "15": {"description": "Parking Status"}, "1C": {"description": "Deactivate Response"}, "21": {"description": "Vehicle Count"}, "37": {"description": "Keep-Alive"}, "3F": {"description": "Reboot Response"}}, "uplink": {"01": {"01": {"digit": true, "value": {"00": "failed", "01": "successful"}}}, "02": {"67": {"digit": false, "unit": "\\u00b0C"}}, "03": {"02": {"digit": false, "unit": "V"}}, "15": {"66": {"digit": true, "value": {"00": "vacant", "01": "occupied"}}}, "1C": {"01": {"digit": true, "value": {"01": "done"}}}, "21": {"00": {"digit": false, "unit": "\\ub300", "limit": ["80", "Sensor reboot or recalibration"]}}, "37": {"66": {"digit": true, "value": {"00": "vacant", "01": "occupied"}}, "00": {"digit": false, "unit": "\\ub300", "limit": ["80", "Sensor reboot or recalibration"]}}, "3F": {"01": {"digit": true, "value": {"01": "done"}}}}, "downlink": {}}';

obj = JSON.parse(txt);

function getDataChanDesc(payload) {
    var value = payload.split(" ")[0];
    return obj.data_chan[value].description;
}

function getDataType(payload) {
    var value = payload.split(" ")[1];
    return obj.data_type[value].description;
}

function getParsedValue(payload) {
    var payloadList = payload.split(" ");
    var head = obj.uplink[payloadList[0]][payloadList[1]];

    if (head.hasOwnProperty('digit')) {
        var value = head.value[payloadList[2]];
    } else {
        if (head.hasOwnProperty('limit')) {
            if(parseInt(payloadList[2], 16) == parseInt(head.limit[0], 16) ) {
                var value = head.limit[1];
            } else if (parseInt(payloadList[2], 16) > parseInt(head.limit[0], 16) ){
                var value = "Invalid"
            } else {
                var numericVal = parseInt(payloadList[2] + payloadList[3], 16);
                var value = numericVal * obj.data_type[payloadList[1]].resolution + head.unit;
            }
        } else {
            var numericVal = parseInt(payloadList[2] + payloadList[3], 16);
            var value = numericVal * obj.data_type[payloadList[1]].resolution + head.unit;
        }
    }

    return value;
    /*
    if (digit.indexOf(payloadList[1])) {
        return obj.uplink[payloadList[0]][payloadList[1]][payloadList[2]];
    } else {
        return "00F0";
    }*/
}