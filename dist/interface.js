import * as JSB from "../node_modules/jsb-js/dist/index.js";
import renderOutput from "./output.js";
function renderInput(piece) {
    const barsHtml = piece.getInput().map((bar, barIndex) => {
        const eventsHtml = bar.map((event, eventIndex) => {
            const group = state.group();
            const sHtml = document.createElement("div");
            sHtml.classList.add("group");
            if (event.getS() === group) {
                sHtml.classList.add("selected");
            }
            if (event.getS().getNotes().length > 1) {
                sHtml.classList.add("multi");
            }
            sHtml.appendChild(document.createTextNode(event.getS().main()?.string() ?? ""));
            sHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "s"));
            const aHtml = document.createElement("div");
            aHtml.classList.add("group");
            if (event.getA() === group) {
                aHtml.classList.add("selected");
            }
            if (event.getA().getNotes().length > 1) {
                sHtml.classList.add("multi");
            }
            aHtml.appendChild(document.createTextNode(event.getA().main()?.string() ?? ""));
            aHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "a"));
            const tHtml = document.createElement("div");
            tHtml.classList.add("group");
            if (event.getT() === group) {
                tHtml.classList.add("selected");
            }
            if (event.getT().getNotes().length > 1) {
                sHtml.classList.add("multi");
            }
            tHtml.appendChild(document.createTextNode(event.getT().main()?.string() ?? ""));
            tHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "t"));
            const bHtml = document.createElement("div");
            bHtml.classList.add("group");
            if (event.getB() === group) {
                bHtml.classList.add("selected");
            }
            if (event.getB().getNotes().length > 1) {
                sHtml.classList.add("multi");
            }
            bHtml.appendChild(document.createTextNode(event.getB().main()?.string() ?? ""));
            bHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "b"));
            const eventHtml = document.createElement("div");
            eventHtml.classList.add("event");
            eventHtml.append(sHtml, aHtml, tHtml, bHtml);
            return eventHtml;
        });
        const barHtml = document.createElement("span");
        barHtml.classList.add("bar");
        barHtml.append(...eventsHtml);
        return barHtml;
    });
    const pieceHtml = document.createElement("div");
    pieceHtml.id = "piece";
    pieceHtml.append(...barsHtml);
    const pieceBox = document.getElementById("piece-box");
    pieceBox.innerHTML = "";
    pieceBox.appendChild(pieceHtml);
    const mirror = document.getElementById("mirror");
    const notesHtml = state.group().getNotes().map((note, noteIndex) => {
        const noteHtml = document.createElement("span");
        noteHtml.classList.add("note");
        if (note === state.note()) {
            noteHtml.classList.add("selected");
        }
        noteHtml.appendChild(document.createTextNode(note.string()));
        noteHtml.addEventListener("mousedown", () => state.select(state.barIndex, state.eventIndex, state.part, noteIndex));
        return noteHtml;
    });
    if (notesHtml.length === 0) {
        const emptyNote = document.createElement("span");
        emptyNote.classList.add("note");
        emptyNote.classList.add("empty");
        emptyNote.appendChild(document.createTextNode("(empty)"));
        emptyNote.style;
        notesHtml[0] = emptyNote;
    }
    mirror.innerHTML = "";
    mirror.append(...notesHtml);
}
const state = {
    piece: new JSB.Piece().setKey(JSB.Key.parse("A major"))
        .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s")
        .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b"),
    barIndex: 0,
    eventIndex: 0,
    part: "s",
    noteIndex: 0,
    auto: false,
    select(barIndex, eventIndex, part, noteIndex = 0) {
        this.barIndex = barIndex;
        this.eventIndex = eventIndex;
        this.part = part;
        this.noteIndex = noteIndex;
        state.update();
    },
    group() {
        return this.piece.getInput()[this.barIndex][this.eventIndex].getPart(this.part);
    },
    note() {
        return this.group().getNotes()[this.noteIndex];
    },
    defaultNote() {
        if (state.note() === undefined) {
            state.group().setNotes([JSB.Note.parse("C4")]);
        }
        return state.note();
    },
    update() {
        renderInput(this.piece);
        if (this.auto) {
            this.harmonise();
        }
    },
    harmonise() {
        try {
            this.piece.harmonise();
            renderOutput(this.piece);
            consoleHtml.innerText = "Success!";
        }
        catch (error) {
            const piece = document.getElementById("piece");
            const time = this.piece.getMaxTime();
            const event = piece.children[time.bar].children[time.event];
            event.classList.add("error");
            consoleHtml.innerText = `${error} (Bar ${time.bar + 1}, chord ${time.event + 1})`;
        }
    }
};
document.getElementById("prepend-bar")?.addEventListener("mousedown", () => {
    state.piece.getInput().splice(state.barIndex, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
    state.eventIndex = 0;
    state.noteIndex = 0;
    state.update();
});
document.getElementById("prepend-event")?.addEventListener("mousedown", () => {
    state.piece.getInput()[state.barIndex].splice(state.eventIndex, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
    state.noteIndex = 0;
    state.update();
});
document.getElementById("delete-event")?.addEventListener("mousedown", () => {
    if (state.piece.getInput()[state.barIndex].length > 1) {
        state.piece.getInput()[state.barIndex].splice(state.eventIndex, 1);
        if (--state.eventIndex < 0) {
            state.eventIndex = 0;
        }
        state.noteIndex = 0;
        state.update();
    }
    else if (state.piece.getInput().length > 1) {
        state.piece.getInput().splice(state.barIndex, 1);
        if (--state.barIndex < 0) {
            state.barIndex = 0;
        }
        state.eventIndex = 0;
        state.noteIndex = 0;
        state.update();
    }
});
document.getElementById("append-event")?.addEventListener("mousedown", () => {
    state.piece.getInput()[state.barIndex].splice(state.eventIndex + 1, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
    state.update();
});
document.getElementById("append-bar")?.addEventListener("mousedown", () => {
    state.piece.getInput().splice(state.barIndex + 1, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
    ++state.barIndex;
    state.eventIndex = 0;
    state.noteIndex = 0;
    state.update();
});
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "a":
        case "A":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("A"));
            break;
        case "b":
        case "B":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("B"));
            break;
        case "c":
        case "C":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("C"));
            break;
        case "d":
        case "D":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("D"));
            break;
        case "e":
        case "E":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("E"));
            break;
        case "f":
        case "F":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("F"));
            break;
        case "g":
        case "G":
            state.defaultNote().getPitch().setTone(JSB.Tone.parse("G"));
            break;
        case "1":
            state.defaultNote().getPitch().setOctave(1);
            break;
        case "2":
            state.defaultNote().getPitch().setOctave(2);
            break;
        case "3":
            state.defaultNote().getPitch().setOctave(3);
            break;
        case "4":
            state.defaultNote().getPitch().setOctave(4);
            break;
        case "5":
            state.defaultNote().getPitch().setOctave(5);
            break;
        case "#":
            state.defaultNote().getPitch().getTone().alterAccidental(1);
            break;
        case "'":
            state.defaultNote().getPitch().getTone().alterAccidental(-1);
            break;
        case ",":
            switch (state.defaultNote().getDuration()) {
                case 0.25:
                    state.defaultNote().setDuration(0.5);
                    break;
                case 0.5:
                    state.defaultNote().setDuration(1);
                    break;
                case 0.75:
                    state.defaultNote().setDuration(1.5);
                    break;
                case 1:
                    state.defaultNote().setDuration(2);
                    break;
                case 1.5:
                    state.defaultNote().setDuration(3);
                    break;
                case 2:
                    state.defaultNote().setDuration(4);
                    break;
                case 3:
                    state.defaultNote().setDuration(6);
                    break;
            }
            break;
        case ".":
            switch (state.defaultNote().getDuration()) {
                case 0.5:
                    state.defaultNote().setDuration(0.75);
                    break;
                case 0.75:
                    state.defaultNote().setDuration(0.5);
                    break;
                case 1:
                    state.defaultNote().setDuration(1.5);
                    break;
                case 1.5:
                    state.defaultNote().setDuration(1);
                    break;
                case 2:
                    state.defaultNote().setDuration(3);
                    break;
                case 3:
                    state.defaultNote().setDuration(2);
                    break;
                case 4:
                    state.defaultNote().setDuration(6);
                    break;
                case 6:
                    state.defaultNote().setDuration(4);
                    break;
            }
            break;
        case "/":
            switch (state.defaultNote().getDuration()) {
                case 0.5:
                    state.defaultNote().setDuration(0.25);
                    break;
                case 1:
                    state.defaultNote().setDuration(0.5);
                    break;
                case 1.5:
                    state.defaultNote().setDuration(0.75);
                    break;
                case 2:
                    state.defaultNote().setDuration(1);
                    break;
                case 3:
                    state.defaultNote().setDuration(1.5);
                    break;
                case 4:
                    state.defaultNote().setDuration(2);
                    break;
                case 6:
                    state.defaultNote().setDuration(3);
                    break;
            }
            break;
        case "Enter":
            if (e.shiftKey) {
                if (state.eventIndex-- === 0) {
                    if (state.barIndex-- === 0) {
                        state.barIndex = 0;
                        state.eventIndex = 0;
                    }
                    else {
                        state.eventIndex = state.piece.getInput()[state.barIndex].length - 1;
                        state.noteIndex = 0;
                    }
                }
                else {
                    state.noteIndex = 0;
                }
            }
            else {
                if (++state.eventIndex === state.piece.getInput()[state.barIndex].length) {
                    if (++state.barIndex === state.piece.getInput().length) {
                        --state.barIndex;
                        --state.eventIndex;
                    }
                    else {
                        state.eventIndex = 0;
                        state.noteIndex = 0;
                    }
                }
                else {
                    state.noteIndex = 0;
                }
            }
            break;
        case "Tab":
            e.preventDefault();
            const length = state.group().getNotes().length;
            if (e.shiftKey) {
                state.noteIndex += length - 1;
                state.noteIndex %= length;
            }
            else {
                ++state.noteIndex;
                state.noteIndex %= length;
            }
            break;
        case "Backspace":
            state.group().setIndex(0).setNotes([]);
            break;
        default: return;
    }
    state.update();
});
document.getElementById("flatten")?.addEventListener("mousedown", () => {
    if (state.piece.getKey().accidentals() > -7) {
        state.piece.getKey().setTone(state.piece.getKey().degree(3));
    }
    key.innerText = state.piece.getKey().string();
    state.update();
});
const key = document.getElementById("key");
key.addEventListener("mousedown", () => {
    if (state.piece.getKey().getTonality()) {
        state.piece.setKey(new JSB.Key(state.piece.getKey().degree(5), false));
    }
    else {
        state.piece.setKey(new JSB.Key(state.piece.getKey().degree(2), true));
    }
    key.innerText = state.piece.getKey().string();
    state.update();
});
document.getElementById("sharpen")?.addEventListener("mousedown", () => {
    if (state.piece.getKey().accidentals() < 7) {
        state.piece.getKey().setTone(state.piece.getKey().degree(4));
    }
    key.innerText = state.piece.getKey().string();
    state.update();
});
document.getElementById("harmonise")?.addEventListener("mousedown", () => {
    state.harmonise();
});
document.getElementById("auto")?.addEventListener("mousedown", function () {
    state.auto = !state.auto;
    this.innerText = "Auto: " + (state.auto ? "on" : "off");
    if (state.auto) {
        state.update();
    }
});
const consoleHtml = document.getElementById("console");
renderInput(state.piece);
renderOutput(state.piece.harmonise());
consoleHtml.innerText = `The soprano line is required. Other parts are optional.
Press [A-G] to enter a note.

Press [1-5] to set the octave of a note.

Press ['] to flatten or [#] to sharpen an accidental.

Press [,] to double or [/] to halve the duration of a note.

Press [.] to dot/undot a note.

Press [BACKSPACE] to delete a note.

The buttons located above can create, delete, extend, or shorten bars.

In a chord, a part can have multiple notes, but only one is used for harmonisation, while others are considered non-harmony notes.`;
