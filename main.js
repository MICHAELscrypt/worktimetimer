
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let time_limit_url = urlParams.get('tw');
let time_break_url = urlParams.get('tb');
let soundToogle = urlParams.get('sound');

let TIME_LIMIT = 1500;  // 25min == 1500
let TIME_BREAK = 300;   // 5min == 300

const FULL_DASH_ARRAY = 283;

if (time_limit_url !== null && time_limit_url !== "") {
  TIME_LIMIT = parseInt(time_limit_url) * 60; }
if (time_break_url != null && time_break_url != "") {
  TIME_BREAK = parseInt(time_break_url) * 60; }

let timeLeft = TIME_LIMIT;
let timePassed = 0;
let timerInterval = null;
let remainingPathColor = "blue";

if (document.getElementById("startbutton") != null) {
  document.getElementById("startbutton").innerHTML = `
  <button class="offset-by-three columns six columns" onclick="startTimer(); removeButton(); addAudio();">start working</button>
  `;
}

if (document.getElementById("app") != null) {
  document.getElementById("app").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${remainingPathColor}"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
  `;
}


function removeButton() {
    document.getElementById("startbutton").innerHTML = ``;
    return false;
}

function removeBanner() {
  if (document.getElementById("banner") != null) {
    document.getElementById("banner").innerHTML = ``;
  }
  if (document.getElementById("url") != null) {
    document.getElementById("url").innerHTML = ``;
  }
}

function onTimesUp() {
  clearInterval(timerInterval);
}

function breakTimer() {

  onTimesUp();
  timePassed = 0;
  timeLeft = TIME_BREAK;
  setPathColor("break");

  document.getElementById("startbutton").innerHTML = `
    <button class="offset-by-three columns six columns" onclick=" removeButton(); removeBanner(); startTimer();">start working again</button>
  `;

  // if (document.getElementById("banner") != null) {
  //   document.getElementById("banner").innerHTML = `
  //     <h4>your ad here</h4>
  //   `;
  // }

  if (document.getElementById("url") != null) {
    document.getElementById("url").innerHTML = `
      <h4>https://25-5.xyz</h4>
    `;
  }

  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );

  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_BREAK - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray(TIME_BREAK);

    if (timeLeft === 0) {
      if (soundToogle != "off") {
        play();
      }
      onTimesUp();
      setPathColor("work");
    }
  }, 1000);
}

function startTimer() {
  onTimesUp();
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  setPathColor("work");
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray(TIME_LIMIT);

    if (timeLeft === 0) {
      if (soundToogle != "off") {
        play();
      }
      breakTimer();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setPathColor(color) {
  if (color === "work") {
    document
        .getElementById("base-timer-path-remaining")
        .classList.remove("green");
    document
        .getElementById("base-timer-path-remaining")
        .classList.add("blue");
  } else if (color === "break") {
    document
        .getElementById("base-timer-path-remaining")
        .classList.remove("blue");
    document
        .getElementById("base-timer-path-remaining")
        .classList.add("green");
  }
}

function calculateTimeFraction(timeLimit) {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray(timeLimit) {
  const circleDasharray = `${(
    calculateTimeFraction(timeLimit) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function addAudio() {
  this.sound = document.createElement("audio");
  this.sound.src = "/sounds/Metal Gong-SoundBible.com-1270479122.mp3";
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
