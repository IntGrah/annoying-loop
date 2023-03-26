function bebop1() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic(); chord = Chord.Major11th;
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
}

function bebop2() {
    for (let i = 0; i < 2; ++i) {
        if (i === 0) tonic = randTonic(38); else tonic -= 3;
        chord = Chord.Dominant9th;
        trigger(41, 0.25, 0.5); trigger(39, 0.25, 0.75);
        trigger(40, 0.25, 1); trigger(30, 0.25, 1.25, 0.6); trigger(31, 0.25, 1.5, 0.6); trigger(33, 0.25, 1.75, 0.7);
        trigger(34, 0.25, 2, 0.7); trigger(36, 0.25, 2.25, 0.8); trigger(38, 0.25, 2.5, 0.8); trigger(41, 0.25, 2.75, 0.9);
        trigger(45, 0.25, 3, 1); trigger(44, 0.25, 3.25); trigger(43, 0.25, 3.5, 0.9); trigger(42, 0.25, 3.75, 0.9);
        middle(); bass(false); progress(4);
        tonic += 1; chord = Chord.Major7th;
        trigger(40, 0.5, 0); trigger(38, 0.125, 0.25); trigger(40, 0.125, 0.375); trigger(38, 0.25, 0.50); trigger(36, 0.25, 0.75);
        trigger(35, 0.25, 1); trigger(33, 0.25, 1.25); trigger(31, 2, 1.75);
        trigger(52, 0.5, 2.25, 0.3); trigger(50, 0.125, 2.75, 0.3); trigger(48, 0.125, 2.85, 0.3); trigger(47, 0.5, 3, 0.3);

        middle(); bass(false); progress(4);
    }
}

function bebop3() {
    tonic = randTonic(37); chord = Chord.Minor9th;
    trigger(39, 0.125, 0.25); trigger(43, 0.125, 0.375); trigger(46, 0.25, 0.5); trigger(50, 0.25, 0.75);
    trigger(48, 0.25, 1); trigger(46, 0.25, 1.25); trigger(43, 0.25, 1.5); trigger(44, 0.25, 1.75);
    trigger(45, 0.25, 2); trigger(46, 0.25, 2.25); trigger(48, 0.25, 2.5); trigger(51, 0.25, 2.75);
    trigger(50, 0.25, 3); trigger(48, 0.125, 3.25); trigger(50, 0.125, 3.375); trigger(48, 0.25, 3.5); trigger(46, 0.25, 3.75);
    middle(); bass(false); progress(4);

    tonic -= 2; chord = Chord.Major7th;
    trigger(47, 0.25, 0); trigger(43, 0.25, 0.75);
    trigger(40, 0.25, 1.25); trigger(38, 0.25, 1.75);
    trigger(36, 1, 2);

    trigger(chord[3] + 36, 0.75, 2.25, 0.3);
    trigger(chord[2] + 36, 0.75, 2.5, 0.3);
    trigger(chord[1] + 36, 0.75, 2.75, 0.3);
    trigger(chord[0] + 36, 0.75, 3, 0.3);

    trigger(38, 0.25, 3.5); trigger(40, 0.25, 3.75);
    middle(); bass(false); progress(4);

    tonic += 2; chord = Chord.Minor9th;
    trigger(41, 0.25, 0); trigger(39, 0.125, 0.25); trigger(41, 0.125, 0.375); trigger(39, 0.25, 0.5); trigger(38, 0.25, 0.75);
    trigger(39, 0.25, 1); trigger(43, 0.25, 1.25); trigger(48, 0.25, 1.5); trigger(47, 0.25, 1.75);
    trigger(46, 0.25, 2); trigger(43, 0.25, 2.25, 0.8); trigger(39, 0.25, 2.5, 0.8); trigger(45, 0.25, 2.75);
    trigger(42, 0.25, 3, 0.8); trigger(38, 0.25, 3.25, 0.8); trigger(44, 0.25, 3.5); trigger(42, 0.25, 3.75);
    middle(); bass(false); progress(4);

    tonic += 1; chord = Chord.Major9th;
    trigger(40, 0.25, 0); trigger(38, 0.125, 0.25); trigger(40, 0.125, 0.375); trigger(38, 0.25, 0.5); trigger(36, 0.25, 0.75);
    trigger(35, 0.25, 1); trigger(33, 0.4, 1.25); trigger(31, 1.5, 1.75);
    echoRain();
    middle(); bass(false); progress(4);
}

function bebop4() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic();
        chord = Chord.Major7th;
        trigger(34, 0.25, 0.25); trigger(35, 0.25, 0.5); trigger(38, 0.25, 0.75);
        trigger(36, 0.25, 1); trigger(40, 0.25, 1.25); trigger(43, 0.25, 1.5); trigger(45, 0.25, 1.75);
        trigger(47, 0.25, 2); trigger(43, 0.25, 2.25); trigger(40, 0.25, 2.5); trigger(36, 0.25, 2.75);
        trigger(38, 0.25, 3); trigger(35, 0.25, 3.25); trigger(43, 0.25, 3.75);
        middle(); bass(true); progress(4);

        chord = Chord.Minor11th;
        trigger(41, 0.25, 0); trigger(40, 0.125, 0.25); trigger(41, 0.125, 0.375); trigger(40, 0.25, 0.5); trigger(40, 0.25, 0.75);
        trigger(38, 0.125, 1); trigger(40, 0.125, 1.125); trigger(38, 0.25, 1.25); trigger(36, 0.25, 1.5); trigger(34, 0.25, 1.75);
        trigger(33, 0.5, 2);

        noise(4);
        middle(); bass(true); progress(4);
    }
}

function bebop5() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic();
        chord = Chord.Minor9th;
        trigger(39, 0.25, 0); trigger(31, 0.25, 0.25); trigger(38, 0.5, 0.75);
        trigger(36, 0.25, 1.25); trigger(38, 0.25, 1.75);
        trigger(39, 0.25, 2); trigger(43, 0.25, 2.25); trigger(46, 0.25, 2.5); trigger(50, 0.25, 2.75);
        trigger(48, 0.25, 3); trigger(46, 0.25, 3.25); trigger(45, 0.25, 3.5); trigger(43, 0.25, 3.75);
        middle(); bass(true); progress(4);

        chord = Chord.Major11th;
        trigger(42, 0.75, 0); trigger(40, 0.125, 0.75); trigger(42, 0.125, 0.85);
        trigger(40, 0.25, 1); trigger(38, 0.25, 1.25); trigger(36, 0.5, 1.75);
        trigger(35, 1.5, 2.25);

        middle(); bass(true); progress(4);
    }
}

function bebop6() {
    tonic = randTonic(); chord = Chord.Minor9th;
    trigger(NaN, 0.25, 0); trigger(NaN, 0.25, 0.25); trigger(NaN, 0.25, 0.5); trigger(NaN, 0.25, 0.75);
    trigger(NaN, 0.25, 1); trigger(NaN, 0.25, 1.25); trigger(NaN, 0.25, 1.5); trigger(NaN, 0.25, 1.75);
    trigger(NaN, 0.25, 2); trigger(NaN, 0.25, 2.25); trigger(NaN, 0.25, 2.5); trigger(NaN, 0.25, 2.75);
    trigger(NaN, 0.25, 3); trigger(NaN, 0.25, 3.25); trigger(NaN, 0.25, 3.5); trigger(NaN, 0.25, 3.75);
    middle(); bass(false); progress(4);

    tonic += 1; chord = Chord.Major7th;
    trigger(NaN, 0.25, 0); trigger(NaN, 0.25, 0.25); trigger(NaN, 0.25, 0.5); trigger(NaN, 0.25, 0.75);
    trigger(NaN, 0.25, 1); trigger(NaN, 0.25, 1.25); trigger(NaN, 0.25, 1.5); trigger(NaN, 0.25, 1.75);
    trigger(NaN, 0.25, 2); trigger(NaN, 0.25, 2.25); trigger(NaN, 0.25, 2.5); trigger(NaN, 0.25, 2.75);
    trigger(NaN, 0.25, 3); trigger(NaN, 0.25, 3.25); trigger(NaN, 0.25, 3.5); trigger(NaN, 0.25, 3.75);
    middle(); bass(false); progress(4);
}

function __generalisedBebop__() {
    tonic = randTonic(); chord = Chord.Minor9th;
    trigger(NaN, 0.25, 0); trigger(NaN, 0.25, 0.25); trigger(NaN, 0.25, 0.5); trigger(NaN, 0.25, 0.75);
    trigger(NaN, 0.25, 1); trigger(NaN, 0.25, 1.25); trigger(NaN, 0.25, 1.5); trigger(NaN, 0.25, 1.75);
    trigger(NaN, 0.25, 2); trigger(NaN, 0.25, 2.25); trigger(NaN, 0.25, 2.5); trigger(NaN, 0.25, 2.75);
    trigger(NaN, 0.25, 3); trigger(NaN, 0.25, 3.25); trigger(NaN, 0.25, 3.5); trigger(NaN, 0.25, 3.75);
    middle(); bass(false); progress(4);

    tonic += 1; chord = Chord.Major7th;
    trigger(NaN, 0.25, 0); trigger(NaN, 0.25, 0.25); trigger(NaN, 0.25, 0.5); trigger(NaN, 0.25, 0.75);
    trigger(NaN, 0.25, 1); trigger(NaN, 0.25, 1.25); trigger(NaN, 0.25, 1.5); trigger(NaN, 0.25, 1.75);
    trigger(NaN, 0.25, 2); trigger(NaN, 0.25, 2.25); trigger(NaN, 0.25, 2.5); trigger(NaN, 0.25, 2.75);
    trigger(NaN, 0.25, 3); trigger(NaN, 0.25, 3.25); trigger(NaN, 0.25, 3.5); trigger(NaN, 0.25, 3.75);
    middle(); bass(false); progress(4);
}
