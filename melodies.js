function melody1() {
    tonic = randTonic(); chord = Chord.Major9th;
    trigger(47, 4, 0); trigger(43, 2, 2.5); trigger(40, 1.75, 3.25);
    middle(); bass(false); progress(4);
    trigger(38, 3, 0); trigger(40, 1, 2.5); trigger(43, 0.5, 3); trigger(47, 1, 3.25);
    noise(3); middle(); bass(false); progress(4);
    trigger(45, 4, 0); trigger(43, 2, 3.25);
    middle(); bass(false); progress(4);
    trigger(42, 4, 0);
    noise(3); middle(); bass(); progress(4);
}

function melody2() {
    for (let i = 0; i < 2; ++i) {
        tonic = randTonic(); chord = Chord.Minor9th;
        trigger(50, 1, 0.5); trigger(48, 1, 1.25);
        trigger(46, 1, 2); trigger(45, 1, 2.75);
        trigger(43, 0.5, 3.25); trigger(41, 0.25, 3.75);
        middle(); bass(false); progress(4);
        trigger(39, 3, 0);
        if (coin()) twinkle(); else noise(5);
        middle(); bass(false); progress(4);
    }
}

function melody3() {
    tonic = randTonic(37, 42); chord = Chord.Major11th;
    trigger(54, 1.5, 0); trigger(55, 1, 1.25);
    trigger(54, 2, 2); trigger(50, 1, 2.75); trigger(48, 1, 3.5);
    noise(5);
    middle(); bass(false); progress(4);
    trigger(47, 2.5, 0.75);
    trigger(43, 0.25, 2, 0.4); trigger(43, 1, 2.125, 0.4);
    trigger(42, 0.25, 3, 0.4); trigger(42, 1, 3.125, 0.4);
    noise(3);
    middle(); bass(false); progress(4);
    tonic -= 2;
    trigger(42, 0.25, 0, 0.4); trigger(42, 1, 0.125, 0.4);
    trigger(54, 1, 1);
    trigger(52, 1, 2);
    trigger(50, 1, 2.75);
    trigger(48, 1, 3.5);
    noise(3);
    middle(); bass(false); progress(4);
    trigger(47, 3, 0.25);
    echoRain(); noise(5);
    middle(); bass(false); progress(4);
}
