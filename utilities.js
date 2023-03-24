const synth = new Tone.PolySynth(Tone.Synth).toDestination(); synth.maxPolyphony = 1000;
const Chord = {
    Major7th: [7, 11, 12, 16],
    Minor9th: [3, 7, 10, 14],
    Major9th: [4, 7, 11, 14],
    Dominant9th: [4, 7, 10, 14],
    Minor11th: [7, 10, 14, 17],
    Major11th: [7, 11, 14, 18]
}

let i = 0;
function trigger(n, d, t, v = 1) {
    i++;
    const notes = typeof n === "number" ? freq(n + tonic) : n.map(note => freq(note + tonic));
    synth.triggerAttackRelease(notes, d * beat, time + t * beat, v);
}

const coin = () => Math.random() < 0.5;
const randInt = (min, max) => Math.floor((max - min) * Math.random()) + min;
const randEl = arr => arr[randInt(0, arr.length)];
const randTonic = (min = 36, max = 47) => randEl([-4, -3, -2, -1, 1, 2, 3, 4].map(n => n + tonic).filter(n => min <= n && n <= max));
const randChord = () => randEl(Object.values(Chord));
const freq = note => 440 * 2 ** ((note - 69) / 12);
const progress = beats => time += beats * beat;
