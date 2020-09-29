const atob = require('atob');
const fs = require('fs');
require('dotenv').config();

const obj = JSON.parse(fs.readFileSync('data/payloadInfo.json'));
const devList = JSON.parse(fs.readFileSync('data/devInfo.json'));

function _base64ToHexStr(b64) {
  const bin = atob(escape(b64));
  var hexArr = [];
  
  for (var i = 0; i < bin.length; i++)        {
    var hex = bin.charCodeAt(i).toString(16);
    hex = (hex.length == 1) ? '0' + hex : hex;
    hexArr.push(hex);
  }
  return hexArr.join(" ");
}

function getUnitObj(chanObj, typeObj) {
  var unit = chanObj.unit;
  if (!unit) {
    return {
        unit: ""
    };
  } else if (unit.toLowerCase() === 'undecided') {
    var refChan = chanObj.data_type[typeObj.value];
    var refObj = obj['data_chan'][refChan];
    return getUnitObj(refObj, typeObj);
  } else if (unit.toLowerCase() === 'number') {
    return {
      unit: unit.toLowerCase(),
      range: chanObj.range,
      outOfRangeMessage: chanObj.outOfRangeMessage
    }
  } else {
    return {
      unit: unit.toLowerCase()
    }
  }
}

function getParsedObj(chanObj, typeObj, dataArr) {
  const dataHex = dataArr.join("");
  var unitObj = getUnitObj(chanObj, typeObj);
  var dataParsed = parseInt(dataHex, 16) * typeObj.resolution;
  
  if (unitObj.unit === 'number') {
    if (unitObj.hasOwnProperty('range')) {
        dataParsed = ((unitObj.range[0] <= dataParsed) && (unitObj.range[1] >= dataParsed)) ? dataParsed : unitObj.outOfRangeMessage[dataHex];
    }
  } else if (unitObj.unit === 'boolean') {
    dataParsed = (dataParsed == 1) ? true : false;
  } else {
    dataParsed += unitObj.unit;
  }

  return {
    dataChan: chanObj.description,
    dataType: typeObj.description,
    dataParsed: dataParsed,
    dataHex: [chanObj.value, typeObj.value, dataArr.join(" ")].join(" ")
  };
}

function getParsedObjList(payloadRaw) {
  var payloadHex = _base64ToHexStr(payloadRaw).toUpperCase();
  var payloadList = payloadHex.split(" ");
  var currLoc = 0;
  var result = [];

  while (currLoc < payloadList.length) {
    try {
      let chanObj = obj.data_chan[payloadList[currLoc]];
      currLoc++;
      
      let typeObj = obj.data_type[payloadList[currLoc]];
      currLoc++;
      
      let data = [];
      for(i=1;i<=typeObj.size;i++) {
          data.push(payloadList[currLoc]);
          currLoc++;
      }
      result.push(getParsedObj(chanObj, typeObj, data));
    } catch (exception) {
      console.log(exception);
    }
  }
  return result;
}

function getFormattedCurrentDatetime() {
  var d = new Date();
  month = '' + (d.getMonth() + 1);
  day = '' + d.getDate();
  year = d.getFullYear();
  hour = d.getHours();
  min = d.getMinutes();
  sec = d.getSeconds();
  mils = d.getMilliseconds();

  if (month.length < 2) { month = '0' + month; }
  if (day.length < 2) { day = '0' + day; }
  if (hour.length < 2) { hour = '0' + hour; }
  if (min.length < 2) {min = '0' + min; }
  
  if (mils.length < 2) {mils = '00' + mils;}
  else {
    if(mils.length < 3) {mils = '0' + mils;}
  }
  
  return [year, month, day].join('.') + " " + [hour, min, sec].join(":") + " " + mils + "Z";
}

function getMessageContent(topic, message) {
  const parsedTopic = topic.split(process.env.MQTT_TOPIC_SEPERATOR);
  const devEui = parsedTopic[2];
  const device_id = (devEui in devList) ? devList[devEui] : devEui;
  const parsedObjectList = getParsedObjList(message);
  let result = "";
  let color = "black";
  
  parsedObjectList.forEach(function(parsed) {
    if (parsed.dataType === "Presence Sensor") {
      color =  (parsed.dataParsed) ? "red" : "green";
    }
    
    result += '<p style="color:' + color + ';">'
          + ' <b>[[ ' + device_id + ' ]]</b> '
          + getFormattedCurrentDatetime() + ' | '
          + device_id + ' | '
          + parsed.dataChan + ' | '
          + parsed.dataType + ' | '
          + parsed.dataParsed + ' | '
          + parsed.dataHex
          + '</p>';
  });

  return {result, color, devEui};
}

exports.getMessageContent = getMessageContent;