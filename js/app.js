const VF = Vex.Flow;

const factory = new Vex.Flow.Factory({
    renderer: {
        elementId: "output",
    }
});
const score = factory.EasyScore();

export default function renderOutput(piece) {
    let x = 40;

    factory.getContext().clear();
    factory.getContext().resize(100000, 240);

    const bars = piece.getOutput();

    for (let i = 0, width = 0; i < bars.length; ++i, x += width) {
        const event = bars[i];

        const vfNotes = (["s", "a", "t", "b"]).map(part => {
            const accidentals = Array(6).fill(piece.getKey().signature());
            const notes = event.map(e => e.getPart(part).getNotes()).flat();
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




const state = {
    piece: new JSB.Piece().setKey(JSB.Key.parse("A major"))
        .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s")
        .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b"),
    barIndex: 0,
    eventIndex: 0,
    part: "s",
    noteIndex: 0,
    auto: false,
    keyElement: document.getElementById("key"),
    autoElement: document.getElementById("auto"),
    consoleElement: document.getElementById("console"),

    renderInput() {
        const barsHtml = this.piece.getInput().map((bar, barIndex) => {
            const eventsHtml = bar.map((event, eventIndex) => {
                const group = this.group();

                const sHtml = document.createElement("div");
                sHtml.classList.add("group");
                if (event.getS() === group) {
                    sHtml.classList.add("selected");
                }
                if (event.getS().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                sHtml.appendChild(document.createTextNode(event.getS().main()?.string() ?? ""));
                sHtml.addEventListener("mousedown", () => this.select(barIndex, eventIndex, "s", 0));

                const aHtml = document.createElement("div");
                aHtml.classList.add("group");
                if (event.getA() === group) {
                    aHtml.classList.add("selected");
                }
                if (event.getA().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                aHtml.appendChild(document.createTextNode(event.getA().main()?.string() ?? ""));
                aHtml.addEventListener("mousedown", () => this.select(barIndex, eventIndex, "a", 0));

                const tHtml = document.createElement("div");
                tHtml.classList.add("group");
                if (event.getT() === group) {
                    tHtml.classList.add("selected");
                }
                if (event.getT().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                tHtml.appendChild(document.createTextNode(event.getT().main()?.string() ?? ""));
                tHtml.addEventListener("mousedown", () => this.select(barIndex, eventIndex, "t", 0));

                const bHtml = document.createElement("div");
                bHtml.classList.add("group");
                if (event.getB() === group) {
                    bHtml.classList.add("selected");
                }
                if (event.getB().getNotes().length > 1) {
                    sHtml.classList.add("multi");
                }
                bHtml.appendChild(document.createTextNode(event.getB().main()?.string() ?? ""));
                bHtml.addEventListener("mousedown", () => this.select(barIndex, eventIndex, "b", 0));

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
        const notesHtml = this.group().getNotes().map((note, noteIndex) => {
            const noteHtml = document.createElement("span");
            noteHtml.classList.add("note");
            if (note === this.note()) {
                noteHtml.classList.add("selected");
            }
            noteHtml.appendChild(document.createTextNode(note.string()));
            noteHtml.addEventListener("mousedown", () => this.select(this.barIndex, this.eventIndex, this.part, noteIndex));
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

    select(barIndex, eventIndex, part, noteIndex) {
        this.barIndex = barIndex;
        this.eventIndex = eventIndex;
        this.part = part;
        this.noteIndex = noteIndex;
        this.update();
    },

    group() {
        return this.piece.getInput()[this.barIndex][this.eventIndex].getPart(this.part);
    },

    note() {
        return this.group().getNotes()[this.noteIndex];
    },

    defaultNote() {
        if (this.note() === undefined) {
            this.group().setNotes([JSB.Note.parse("C4")]);
        }
        return this.note();
    },

    update() {
        this.renderInput();
        if (this.auto) {
            this.harmonise();
        }
    },

    harmonise() {
        try {
            this.piece.harmonise();
            renderOutput(this.piece);
            this.consoleElement.innerText = "Success!";
        } catch (error) {
            const piece = document.getElementById("piece");
            const time = this.piece.getMaxTime();
            const event = piece.children[time.bar].children[time.event];
            event.classList.add("error");
            this.consoleElement.innerText = `${error} (Bar ${time.bar + 1}, chord ${time.event + 1})`;
        }
    },

    prependBar() {
        this.piece.getInput().splice(this.barIndex, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
        this.eventIndex = 0;
        this.noteIndex = 0;
        this.update();
    },

    prependEvent() {
        this.piece.getInput()[this.barIndex].splice(this.eventIndex, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
        this.noteIndex = 0;
        this.update();
    },

    deleteEvent() {
        if (this.piece.getInput()[this.barIndex].length > 1) {
            this.piece.getInput()[this.barIndex].splice(this.eventIndex, 1);
            if (--this.eventIndex < 0) {
                this.eventIndex = 0;
            }
            this.noteIndex = 0;
            this.update();
        } else if (this.piece.getInput().length > 1) {
            this.piece.getInput().splice(this.barIndex, 1);
            if (--this.barIndex < 0) {
                this.barIndex = 0;
            }
            this.eventIndex = 0;
            this.noteIndex = 0;
            this.update();
        }
    },

    appendEvent() {
        this.piece.getInput()[this.barIndex].splice(this.eventIndex + 1, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
        this.update();
    },

    appendBar() {
        this.piece.getInput().splice(this.barIndex + 1, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
        ++this.barIndex;
        this.eventIndex = 0;
        this.noteIndex = 0;
        this.update();
    },

    flatten() {
        if (this.piece.getKey().accidentals() > -7) {
            this.piece.getKey().setTone(this.piece.getKey().degree(3));
        }
        this.keyElement.innerText = this.piece.getKey().string();
        this.update();
    },

    toggleTonality() {
        if (this.piece.getKey().getTonality()) {
            this.piece.setKey(new JSB.Key(this.piece.getKey().degree(5), false));
        } else {
            this.piece.setKey(new JSB.Key(this.piece.getKey().degree(2), true));
        }
        this.keyElement.innerText = this.piece.getKey().string();
        this.update();
    },

    sharpen() {
        if (this.piece.getKey().accidentals() < 7) {
            this.piece.getKey().setTone(this.piece.getKey().degree(4));
        }
        this.keyElement.innerText = this.piece.getKey().string();
        this.update();
    },

    toggleAuto() {
        this.auto = !this.auto;
        this.autoElement.innerText = "Auto: " + (this.auto ? "on" : "off");
        if (this.auto) {
            this.update();
        }
    },

    keydown(e) {
        if (!e.ctrlKey && !e.shiftKey) {
            switch (e.key) {
                case "a": case "A": this.defaultNote().getPitch().setTone(JSB.Tone.parse("A")); break;
                case "b": case "B": this.defaultNote().getPitch().setTone(JSB.Tone.parse("B")); break;
                case "c": case "C": this.defaultNote().getPitch().setTone(JSB.Tone.parse("C")); break;
                case "d": case "D": this.defaultNote().getPitch().setTone(JSB.Tone.parse("D")); break;
                case "e": case "E": this.defaultNote().getPitch().setTone(JSB.Tone.parse("E")); break;
                case "f": case "F": this.defaultNote().getPitch().setTone(JSB.Tone.parse("F")); break;
                case "g": case "G": this.defaultNote().getPitch().setTone(JSB.Tone.parse("G")); break;
                case "1": this.defaultNote().getPitch().setOctave(1); break;
                case "2": this.defaultNote().getPitch().setOctave(2); break;
                case "3": this.defaultNote().getPitch().setOctave(3); break;
                case "4": this.defaultNote().getPitch().setOctave(4); break;
                case "5": this.defaultNote().getPitch().setOctave(5); break;
                case "#": this.defaultNote().getPitch().getTone().alterAccidental(1); break;
                case "'": this.defaultNote().getPitch().getTone().alterAccidental(-1); break;
                case ",":
                    switch (this.defaultNote().getDuration()) {
                        case 0.25: this.defaultNote().setDuration(0.5); break;
                        case 0.5: this.defaultNote().setDuration(1); break;
                        case 0.75: this.defaultNote().setDuration(1.5); break;
                        case 1: this.defaultNote().setDuration(2); break;
                        case 1.5: this.defaultNote().setDuration(3); break;
                        case 2: this.defaultNote().setDuration(4); break;
                        case 3: this.defaultNote().setDuration(6); break;
                    }
                    break;
                case ".":
                    switch (this.defaultNote().getDuration()) {
                        case 0.5: this.defaultNote().setDuration(0.75); break;
                        case 0.75: this.defaultNote().setDuration(0.5); break;
                        case 1: this.defaultNote().setDuration(1.5); break;
                        case 1.5: this.defaultNote().setDuration(1); break;
                        case 2: this.defaultNote().setDuration(3); break;
                        case 3: this.defaultNote().setDuration(2); break;
                        case 4: this.defaultNote().setDuration(6); break;
                        case 6: this.defaultNote().setDuration(4); break;
                    }
                    break;
                case "/":
                    switch (this.defaultNote().getDuration()) {
                        case 0.5: this.defaultNote().setDuration(0.25); break;
                        case 1: this.defaultNote().setDuration(0.5); break;
                        case 1.5: this.defaultNote().setDuration(0.75); break;
                        case 2: this.defaultNote().setDuration(1); break;
                        case 3: this.defaultNote().setDuration(1.5); break;
                        case 4: this.defaultNote().setDuration(2); break;
                        case 6: this.defaultNote().setDuration(3); break;
                    }
                    break;
                case "Enter":
                    if (e.shiftKey) {
                        if (this.eventIndex-- === 0) {
                            if (this.barIndex-- === 0) {
                                this.barIndex = 0;
                                this.eventIndex = 0;
                            } else {
                                this.eventIndex = this.piece.getInput()[this.barIndex].length - 1;
                                this.noteIndex = 0;
                            }
                        } else {
                            this.noteIndex = 0;
                        }
                    } else {
                        if (++this.eventIndex === this.piece.getInput()[this.barIndex].length) {
                            if (++this.barIndex === this.piece.getInput().length) {
                                --this.barIndex;
                                --this.eventIndex;
                            } else {
                                this.eventIndex = 0;
                                this.noteIndex = 0;
                            }
                        } else {
                            this.noteIndex = 0;
                        }
                    }
                    break;
                case "Tab":
                    e.preventDefault();
                    const length = this.group().getNotes().length;
                    if (e.shiftKey) {
                        this.noteIndex += length - 1;
                        this.noteIndex %= length;
                    } else {
                        ++this.noteIndex;
                        this.noteIndex %= length;
                    }
                    break;
                case "Backspace":
                    this.group().setIndex(0).setNotes([]);
                    break;
                default: return;
            }
        } else if (e.ctrlKey && !e.shiftKey) {
            switch (e.key) {
                case "b": ;
            }
        }
        this.update();
    },

    init() {
        document.getElementById("prepend-bar")?.addEventListener("mousedown", this.prependBar);
        document.getElementById("prepend-event")?.addEventListener("mousedown", this.prependEvent);
        document.getElementById("delete-event")?.addEventListener("mousedown", this.deleteEvent);
        document.getElementById("append-event")?.addEventListener("mousedown", this.appendEvent);
        document.getElementById("append-bar")?.addEventListener("mousedown", this.appendBar);
        document.addEventListener("keydown", this.keydown);
        document.getElementById("flatten")?.addEventListener("mousedown", this.flatten);
        this.keyElement.addEventListener("mousedown", this.toggleTonality);
        document.getElementById("sharpen")?.addEventListener("mousedown", this.sharpen);
        document.getElementById("harmonise")?.addEventListener("mousedown", this.harmonise);
        this.autoElement.addEventListener("mousedown", this.toggleAuto);
        this.consoleElement.innerText = `The soprano line is required. Other parts are optional.
[A-G] to enter a note.

[1-5] to set the octave of a note.

['] to flatten, [#] to sharpen an accidental.

[,] to double, [/] to halve the duration of a note.

[.] to dot/undot a note.

[BACKSPACE] to delete a note.`
        this.renderInput();
        renderOutput(this.piece.harmonise());
    }
};

state.init();
