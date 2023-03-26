function riteOfSpring() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic();
        chord = Chord.Minor9th;
        trigger(46, 1, 0); trigger(45, 0.125, 0.75); trigger(46, 0.125, 0.875);
        trigger(45, 0.25, 1); trigger(41, 0.25, 1.25); trigger(38, 0.25, 1.75);
        trigger(45, 0.25, 2.25); trigger(43, 0.25, 2.75);
        trigger(41, 0.5, 3.25); trigger(39, 0.25, 3.75);
        middle(); bass(false); progress(4);
        chord = Chord.Major9th;
        const mapped = chord.map(n => n + 24)
        trigger(38, 4, 0);
        trigger(mapped, 0.2, 1, 0.5)
        trigger(mapped, 0.2, 1.25, 0.5)
        trigger(mapped, 0.2, 2.5, 0.5)
        trigger(mapped, 0.2, 2.75, 0.5)
        middle(); bass(false); progress(4);
    }
}

function theLick() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic();
        chord = Chord.Minor9th;
        trigger(36, 0.25, 0); trigger(38, 0.25, 0.25); trigger(39, 0.25, 0.5); trigger(41, 0.25, 0.75);
        trigger(38, 0.5, 1); trigger(34, 0.25, 1.5); trigger(36, 0.25, 1.75);
        trigger(34, 0.25, 2.25); trigger(33, 0.25, 2.75);
        trigger(31, 0.4, 3.25);
        middle(); bass(true); progress(4);

        trigger(29, 2, 0);
        if (coin()) noise(4); else echoRain();
        middle(); bass(true); progress(4);
    }
}

function bassSolo() {
    chord = Chord.Minor9th;
    for (let i = 0; i < 2; ++i) {
        trigger(0, 1, 0); trigger(7, 0.25, 0.75);
        trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
        trigger(5, 0.2, 2.25); trigger(7, 0.5, 2.75);
        trigger(2, 0.25, 3.25); trigger(3, 0.25, 3.5); trigger(5, 0.25, 3.75);
        if (i === 1) middle();
        progress(4);
        trigger(0, 1, 0); trigger(7, 0.25, 0.75);
        trigger(12, 0.25, 1); trigger(7, 0.2, 1.25); trigger(10, 0.2, 1.75);
        trigger(12, 0.2, 2.25); trigger(15, 0.25, 2.75);
        trigger(17, 0.25, 3); trigger(18, 0.25, 3.25); trigger(19, 0.5, 3.5);
        if (i === 1) middle();
        progress(4);
    }
}

function rickRoll() {
    tonic = randTonic(); chord = Chord.Major9th;
    noise(4); middle(); bass(false); progress(4);
    noise(4); middle(); bass(false); progress(4);

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
