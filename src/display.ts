import { JSB } from "./index.js";
import render from "./render.js";

function display(piece: JSB.Piece) {
    const barsHtml = piece.getInput().map(bar => {
        const eventsHtml = bar.map(event => {
            const group = state.group();

            const sHtml = document.createElement("div");
            sHtml.setAttribute("class", "group".concat(event.getS() === group ? " selected" : ""));
            sHtml.appendChild(document.createTextNode(event.getS().main()?.string() ?? ""));

            const aHtml = document.createElement("div");
            aHtml.setAttribute("class", "group".concat(event.getA() === group ? " selected" : ""));
            aHtml.appendChild(document.createTextNode(event.getA().main()?.string() ?? ""));

            const tHtml = document.createElement("div");
            tHtml.setAttribute("class", "group".concat(event.getT() === group ? " selected" : ""));
            tHtml.appendChild(document.createTextNode(event.getT().main()?.string() ?? ""));

            const bHtml = document.createElement("div");
            bHtml.setAttribute("class", "group".concat(event.getB() === group ? " selected" : ""));
            bHtml.appendChild(document.createTextNode(event.getB().main()?.string() ?? ""));

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
    const notesHtml = state.group().getNotes().map(note => {
        const noteHtml = document.createElement("span");
        noteHtml.setAttribute("class", "note".concat(note === state.note() ? " selected" : ""));
        noteHtml.appendChild(document.createTextNode(note.string()));
        return noteHtml;
    });
    mirror.innerHTML = "";
    mirror.append(...notesHtml);
}

const piece = new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();

const state = {
    barIndex: 0,
    eventIndex: 0,
    part: "s" as JSB.Util.Part,
    noteIndex: 0,

    group() {
        return piece.getInput()[this.barIndex][this.eventIndex][this.part] as JSB.Group;
    },

    note() {
        return this.group().getNotes()[this.noteIndex];
    },

    tonality: true
};

const tonality = document.getElementById("tonality") as HTMLElement;
tonality.addEventListener("mousedown", () => {
    state.tonality = !state.tonality;
    tonality.innerText = state.tonality ? "Major" : "Minor";
    piece.getKey().setTonality(state.tonality);
    display(piece);
    render(piece.harmonise());
});

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "a": case "A": state.note()?.getPitch().getTone().setLetter(5); break;
        case "b": case "B": state.note()?.getPitch().getTone().setLetter(6); break;
        case "c": case "C": state.note()?.getPitch().getTone().setLetter(0); break;
        case "d": case "D": state.note()?.getPitch().getTone().setLetter(1); break;
        case "e": case "E": state.note()?.getPitch().getTone().setLetter(2); break;
        case "f": case "F": state.note()?.getPitch().getTone().setLetter(3); break;
        case "g": case "G": state.note()?.getPitch().getTone().setLetter(4); break;
        case "1": state.note()?.getPitch().setOctave(1); break;
        case "2": state.note()?.getPitch().setOctave(2); break;
        case "3": state.note()?.getPitch().setOctave(3); break;
        case "4": state.note()?.getPitch().setOctave(4); break;
        case "5": state.note()?.getPitch().setOctave(5); break;
        case "#": state.note()?.getPitch().getTone().alterAccidental(1); break;
        case "'": state.note()?.getPitch().getTone().alterAccidental(-1); break;
        case "Enter":
            if (e.shiftKey) {
                if (state.eventIndex-- === 0) {
                    if (state.barIndex-- === 0) {
                        state.barIndex = 0;
                        state.eventIndex = 0;
                    } else {
                        state.eventIndex = piece.getInput()[state.barIndex].length - 1;
                        state.noteIndex = 0;
                    }
                } else {
                    state.noteIndex = 0;
                }
            } else {
                if (++state.eventIndex === piece.getInput()[state.barIndex].length) {
                    if (++state.barIndex === piece.getInput().length) {
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
            const length = state.group().getNotes().length;
            if (e.shiftKey) {
                state.noteIndex += length - 1;
                state.noteIndex %= length;
            } else {
                ++state.noteIndex;
                state.noteIndex %= length;
            }
            break;
    }
    display(piece);
    render(piece.harmonise());
});

display(piece);
render(piece);
