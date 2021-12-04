import { JSB, VF } from "./index.js";

function convert(note: JSB.Note, part: JSB.Util.Part) {
    const vfNote = new VF.StaveNote({
        clef: part === "s" || part === "a" ? "treble" : "bass",
        keys: [`${note.getPitch().getTone().string()}/${note.getPitch().getOctave()}`],
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
        vfNote.addAccidental(0, new VF.Accidental(JSB.Tone.ACCIDENTALS[note.getPitch().getTone().getAccidental()]));
    }
    if ([0.75, 1.5, 3].includes(note.getDuration())) {
        vfNote.addDot(0);
    }
    return vfNote;
}

const factory = new Vex.Flow.Factory({
    renderer: {
        elementId: "output",
    }
});

export default function render(piece: JSB.Piece) {
    if (!piece.getStatus()) {
        return;
    }
    let x = 40;

    factory.getContext().clear();
    factory.getContext().resize(100000, 240);

    const bars = piece.getOutput()

    for (let i = 0; i < bars.length; ++i) {
        const s = bars[i].map(e => e.getS().getNotes().map(note => convert(note, "s"))).flat();
        const a = bars[i].map(e => e.getA().getNotes().map(note => convert(note, "a"))).flat();
        const t = bars[i].map(e => e.getT().getNotes().map(note => convert(note, "t"))).flat();
        const b = bars[i].map(e => e.getB().getNotes().map(note => convert(note, "b"))).flat();

        let width = 60 * bars[i].map(event => event.getDuration()).reduce((l, r) => l + r);

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

        let upper = system.addStave({
            voices: [
                score.voice(s, {}).setStrict(false),
                score.voice(a, {}).setStrict(false)
            ]
        });

        let lower = system.addStave({
            voices: [
                score.voice(t, {}).setStrict(false),
                score.voice(b, {}).setStrict(false)
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
    }
    factory.getContext().resize(x + 40, 240);
}
