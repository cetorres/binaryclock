/*
 * Javascript Binary-coded Decimal Clock
 * 
 * Author: Carlos Eugenio Torres 
 * E-mail: carloseugeniotorres@gmail.com
 * Site: http://www.carloseugeniotorres.com
 *
 * Version: 0.1
 * Date: April 3rd 2007
 *
 */

// Detect if browser is Internet Explorer
var IE = document.all;

var BCDClock =
{
	_led_image_name_on: "../images/led-on.gif",
	_led_image_name_off: "../images/led-off.gif",
	_led_on: null,
	_led_off: null,

	load: function(container)
	{
		this._led_on = new Image();
		this._led_off = new Image();
		this._led_on.src = this._led_image_name_on;
		this._led_off.src = this._led_image_name_off;

		this.buildClock(container);
	},

	buildClock: function(container)
	{
		if (container == null) return;

		container = document.getElementById(container);
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
				led_off.src = this._led_off.src;
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
	},

	setLed: function(row, col, status)
	{
		var led = "led_" + row + "_" + col;
		led = document.getElementById(led);
		if (!led) return;
		led.src = status ? this._led_on.src : this._led_off.src;
	},

	setLedBin: function(ledCol, bin)
	{
		bin = "0000" + bin;
		bin = bin.substr(bin.length-4);
		for (var i = 0; i < 4; i++)
			this.setLed(i, ledCol, (bin.substr(i,1) == "1" ? true : false));
	},

	setHours: function(hours)
	{
		hours = "00" + hours;
		hours = hours.substr(hours.length-2);
		this.setLedBin(0,this.toBinary(hours.substr(0,1)));
		this.setLedBin(1,this.toBinary(hours.substr(1,1)));		
	},

	setMinutes: function(minutes)
	{
		minutes = "00" + minutes;
		minutes = minutes.substr(minutes.length-2);
		this.setLedBin(2,this.toBinary(minutes.substr(0,1)));
		this.setLedBin(3,this.toBinary(minutes.substr(1,1)));		
	},

	setSeconds: function(seconds)
	{
		seconds = "00" + seconds;
		seconds = seconds.substr(seconds.length-2);
		this.setLedBin(4,this.toBinary(seconds.substr(0,1)));
		this.setLedBin(5,this.toBinary(seconds.substr(1,1)));		
	},

	toBinary: function(decimal)
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
}

function updateClock()
{
	var time = new Date()
	BCDClock.setHours(time.getHours());
	BCDClock.setMinutes(time.getMinutes());
	BCDClock.setSeconds(time.getSeconds());
	setTimeout("updateClock()",1000);
}

window.onload = updateClock;