function hexFormat(_data) {
	_data = _data.replace(new RegExp("^(\\w{" + (_data.length%2? _data.length%2:0) + "})(\\w{2})", "g"), "$1 $2").replace(/(\w{2})+?/gi, "$1 ").trim();
	_data = _data.replace(/\s/g, " ");
	return _data;
}

function sendFormdataPostAjax(url, formData, onSuccess, onError) {
	jQuery.ajax({
		type:"POST",
		url: url,
		processData: false, 
		contentType:false,
		enctype: 'multipart/form-data',
		data: formData,
		success : onSuccess,
		error : onError
	});
}

function sendFormdataGetAjax(url, formData, onSuccess, onError) {
	jQuery.ajax({
		type:"GET",
		url: url,
		processData: false, 
		contentType:false,
		enctype: 'multipart/form-data',
		data: formData,
		success : onSuccess,
		error : onError
	});
}


function sendUrlGetAjax(url, onSuccess, onError) {
	jQuery.ajax({
		type:"GET",
		dataType:"JSON",
	    url: url,
	    success: onSuccess,
	    error : onError 
	});
}

function sendUrlDeleteAjax(url, onSuccess, onError) {
	jQuery.ajax({
		type:"DELETE",
		dataType:"JSON",
	    url: url,
	    success: onSuccess,
	    error : onError 
	});
}

function commonAjaxError(x, error) {
	if(x.status == 405) {
		location.href = "/";
	}
	else {
		console.log("error : " + x.status + "/" + error);
	}
}

function convertStyleByFeedback(group, icon, is_ok) {
	if(is_ok) {
		group.removeClass("has-error").addClass("has-success");
		icon.removeClass("glyphicon-remove").addClass("glyphicon-ok");
	}
	else {
		group.removeClass("has-success").addClass("has-error");
		icon.removeClass("glyphicon-ok").addClass("glyphicon-remove");
	}
}

function convertReadonlyToEditable(input, feedback_icon, result_txt, toggle_btn) {
	input.val("");
	input.attr("readonly", false);
	input.attr("placeholder", "");
	feedback_icon.show();
	result_txt.show();
	toggle_btn.removeClass("glyphicon-flash").addClass("glyphicon-pencil");
}

function convertEditableToReadonly(input, feedback_icon, result_txt, toggle_btn) {
	input.val("");
	input.attr("readonly", true);
	input.attr("placeholder", "Auto Generate.");
	feedback_icon.hide();
	result_txt.hide();
	
	toggle_btn.removeClass("glyphicon-pencil").addClass("glyphicon-flash");
}

function addInputHandler(conditions){
    var $input = conditions.input;
    var dataType = conditions.dataType;
    var eventType = conditions.eventType;
    var extFunc = conditions.extFunc;
    
    if ((!$input) || (!dataType)) {
        throw {error:"NotEnoughArguments", errorMsg:"required argument is missing " +((!$input)?" target input element":" dataType")}
        return;
    }
    /*if ($input[0].tagName != "INPUT") {
        throw {error:"IlregalTargetElement", errorMsg:"target element is not input"};
        return;
    }*/
    if ((!eventType)) {
        eventType = "keyup";
    }
    var handlerFunc = conditions.handler;
    if ((!handlerFunc)) {
        handlerFunc = function(event){
            var regEx = null;
            if (dataType == "N") {
                regEx = /[^0-9]/gi;
            } else if (dataType == "AP") {
                regEx = /[^a-z]/gi;
            } else if (dataType == "AN") {
                regEx = /[^a-z0-9]/gi; 
            } else if(dataType == "HEX") {
           	// a-f for hexa..
           	 regEx = /[^a-f0-9]/gi;
            } else if (dataType == "HA") {
                regEx = /[a-z0-9]/gi;
                
            } else{
                throw {error:"IlregalDataType", errorMsg:"dataType("+dataType+") is incorrect"}     
            }
            remainOnlyTargetValue(regEx, $input,event);
            
            if(extFunc != null) {
            	extFunc.call();
            }	
        };  
    }
    $input.on(eventType,handlerFunc);
    
    if (conditions.maxlength) {
        $input.attr("maxlength",conditions.maxlength);
    }
}

function remainOnlyTargetValue(regEx, $input,event) {
    if ((!(event.keyCode >=34 && event.keyCode<=40)) && event.keyCode != 16) {
        var inputVal = $input.val();
        if (regEx.test(inputVal)) {
            $input.val(inputVal.replace(regEx,''));    
        }
    }
}

function checkJSON(text) {
	if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
		replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
		replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
		  //the json is ok
		return true;		
	}
	else{
		return false;
	} 
}

function _strToHexStr(_str) {
	var hexStr = '';
    for (var i = 0; i < _str.length; i++)        {
    	var hex = _str.charCodeAt(i).toString(16);
    	if(hex.length == 1) {
    		hex = '0' + hex;
    	}
		hexStr += hex + ' ';
    }
    return hexStr.trim();
}

function _base64ToHexStr(base64) {
    var binary_string = window.atob(base64);
    var hexStr = '';
    
    for (var i = 0; i < binary_string.length; i++)        {
    	var hex = binary_string.charCodeAt(i).toString(16);
    	if(hex.length == 1) {
    		hex = '0' + hex;
    	}
		hexStr += hex + ' ';
    }
    return hexStr.trim();
}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


String.prototype.convertToHex = function (delim) {
    return this.split("").map(function(c) {
        return ("0" + c.charCodeAt(0).toString(16)).toUpperCase().slice(-2);
    }).join(delim || "");
};


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

function reverseEndian(target, currEndianStatus, clipBrd, size) {
	var isBigEndian = (currEndianStatus.text().indexOf("Big") == -1 ? false : true);
	var isLittleEndian = (currEndianStatus.text().indexOf("Little") == -1 ? false : true);
		
	//make byte array
	var appEuiValue = target.val();
	appEuiValue = appEuiValue.replace(/ /gi, "");
	
	var bArray = new Array();
	for(var i = 0; i < size; i++) {
		bArray[i] = appEuiValue.substring(i*2, (i*2)+2);	
	}
	
	var rArray = bArray.reverse();
	var rAppEui = ''; 
	for(var i = 0; i < size; i++) {
		rAppEui += rArray[i];
	}
	
	target.val(hexFormat(rAppEui));
	clipBrd.attr("data-clipboard-text", rAppEui);
		
	var currentEndianTxt = "";
	if(isBigEndian) {
		currentEndianTxt = "Little-Endian";
	} 
	else if(isLittleEndian) {
		currentEndianTxt = "Big-Endian";
	}
	else {
		currentEndianTxt = "unknown";
	}
	$('span:first', currEndianStatus).text(currentEndianTxt);
}

module.exports._base64ToHexStr = _base64ToHexStr;