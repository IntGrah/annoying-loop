const VF = Vex.Flow;

const factory = new Vex.Flow.Factory({
    renderer: {
        elementId: "output",
    }
});
const score = factory.EasyScore();

const state = {
    piece: new JSB.Piece().setKey(JSB.Key.parse("A major"))
        .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s")
        .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b"),
    barIndex: 0,
    eventIndex: 0,
    part: "s",
    noteIndex: 0,
    auto: false,
    keyElement: document.getElementById("key"),
    autoElement: document.getElementById("auto"),
    consoleElement: document.getElementById("console"),

    renderInput() {
        const barsHtml = state.piece.getBars().map((bar, barIndex) => {
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
                sHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "s", 0));

                const aHtml = document.createElement("div");
                aHtml.classList.add("group");
                if (event.getA() === group) {
                    aHtml.classList.add("selected");
                }
                if (event.getA().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                aHtml.appendChild(document.createTextNode(event.getA().main()?.string() ?? ""));
                aHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "a", 0));

                const tHtml = document.createElement("div");
                tHtml.classList.add("group");
                if (event.getT() === group) {
                    tHtml.classList.add("selected");
                }
                if (event.getT().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                tHtml.appendChild(document.createTextNode(event.getT().main()?.string() ?? ""));
                tHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "t", 0));

                const bHtml = document.createElement("div");
                bHtml.classList.add("group");
                if (event.getB() === group) {
                    bHtml.classList.add("selected");
                }
                if (event.getB().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                bHtml.appendChild(document.createTextNode(event.getB().main()?.string() ?? ""));
                bHtml.addEventListener("mousedown", () => state.select(barIndex, eventIndex, "b", 0));

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
    },

    renderOutput() {
        let x = 40;
    
        factory.getContext().clear();
        factory.getContext().resize(100000, 240);
    
        const bars = state.piece.getBars();
    
        for (let i = 0, width = 0; i < bars.length; ++i, x += width) {
            const event = bars[i];
    
            const vfNotes = (["s", "a", "t", "b"]).map(part => {
                const accidentals = Array(6).fill(state.piece.getKey().signature());
                const notes = event.map(e => e.get(part).getNotes()).flat();
                return notes.map(note => {
                    const vfNote = new VF.StaveNote({
                        clef: part === "s" || part === "a" ? "treble" : "bass",
                        keys: [`${JSB.Tone.LETTERS[note.getPitch().getTone().getLetter()]}/${note.getPitch().getOctave()}`],
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
                        }[note.getDuration()],
                        stem_direction: part === "s" || part === "t" ? 1 : -1
                    });
                    if (accidentals[note.getPitch().getOctave()][note.getPitch().getTone().getLetter()] !== note.getPitch().getTone().getAccidental()) {
                        accidentals[note.getPitch().getOctave()][note.getPitch().getTone().getLetter()] = note.getPitch().getTone().getAccidental();
                        vfNote.addAccidental(0, new VF.Accidental({ "-2": "bb", "-1": "b", "0": "n", "1": "#", "2": "##" }[note.getPitch().getTone().getAccidental()]));
                    }
                    if ([0.75, 1.5, 3, 6].includes(note.getDuration())) {
                        vfNote.addDot(0);
                    }
                    return vfNote;
                });
            });
    
            width = 40 * Math.max(...vfNotes.map(notes => notes.length));
    
            if (i === 0) {
                width += 40 + 20 * Math.abs(state.piece.getKey().accidentals());
            }
    
            const system = factory.System({ x: x, y: 0, width: width, spaceBetweenStaves: 10 });
    
            const vfKey = state.piece.getKey().getTonality() ? state.piece.getKey().getTone().string() : state.piece.getKey().degree(2).string();
    
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
    },

    select(barIndex, eventIndex, part, noteIndex) {
        state.barIndex = barIndex;
        state.eventIndex = eventIndex;
        state.part = part;
        state.noteIndex = noteIndex;
        state.update();
    },

    group() {
        return state.piece.getBars()[state.barIndex][state.eventIndex].get(state.part);
    },

    note() {
        return state.group().getNotes()[state.noteIndex];
    },

    defaultNote() {
        if (state.note() === undefined) {
            state.group().setNotes([JSB.Note.parse("C4")]);
        }
        return state.note();
    },

    update() {
        state.renderInput();
        if (state.auto) {
            state.harmonise();
        }
    },

    harmonise() {
        try {
            state.piece.harmonise();
            state.renderOutput(state.piece);
            state.consoleElement.innerText = "Success!";
        } catch (error) {
            const piece = document.getElementById("piece");
            const time = state.piece.getMaxTime();
            const event = piece.children[time.barIndex].children[time.eventIndex];
            event.classList.add("error");
            state.consoleElement.innerText = `${error} (Bar ${time.bar + 1}, chord ${time.event + 1})`;
        }
    },

    prependBar() {
        state.piece.getBars().splice(state.barIndex, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
        state.eventIndex = 0;
        state.noteIndex = 0;
        state.update();
    },

    prependEvent() {
        state.piece.getBars()[state.barIndex].splice(state.eventIndex, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
        state.noteIndex = 0;
        state.update();
    },

    deleteEvent() {
        if (state.piece.getBars()[state.barIndex].length > 1) {
            state.piece.getInput()[state.barIndex].splice(state.eventIndex, 1);
            if (--state.eventIndex < 0) {
                state.eventIndex = 0;
            }
            state.noteIndex = 0;
            state.update();
        } else if (state.piece.getBars().length > 1) {
            state.piece.getBars().splice(state.barIndex, 1);
            if (--state.barIndex < 0) {
                state.barIndex = 0;
            }
            state.eventIndex = 0;
            state.noteIndex = 0;
            state.update();
        }
    },

    appendEvent() {
        state.piece.getBars()[state.barIndex].splice(state.eventIndex + 1, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
        state.update();
    },

    appendBar() {
        state.piece.getInput().splice(state.barIndex + 1, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
        ++state.barIndex;
        state.eventIndex = 0;
        state.noteIndex = 0;
        state.update();
    },

    flatten() {
        if (state.piece.getKey().accidentals() > -7) {
            state.piece.getKey().setTone(state.piece.getKey().degree(3));
        }
        state.keyElement.innerText = state.piece.getKey().string();
        state.update();
    },

    toggleTonality() {
        if (state.piece.getKey().getTonality()) {
            state.piece.setKey(new JSB.Key(state.piece.getKey().degree(5), false));
        } else {
            state.piece.setKey(new JSB.Key(state.piece.getKey().degree(2), true));
        }
        state.keyElement.innerText = state.piece.getKey().string();
        state.update();
    },

    sharpen() {
        if (state.piece.getKey().accidentals() < 7) {
            state.piece.getKey().setTone(state.piece.getKey().degree(4));
        }
        state.keyElement.innerText = state.piece.getKey().string();
        state.update();
    },

    toggleAuto() {
        state.auto = !state.auto;
        state.autoElement.innerText = "Auto: " + (state.auto ? "on" : "off");
        if (state.auto) {
            state.update();
        }
    },

    keydown(e) {
        if (!e.ctrlKey && !e.shiftKey) {
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
                case ",":
                    switch (state.defaultNote().getDuration()) {
                        case 0.25: state.defaultNote().setDuration(0.5); break;
                        case 0.5: state.defaultNote().setDuration(1); break;
                        case 0.75: state.defaultNote().setDuration(1.5); break;
                        case 1: state.defaultNote().setDuration(2); break;
                        case 1.5: state.defaultNote().setDuration(3); break;
                        case 2: state.defaultNote().setDuration(4); break;
                        case 3: state.defaultNote().setDuration(6); break;
                    }
                    break;
                case ".":
                    switch (state.defaultNote().getDuration()) {
                        case 0.5: state.defaultNote().setDuration(0.75); break;
                        case 0.75: state.defaultNote().setDuration(0.5); break;
                        case 1: state.defaultNote().setDuration(1.5); break;
                        case 1.5: state.defaultNote().setDuration(1); break;
                        case 2: state.defaultNote().setDuration(3); break;
                        case 3: state.defaultNote().setDuration(2); break;
                        case 4: state.defaultNote().setDuration(6); break;
                        case 6: state.defaultNote().setDuration(4); break;
                    }
                    break;
                case "/":
                    switch (state.defaultNote().getDuration()) {
                        case 0.5: state.defaultNote().setDuration(0.25); break;
                        case 1: state.defaultNote().setDuration(0.5); break;
                        case 1.5: state.defaultNote().setDuration(0.75); break;
                        case 2: state.defaultNote().setDuration(1); break;
                        case 3: state.defaultNote().setDuration(1.5); break;
                        case 4: state.defaultNote().setDuration(2); break;
                        case 6: state.defaultNote().setDuration(3); break;
                    }
                    break;
                case "Enter":
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
                default: return;
            }
        } else if (e.ctrlKey && !e.shiftKey) {
            switch (e.key) {
                case "b": ;
            }
        }
        state.update();
    },

    init() {
        document.getElementById("prepend-bar")?.addEventListener("mousedown", state.prependBar);
        document.getElementById("prepend-event")?.addEventListener("mousedown", state.prependEvent);
        document.getElementById("delete-event")?.addEventListener("mousedown", state.deleteEvent);
        document.getElementById("append-event")?.addEventListener("mousedown", state.appendEvent);
        document.getElementById("append-bar")?.addEventListener("mousedown", state.appendBar);
        document.addEventListener("keydown", state.keydown);
        document.getElementById("flatten")?.addEventListener("mousedown", state.flatten);
        state.keyElement.addEventListener("mousedown", state.toggleTonality);
        document.getElementById("sharpen")?.addEventListener("mousedown", state.sharpen);
        document.getElementById("harmonise")?.addEventListener("mousedown", state.harmonise);
        state.autoElement.addEventListener("mousedown", state.toggleAuto);
        state.renderInput();
        state.harmonise();
        state.renderOutput();
        state.consoleElement.innerText = `The soprano line is required. Other parts are optional.
[A-G] to enter a note.

[1-5] to set the octave of a note.

['] to flatten, [#] to sharpen an accidental.

[,] to double, [/] to halve the duration of a note.

[.] to dot/undot a note.

[BACKSPACE] to delete a note.`
    }
};

state.init();
