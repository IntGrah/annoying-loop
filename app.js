const beat = 0.5;
let start, time, tonic, chord;

document.getElementById("start").onclick = () => Tone.start().then(jazz);

let started = false;

function jazz() {
    if (started) return;
    started = true;
    start = Tone.now() + 1;
    time = 0;
    tonic = 38; chord = Chord.Minor9th;
    middle(); bass(false); progress(4);
    middle(); bass(); progress(4);
    tonic = 36; chord = Chord.Dominant9th;
    middle(); bass(); progress(4);
    tonic = 39; chord = Chord.Minor9th;
    middle(); bass(); progress(4);
    tonic = 38;
    filler();
    for (let i = 0; i < 24; ++i) setTimeout(cycle, i * 160000);
}

function cycle() {
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
            randEl([bassSolo])();
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
            filler();
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
