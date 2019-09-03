module.exports = function textToSpeech() {
  const availableVoices = window.speechSynthesis.getVoices();
  let spanishVoice = '';

  // find voice by language locale "es-MX"
  availableVoices.forEach((voice) => {
    if (voice.lang === 'es-MX') {
      spanishVoice = voice;
    }
  });
  // if not then select the first voice
  if (spanishVoice === '') spanishVoice = availableVoices[0];

  var utter = new SpeechSynthesisUtterance();
  utter.rate = 1;
  utter.pitch = 0.5;
  utter.text = '';
  utter.voice = spanishVoice;

  // event after text has been spoken
  /* utter.onend = function() {
    alert('Speech has finished');
  }; */

  window.speechSynthesis.speak(utter);
};
