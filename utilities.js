const synth = new Tone.PolySynth({ maxPolyphony: 100 }).toDestination();

const Chord = {
    Major7th: [7, 11, 12, 16],
    Minor9th: [3, 7, 10, 14],
    Major9th: [4, 7, 11, 14],
    Dominant9th: [4, 7, 10, 14],
    Minor11th: [7, 10, 14, 17],
    Major11th: [7, 11, 14, 18]
}

function trigger(n, d, t, v = 1) {
    const notes = [n].flat().map(note => Tone.Frequency(tonic + note, "midi").toFrequency());
    synth.triggerAttackRelease(notes, d * beat, start + time * beat + t * beat, v);
}

const coin = () => Math.random() < 0.5;
const randInt = (min, max) => Math.floor((max - min) * Math.random()) + min;
const randEl = arr => arr[randInt(0, arr.length)];
const randTonic = (min = 35, max = 46) => randEl([-4, -3, -2, -1, 1, 2, 3, 4].map(n => n + tonic).filter(n => min <= n && n <= max));
const randChord = () => randEl(Object.values(Chord));
const progress = beats => { time += beats; };
