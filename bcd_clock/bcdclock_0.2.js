/*
 * Javascript Binary-coded Decimal Clock
 * 
 * Author: Carlos Eugenio Torres 
 * E-mail: carloseugeniotorres@gmail.com
 * Site: http://www.carloseugeniotorres.com
 *
 * History:
 *
 * Version: 0.2
 * Date: June 13rd 2007
 * Code changed to implement classes like to be
 * interpreted by any browser.
 *
 * Version: 0.1
 * Date: April 3rd 2007
 * First version
 *
 */

// Detect if browser is Internet Explorer
var IE = document.all;

function BCDClock(container, digits)
{
	this.led_image_name_on = "../images/led-on.gif";
	this.led_image_name_off = "../images/led-off.gif";
	this.led_on = null;
	this.led_off = null;
	this.container = container;
	this.digits = digits;
}

BCDClock.prototype.load = function()
{
	this.led_on = new Image();
	this.led_off = new Image();
	this.led_on.src = this.led_image_name_on;
	this.led_off.src = this.led_image_name_off;

	this.buildClock();
	this.showDigits();
}

BCDClock.prototype.buildClock = function()
{
	if (this.container == null) return;

	var container = document.getElementById(this.container);
	var table = document.createElement("table");
	table.id = "table_binary_clock";
	table.setAttribute("border","0");
	table.setAttribute("cellspacing","2");
	table.setAttribute("cellpadding","0");
	table.setAttribute("align","center");
	table.style.border = "solid 1px #000000";

	var trTitle = document.createElement("tr");
	for (var t = 0; t < 6; t++)
	{
		var tdTitle = document.createElement("td");
		tdTitle.setAttribute("align","center");
		tdTitle.style.fontFamily = "Tahoma, Verdana, Arial";
		if (t < 2) tdTitle.innerHTML = "H";
		else if (t >= 2 && t < 4) tdTitle.innerHTML = "M";
		else tdTitle.innerHTML = "S";
		trTitle.appendChild(tdTitle);
	}
	table.appendChild(trTitle);

	for (var i = 0; i < 4; i++)
	{
		var tr = document.createElement("tr");
		for (var j = 0; j < 6; j++)
		{
			var td = document.createElement("td");
			if (j < 2) td.style.background = "#FDE6E2";
			else if (j >= 2 && j < 4) td.style.background = "#E7FFED";
			else td.style.background = "#E6E5FD";
			
			td.setAttribute("align","center");
			var led_off = document.createElement("img");
			led_off.src = this.led_off.src;
			led_off.setAttribute("title", "2^" + (3-i));
			led_off.setAttribute("align","absmiddle");
			led_off.id = "led_" + i + "_" + j;
			td.appendChild(led_off);
			tr.appendChild(td);
		}	
		table.appendChild(tr);
	}	

	container.appendChild(table);
	if (IE)
		container.innerHTML = table.outerHTML; 
}

BCDClock.prototype.setLed = function(row, col, status)
{
	var led = "led_" + row + "_" + col;
	led = document.getElementById(led);
	if (!led) return;
	led.src = status ? this.led_on.src : this.led_off.src;
}

BCDClock.prototype.setLedBin = function(ledCol, bin)
{
	bin = this.padZero(4, bin);
	for (var i = 0; i < 4; i++)
		this.setLed(i, ledCol, (bin.substr(i,1) == "1" ? true : false));
}

BCDClock.prototype.setHours = function(hours)
{
	this.setLedBin(0,this.toBinary(hours.substr(0,1)));
	this.setLedBin(1,this.toBinary(hours.substr(1,1)));		
}

BCDClock.prototype.setMinutes = function(minutes)
{
	this.setLedBin(2,this.toBinary(minutes.substr(0,1)));
	this.setLedBin(3,this.toBinary(minutes.substr(1,1)));		
}

BCDClock.prototype.setSeconds = function(seconds)
{
	this.setLedBin(4,this.toBinary(seconds.substr(0,1)));
	this.setLedBin(5,this.toBinary(seconds.substr(1,1)));		
}

BCDClock.prototype.showDigits = function(hours, minutes, seconds)
{
	if (!this.digits)
		return;
	var digits = document.getElementById(this.digits);
	digits.innerHTML = hours + ":" + minutes + ":" + seconds;
}

BCDClock.prototype.update = function(hours, minutes, seconds)
{
	hours = this.padZero(2, hours);
	minutes = this.padZero(2, minutes);
	seconds = this.padZero(2, seconds);
	this.setHours(hours);
	this.setMinutes(minutes);
	this.setSeconds(seconds);
	this.showDigits(hours, minutes, seconds);
}

BCDClock.prototype.padZero = function(length, value)
{
	var pad = "";
	for (i = 0; i < length; i++)
		pad += "0";
	value = pad + value;
	return value.substr(value.length - length);
}

BCDClock.prototype.toBinary = function(decimal)
{
	var dec = new Number(); 
	dec = decimal; 
	i = dec;
	var hit = "";
	while(i >= 1)
	{
		var m = (i * 10) / 4;
		while (m > 1) 
		{ 
			m -= 5; 
		}
		if (m < 0) 
		{ 
			i = (i-1) / 2; 
			hit += "1"; 
		} 
		else 
		{ 
			i = i / 2; 
			hit += "0"; 
		}		   
	}
	var bin = "";
	for ( a = hit.length; a >= 0; a--)
	   bin += hit.substr(a-1, a);

	return bin;
}

function updateClockExternal()
{
	var time = new Date();
	bcdClock.update(time.getHours(), time.getMinutes(), time.getSeconds());
	setTimeout("updateClockExternal()",1000);
}