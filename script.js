var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var newButton = document.querySelector('#new-button');
var repeatButton = document.querySelector('#repeat-button');

var showResultButton = document.querySelector('#show-result-button');
var resultTxt = document.querySelector('#result-txt');

var guessButton = document.querySelector('#guess-button');
var guessTxt = document.querySelector('#guess-txt');
var guessResult = document.querySelector('#guess-result');

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices()
    .filter(voice => voice.lang.match(/^en\-/))
    .sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
    });
}

populateVoiceList();

// Weird loading issue
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(phrases){
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }

  for (let i = 0; i < phrases.length; i++) {
    var utterThis = new SpeechSynthesisUtterance(phrases[i]);

    utterThis.onend = function (event) {
      console.log('SpeechSynthesisUtterance.onend');
    }

    utterThis.onerror = function (event) {
      console.error('SpeechSynthesisUtterance.onerror');
    }

    utterThis.voice = voices[Math.floor(Math.random() * voices.length)];

    console.log("Phrase: '" + phrases[i] + "'. Using voice: " + utterThis.voice.name + ", " + utterThis.voice.lang);

    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;

    synth.speak(utterThis);
  }
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

var phrases = [];
var result = '';

newButton.onclick = function(event) {
  event.preventDefault();

  // reset state
  guessTxt.value = '';
  resultTxt.value = '';
  showResultButton.innerText = 'Show result';
  showResult = false;
  
  phrases = [];
  result = '';
  
  for (let i = 0; i < 3; i++) {
    phrases[i] = dict[Math.floor(Math.random() * dict.length)];
    result += phrases[i] + "\n";
  }

  speak(phrases);
}

repeatButton.onclick = function(event) {
  event.preventDefault();

  speak(phrases);
}

guessButton.onclick = function(event) {
  event.preventDefault();

  if (guessTxt.value.replace(/[\n|\s]*$/mg, '').toLowerCase() === result.replace(/[\n|\s]*$/mg, '').toLowerCase()) {
    guessResult.innerText = 'Correct!';
  } else {
    guessResult.innerText = 'Wrong!';
  }
}


var showResult = false;

showResultButton.onclick = function(event) {
  event.preventDefault();

  if (showResult) {
    resultTxt.value = '';
    showResultButton.innerText = 'Show result';
  } else {
    resultTxt.value = result;
    showResultButton.innerText = 'Hide result';
  }

  showResult = !showResult;
}
