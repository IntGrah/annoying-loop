import * as JSB from "../node_modules/jsb-js/dist/index.js";
const VF = Vex.Flow;

function convert(note: JSB.Note, part: JSB.Util.Part) {
    const vfNote = new VF.StaveNote({
        clef: part === "s" || part === "a" ? "treble" : "bass",
        keys: [`${note.getPitch().getTone().string().replace("x", "##")}/${note.getPitch().getOctave()}`],
        duration: {
            "0.25": "16",
            "0.5": "8",
            "0.75": "8",
            "1": "q",
            "1.5": "q",
            "2": "h",
            "3": "h",
            "4": "1"
        }[note.getDuration()] as string,
        stem_direction: part === "s" || part === "t" ? 1 : -1
    });
    if (note.getPitch().getTone().getAccidental() !== 0) {
        vfNote.addAccidental(0, new VF.Accidental(JSB.Tone.ACCIDENTALS[note.getPitch().getTone().getAccidental()].replace("x", "##")));
    }
    if ([0.75, 1.5, 3, 6].includes(note.getDuration())) {
        vfNote.addDot(0);
    }
    return vfNote;
}

const factory = new Vex.Flow.Factory({
    renderer: {
        elementId: "output",
    }
});

export default function renderOutput(piece: JSB.Piece, keyAccidentals: number) {
    let x = 10 * Math.abs(keyAccidentals);

    factory.getContext().clear();
    factory.getContext().resize(100000, 240);

    const bars = piece.getOutput();

    bars.forEach((event, i) => {
        const s = event.map(e => e.getS().getNotes().map(note => convert(note, "s"))).flat();
        const a = event.map(e => e.getA().getNotes().map(note => convert(note, "a"))).flat();
        const t = event.map(e => e.getT().getNotes().map(note => convert(note, "t"))).flat();
        const b = event.map(e => e.getB().getNotes().map(note => convert(note, "b"))).flat();

        let width = 60 * event.map(event => event.duration()).reduce((l, r) => l + r);

        if (i === 0) {
            width += 80;
        }

        const system = factory.System({
            x: x,
            y: 0,
            width: width,
            spaceBetweenStaves: 10
        });

        x += width;

        const score = factory.EasyScore();

        const vfKey = piece.getKey().getTonality() ? piece.getKey().getTone().string() : piece.getKey().degree(2).string();

        const vfTime = {
            time: {
                num_beats: event.map(event => event.duration()).reduce((l, r) => l + r),
                beat_value: 4,
            }
        };


        let upper = system.addStave({
            voices: [
                score.voice(s, vfTime).setStrict(false),
                score.voice(a, vfTime).setStrict(false)
            ]
        });

        let lower = system.addStave({
            voices: [
                score.voice(t, vfTime).setStrict(false),
                score.voice(b, vfTime).setStrict(false)
            ]
        });

        if (i === 0) {
            upper.addClef("treble").addKeySignature(vfKey);
            lower.addClef("bass").addKeySignature(vfKey);
            system.addConnector("brace");
            system.addConnector("singleLeft");
        }

        system.addConnector(i === bars.length - 1 ? "boldDoubleRight" : "singleRight");

        factory.draw();
    });
    factory.getContext().resize(x + 40, 240);
}
