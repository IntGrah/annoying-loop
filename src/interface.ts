import * as JSB from "jsb-js";
import renderOutput from "./output.js";

function renderInput(piece: JSB.Piece) {
    const barsHtml = piece.getInput().map((bar, barIndex) => {
        const eventsHtml = bar.map((event, eventIndex) => {
            const group = state.group();

            const sHtml = document.createElement("div");
            sHtml.setAttribute("class", "group".concat(event.getS() === group ? " selected" : ""));
            sHtml.appendChild(document.createTextNode(event.getS().main()?.string() ?? ""));
            sHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "s"));

            const aHtml = document.createElement("div");
            aHtml.setAttribute("class", "group".concat(event.getA() === group ? " selected" : ""));
            aHtml.appendChild(document.createTextNode(event.getA().main()?.string() ?? ""));
            aHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "a"));

            const tHtml = document.createElement("div");
            tHtml.setAttribute("class", "group".concat(event.getT() === group ? " selected" : ""));
            tHtml.appendChild(document.createTextNode(event.getT().main()?.string() ?? ""));
            tHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "t"));

            const bHtml = document.createElement("div");
            bHtml.setAttribute("class", "group".concat(event.getB() === group ? " selected" : ""));
            bHtml.appendChild(document.createTextNode(event.getB().main()?.string() ?? ""));
            bHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "b"));

            const eventHtml = document.createElement("div");
            eventHtml.setAttribute("class", "event");
            eventHtml.append(sHtml, aHtml, tHtml, bHtml);
            return eventHtml;
        });
        const barHtml = document.createElement("span");
        barHtml.setAttribute("class", "bar");
        barHtml.append(...eventsHtml);
        return barHtml;
    });
    const pieceHtml = document.createElement("div");
    pieceHtml.setAttribute("id", "piece");
    pieceHtml.append(...barsHtml);

    const pieceBox = document.getElementById("piece-box") as HTMLElement;
    pieceBox.innerHTML = "";
    pieceBox.appendChild(pieceHtml);

    const mirror = document.getElementById("mirror") as HTMLElement;
    const notesHtml = state.group().getNotes().map((note, noteIndex) => {
        const noteHtml = document.createElement("span");
        noteHtml.setAttribute("class", "note".concat(note === state.note() ? " selected" : ""));
        noteHtml.appendChild(document.createTextNode(note.string()));
        noteHtml.addEventListener("mousedown", () => state.select(state.barIndex, state.eventIndex, state.part, noteIndex));
        return noteHtml;
    });
    mirror.innerHTML = "";
    mirror.append(...notesHtml);
}

const state = {
    piece: new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise(),
    barIndex: 0,
    eventIndex: 0,
    part: "s" as JSB.Util.Part,
    noteIndex: 0,
    tonality: true,

    select(barIndex: number, eventIndex: number, part: JSB.Util.Part, noteIndex = 0) {
        this.barIndex = barIndex;
        this.eventIndex = eventIndex;
        this.part = part;
        this.noteIndex = noteIndex;
        update(false);
    },

    group() {
        return this.piece.getInput()[this.barIndex][this.eventIndex][this.part] as JSB.Group;
    },

    note() {
        return this.group().getNotes()[this.noteIndex];
    },
    
    defaultNote() {
        if (state.note() === undefined) {
            state.group().setNotes([JSB.Note.parse("C4")]);
        }
        return state.note();
    }
};

const tonality = document.getElementById("tonality") as HTMLElement;

tonality.addEventListener("mousedown", () => {
    state.tonality = !state.tonality;
    tonality.innerText = state.tonality ? "Major" : "Minor";
    state.piece.getKey().setTonality(state.tonality);
    update(true);
});

document.getElementById("new-event")?.addEventListener("mousedown", () => {
    state.piece.getInput()[state.barIndex].splice(state.eventIndex + 1, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
    update(true);
});

document.getElementById("new-bar")?.addEventListener("mousedown", () => {
    state.piece.getInput().splice(state.barIndex + 1, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
    update(true);
});

document.getElementById("delete-event")?.addEventListener("mousedown", () => {
    if (state.piece.getInput()[state.barIndex].length > 1) {
        state.piece.getInput()[state.barIndex].splice(state.eventIndex, 1);
        update(true);
    }
});

document.getElementById("delete-bar")?.addEventListener("mousedown", () => {
    if (state.piece.getInput().length > 1) {
        state.piece.getInput().splice(state.barIndex, 1);
        update(true);
    }
});

document.addEventListener("keydown", e => {
    let harmonise = true;
    switch (e.key) {
        case "a": case "A": state.defaultNote().getPitch().setTone(JSB.Tone.parse("A")); break;
        case "b": case "B": state.defaultNote().getPitch().setTone(JSB.Tone.parse("B")); break;
        case "c": case "C": state.defaultNote().getPitch().setTone(JSB.Tone.parse("C")); break;
        case "d": case "D": state.defaultNote().getPitch().setTone(JSB.Tone.parse("D")); break;
        case "e": case "E": state.defaultNote().getPitch().setTone(JSB.Tone.parse("E")); break;
        case "f": case "F": state.defaultNote().getPitch().setTone(JSB.Tone.parse("F")); break;
        case "g": case "G": state.defaultNote().getPitch().setTone(JSB.Tone.parse("G")); break;
        case "1": state.defaultNote().getPitch().setOctave(1); break;
        case "2": state.defaultNote().getPitch().setOctave(2); break;
        case "3": state.defaultNote().getPitch().setOctave(3); break;
        case "4": state.defaultNote().getPitch().setOctave(4); break;
        case "5": state.defaultNote().getPitch().setOctave(5); break;
        case "#": state.defaultNote().getPitch().getTone().alterAccidental(1); break;
        case "'": state.defaultNote().getPitch().getTone().alterAccidental(-1); break;
        case "Enter":
            harmonise = false;
            if (e.shiftKey) {
                if (state.eventIndex-- === 0) {
                    if (state.barIndex-- === 0) {
                        state.barIndex = 0;
                        state.eventIndex = 0;
                    } else {
                        state.eventIndex = state.piece.getInput()[state.barIndex].length - 1;
                        state.noteIndex = 0;
                    }
                } else {
                    state.noteIndex = 0;
                }
            } else {
                if (++state.eventIndex === state.piece.getInput()[state.barIndex].length) {
                    if (++state.barIndex === state.piece.getInput().length) {
                        --state.barIndex;
                        --state.eventIndex;
                    } else {
                        state.eventIndex = 0;
                        state.noteIndex = 0;
                    }
                } else {
                    state.noteIndex = 0;
                }
            }
            break;
        case "Tab":
            e.preventDefault();
            harmonise = false;
            const length = state.group().getNotes().length;
            if (e.shiftKey) {
                state.noteIndex += length - 1;
                state.noteIndex %= length;
            } else {
                ++state.noteIndex;
                state.noteIndex %= length;
            }
            break;
        case "Backspace":
            state.group().setIndex(0).setNotes([]);
            break;
    }
    update(harmonise);
});

function update(harmonise: boolean) {
    renderInput(state.piece);
    if (harmonise) {
        try {
            state.piece.harmonise();
            renderOutput(state.piece);
        } catch (e) {
            const piece = document.getElementById("piece") as HTMLDivElement;
            const time = state.piece.getTime();
            console.log(time);
            console.log(piece.children[time.bar].children[time.event]);
        }
    }
}

update(true);
