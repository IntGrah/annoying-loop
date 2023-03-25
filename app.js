function filler() {
    tonic = randTonic(); chord = randChord();
    if (coin()) highNotes();
    const modulate1 = coin();
    noise(randInt(3, 5));
    middle(); bass(modulate1); progress(4);

    if (modulate1) tonic = randTonic();
    chord = randChord();
    highNotes();
    noise(randInt(3, 7)); middle(); bass(); progress(4);

    tonic = randTonic(); chord = randChord();
    if (coin()) highNotes();
    const modulate2 = coin();
    noise(randInt(3, 5));
    middle(); bass(modulate2); progress(4);

    if (modulate2) tonic = randTonic();
    chord = randChord();
    if (coin()) highNotes(); else echoRain();
    noise(randInt(3, 7)); middle(); bass(); progress(4);
}

const syncopation = [
    [0, 0.75],
    [0.25, 0.75],
    [0, 0.25, 0.75],
    [0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75]
];

const bebop = [
    [0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
    [0, 0.25, 0.5, 0.75],
];

const arpeggiaic = [-2, -2, -2, -1, 1, 2, 2, 2];
const scalic = [-2, -1, -1, -1, -1, 1, 1, 1, 1, 2];

const Scale = new Map();
Scale.set(Chord.Major7th, [7, 9, 11, 12, 14, 16, 17, 19, 21, 23]);
Scale.set(Chord.Minor9th, [7, 8, 10, 12, 14, 15, 17, 19, 20, 22]);
Scale.set(Chord.Major9th, [7, 9, 11, 12, 14, 16, 18, 19, 21, 23]);
Scale.set(Chord.Dominant9th, [7, 9, 10, 12, 14, 16, 17, 19, 21, 22]);
Scale.set(Chord.Minor11th, [7, 9, 10, 12, 14, 16, 17, 19, 21, 22]);
Scale.set(Chord.Major11th, [7, 9, 11, 12, 14, 16, 18, 19, 21, 23]);

function improv() {
    const rhythm = randEl([bebop, syncopation]);
    let index = randInt(0, 10);
    const move = contour => index = randEl(contour.map(n => n + index).filter(n => 0 <= n && n < 10));
    for (let n = 0; n < 4; ++n) {
        if (coin()) tonic = randTonic();
        chord = randChord();
        const notes = Scale.get(chord);
        for (let i = 0; i < 4; ++i) {
            const contour = randEl([arpeggiaic, scalic]);
            for (const t of randEl(rhythm)) {
                trigger(notes[move(contour)] + 24, 0.25, i + t);
            }
        }
        if (n % 2 === 1 && echoRain());
        middle(); bass(true); progress(4);
    }
}
