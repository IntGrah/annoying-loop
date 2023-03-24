function offbeat() {
    trigger(randEl(chord) + 36, 1.5, 1, 0.25);
    trigger(randEl(chord) + 36, 1.5, 2, 0.25);
    trigger(randEl(chord) + 36, 1.25, 3, 0.25);
}

function rain1() {
    trigger(chord[3] + 24, 1.5, 0.5, 0.3);
    trigger(chord[2] + 24, 1.5, 1.25, 0.3);
    trigger(chord[1] + 24, 1.5, 2, 0.3);
    trigger(chord[1] + 24, 1.5, 2.75, 0.3);
}

function rain2() {
    trigger(chord[3] + 36, 0.25, 0.5, 0.3);
    trigger(chord[3] + 36, 1, 0.75, 0.3);
    trigger(chord[2] + 36, 0.25, 1.25, 0.3);
    trigger(chord[2] + 36, 1, 1.5, 0.3);
    trigger(chord[1] + 36, 0.25, 2, 0.3);
    trigger(chord[1] + 36, 1, 2.25, 0.3);
    trigger(chord[1] + 36, 1.5, 2.75, 0.3);
}

function noise(n) {
    Array(n).fill(chord).flat().forEach(note => trigger(note + 24, 0.3, 0.25 * randInt(0, 16), 0.4))
}

function middle() {
    const mapped = chord.map(n => n + 12);
    trigger(mapped, 0.4, 0, 0.2); trigger(mapped, 0.4, 0.5, 0.2);
    trigger(mapped, 0.3, 1.25, 0.2); trigger(mapped, 0.3, 1.75, 0.2);
    trigger(mapped, 0.5, 2.5, 0.2);
    trigger(mapped, 0.5, 3.25, 0.2);
}

function bass(end = true) {
    trigger(0, 1, 0); trigger(7, 0.25, 0.75);
    trigger(12, 1, 1); trigger(7, 0.25, 1.75);
    trigger(0, 1, 2); trigger(7, 0.25, 2.75);
    trigger(12, 0.5, 3); if (end) { trigger(7, 0.25, 3.5); trigger(0, 0.25, 3.75); } else { trigger(7, 0.5, 3.5); }
}
