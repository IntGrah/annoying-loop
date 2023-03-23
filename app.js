const rhythms = [[0, 0.75], [0, 0.25, 0.75], [0.25, 0.75], [0.25, 0.5, 0.75], [0, 0.25, 0.5, 0.75]];
const Chord = {
    Major7th: [7, 11, 12, 16],
    Minor9th: [3, 7, 10, 14],
    Major9th: [4, 7, 11, 14],
    Dominant9th: [4, 7, 10, 14],
    Minor11th: [7, 10, 14, 17],
    Major11th: [7, 11, 14, 18]
}

let time;
let tonic;
let chord;
const beat = 0.5;
let started = false;

function jazz() {
    if (started === true) return;
    started = true;
    Tone.start();
    time = Tone.now() + 0.5;
    tonic = 38; chord = Chord.Minor9th;
    middle(); bass(false); progress(4);
    middle(); bass(); progress(4);
    modulate(); middle(); bass(); progress(4);
    modulate(); middle(); bass(); progress(4);
    for (let i = 0; i < 10; ++i) {
        if (coin()) {
            filler1();
            filler2();
            improv(); improv(); improv(); improv();
            filler3();
            filler1();
            filler4();
            tune1();
            filler2();
            filler3();
            if (coin()) {
                filler4();
                bassSolo();
            }
        }
        filler1();
        filler2();
        tune2();
        improv(); improv();
        filler4();
        filler6();
        filler5();
        if (coin()) {
            riteOfSpring(); riteOfSpring();
            filler3();
            filler1();
        }
        filler1();
        filler3();
        filler4();
        lick1();
        lick1();
        filler6();
        filler4();
        tune2();
        filler5();
        filler1();
        if (coin()) {
            filler2();
            filler3();
            improv(); improv(); improv(); improv();
            filler1();
            filler1();
            filler6();
            filler4();
            bassSolo();
        }
        improv(); improv(); improv(); improv();
        filler2();
        filler2();
        if (coin()) {
            improv(); improv(); improv(); improv();
        }
        filler1();
        filler2();
        filler3();
        tune2();
        tune2();
        filler1();
        filler4();
        filler5();
        if (coin()) rickRoll();
        lick2();
        lick2();
        filler3();
        if (coin()) {
            filler1();
            improv(); improv(); improv(); improv();
            filler3();
            filler6();
        }
        filler2();
        filler4();
        filler1();
        tune2();
        tune2();
        filler1();
        filler4();
        improv(); improv(); improv(); improv();
        filler2();
        filler3();
        if (coin()) {
            lick2();
            lick2();
        }
        filler4();
        if (coin()) {
            filler4();
            improv(); improv(); improv(); improv();
            improv(); improv(); improv(); improv();
            filler1();
            rickRoll();
            filler2();
        }
        riteOfSpring(); riteOfSpring();
        filler1();
        filler4();
        if (coin()) tune1();
        filler4();
        lick1();
        lick1();
        improv(); improv(); improv(); improv();
        if (coin()) {
            filler4();
            bebop();
            filler4();
            bebop();
        }
        filler6();
        tune1();
        filler1();
        rickRoll();
        lick1();
        lick2();
        tune2();
        tune2();
        filler1();
        filler2();
        improv(); improv(); improv(); improv();
        improv(); improv(); improv(); improv();
        filler1();
        improv(); improv(); improv(); improv();
        improv(); improv(); improv(); improv();
        filler3();
        filler1();
    }
}

const button = document.getElementById("jazz");
button.onclick = () => {
    button.innerText = "Close tab to stop"
    Tone.loaded().then(jazz);
}
