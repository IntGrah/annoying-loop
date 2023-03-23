function tune1() {
    modulate(); chord = Chord.Major9th;
    trigger(47, 4, 0); trigger(43, 2, 2.5); trigger(40, 1.75, 3.25);
    middle(); bass(false); progress(4);
    trigger(38, 3, 0); trigger(40, 1, 2.5); trigger(43, 0.5, 3); trigger(47, 1, 3.25);
    noise(3); middle(); bass(false); progress(4);
    trigger(45, 4, 0); trigger(43, 2, 3.25);
    middle(); bass(false); progress(4);
    trigger(42, 4, 0);
    noise(3); middle(); bass(); progress(4);
}

function tune2() {
    modulate(); chord = Chord.Minor9th;
    trigger(50, 1, 0.5); trigger(48, 1, 1.25);
    trigger(46, 1, 2); trigger(45, 1, 2.75);
    trigger(43, 0.5, 3.25); trigger(41, 0.25, 3.75);
    middle(); bass(false); progress(4);
    trigger(39, 3, 0);
    noise(6); middle(); bass(false); progress(4);
    modulate(); chord = Chord.Minor9th;
    trigger(50, 1, 0.5); trigger(48, 1, 1.25);
    trigger(46, 1, 2); trigger(45, 1, 2.75);
    trigger(43, 0.5, 3.25); trigger(41, 0.25, 3.75);
    middle(); bass(false); progress(4);
    trigger(39, 3, 0);
    noise(6); middle(); bass(false); progress(4);
}

function bebop() {
    modulate(); chord = Chord.Major11th;
    trigger(28, 0.25, 0.25); trigger(31, 0.25, 0.5); trigger(35, 0.25, 0.75);
    trigger(38, 0.25, 1); trigger(42, 0.25, 1.25); trigger(45, 0.25, 1.5); trigger(42, 0.25, 1.75);
    trigger(43, 0.25, 2); trigger(47, 0.25, 2.25); trigger(43, 0.25, 2.5); trigger(42, 0.25, 2.75);
    trigger(40, 0.25, 3); trigger(38, 0.25, 3.25); trigger(37, 0.25, 3.5); trigger(35, 0.25, 3.75);
    middle(); bass(false); progress(4);
    chord = Chord.Minor9th;
    trigger(34, 0.5, 0); trigger(46, 0.25, 0.75);
    trigger(43, 0.25, 1); trigger(39, 0.25, 1.25); trigger(38, 2, 1.75);
    trigger(chord.map(n => n + 36), 0.5, 3.25, 0.1);
    middle(); bass(false); progress(4);
}

function riteOfSpring() {
    modulate(); chord = Chord.Minor9th;
    trigger(46, 1, 0);
    trigger(45, 0.125, 0.75);
    trigger(46, 0.125, 0.875);
    trigger(45, 0.25, 1);
    trigger(41, 0.25, 1.25);
    trigger(38, 0.25, 1.75);
    trigger(45, 0.25, 2.25);
    trigger(43, 0.25, 2.75);
    trigger(41, 0.5, 3.25);
    trigger(39, 0.25, 3.75);
    middle(); bass(false); progress(4);
    chord = Chord.Major9th;
    const mapped = chord.map(n => n + 24)
    trigger(38, 4, 0);
    trigger(mapped, 0.2, 1)
    trigger(mapped, 0.2, 1.25)
    trigger(mapped, 0.2, 2.5)
    trigger(mapped, 0.2, 2.75)
    middle(); bass(false); progress(4);
}

function lick1() {
    modulate(); chord = Chord.Minor9th;
    trigger(36, 0.25, 0); trigger(38, 0.25, 0.25); trigger(39, 0.25, 0.5); trigger(41, 0.25, 0.75);
    trigger(38, 0.5, 1); trigger(34, 0.25, 1.5); trigger(36, 0.25, 1.75);
    trigger(34, 0.25, 2.25); trigger(33, 0.25, 2.75);
    trigger(31, 0.4, 3.25);
    middle(); bass(true); progress(4);

    trigger(29, 2, 0);
    noise(6); middle(); bass(true); progress(4);
}

function lick2() {
    modulate(); chord = Chord.Minor9th;
    trigger(36, 0.25, 0); trigger(38, 0.25, 0.25); trigger(39, 0.25, 0.5); trigger(41, 0.25, 0.75);
    trigger(38, 0.5, 1); trigger(34, 0.25, 1.5); trigger(36, 0.25, 1.75);
    trigger(34, 0.25, 2.25); trigger(33, 0.25, 2.75);
    trigger(31, 0.4, 3.25);
    middle(); bass(true); progress(4);

    trigger(29, 2, 0);
    rain2(); middle(); bass(true); progress(4);
}

function bassSolo() {
    modulate(); chord = Chord.Minor9th;
    trigger(0, 1, 0); trigger(7, 0.25, 0.75);
    trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
    trigger(5, 0.2, 2.25); trigger(7, 0.5, 2.75);
    trigger(2, 0.25, 3.25); trigger(3, 0.25, 3.5); trigger(5, 0.25, 3.75);
    progress(4);
    trigger(0, 1, 0); trigger(7, 0.25, 0.75);
    trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
    trigger(12, 0.2, 2.25); trigger(15, 0.25, 2.75);
    trigger(17, 0.25, 3); trigger(18, 0.25, 3.25); trigger(19, 0.5, 3.5);
    progress(4);
    middle();
    trigger(0, 1, 0); trigger(7, 0.25, 0.75);
    trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
    trigger(5, 0.2, 2.25); trigger(7, 0.5, 2.75);
    trigger(2, 0.25, 3.25); trigger(3, 0.25, 3.5); trigger(5, 0.25, 3.75);
    progress(4);
    middle();
    trigger(0, 1, 0); trigger(7, 0.25, 0.75);
    trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
    trigger(12, 0.2, 2.25); trigger(15, 0.25, 2.75);
    trigger(17, 0.25, 3); trigger(18, 0.25, 3.25); trigger(19, 0.5, 3.5);
    progress(4);
}

function rickRoll() {
    modulate(); chord = Chord.Major9th;
    noise(6); middle(); bass(false); progress(4);
    noise(6); middle(); bass(false); progress(4);

    trigger(31, 0.25, -1); trigger(33, 0.25, -0.75); trigger(36, 0.25, -0.5); trigger(33, 0.25, -0.25);
    trigger(40, 0.5, 0); trigger(40, 0.5, 0.75);
    trigger(38, 0.5, 1.5);
    middle(); bass(false); progress(4);

    chord = Chord.Major11th;
    trigger(31, 0.25, -1); trigger(33, 0.25, -0.75); trigger(36, 0.25, -0.5); trigger(33, 0.25, -0.25);
    trigger(38, 0.5, 0); trigger(38, 0.5, 0.75);
    trigger(36, 0.5, 1.5);
    trigger(35, 0.25, 2.25); trigger(33, 0.5, 2.5);
    middle(); bass(true); progress(4);
}

function improv() {
    modulate(); chord = Chord.Major11th;
    const notes = [19, 21, 23, 24, 26, 28, 30, 31, 33, 35];
    let i = randInt(0, 10);
    const move = () => i = randEl([-2, -1, 1, 2].map(n => n + i).filter(n => 0 <= n && n < 10));
    randEl(rhythms).forEach(t => trigger(notes[move()] + 12, 0.25, t));
    randEl(rhythms).forEach(t => trigger(notes[move()] + 12, 0.25, 1 + t));
    randEl(rhythms).forEach(t => trigger(notes[move()] + 12, 0.25, 2 + t));
    randEl(rhythms).forEach(t => trigger(notes[move()] + 12, 0.25, 3 + t));
    middle(); bass(true); progress(4);
}
