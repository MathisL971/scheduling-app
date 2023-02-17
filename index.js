// Toggle Menu Button Script

const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

// Copy to clipboard Script

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}


// Save registration user input
function savePlayerInformation() {
  var playerInfo = {
    firstName: document.getElementsById('fname').value,
    lastName: document.getElementById('lname'),
    password: document.getElementById('pword')
  }
}

function getCheckboxValues() {
  var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var daysSelected = [];

  for (i = 0; i < days.length; i++) {
    if (document.getElementById(days[i]).checked) {
      daysSelected.push(days[i]);
    }
  }
  
  return daysSelected;
}

function generateEvent() {
  // Get name of the event
  var name = document.getElementById("name").value;
  // Get schedule type of the event
  var schedule;
  if (document.getElementById('scheduleType').value == "days-of-the-week") {
    schedule = getCheckboxValues();
  } else if (document.getElementById('scheduleType').value == "specific-date") {
    schedule = document.getElementById("specificDate").value;
  }
  // Get lower bound of event hour range
  var hourLow = document.getElementById('hourLow').value;
  // Get upper bound of event hour range
  var hourHigh = document.getElementById("hourHigh").value;
  // Get duration of event
  var duration = document.getElementById("duration").value;
  // Get min number of participants
  var minParticipant = document.getElementById("minParticipant").value;
  // Get max number of participants
  var maxParticipant = document.getElementById("maxParticipant").value;

  const event = {
    id: null,
    name: name,
    schedule: schedule,
    hourLow: hourLow,
    hourHigh: hourHigh,
    duration: duration,
    minParticipant: minParticipant,
    maxParticipant: maxParticipant
  }



  if (localStorage.getItem("events") != null) {
    var events = localStorage.getItem("events");
    var eventsArr = JSON.parse(events);
    var lastId = eventsArr[eventsArr.length - 1].id;
    event.id = lastId + 1;
    eventsArr.push(event);
    localStorage.setItem("events", JSON.stringify(eventsArr));
  } else {
    var eventsArr = [];
    event.id = 1;
    eventsArr.push(event);
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }

  localStorage.setItem("currentEventID", JSON.stringify(event.id));
  window.location.href = "dashboard.html";
}


function createParticipant() {
  // Get name of the participant
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var password = document.getElementById("password").value;

  var days = document.getElementsByClassName("day");
 
  console.log(days);

}

function displaySchedule() {
  var scheduleType = document.getElementById("scheduleType").value;
  if (scheduleType == "days-of-the-week") {
    document.getElementById("daysOfTheWeekContainer").style.display = "block";
    document.getElementById("specificDateContainer").style.display = "none";

  } else if (scheduleType == "specific-date") {
    document.getElementById("specificDateContainer").style.display = "block";
    document.getElementById("daysOfTheWeekContainer").style.display = "none";
  } else {
    document.getElementById("specificDateContainer").style.display = "none";
    document.getElementById("daysOfTheWeekContainer").style.display = "none";
  }
}

function visitEvent() {
  var eventID = document.getElementById("eventIdEventPage").value;

  if (getEvent(eventID) != -1) {
    document.getElementById("eventIdEventPage").value = "";
    localStorage.setItem("currentEventID", JSON.stringify(eventID));
    window.location.href = "dashboard.html";
  } else {
    alert("EventID " + eventID + " does not exist!")
  }
}

function populateDashboard() {
  var eventID = JSON.parse(localStorage.getItem("currentEventID"));
  document.getElementById("id-to-copy").innerHTML = eventID;
  document.getElementById("url-to-copy").innerHTML = "www.avail2ball.com/" + eventID;

  var event = getEvent(eventID);

  var days = event.schedule;
  if (typeof days == "string") {
    document.getElementById("dashboardDate").innerHTML = days;
    document.getElementById("previousDayButton").style.display = "none";
    document.getElementById("nextDayButton").style.display = "none";
  } else if (typeof days == "object") {
    document.getElementById("dashboardDate").innerHTML = days[0];
  } else {
    document.getElementById("dashboardDate").innerHTML = "UNDEFINED";
  }
}

function getEvent(id) {
  var events = JSON.parse(localStorage.getItem("events"));
  if (events != null) {
    for (i = 0; i < events.length; i++) {
      if (events[i].id == id) {
        return events[i];
      }
    }
  }
  return -1;
}


function getNextDay() {

  var event  = getEvent(JSON.parse(localStorage.getItem("currentEventID")));

  var days = event.schedule;
  if (days.length > 1) {
    for (i = 0; i < days.length; i++) {
      if (days[i] == document.getElementById("dashboardDate").innerHTML) {
        if (i < days.length - 1) {
          document.getElementById("dashboardDate").innerHTML = days[i + 1];
        } else {
          document.getElementById("dashboardDate").innerHTML = days[0];
        }
        break;
      }
    }
  }
} 

function getPreviousDay() {
  var event  = getEvent(JSON.parse(localStorage.getItem("currentEventID")));

  var days = event.schedule;
  if (days.length > 1) {
    for (i = 0; i < days.length; i++) {
      if (days[i] == document.getElementById("dashboardDate").innerHTML && i > 0) {
        document.getElementById("dashboardDate").innerHTML = days[i - 1];
      } else {
        document.getElementById("dashboardDate").innerHTML = days[days.length - 1];
      }
    }
  }
}

function addDay() {
  var content = document.getElementById("dailyAvailabilitiesContainer").innerHTML;
  content += '<div class="day"><div class="availability-day"><select class="" name=""><option value="select">Select the day</option><option value="monday">Monday</option><option value="wednesday">Wednesday</option><option value="saturday">Saturday</option><option value="sunday">Sunday</option></select><img onclick="deleteDay()" src="images/trash-red.png" alt="red-bin-icon"></div><div class="availability-time"><input type="time" id="from" name="after" min="09:00" max="00:00" required=""><p>to</p><input type="time" id="to" name="after" min="00:00" max="00:00" required=""><img src="images/trash-black.png" alt="bin-icon"></div><div class="add-a-slot"><img src="images/+iconv2.png" alt="+icon"><p>Add a slot</p></div></div>'
  document.getElementById("dailyAvailabilitiesContainer").innerHTML = content;
}

function deleteDay() {
  
}