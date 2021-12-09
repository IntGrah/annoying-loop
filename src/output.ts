// import { Piece, Tone, Util } from "jsb-js/dist";

const VF = Vex.Flow;

const factory = new Vex.Flow.Factory({
    renderer: {
        elementId: "output",
    }
});
const score = factory.EasyScore();

export default function renderOutput(piece: Piece) {
    let x = 40;

    factory.getContext().clear();
    factory.getContext().resize(100000, 240);

    const bars = piece.getOutput();

    for (let i = 0, width = 0; i < bars.length; ++i, x += width) {
        const event = bars[i];

        const vfNotes = (["s", "a", "t", "b"] as Util.Part[]).map(part => {
            const accidentals = Array(6).fill(piece.getKey().signature());
            const notes = event.map(e => e.getPart(part).getNotes()).flat();
            return notes.map(note => {
                const vfNote = new VF.StaveNote({
                    clef: part === "s" || part === "a" ? "treble" : "bass",
                    keys: [`${Tone.LETTERS[note.getPitch().getTone().getLetter()]}/${note.getPitch().getOctave()}`],
                    duration: {
                        "0.25": "16",
                        "0.5": "8",
                        "0.75": "8",
                        "1": "4",
                        "1.5": "4",
                        "2": "2",
                        "3": "2",
                        "4": "1",
                        "6": "1"
                    }[note.getDuration()] as string,
                    stem_direction: part === "s" || part === "t" ? 1 : -1
                });
                if (accidentals[note.getPitch().getOctave()][note.getPitch().getTone().getLetter()] !== note.getPitch().getTone().getAccidental()) {
                    accidentals[note.getPitch().getOctave()][note.getPitch().getTone().getLetter()] = note.getPitch().getTone().getAccidental();
                    vfNote.addAccidental(0, new VF.Accidental({ "-2": "bb", "-1": "b", "0": "n", "1": "#", "2": "##" }[note.getPitch().getTone().getAccidental()] as string));
                }
                if ([0.75, 1.5, 3, 6].includes(note.getDuration())) {
                    vfNote.addDot(0);
                }
                return vfNote;
            });
        });

        width = 40 * Math.max(...vfNotes.map(notes => notes.length));

        if (i === 0) {
            width += 40 + 20 * Math.abs(piece.getKey().accidentals());
        }

        const system = factory.System({ x: x, y: 0, width: width, spaceBetweenStaves: 10 });

        const vfKey = piece.getKey().getTonality() ? piece.getKey().getTone().string() : piece.getKey().degree(2).string();

        const vfTime = {
            time: {
                num_beats: event.map(event => event.duration()).reduce((l, r) => l + r),
                beat_value: 4,
            }
        };


        let upper = system.addStave({
            voices: [
                score.voice(vfNotes[0], vfTime).setStrict(false),
                score.voice(vfNotes[1], vfTime).setStrict(false)
            ]
        });

        let lower = system.addStave({
            voices: [
                score.voice(vfNotes[2], vfTime).setStrict(false),
                score.voice(vfNotes[3], vfTime).setStrict(false)
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
