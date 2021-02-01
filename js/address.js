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

var result = '';
var phrase = '';

function populateVoiceList() {
  voices = synth.getVoices()
    .filter(voice => voice.lang.match(/^en\-GB/) )
    .sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
    });
  console.log(synth.getVoices());
  console.log(voices);
}

populateVoiceList();

// Weird loading issue
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(phrase){
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }

  let voice = voices[Math.floor(Math.random() * voices.length)];

  var utterThis = new SpeechSynthesisUtterance(phrase);

  utterThis.onend = function (event) {
    console.log('SpeechSynthesisUtterance.onend');
  }

  utterThis.onerror = function (event) {
    console.error('SpeechSynthesisUtterance.onerror');
  }

  utterThis.voice = voice;

  console.log("Phrase: '" + phrase + "'. Using voice: " + utterThis.voice.name + ", " + utterThis.voice.lang);

  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;

  synth.speak(utterThis);
}

function generatePhrase() {
  let result = '';

  let address = '';

  thisStreetName = streetName[Math.floor(Math.random() * streetName.length)];
  thisStreetSuffix = streetSuffix[Math.floor(Math.random() * streetSuffix.length)];

  // let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXY0123456789';
  // let charactersLength = characters.length;

  // for ( var i = 0; i < 3; i++ ) {
  //   address += Math.floor(Math.random() * 10);
  // }

  // for ( var i = 0; i < 2; i++ ) {
  //   address += characters.charAt(Math.floor(Math.random() * charactersLength));
  // }
  thisStreetName = 'Cardinal Bourne';

  address += thisStreetName;
  // address += " " + thisStreetSuffix;
  result = address;

  addressBySpaces = thisStreetName.split(' ');
  address += ".\n Spelling: ";
  
  for (let i = 0; i < addressBySpaces.length; i++) {
    address += addressBySpaces[i].split('');
    if (i < addressBySpaces.length - 1) {
      address += ".\n space.\n";
    }
  }

  let phone = '';

  for (let i = 0; i < 3; i++) {
    phone += Math.floor(Math.random() * 10);
  }

  phone += ' ';

  for (let i = 0; i < 3; i++) {
    phone += Math.floor(Math.random() * 10);
  }

  phone += ' ';

  for (let i = 0; i < 4; i++) {
    phone += Math.floor(Math.random() * 10);
  }

  result += "\n" + phone;
  
  return {
    'phrase': address + ".\n Phone number: " + phone,
    'result': result
  };
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

newButton.onclick = function(event) {
  event.preventDefault();

  // reset state
  guessTxt.value = '';
  guessResult.innerText = '';

  resultTxt.value = '';
  showResultButton.innerText = 'Show result';
  showResult = false;

  generator = generatePhrase();

  phrase = generator['phrase'];
  result = generator['result'];
  
  speak(phrase);
}

repeatButton.onclick = function(event) {
  event.preventDefault();

  speak(phrase);
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
