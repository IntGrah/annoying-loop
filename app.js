let time;
let tonic;
let chord;
const beat = 0.5;
let started = false;

function jazz() {
    if (started === true) return;
    started = true;
    Tone.start();
    time = Tone.now() + 1;
    tonic = 38; chord = Chord.Minor9th;
    middle(); bass(false); progress(4);
    middle(); bass(); progress(4);
    tonic = 36; chord = Chord.Dominant9th;
    middle(); bass(); progress(4);
    tonic = 39; chord = Chord.Minor9th;
    middle(); bass(); progress(4);

    for (let i = 0; i < 12; ++i) {
        if (coin()) {
            if (coin()) {
                fourBarFiller();
                fourBarFiller();
                fourBarImprov();
                fourBarFiller();
            } else {
                fourBarFiller();
                fourBarScaleMelody();
                fourBarImprov();
                fourBarBassSolo();

                if (coin()) {
                    fourBarFiller();
                    fourBarTheLick();
                    fourBarImprov();
                    fourBarTrillLick();
                }
            }
        }

        fourBarFiller();
        fourBarRiteOfSpring();
        fourBarFiller();
        fourBarImprov();

        fourBarFiller();
        fourBarScaleMelody();
        fourBarImprov();
        fourBarFiller();

        fourBarTrillLick();
        fourBarFiller();
        fourBarArpeggioLick();
        fourBarFiller();

        if (coin()) {
            fourBarArpeggioMelody();
            fourBarFiller();
            fourBarRiteOfSpring();
            fourBarFiller();
        } else {
            fourBarBassSolo();
            fourBarImprov();
            fourBarScaleMelody();
            fourBarFiller();

            if (coin()) {
                fourBarImprov();
                fourBarFiller();
                fourBarImprov();
                fourBarArpeggioLick();

                fourBarTheLick();
                fourBarTrillLick();
                fourBarRickRoll();
                fourBarBassSolo();
            } else {
                fourBarImprov();
                fourBarScaleMelody();
                fourBarArpeggioMelody();
                fourBarRiteOfSpring();
            }
        }

        fourBarFiller();
        fourBarTheLick();
        fourBarTrillLick();
        fourBarScaleMelody();

        if (coin()) {
            fourBarFiller();
            fourBarImprov();
            fourBarFiller();
            fourBarArpeggioMelody();

            fourBarTheLick();
            fourBarFiller();
            fourBarBassSolo();
            fourBarImprov();
        }

        if (coin()) {
            fourBarImprov();
            fourBarFiller();
            fourBarScaleMelody();
            fourBarTrillLick();

            fourBarFiller();
            fourBarArpeggioLick();
            fourBarImprov();
            fourBarArpeggioLick();
        }

        fourBarTheLick();
        fourBarImprov();
        fourBarFiller();
        fourBarBassSolo();

        fourBarImprov();
        fourBarFiller();
        fourBarImprov();
        fourBarArpeggioLick();

        if (coin()) {
            fourBarFiller();
            fourBarArpeggioMelody();
            fourBarFiller();
            fourBarRickRoll();

            if (coin()) {
                fourBarArpeggioMelody();
                fourBarTheLick();
                fourBarFiller();
                fourBarRiteOfSpring();
            }
        }

        fourBarImprov();
        fourBarTheLick();
        fourBarArpeggioMelody();
        fourBarImprov();

        fourBarTrillLick();
        fourBarImprov();
        fourBarTheLick();
        fourBarFiller();

        fourBarFiller();
        fourBarTrillLick();
        fourBarFiller();
        fourBarArpeggioLick();

        if (coin()) {
            fourBarScaleMelody();
            fourBarFiller();
            fourBarArpeggioMelody();
            fourBarFiller();

            fourBarTheLick();
            fourBarRickRoll();
            fourBarTheLick();
            fourBarRiteOfSpring();
        }

        if (coin()) {
            fourBarFiller();
            fourBarImprov();
            fourBarFiller();
            fourBarRickRoll();

            fourBarRiteOfSpring();
            fourBarArpeggioLick();
            fourBarTheLick();
            fourBarFiller();
        }

        fourBarFiller();
        fourBarRiteOfSpring();
        fourBarFiller();
        fourBarArpeggioMelody();

        fourBarImprov();
        fourBarTrillLick();
        fourBarImprov();
        fourBarArpeggioLick();

        fourBarFiller();
        fourBarTheLick();
        fourBarTheLick();
        fourBarImprov();

        if (coin()) {
            fourBarImprov();
            fourBarImprov();
            fourBarImprov();
            fourBarImprov();
        }

        if (coin()) {
            fourBarFiller();
            fourBarArpeggioMelody();
            fourBarFiller();
            fourBarScaleMelody();

            fourBarFiller();
            fourBarArpeggioLick();
            fourBarTrillLick();
            fourBarImprov();
        }

        fourBarFiller();
        fourBarBassSolo();
        fourBarArpeggioMelody();
        fourBarTrillLick();

        if (coin()) {
            fourBarTheLick();
            fourBarTheLick();
            fourBarArpeggioMelody();
            fourBarScaleMelody();
        } else {
            fourBarScaleMelody();
            fourBarArpeggioMelody();
            fourBarTheLick();
            fourBarRickRoll();

            fourBarFiller();
            fourBarArpeggioLick();
            fourBarFiller();
            fourBarImprov();
        }

        fourBarFiller();
        fourBarImprov();
        fourBarFiller();
        fourBarArpeggioMelody();

        if (coin()) {
            fourBarArpeggioMelody();
            fourBarFiller();
            fourBarImprov();
            fourBarTrillLick();
        }

        fourBarBassSolo();
        fourBarScaleMelody();
        fourBarArpeggioLick();
        fourBarImprov();

        if (coin()) {
            fourBarRickRoll();
            fourBarTheLick();
            fourBarTrillLick();
            fourBarScaleMelody();

            fourBarFiller();
            fourBarArpeggioLick();
            fourBarImprov();
            fourBarImprov();
        }

        if (coin()) {
            fourBarTrillLick();
            fourBarFiller();
            fourBarImprov();
            fourBarArpeggioLick();
        }

        fourBarArpeggioMelody();
        fourBarImprov();
        fourBarArpeggioLick();
        fourBarFiller();
    }
}

const button = document.getElementById("jazz");
button.onclick = () => {
    button.innerText = "Close tab to stop"
    Tone.loaded().then(jazz);
}
