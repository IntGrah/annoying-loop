const synth = new Tone.PolySynth(Tone.Synth).toDestination(); synth.maxPolyphony = 1000;

function modulate() {
    tonic = randEl([-4, -3, -2, -1, 1, 2, 3, 4].map(n => n + tonic).filter(n => 36 <= n && n <= 47));
    chord = randEl(Object.values(Chord));
}
function trigger(n, d, t, v = 1) {
    const notes = typeof n === "number" ? freq(n + tonic) : n.map(note => freq(note + tonic));
    synth.triggerAttackRelease(notes, d * beat, time + t * beat, v);
}

const coin = () => Math.random() < 0.5;
const randInt = (min, max) => Math.floor((max - min) * Math.random()) + min;
const randEl = arr => arr[randInt(0, arr.length)];
const freq = note => 440 * 2 ** ((note - 69) / 12);
const progress = beats => time += beats * beat;
