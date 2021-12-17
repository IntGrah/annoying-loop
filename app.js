const VF = Vex.Flow;
const factory = new Vex.Flow.Factory({ renderer: { elementId: "output" } });
const score = factory.EasyScore();

const $ = {
  VERSION: "1.0.0",
  piece: new JSB.Piece().setKey(JSB.Key.parse("A major"))
    .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s")
    .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b"),
  barIndex: 0,
  eventIndex: 0,
  groupIndex: 0,
  part: "s",
  noteIndex: 0,
  noteElement: null,
  auto: true,
  pieceBoxElement: document.getElementById("piece-box"),
  keyElement: document.getElementById("key"),
  autoElement: document.getElementById("auto"),
  durations: {
    0.25: "16",
    0.5: "8",
    0.75: "8",
    1: "4",
    1.5: "4",
    2: "2",
    3: "2",
    4: "1",
    6: "1",
    8: "1/2",
    12: "1/2"
  },

  HTML: {
    createPieceElement(children) {
      const element = document.createElement("div");
      element.id = "piece";
      element.append(...children);
      return element;
    },

    createBarElement(children) {
      const element = document.createElement("span");
      element.classList.add("bar");
      element.append(...children);
      return element;
    },

    createEventElement(children, selected, type) {
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

    createGroupElement(children, selected) {
      const element = document.createElement("div");
      element.classList.add("group");
      if (children.length > 1) {
        element.classList.add("multi");
      }
      if (children.length === 0) {
        element.appendChild($.HTML.createNoteElement("", selected));
      } else {
        element.append(...children);
      }
      return element;
    },

    createNoteElement(string, selected) {
      const element = document.createElement("span");
      element.classList.add("note");
      if (selected) {
        element.classList.add("selected");
        $.noteElement = element;
      }
      element.appendChild(document.createTextNode(string));
      element.addEventListener("mousedown", () => $.select(element));
      return element;
    },

    init(bars) {
      const selectedEvent = $.event();
      const selectedGroup = $.group();
      const selectedNote = $.note();
      $.pieceBoxElement.innerHTML = "";
      $.pieceBoxElement.appendChild(
        $.HTML.createPieceElement(
          bars.map(
            bar => $.HTML.createBarElement(
              bar.map(
                event => $.HTML.createEventElement(
                  [event.s, event.a, event.t, event.b].map(
                    group => $.HTML.createGroupElement(
                      group.notes.map(note => $.HTML.createNoteElement(note.string(), note === selectedNote)),
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

  VF(bars) {
    let x = 40;

    factory.getContext().clear();
    factory.getContext().resize(100000, 240);

    for (let i = 0, width = 0; i < bars.length; ++i, x += width) {
      const bar = bars[i];

      const vfParts = ["s", "a", "t", "b"].map(part => {
        const clef = part === "s" || part === "a" ? "treble" : "bass";
        const accidentals = Array(6).fill($.piece.key.signature());
        const vfNotes = [];
        for (const event of bar) {
          const notes = event.get(part).notes;
          const vfGroup = notes.map(note => {
            const vfNote = new VF.StaveNote({
              clef: clef,
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
            if (part === "s" && event.type === "cadence") {
              vfNote.addArticulation(0, new VF.Articulation("a@a"));
            }
            return vfNote;
          });

          vfNotes.push(...vfGroup);

          let difference = event.duration() - event.get(part).duration();

          const vfRests = [];

          while (difference > 0) {
            const duration = [12, 8, 6, 4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25].filter(n => n <= difference)[0];
            difference -= duration;
            const vfRest = new VF.StaveNote({
              clef: clef,
              keys: [{ "s": "A/5", "a": "C/4", "t": "C/4", "b": "E/2" }[part]],
              duration: $.durations[duration] + "r",
            });
            if ([0.75, 1.5, 3, 6, 12].includes(duration)) {
              vfRest.addDot(0);
            }
            vfRests.unshift(vfRest);
          }
          vfNotes.push(...vfRests);
        }
        return vfNotes;
      });

      width = 20 + 40 * bar.map(event => event.duration()).reduce((l, r) => l + r);

      if (i === 0) {
        width += 20 * Math.abs($.piece.key.accidentals());
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
          score.voice(vfParts[0], vfTime).setStrict(false),
          score.voice(vfParts[1], vfTime).setStrict(false),
        ],
      });

      const lower = system.addStave({
        voices: [
          score.voice(vfParts[2], vfTime).setStrict(false),
          score.voice(vfParts[3], vfTime).setStrict(false),
        ],
      });

      const vfKey = $.piece.key.tonality
        ? $.piece.key.tone.string()
        : $.piece.key.degree(2).string();

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
  },

  index(element) {
    return Array.prototype.indexOf.call(element.parentElement.children, element);
  },

  select(noteElement) {
    if (!noteElement) {
      return;
    }
    $.barIndex = $.index(noteElement.parentElement.parentElement.parentElement);
    $.eventIndex = $.index(noteElement.parentElement.parentElement);
    $.groupIndex = [$.index(noteElement.parentElement)];
    $.part = ["s", "a", "t", "b"][$.groupIndex];
    $.noteIndex = $.index(noteElement);

    $.noteElement.parentElement.parentElement.classList.remove("selected");
    $.noteElement.classList.remove("selected");
    $.noteElement = noteElement;
    $.noteElement.parentElement.parentElement.classList.add("selected");
    $.noteElement.classList.add("selected");
  },

  bar() {
    return $.piece.cache[$.barIndex];
  },

  event() {
    return $.bar()[$.eventIndex];
  },

  group() {
    return $.event().get($.part);
  },

  note() {
    return $.group().notes[$.noteIndex];
  },

  harmonise(force = false) {
    if (force || $.auto)
      try {
        $.piece.harmonise();
        $.VF($.piece.bars);
      } catch (error) {
        console.log(error);
        const time = $.piece.maxTime;
        $.pieceBoxElement.firstElementChild.children[time.barIndex].children[time.eventIndex].classList.add("error");
        $.VF($.piece.cache);
      }
  },

  deleteEvent() {
    const bar = $.bar();
    if (bar.length > 1) {
      const eventElement = $.noteElement.parentElement.parentElement;
      const newNoteElement = eventElement.previousElementSibling?.children[$.groupIndex].firstElementChild ?? eventElement.nextElementSibling.children[$.groupIndex].firstElementChild;
      bar.splice($.eventIndex, 1);
      eventElement.remove();
      $.select(newNoteElement)
      $.harmonise();
    } else {
      $.deleteBar();
    }
  },

  deleteBar() {
    if ($.piece.cache.length === 1) {
      return;
    }
    const barElement = $.noteElement.parentElement.parentElement.parentElement;
    const newNoteElement = barElement.previousElementSibling?.lastElementChild.children[$.groupIndex].firstElementChild ?? barElement.nextElementSibling.firstElementChild.children[$.groupIndex].firstElementChild;
    $.piece.cache.splice($.barIndex, 1);
    barElement.remove();
    $.select(newNoteElement)
    $.harmonise();
  },

  appendEvent() {
    $.bar().splice($.eventIndex, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), "normal"));
    const eventElement = $.HTML.createEventElement([
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
    ], true, "normal");
    $.noteElement.parentElement.parentElement.insertAdjacentElement("afterend", eventElement);
    $.select(eventElement.children[$.groupIndex].firstElementChild);
    $.harmonise();
  },

  appendBar() {
    $.piece.cache.splice($.barIndex, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), "normal"),]);
    const barElement = $.HTML.createBarElement([$.HTML.createEventElement([
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
      $.HTML.createGroupElement([], false),
    ], true, "normal")]);
    $.noteElement.parentElement.parentElement.parentElement.insertAdjacentElement("afterend", barElement);
    $.select(barElement.firstElementChild.children[$.groupIndex].firstElementChild);
    $.harmonise();
  },

  clearGroup() {
    $.group().index = 0;
    $.group().notes = [];
    const groupElement = $.noteElement.parentElement;
    groupElement.innerHTML = "";
    groupElement.appendChild($.HTML.createNoteElement("", true));
    $.select(groupElement.firstElementChild);
    $.harmonise();
  },

  flattenKey() {
    if ($.piece.key.accidentals() > -7) {
      $.piece.key.tone = $.piece.key.degree(3);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.harmonise();
  },

  toggleTonality() {
    if ($.piece.key.tonality) {
      $.piece.key = new JSB.Key($.piece.key.degree(5), false);
    } else {
      $.piece.key = new JSB.Key($.piece.key.degree(2), true);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.harmonise();
  },

  sharpenKey() {
    if ($.piece.key.accidentals() < 7) {
      $.piece.key.tone = $.piece.key.degree(4);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.harmonise();
  },

  toggleAuto() {
    $.auto = !$.auto;
    $.autoElement.innerText = "Auto: " + ($.auto ? "on" : "off");
    if ($.auto) {
      $.harmonise();
    }
  },

  setLetter(letter) {
    if ($.note() === undefined) {
      $.group().notes = [JSB.Note.parse("C4")];
    }
    const note = $.note();
    note.pitch.tone = JSB.Tone.parse(["C", "D", "E", "F", "G", "A", "B"][letter]).alterAccidental($.piece.key.signature()[letter]);
    $.noteElement.innerText = note.string();
    $.harmonise();
  },

  setOctave(octave) {
    const note = $.note();
    if (!note) {
      return;
    }
    note.pitch.octave = octave;
    $.noteElement.innerText = note.string();
    $.harmonise();
  },

  alterAccidental(accidental) {
    const note = $.note();
    if (!note) {
      return;
    }
    note.pitch.tone.alterAccidental(accidental);
    $.noteElement.innerText = note.string();
    $.harmonise();
  },

  augmentDuration() {
    const note = $.note();
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
    $.harmonise();
  },

  toggleDot() {
    const note = $.note();
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
    $.harmonise();
  },

  diminishDuration() {
    const note = $.note();
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
    $.harmonise();
  },

  previousEvent() {
    const eventElement = $.noteElement.parentElement.parentElement;
    $.select(eventElement.previousElementSibling?.children[$.groupIndex].firstElementChild ?? eventElement.parentElement.previousElementSibling?.lastElementChild.children[$.groupIndex].firstElementChild);
  },

  nextEvent() {
    const eventEvent = $.noteElement.parentElement.parentElement;
    $.select(eventEvent.nextElementSibling?.children[$.groupIndex].firstElementChild ?? eventEvent.parentElement.nextElementSibling?.firstElementChild.children[$.groupIndex].firstElementChild);
  },

  up() {
    $.select($.noteElement.parentElement.previousElementSibling?.firstElementChild);
  },

  down() {
    $.select($.noteElement.parentElement.nextElementSibling?.firstElementChild);
  },

  nextNote() {
    $.select($.noteElement.nextElementSibling ?? $.noteElement.parentElement.firstElementChild);
  },

  previousNote() {
    $.select($.noteElement.previousElementSibling ?? $.noteElement.parentElement.lastElementChild);
  },

  toggleEventType(type) {
    const event = $.event();
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
    $.harmonise();
  },

  keydown(e) {
    if (e.ctrlKey) {
      if (e.shiftKey) {
        //
      } else {
        switch (e.key) {
          case "Enter": $.appendBar(); break;
          case "Backspace": $.deleteBar(); break;
        }
      }
    } else {
      if (e.shiftKey) {
        switch (e.key) {
          case "Tab": e.preventDefault(); $.previousNote(); break;
          case ":": $.toggleEventType("end"); break;
        }
      } else {
        switch (e.key) {
          case "a": $.setLetter(5); break;
          case "b": $.setLetter(6); break;
          case "c": $.setLetter(0); break;
          case "d": $.setLetter(1); break;
          case "e": $.setLetter(2); break;
          case "f": $.setLetter(3); break;
          case "g": $.setLetter(4); break;
          case "1": $.setOctave(1); break;
          case "2": $.setOctave(2); break;
          case "3": $.setOctave(3); break;
          case "4": $.setOctave(4); break;
          case "5": $.setOctave(5); break;
          case "#": $.alterAccidental(1); break;
          case "'": $.alterAccidental(-1); break;
          case ",": $.augmentDuration(); break;
          case ".": $.toggleDot(); break;
          case "/": $.diminishDuration(); break;
          case "ArrowLeft": e.preventDefault(); $.previousEvent(); break;
          case "ArrowRight": e.preventDefault(); $.nextEvent(); break;
          case "ArrowUp": e.preventDefault(); $.up(); break;
          case "ArrowDown": e.preventDefault(); $.down(); break;
          case "Tab": e.preventDefault(); $.nextNote(); break;
          case "Enter": $.appendEvent(); break;
          case "Backspace": $.deleteEvent(); break;
          case "Delete": $.clearGroup(); break;
          case ";": $.toggleEventType("cadence"); break;
        }
      }
    }
  },

  initEventListeners() {
    document.getElementById("delete-bar")?.addEventListener("mousedown", $.deleteBar);
    document.getElementById("delete-event")?.addEventListener("mousedown", $.deleteEvent);
    document.getElementById("append-event")?.addEventListener("mousedown", $.appendEvent);
    document.getElementById("append-bar")?.addEventListener("mousedown", $.appendBar);
    document.addEventListener("keydown", $.keydown);
    document.getElementById("flatten")?.addEventListener("mousedown", $.flattenKey);
    $.keyElement.addEventListener("mousedown", $.toggleTonality);
    document.getElementById("sharpen")?.addEventListener("mousedown", $.sharpenKey);
    document.getElementById("harmonise")?.addEventListener("mousedown", $.harmonise);
    $.autoElement.addEventListener("mousedown", $.toggleAuto);
  },

  init() {
    $.initEventListeners();
    $.HTML.init($.piece.cache);
    $.harmonise();
    $.VF($.piece.bars);
  }
};

$.init();
