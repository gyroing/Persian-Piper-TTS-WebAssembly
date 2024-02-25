let tts = null;
let audioCtx = null;

Module = {};
Module.onRuntimeInitialized = function() {
  console.log('Model files downloaded!');
  console.log('Initializing tts ......');
  tts = initSherpaOnnxOfflineTts()
  if (tts.numSpeakers < 1) {
    console.log('No Speaker_ID found..');
  }
  textP.disabled = false;
  console.log('TTS Initialized.');
};

const speak = function(text) {
    text = text.trim();
    if (text.length == 0) {
        console.log('Please input a non-blank text');
        return;
    }

    let audio =
        tts.generate({text: text, sid: 0, speed: 1});

    console.log(audio.samples.length, audio.sampleRate);

    if (!audioCtx) {
      audioCtx = new AudioContext({sampleRate: tts.sampleRate});
    }

    const buffer = audioCtx.createBuffer(1, audio.samples.length, tts.sampleRate);

    const ptr = buffer.getChannelData(0);
    for (let i = 0; i < audio.samples.length; i++) {
      ptr[i] = audio.samples[i];
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
    
};
playTTS.onclick = function() {
  speak(textP.value);  
};
