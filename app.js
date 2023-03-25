const beat = 0.5;
let start, time, tonic, chord;

document.getElementById("start").onclick = () => Tone.start().then(jazz);

let started = false;

function jazz() {
    if (started) return;
    started = true;
    start = Tone.now() + 1;
    time = 0;
    tonic = randInt(37, 41); chord = Chord.Minor9th;
    middle(); bass(false); progress(4);
    middle(); bass(); progress(4);
    tonic -= 2; chord = Chord.Dominant9th;
    middle(); bass(); progress(4);
    tonic += 3; chord = Chord.Minor9th;
    middle(); bass(); progress(4);
    filler();
    for (let i = 0; i < 24; ++i) setTimeout(cycle, i * 160000);
}

function cycle() {
    improv();
    improv();
    if (coin()) {
        if (coin()) {
            filler();
            filler();
            improv();
            filler();

            improv();
            randEl([arpeggioMelody, scaleMelody, riteOfSpring, theLick, trillLick, arpeggioLick, rickRoll])();
            filler();
            improv();

            randEl([arpeggioLick, trillLick])();
            improv();
            randEl([theLick, riteOfSpring])();
            filler();
        } else {
            filler();
            theLick();
            randEl([filler, theLick])();
            randEl([arpeggioMelody, scaleMelody])();

            filler();
            randEl([arpeggioMelody, scaleMelody])();
            filler();
            randEl([arpeggioMelody, scaleMelody])();

            improv();
            filler();
            filler();
            bassSolo();
        }
    } else {
        if (coin()) {
            filler();
            riteOfSpring();
            improv();
            randEl([theLick, arpeggioLick, trillLick])();

            filler();
            randEl([arpeggioMelody, scaleMelody])();
            improv();
            improv();

            filler();
            randEl([rickRoll, improv])();
            improv();
            bassSolo()
        } else {
            improv();
            filler();
            improv();
            improv();

            filler();
            improv();
            randEl([arpeggioMelody, scaleMelody, riteOfSpring, theLick, trillLick, arpeggioLick, rickRoll])();
            improv();

            filler();
            randEl([arpeggioMelody, scaleMelody, riteOfSpring, theLick, trillLick, arpeggioLick, rickRoll])();
            filler();
            bassSolo();
        }
    }

    if (coin()) {
        filler();
        filler();
        randEl([arpeggioMelody, scaleMelody, riteOfSpring])();
        filler();

        improv();
        improv();
        improv();
        improv();
    } else {
        filler();
        improv();
        improv();
        randEl([theLick, trillLick, arpeggioLick])();

        improv();
        filler();
        randEl([rickRoll, trillLick])();
        improv();
    }
}
