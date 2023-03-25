const beat = 0.5;
let start, time, tonic, chord;

const button = document.getElementById("start");
button.onclick = () => {
    button.style.fontSize = "50px";
    button.innerHTML = "There! I started playing some jazz.<br><br>If you can't hear anything, then<br>maybe try turning up the volume.<br><br>If that doesn't work, then maybe your phone is just bad. Yikes.<br>Yes, that means you have to get your computer, don't be lazy.<br><br>Oh, by the way, if you want to turn this off,<br>first re-evaluate your life decisions,<br>and then close the website."
    Tone.start().then(jazz);
}

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
