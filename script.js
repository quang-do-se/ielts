var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

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

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }

  for (let i = 0; i < 10; i++) {
    phrase = dict[Math.floor(Math.random() * dict.length)];

    var utterThis = new SpeechSynthesisUtterance(phrase);

    utterThis.onend = function (event) {
      console.log('SpeechSynthesisUtterance.onend');
    }

    utterThis.onerror = function (event) {
      console.error('SpeechSynthesisUtterance.onerror');
    }

    utterThis.voice = voices[Math.floor(Math.random() * voices.length)];

    console.log("Phrase: '" + phrase + "'. Using voice: " + utterThis.voice.name + ", " + utterThis.voice.lang);

    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();
}
