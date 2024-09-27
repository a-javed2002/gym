import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      // Set default voice if not already set
      if (!selectedVoice) {
        setSelectedVoice(allVoices[0]?.name || '');
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoice]);

  const speak = () => {
    if (!text || !selectedVoice) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Set the selected voice
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Set rate and pitch
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='content-body'>
      <h1>Text to Speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
      />
      <div>
        <label>
          Voice:
          <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Rate:
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min="0.5"
            max="2"
            step="0.1"
          />
        </label>
      </div>
      <div>
        <label>
          Pitch:
          <input
            type="number"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            min="0"
            max="2"
            step="0.1"
          />
        </label>
      </div>
      <button onClick={speak}>Speak</button>
    </div>
  );
};

export default TextToSpeech;
