
function tz_seconds_to_offset(seconds) {
  var hours = zero_pad(Math.floor(Math.abs(seconds / 60 / 60)));
  var minutes = zero_pad(Math.floor(Math.abs(seconds) / 60) % 60);
  return (seconds < 0 ? '-' : '+') + hours + ":" + minutes;
}

function tz_minutes_to_offset(minutes) {
  var hours = zero_pad(Math.floor(Math.abs(minutes / 60)));
  var min = zero_pad(Math.abs(minutes) % 60);
  return (minutes < 0 ? '-' : '+') + hours + ":" + min;
}

function tz_offset_to_minutes(offset) {
  var match = offset.match(/([+-])(\d\d):?(\d\d)/);
  var minutes = parseInt(match[3]);
  minutes = minutes + (parseInt(match[2] * 60));
  if(match[1] == '-') {
    minutes = minutes * -1;
  }
  return minutes;
}

function zero_pad(num) {
  num = "" + num;
  if(num.length == 1) {
    num = "0" + num;
  }
  return num;
}

function dateToYMD(d) {
  return d.getFullYear()+"-"+zero_pad(d.getMonth()+1)+"-"+zero_pad(d.getDate());
}

function dateToUTCYMD(d) {
  return d.getUTCFullYear()+"-"+zero_pad(d.getUTCMonth()+1)+"-"+zero_pad(d.getUTCDate());
}

function dateToUTCHM(d) {
  return d.getUTCHours()+":"+zero_pad(d.getUTCMinutes());
}
