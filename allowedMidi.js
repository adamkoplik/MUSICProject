const fs = require('fs');
const path = require('path');

// Convert note name to MIDI number
const noteToSemitone = {
  "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4,
  "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9,
  "A#": 10, "B": 11
};

function noteNameToMidi(note) {
  const match = note.match(/^([A-G]#?)(-?\d)$/);
  if (!match) return null;
  const [, pitch, octave] = match;
  const semitone = noteToSemitone[pitch];
  if (semitone === undefined) return null;
  return semitone + (parseInt(octave, 10) + 1) * 12;
}

function getSampleMap(samplesDir) {
  const instrumentDirs = fs.readdirSync(samplesDir).filter(f =>
    fs.statSync(path.join(samplesDir, f)).isDirectory()
  );

  const instrumentMap = {};

  for (const inst of instrumentDirs) {
    const instPath = path.join(samplesDir, inst);
    const files = fs.readdirSync(instPath);
    const midiNotes = files
      .filter(f => f.endsWith(".ogg"))
      .map(f => path.basename(f, ".ogg"))
      .map(noteNameToMidi)
      .filter(midi => midi !== null)
      .sort((a, b) => a - b);

    instrumentMap[inst] = midiNotes;
  }

  return instrumentMap;
}

// Example usage
const map = getSampleMap("samples");
console.log(JSON.stringify(map, null, 2));
