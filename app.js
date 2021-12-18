const VF = Vex.Flow;
const factory = new Vex.Flow.Factory({ renderer: { elementId: "output" } });
const score = factory.EasyScore();

const $ = {
  VERSION: "1.0.5",
  durations: { 0.25: "16", 0.5: "8", 0.75: "8", 1: "4", 1.5: "4", 2: "2", 3: "2", 4: "1", 6: "1", 8: "1/2", 12: "1/2" },

  HTML: {
    index(element) {
      return Array.prototype.indexOf.call(element.parentElement.children, element);
    },

    select(noteElement) {
      if (!noteElement) {
        return;
      }
      $.JSB.barIndex = $.HTML.index(noteElement.parentElement.parentElement.parentElement);
      $.JSB.eventIndex = $.HTML.index(noteElement.parentElement.parentElement);
      $.JSB.groupIndex = [$.HTML.index(noteElement.parentElement)];
      $.JSB.noteIndex = $.HTML.index(noteElement);

      $.noteElement.parentElement.parentElement.classList.remove("selected");
      $.noteElement.classList.remove("selected");
      $.noteElement = noteElement;
      $.noteElement.parentElement.parentElement.classList.add("selected");
      $.noteElement.classList.add("selected");
    },

    createPiece(children) {
      const element = document.createElement("div");
      element.classList.add("piece");
      element.append(...children);
      return element;
    },

    createBar(children) {
      const element = document.createElement("span");
      element.classList.add("bar");
      element.append(...children);
      return element;
    },

    createEvent(children, selected, type) {
      const element = document.createElement("div");
      element.classList.add("event");
      if (selected) {
        element.classList.add("selected");
      }
      switch (type) {
        case "cadence": element.classList.add("cadence"); break;
        case "end": element.classList.add("end"); break;
      }
      element.append(...children);
      return element;
    },

    createGroup(children, selected) {
      const element = document.createElement("div");
      element.classList.add("group");
      if (children.length > 1) {
        element.classList.add("multi");
      }
      if (children.length === 0) {
        element.appendChild($.HTML.createNote("", selected));
      } else {
        element.append(...children);
      }
      return element;
    },

    createNote(string, selected) {
      const element = document.createElement("span");
      element.classList.add("note");
      if (selected) {
        element.classList.add("selected");
        $.noteElement = element;
      }
      element.appendChild(document.createTextNode(string));
      element.addEventListener("mousedown", () => $.HTML.select(element));
      return element;
    },

    render(bars) {
      const selectedEvent = $.JSB.getEvent();
      const selectedGroup = $.JSB.getGroup();
      const selectedNote = $.JSB.getNote();
      $.box.innerHTML = "";
      $.box.appendChild(
        $.HTML.createPiece(
          bars.map(
            bar => $.HTML.createBar(
              bar.map(
                event => $.HTML.createEvent(
                  [event.s, event.a, event.t, event.b].map(
                    group => $.HTML.createGroup(
                      group.notes.map(note => $.HTML.createNote(note.string(), note === selectedNote)),
                      group === selectedGroup
                    )
                  ),
                  event === selectedEvent, event.type
                )
              )
            )
          )
        )
      );
    }
  },

  VF: {
    createBar(bar, part) {
      const accidentals = Array(6).fill($.JSB.piece.key.signature());
      return bar.map(event => $.VF.createGroup(event, part, accidentals)).flat();
    },

    createGroup(event, part, accidentals) {
      const group = event.get(part);
      const vfGroup = group.notes.map(note => $.VF.createNote(note, part, accidentals));

      const vfRests = [];
      let difference = event.duration() - group.duration();
      while (difference > 0) {
        const duration = [12, 8, 6, 4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25].filter(n => n <= difference)[0];
        difference -= duration;
        vfRests.unshift($.VF.createRest(duration, part));
      }
      vfGroup.push(...vfRests);
      return vfGroup;
    },

    createNote(note, part, accidentals) {
      const vfNote = new VF.StaveNote({
        clef: part === "s" || part === "a" ? "treble" : "bass",
        keys: [
          `${JSB.Tone.LETTERS[note.pitch.tone.letter]}/${note.pitch.octave}`
        ],
        duration: $.durations[note.duration],
        stem_direction: part === "s" || part === "t" ? 1 : -1
      });
      if (accidentals[note.pitch.octave][note.pitch.tone.letter] !== note.pitch.tone.accidental) {
        accidentals[note.pitch.octave][note.pitch.tone.letter] =
          note.pitch.tone.accidental;
        vfNote.addAccidental(0, new VF.Accidental({ "-2": "bb", "-1": "b", 0: "n", 1: "#", 2: "##" }[note.pitch.tone.accidental]));
      }
      if ([0.75, 1.5, 3, 6, 12].includes(note.duration)) {
        vfNote.addDot(0);
      }
      return vfNote;
    },

    createRest(duration, part) {
      const vfRest = new VF.StaveNote({
        clef: part === "s" || part === "a" ? "treble" : "bass",
        keys: [{ "s": "A/5", "a": "C/4", "t": "C/4", "b": "E/2" }[part]],
        duration: $.durations[duration] + "r",
      });
      if ([0.75, 1.5, 3, 6, 12].includes(duration)) {
        vfRest.addDot(0);
      }
      return vfRest;
    },

    render(bars) {
      let x = 40;

      factory.getContext().clear();
      factory.getContext().resize(100000, 240);

      for (let i = 0, width = 0; i < bars.length; ++i, x += width) {
        const bar = bars[i];
        width = 20 + 40 * bar.map(event => event.duration()).reduce((l, r) => l + r);
        if (i === 0) {
          width += 20 * Math.abs($.JSB.piece.key.accidentals());
        }

        const system = factory.System({
          x: x,
          y: 0,
          width: width,
          spaceBetweenStaves: 12
        });
        const vfTime = {
          time: {
            num_beats: bar.map(event => event.duration()).reduce((l, r) => l + r),
            beat_value: 4,
          },
        };

        const upper = system.addStave({
          voices: [
            score.voice($.VF.createBar(bar, "s"), vfTime).setStrict(false),
            score.voice($.VF.createBar(bar, "a"), vfTime).setStrict(false)
          ]
        });

        const lower = system.addStave({
          voices: [
            score.voice($.VF.createBar(bar, "t"), vfTime).setStrict(false),
            score.voice($.VF.createBar(bar, "b"), vfTime).setStrict(false)
          ]
        });

        const vfKey = $.JSB.piece.key.tonality ? $.JSB.piece.key.tone.string() : $.JSB.piece.key.degree(2).string();

        if (i === 0) {
          upper.addClef("treble").addKeySignature(vfKey);
          lower.addClef("bass").addKeySignature(vfKey);
          system.addConnector("brace");
          system.addConnector("singleLeft");
        }

        system.addConnector(
          i === bars.length - 1 ? "boldDoubleRight" : "singleRight"
        );

        factory.draw();
      }
      factory.getContext().resize(x + 40, 240);
    }
  },

  JSB: {
    getBar() {
      return $.JSB.piece.cache[$.JSB.barIndex];
    },

    getEvent() {
      return $.JSB.getBar()[$.JSB.eventIndex];
    },

    getGroup() {
      return $.JSB.getEvent().get(["s", "a", "t", "b"][$.JSB.groupIndex]);
    },

    getNote() {
      return $.JSB.getGroup().notes[$.JSB.noteIndex];
    },

    harmonise(force = false) {
      if (!force && !$.auto) {
        return;
      }
      try {
        $.error?.classList.remove("error");
        $.JSB.piece.harmonise();
        $.VF.render($.JSB.piece.bars);
      } catch (error) {
        console.error(error);
        const time = $.JSB.piece.maxTime;
        $.error = $.box.firstElementChild.children[time.barIndex].children[time.eventIndex];
        $.error.classList.add("error");
        $.VF.render($.JSB.piece.cache);
      }
    },

    init(piece) {
      $.JSB.piece = piece
      $.JSB.barIndex = 0;
      $.JSB.eventIndex = 0;
      $.JSB.groupIndex = 0;
      $.JSB.noteIndex = 0;
      $.JSB.piece.harmonise();
    }
  },

  manage: {
    deleteEvent() {
      const bar = $.JSB.getBar();
      if (bar.length > 1) {
        const eventElement = $.noteElement.parentElement.parentElement;
        const newNoteElement = eventElement.previousElementSibling?.children[$.JSB.groupIndex].firstElementChild ?? eventElement.nextElementSibling.children[$.JSB.groupIndex].firstElementChild;
        bar.splice($.JSB.eventIndex, 1);
        eventElement.remove();
        $.HTML.select(newNoteElement)
        $.JSB.harmonise();
      } else {
        $.manage.deleteBar();
      }
    },

    deleteBar() {
      if ($.JSB.piece.cache.length === 1) {
        return;
      }
      const barElement = $.noteElement.parentElement.parentElement.parentElement;
      const newNoteElement = barElement.previousElementSibling?.lastElementChild.children[$.JSB.groupIndex].firstElementChild ?? barElement.nextElementSibling.firstElementChild.children[$.JSB.groupIndex].firstElementChild;
      $.JSB.piece.cache.splice($.JSB.barIndex, 1);
      barElement.remove();
      $.HTML.select(newNoteElement)
      $.JSB.harmonise();
    },

    appendEvent() {
      $.JSB.getBar().splice($.JSB.eventIndex + 1, 0, JSB.Event.empty());
      const eventElement = $.HTML.createEvent([
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
      ], true, "normal");
      $.noteElement.parentElement.parentElement.insertAdjacentElement("afterend", eventElement);
      $.HTML.select(eventElement.children[$.JSB.groupIndex].firstElementChild);
      $.JSB.harmonise();
    },

    appendBar() {
      $.JSB.piece.cache.splice($.JSB.barIndex + 1, 0, [JSB.Event.empty()]);
      const barElement = $.HTML.createBar([$.HTML.createEvent([
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
        $.HTML.createGroup([], false),
      ], true, "normal")]);
      $.noteElement.parentElement.parentElement.parentElement.insertAdjacentElement("afterend", barElement);
      $.HTML.select(barElement.firstElementChild.children[$.JSB.groupIndex].firstElementChild);
      $.JSB.harmonise();
    },

    clearGroup() {
      $.JSB.getGroup().index = 0;
      $.JSB.getGroup().notes = [];
      const groupElement = $.noteElement.parentElement;
      groupElement.innerHTML = "";
      groupElement.appendChild($.HTML.createNote("", true));
      $.HTML.select(groupElement.firstElementChild);
      $.JSB.harmonise();
    },

    toggleEventType(type) {
      const event = $.JSB.getEvent();
      const classList = $.noteElement.parentElement.parentElement.classList;
      if (event.type === type) {
        classList.remove(event.type);
        event.type = "normal";
        classList.add("normal");
      } else {
        classList.remove(event.type);
        event.type = type;
        classList.add(type);
      }
      $.JSB.harmonise();
    }
  },

  key: {
    flatten() {
      if ($.JSB.piece.key.accidentals() > -7) {
        $.JSB.piece.key.tone = $.JSB.piece.key.degree(3);
      }
      $.keyElement.innerText = $.JSB.piece.key.string();
      $.JSB.harmonise();
    },

    toggleTonality() {
      if ($.JSB.piece.key.tonality) {
        $.JSB.piece.key = new JSB.Key($.JSB.piece.key.degree(5), false);
      } else {
        $.JSB.piece.key = new JSB.Key($.JSB.piece.key.degree(2), true);
      }
      $.keyElement.innerText = $.JSB.piece.key.string();
      $.JSB.harmonise();
    },

    sharpen() {
      if ($.JSB.piece.key.accidentals() < 7) {
        $.JSB.piece.key.tone = $.JSB.piece.key.degree(4);
      }
      $.keyElement.innerText = $.JSB.piece.key.string();
      $.JSB.harmonise();
    }
  },

  edit: {
    letter(letter) {
      if ($.JSB.getNote() === undefined) {
        $.JSB.getGroup().notes = [JSB.Note.parse("C4")];
      }
      const note = $.JSB.getNote();
      note.pitch.tone = JSB.Tone.parse(["C", "D", "E", "F", "G", "A", "B"][letter]).alterAccidental($.JSB.piece.key.signature()[letter]);
      $.noteElement.innerText = note.string();
      $.JSB.harmonise();
    },

    octave(octave) {
      const note = $.JSB.getNote();
      if (!note) {
        return;
      }
      note.pitch.octave = octave;
      $.noteElement.innerText = note.string();
      $.JSB.harmonise();
    },

    accidental(accidental) {
      const note = $.JSB.getNote();
      if (!note) {
        return;
      }
      note.pitch.tone.alterAccidental(accidental);
      $.noteElement.innerText = note.string();
      $.JSB.harmonise();
    },

    augmentDuration() {
      const note = $.JSB.getNote();
      if (!note) {
        return;
      }
      switch (note.duration) {
        case 0.25:
        case 0.5:
        case 0.75:
        case 1:
        case 1.5:
        case 2:
        case 3:
        case 4:
        case 6:
          note.duration *= 2;
          $.noteElement.innerText = note.string();
          break;
      }
      $.JSB.harmonise();
    },

    toggleDot() {
      const note = $.JSB.getNote();
      if (!note) {
        return;
      }
      switch (note.duration) {
        case 0.5:
        case 1:
        case 2:
        case 4:
        case 8:
          note.duration *= 1.5;
          $.noteElement.innerText = note.string();
          break;
        case 0.75:
        case 1.5:
        case 3:
        case 6:
        case 12:
          note.duration /= 1.5;
          $.noteElement.innerText = note.string();
          break;
      }
      $.JSB.harmonise();
    },

    diminishDuration() {
      const note = $.JSB.getNote();
      if (!note) {
        return;
      }
      switch (note.duration) {
        case 0.5:
        case 1:
        case 1.5:
        case 2:
        case 3:
        case 4:
        case 6:
        case 8:
        case 12:
          note.duration *= 0.5;
          $.noteElement.innerText = note.string();
          break;
      }
      $.JSB.harmonise();
    }
  },

  location: {
    previousEvent() {
      const eventElement = $.noteElement.parentElement.parentElement;
      $.HTML.select(eventElement.previousElementSibling?.children[$.JSB.groupIndex].firstElementChild ?? eventElement.parentElement.previousElementSibling?.lastElementChild.children[$.JSB.groupIndex].firstElementChild);
    },

    nextEvent() {
      const eventEvent = $.noteElement.parentElement.parentElement;
      $.HTML.select(eventEvent.nextElementSibling?.children[$.JSB.groupIndex].firstElementChild ?? eventEvent.parentElement.nextElementSibling?.firstElementChild.children[$.JSB.groupIndex].firstElementChild);
    },

    abovePart() {
      $.HTML.select($.noteElement.parentElement.previousElementSibling?.firstElementChild);
    },

    belowPart() {
      $.HTML.select($.noteElement.parentElement.nextElementSibling?.firstElementChild);
    },

    previousNote() {
      $.HTML.select($.noteElement.previousElementSibling ?? $.noteElement.parentElement.lastElementChild);
    },

    nextNote() {
      $.HTML.select($.noteElement.nextElementSibling ?? $.noteElement.parentElement.firstElementChild);
    }
  },

  toggleAuto(element) {
    $.auto = !$.auto;
    element.innerText = "Auto: " + ($.auto ? "on" : "off");
    if ($.auto) {
      $.JSB.harmonise();
    }
  },

  clear() {
    const piece = new JSB.Piece();
    piece.cache = [[JSB.Event.empty()]];
    $.JSB.init(piece);
    $.keyElement.innerText = $.JSB.piece.key.string();
    $.noteElement = undefined;
    $.HTML.render($.JSB.piece.cache);
    $.VF.render($.JSB.piece.bars);
  },

  keydown(e) {
    if (e.ctrlKey) {
      if (e.shiftKey) {
        //
      } else {
        switch (e.key) {
          case "Enter": $.manage.appendBar(); break;
          case "Backspace": $.manage.deleteBar(); break;
        }
      }
    } else {
      if (e.shiftKey) {
        switch (e.key) {
          case "Tab": e.preventDefault(); $.location.previousNote(); break;
          case ":": $.manage.toggleEventType("end"); break;
        }
      } else {
        switch (e.key) {
          case "a": $.edit.letter(5); break;
          case "b": $.edit.letter(6); break;
          case "c": $.edit.letter(0); break;
          case "d": $.edit.letter(1); break;
          case "e": $.edit.letter(2); break;
          case "f": $.edit.letter(3); break;
          case "g": $.edit.letter(4); break;
          case "1": $.edit.octave(1); break;
          case "2": $.edit.octave(2); break;
          case "3": $.edit.octave(3); break;
          case "4": $.edit.octave(4); break;
          case "5": $.edit.octave(5); break;
          case "#": $.edit.accidental(1); break;
          case "'": $.edit.accidental(-1); break;
          case ",": $.edit.augmentDuration(); break;
          case ".": $.edit.toggleDot(); break;
          case "/": $.edit.diminishDuration(); break;
          case "ArrowLeft": e.preventDefault(); $.location.previousEvent(); break;
          case "ArrowRight": e.preventDefault(); $.location.nextEvent(); break;
          case "ArrowUp": e.preventDefault(); $.location.abovePart(); break;
          case "ArrowDown": e.preventDefault(); $.location.belowPart(); break;
          case "Tab": e.preventDefault(); $.location.nextNote(); break;
          case "Enter": $.manage.appendEvent(); break;
          case "Backspace": $.manage.deleteEvent(); break;
          case "Delete": $.manage.clearGroup(); break;
          case ";": $.manage.toggleEventType("cadence"); break;
        }
      }
    }
  },

  initEventListeners() {
    document.addEventListener("keydown", $.keydown);
    document.getElementById("delete-bar").addEventListener("mousedown", $.manage.deleteBar);
    document.getElementById("delete-event").addEventListener("mousedown", $.manage.deleteEvent);
    document.getElementById("append-event").addEventListener("mousedown", $.manage.appendEvent);
    document.getElementById("append-bar").addEventListener("mousedown", $.manage.appendBar);
    document.getElementById("flatten").addEventListener("mousedown", $.key.flatten);
    $.keyElement.addEventListener("mousedown", $.key.toggleTonality);
    document.getElementById("sharpen").addEventListener("mousedown", $.key.sharpen);
    document.getElementById("harmonise").addEventListener("mousedown", () => $.JSB.harmonise(true));
    document.getElementById("auto").addEventListener("mousedown", function () { $.toggleAuto(this) });
    document.getElementById("clear").addEventListener("mousedown", $.clear);
  },

  init() {
    const piece = new JSB.Piece().setKey(JSB.Key.parse("A major"))
      .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s")
      .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b");
    $.JSB.init(piece);
    $.noteElement = undefined;
    $.auto = true;
    $.keyElement = document.getElementById("key");
    $.box = document.getElementById("piece-box");
    $.initEventListeners();
    $.HTML.render($.JSB.piece.cache);
    $.VF.render($.JSB.piece.bars);
  }
};

$.init();

console.log(
  "%cJSB%cHarmoniser",
  `padding: 5px;
border-radius: 5px;
color: #000000;
background-image: linear-gradient(to right, #9d5ee0, #bc7eff);
font-size: 20px;`,
  `margin: 5px;
padding: 5px;
border-radius: 2px;
color: #000000;
background-image: linear-gradient(to right, #d3a9ff, #ffffff);
  `
);
