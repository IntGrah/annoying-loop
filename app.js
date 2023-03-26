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
            randEl([melody1, melody2, riteOfSpring, theLick, bebop1, bebop4, bebop5, rickRoll])();
            filler();
            improv();

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
            theLick();
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
            theLick();

            filler();
            randEl([melody1, melody2, melody3])();
            improv();
            improv();

            filler();
            bebop1();
            randEl([bebop1, bebop2, bebop3, bebop4, bebop5])();
            melody2();

            filler();
            randEl([rickRoll, improv])();
            filler();
            bassSolo()
        } else {
            improv();
            melody3();
            bebop1();
            improv();

            riteOfSpring();
            bebop2();
            bebop5();
            theLick();

            filler();
            improv();
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
    randEl([melody3, riteOfSpring, theLick])();
    randEl([improv, bebop3])();
    improv();

    if (coin()) {
        randEl([filler, improv, bebop2])();
        filler();
        randEl([melody1, melody2, melody3, riteOfSpring])();
        filler();

        improv();
        randEl([bebop2, bebop3])();
        improv();
        bebop1();
    } else {
        filler();
        randEl([improv, bebop3])();
        improv();
        randEl([theLick, melody3, bebop4, bebop5])();

        improv();
        filler();
        randEl([rickRoll, bebop2, bebop4])();
        improv();
    }

    bebop1();
    improv();
    bebop2();
    filler();
}
