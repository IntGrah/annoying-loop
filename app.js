const beat = 0.5;
let startT, time, tonic, chord;

const button = document.getElementById("start");
button.onclick = () => {
    button.style.fontSize = "50px";
    button.innerHTML = "close tab to stop"
    Tone.start().then(start);
}

let started = false;

function start() {
    if (started) return;
    started = true;
    startT = Tone.now() + 1;
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
            randEl([melody3, riteOfSpring])();
            filler();

            improv();
            randEl([melody1, melody2, bebop4, bebop5, rickRoll])();
            filler();
            filler();

            randEl([bebop3, bebop4])();
            improv();
            bebop5();
            filler();

            melody1();
            improv();
            randEl([theLick, riteOfSpring])();
            filler();
        } else {
            filler();
            filler();
            randEl([filler, theLick])();
            randEl([melody1, melody2])();

            filler();
            bebop3();
            bebop2();
            improv();

            filler();
            randEl([melody1, melody2])();
            filler();
            randEl([melody1, melody2])();

            improv();
            randEl([bebop1, bebop2, bebop3, bebop4, bebop5])();
            filler();
            bassSolo();
        }
    } else {
        if (coin()) {
            filler();
            riteOfSpring();
            improv();
            filler();

            filler();
            randEl([melody1, melody2, melody3])();
            improv();
            filler();

            filler();
            bebop1();
            randEl([bebop2, bebop3, bebop4, bebop5])();
            melody2();

            filler();
            randEl([rickRoll, improv])();
            filler();
            bassSolo()
        } else {
            improv();
            melody3();
            bebop1();
            filler();

            riteOfSpring();
            bebop2();
            bebop5();
            theLick();

            filler();
        filler();
            randEl([melody1, melody2, bebop3, riteOfSpring, rickRoll])();
            improv();

            filler();
            randEl([melody1, melody2, theLick, rickRoll])();
            filler();
            bassSolo();
        }
    }

    filler();
    randEl([melody1, melody2, melody3, riteOfSpring, theLick, rickRoll])();
    improv();
    randEl([bebop4, bebop5])();

    filler();
    randEl([melody3, riteOfSpring])();
    bebop3();
    improv();

    if (coin()) {
        randEl([filler, improv, bebop2])();
        filler();
        randEl([melody1, melody2, melody3, riteOfSpring])();
        filler();

        filler();
        randEl([bebop2, bebop3])();
        improv();
        bebop1();
    } else {
        filler();
        randEl([improv, bebop3])();
        filler();
        randEl([theLick, melody3, bebop4, bebop5])();

        improv();
        filler();
        randEl([rickRoll, bebop2, bebop4])();
        improv();
    }

    randEl([bebop1, melody3])();
    improv();
    bebop2();
    filler();
}
