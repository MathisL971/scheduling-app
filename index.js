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
  var scheduleType;
  var schedule;
  if (document.getElementById('scheduleType').value == "days-of-the-week") {
    schedule = getCheckboxValues();
    scheduleType = "days-of-the-week";
  } else if (document.getElementById('scheduleType').value == "specific-date") {
    schedule = document.getElementById("specificDate").value;
    scheduleType = "specific-date";
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
    scheduleType: scheduleType,
    schedule: schedule,
    hourLow: hourLow,
    hourHigh: hourHigh,
    duration: duration,
    minParticipant: minParticipant,
    maxParticipant: maxParticipant,
    participants: []
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

  if (getEvent() != -1) {
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

  var event = getEvent();

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

function getEvent() {

  var id = JSON.parse(localStorage.getItem("currentEventID"));

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

  var event  = getEvent();

  var days = event.schedule;

  if (days.length > 1) {
    if (days.indexOf(document.getElementById("dashboardDate").innerHTML) < days.length - 1) {
      document.getElementById("dashboardDate").innerHTML = days[days.indexOf(document.getElementById("dashboardDate").innerHTML) + 1];
    } else {
      document.getElementById("dashboardDate").innerHTML = days[0];
    }
  }
  
} 

function getPreviousDay() {
  var event  = getEvent();

  var days = event.schedule;

  if (days.length > 1) {
    if (days.indexOf(document.getElementById("dashboardDate").innerHTML) > 0) {
      document.getElementById("dashboardDate").innerHTML = days[days.indexOf(document.getElementById("dashboardDate").innerHTML) - 1];
    } else {
      document.getElementById("dashboardDate").innerHTML = days[days.length - 1];
    }
  }
}


function populateMemberRegistration() {

  var event = getEvent();

  // If schedule type is single day  
  if (event.scheduleType == "specific-date") 
  {
    document.getElementById("dailyAvailabilitiesContainer").innerHTML += '<div class="day" id="day"><div class="availabilitySlotContainer"><div id="availabilitySlot" class="availability-time"><input type="time" id="from" name="after" min="09:00" max="00:00" required=""><p>to</p><input type="time" id="to" name="after" min="00:00" max="00:00" required=""><img onclick="deleteSlot(this)" src="images/trash-black.png" alt="bin-icon"></div></div><div onclick="addSlot(this)" class="add-a-slot"><img src="images/+iconv2.png" alt="+icon"><p>Add a slot</p></div></div>';
  }
  // Else
  else if (event.scheduleType == "days-of-the-week")
  {
    var defaultDayNumber = 0;
    localStorage.setItem("lastDayNumber", JSON.stringify(defaultDayNumber));
    
    var days  = getEvent().schedule;
    var dayOptions = "";
    for (var i = 0; i < days.length; i++) {
      dayOptions += '<option value="select">' + days[i] + '</option>';
    }

    document.getElementById("dailyAvailabilitiesContainer").insertAdjacentHTML("beforeend", '<div class="day" id="day' + defaultDayNumber + '"><div class="availability-day"><select class="" name=""><option value="select">Select the day</option>' + dayOptions + '</select><img onclick="deleteDay(this)" src="images/trash-red.png" alt="red-bin-icon"></div><div class="availabilitySlotContainer"><div id="availabilitySlot" class="availability-time"><input type="time" id="from" name="after" min="09:00" max="00:00" required=""><p>to</p><input type="time" id="to" name="after" min="00:00" max="00:00" required=""><img onclick="deleteSlot(this)" src="images/trash-black.png" alt="bin-icon"></div></div><div onclick="addSlot(this)" class="add-a-slot"><img src="images/+iconv2.png" alt="+icon"><p>Add a slot</p></div></div>');

    document.getElementById("dailyAvailabilitiesContainer").insertAdjacentHTML("afterend", '<div class="add-a-day"><img onclick="addDay()" src="images/+iconv2.png" alt="+icon"><p>Add a day</p></div>');
  }
}

function addDay() {
  document.getElementById("dailyAvailabilitiesContainer").insertAdjacentHTML("beforeend", '<div class="day" id="day"><div class="availability-day"><select class="" name=""><option value="select">Select the day</option></select><img onclick="deleteDay(this)" src="images/trash-red.png" alt="red-bin-icon"></div><div class="availabilitySlotContainer"><div id="availabilitySlot" class="availability-time"><input type="time" id="from" name="after" min="09:00" max="00:00" required=""><p>to</p><input type="time" id="to" name="after" min="00:00" max="00:00" required=""><img onclick="deleteSlot(this)" src="images/trash-black.png" alt="bin-icon"></div></div><div onclick="addSlot(this)" class="add-a-slot"><img src="images/+iconv2.png" alt="+icon"><p>Add a slot</p></div></div>');
}

function deleteDay(e) {
  e.parentNode.parentNode.remove();
}

function addSlot(e) {
  e.previousSibling.insertAdjacentHTML("afterend", '<div id="availabilitySlot" class="availability-time"><input type="time" id="from" name="after" min="09:00" max="00:00" required=""><p>to</p><input type="time" id="to" name="after" min="00:00" max="00:00" required=""><img onclick="deleteSlot(this)" src="images/trash-black.png" alt="bin-icon"></div>');
}

function deleteSlot(e) {
  e.parentNode.remove();
}

function createParticipant() {
  // Get name of the participant
  var firstName = document.getElementById("fname").value;
  var lastName = document.getElementById("lname").value;
  var password = document.getElementById("pword").value;

  const participant = {
    participantId: null,
    firstName: firstName,
    lastName: lastName,
    password: password,
    scheduleType: null,
    availabilities: null
  }

  var event = getEvent();

  if (event.participants.length == 0) {
    participant.participantId = 0;
  } else {
    participant.participantId = event.participants[event.participants.length - 1].participantId + 1;
  }

  if (event.scheduleType == "specific-date") 
  {
    participant.scheduleType = "specific-date";

    var availabilities = [];

    var slots = document.getElementsByClassName("availability-time");
    for (var i = 0; i < slots.length; i++) {
      var availability = []
      availability.push(slots[i].children[0].value);
      availability.push(slots[i].children[2].value);
      availabilities.push(availability);
    }
    participant.availabilities = availabilities;
  }
  // Else
  else if (event.scheduleType == "days-of-the-week")
  {
    participant.scheduleType = "days-of-the-week";

    var availabilities = {};


    participant.availabilities = availabilities;

  }


  // Add participants to event
  var events = JSON.parse(localStorage.getItem("events"));
  var event = getEvent();
  event.participants.push(participant);

  // Add updated event to events list
  for (var i = 0; i < events.length; i++) {
    if (events[i].eventID == event.eventID) {
      events[i] = event;
    }
  }
  
  // Update local storage variable with updated events list
  localStorage.setItem("events", JSON.stringify(events));

  // Navigate to dashboard
  window.location.href = "dashboard.html";
}