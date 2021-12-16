const VF = Vex.Flow;
const factory = new Vex.Flow.Factory({ renderer: { elementId: "output" } });
const score = factory.EasyScore();

const $ = {
  piece: new JSB.Piece().setKey(JSB.Key.parse("A major"))
    .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s")
    .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b"),
  barIndex: 0,
  eventIndex: 0,
  groupIndex: 0,
  part: "s",
  noteIndex: 0,
  auto: true,
  noteElmt: undefined,
  boxElmt: document.getElementById("piece-box"),
  keyElmt: document.getElementById("key"),
  autoElmt: document.getElementById("auto"),
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
  mousedown: new MouseEvent("mousedown"),

  html() {
    const selectedEvent = $.event();
    const selectedGroup = $.group();
    const selectedNote = $.note();
    const barsElmt = $.piece.cache.map((bar, barIndex) => {
      const eventsElmt = bar.map((event, eventIndex) => {
        const eventElmt = document.createElement("div");
        const groupsElmt = ["s", "a", "t", "b"].map(part => {
          const group = event.get(part);
          const groupElmt = document.createElement("div");
          groupElmt.classList.add("group");
          if (group.notes.length > 1) {
            groupElmt.classList.add("multi");
          }
          if (group.notes.length === 0) {
            const noteElmt = document.createElement("span");
            noteElmt.classList.add("note");
            if (group === selectedGroup) {
              noteElmt.classList.add("selected");
              $.noteElmt = noteElmt;
            }
            noteElmt.addEventListener("mousedown", () => $.select(noteElmt));
            groupElmt.appendChild(noteElmt);
          } else {
            const notesElmt = group.notes.map((note, noteIndex) => {
              const noteElmt = document.createElement("span");
              noteElmt.classList.add("note");
              if (note === selectedNote) {
                noteElmt.classList.add("selected");
                $.noteElmt = noteElmt;
              }
              noteElmt.appendChild(document.createTextNode(note.string()));
              noteElmt.addEventListener("mousedown", () => $.select(noteElmt));
              return noteElmt;
            });
            groupElmt.append(...notesElmt);
          }
          return groupElmt;
        });
        eventElmt.classList.add("event");
        if (event === selectedEvent) {
          eventElmt.classList.add("selected");
        }
        switch (event.type) {
          case "cadence": eventElmt.classList.add("cadence"); break;
          case "end": eventElmt.classList.add("end"); break;
        }
        eventElmt.append(...groupsElmt);
        return eventElmt;
      });
      const barElmt = document.createElement("span");
      barElmt.classList.add("bar");
      barElmt.append(...eventsElmt);
      return barElmt;
    });
    const pieceElmt = document.createElement("div");
    pieceElmt.id = "piece";
    pieceElmt.append(...barsElmt);

    $.boxElmt.innerHTML = "";
    $.boxElmt.appendChild(pieceElmt);
  },

  vexflow(bars) {
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
          num_beats: bar
            .map(event => event.duration())
            .reduce((l, r) => l + r),
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

  index(elmt) {
    return Array.prototype.indexOf.call(elmt.parentElement.children, elmt);
  },

  select(noteElmt) {
    if (!noteElmt) {
      return;
    }
    $.barIndex = $.index(noteElmt.parentElement.parentElement.parentElement);
    $.eventIndex = $.index(noteElmt.parentElement.parentElement);
    $.groupIndex = [$.index(noteElmt.parentElement)];
    $.part = ["s", "a", "t", "b"][$.groupIndex];
    $.noteIndex = $.index(noteElmt);

    $.noteElmt.parentElement.parentElement.classList.remove("selected");
    $.noteElmt.classList.remove("selected");
    $.noteElmt = noteElmt;
    $.noteElmt.parentElement.parentElement.classList.add("selected");
    $.noteElmt.classList.add("selected");
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

  defaultNote() {
    if ($.note() === undefined) {
      $.group().notes = [JSB.Note.parse("C4")];
    }
    return $.note();
  },

  harmonise(force = false) {
    if (force || $.auto)
      try {
        $.piece.harmonise();
        $.vexflow($.piece.bars);
      } catch (error) {
        console.log(error);
        const time = $.piece.maxTime;
        $.boxElmt.firstElementChild.children[time.barIndex].children[time.eventIndex].classList.add("error");
        $.vexflow($.piece.cache);
      }
  },

  deleteEvent() {
    const bar = $.bar();
    if (bar.length > 1) {
      bar.splice($.eventIndex, 1);
      if (--$.eventIndex < 0) {
        $.eventIndex = 0;
      }
    } else if ($.piece.cache.length > 1) {
      $.piece.cache.splice($.barIndex, 1);
      if (--$.barIndex < 0) {
        $.barIndex = 0;
      }
      $.eventIndex = 0;
    }
    $.noteIndex = 0;
    $.html();
    $.harmonise();
  },

  deleteBar() {
    if ($.piece.cache.length > 1) {
      $.piece.cache.splice($.barIndex, 1);
      if (--$.barIndex < 0) {
        $.barIndex = 0;
      }
      $.eventIndex = 0;
      $.noteIndex = 0;
      $.html();
      $.harmonise();
    }
  },

  appendEvent() {
    $.bar().splice(
      ++$.eventIndex,
      0,
      new JSB.Event(
        JSB.Group.empty(),
        JSB.Group.empty(),
        JSB.Group.empty(),
        JSB.Group.empty(),
        "normal"
      )
    );
    $.html();
    $.harmonise();
  },

  appendBar() {
    $.piece.cache.splice($.barIndex + 1, 0, [
      new JSB.Event(
        JSB.Group.empty(),
        JSB.Group.empty(),
        JSB.Group.empty(),
        JSB.Group.empty(),
        "normal"
      ),
    ]);
    ++$.barIndex;
    $.eventIndex = 0;
    $.noteIndex = 0;
    $.html();
    $.harmonise();
  },

  clearGroup() {
    $.group().index = 0;
    $.group().notes = [];
    $.html();
    $.harmonise();
  },

  flattenKey() {
    if ($.piece.key.accidentals() > -7) {
      $.piece.key.tone = $.piece.key.degree(3);
    }
    $.keyElmt.innerText = $.piece.key.string();
    $.html();
    $.harmonise();
  },

  toggleTonality() {
    if ($.piece.key.tonality) {
      $.piece.key = new JSB.Key($.piece.key.degree(5), false);
    } else {
      $.piece.key = new JSB.Key($.piece.key.degree(2), true);
    }
    $.keyElmt.innerText = $.piece.key.string();
    $.html();
    $.harmonise();
  },

  sharpenKey() {
    if ($.piece.key.accidentals() < 7) {
      $.piece.key.tone = $.piece.key.degree(4);
    }
    $.keyElmt.innerText = $.piece.key.string();
    $.html();
    $.harmonise();
  },

  toggleAuto() {
    $.auto = !$.auto;
    $.autoElmt.innerText = "Auto: " + ($.auto ? "on" : "off");
    if ($.auto) {
      $.html();
      $.harmonise();
    }
  },

  setLetter(letter) {
    $.defaultNote().pitch.tone = JSB.Tone.parse(["C", "D", "E", "F", "G", "A", "B"][letter]).alterAccidental($.piece.key.signature()[letter]);
    $.html();
    $.harmonise();
  },

  setOctave(octave) {
    const note = $.note();
    if (note) {
      note.pitch.octave = octave;
      $.html();
      $.harmonise();
    }
  },

  alterAccidental(accidental) {
    $.defaultNote().pitch.tone.alterAccidental(accidental);
    $.html();
    $.harmonise();
  },

  augmentDuration() {
    switch ($.defaultNote().duration) {
      case 0.25:
      case 0.5:
      case 0.75:
      case 1:
      case 1.5:
      case 2:
      case 3:
      case 4:
      case 6:
        $.defaultNote().duration *= 2;
        break;
    }
    $.html();
    $.harmonise();
  },

  toggleDot() {
    switch ($.defaultNote().duration) {
      case 0.5:
      case 1:
      case 2:
      case 4:
      case 8:
        $.defaultNote().duration *= 1.5;
        break;
      case 0.75:
      case 1.5:
      case 3:
      case 6:
      case 12:
        $.defaultNote().duration /= 1.5;
        break;
    }
    $.html();
    $.harmonise();
  },

  diminishDuration() {
    switch ($.defaultNote().duration) {
      case 0.5:
      case 1:
      case 1.5:
      case 2:
      case 3:
      case 4:
      case 6:
      case 8:
      case 12:
        $.defaultNote().duration *= 0.5;
        break;
    }
    $.html();
    $.harmonise();
  },

  previousEvent() {
    const event = $.noteElmt.parentElement.parentElement;
    $.select(event.previousElementSibling?.children[$.groupIndex].firstElementChild ?? event.parentElement.previousElementSibling?.lastElementChild.children[$.groupIndex].firstElementChild);
  },

  nextEvent() {
    const event = $.noteElmt.parentElement.parentElement;
    $.select(event.nextElementSibling?.children[$.groupIndex].firstElementChild ?? event.parentElement.nextElementSibling?.firstElementChild.children[$.groupIndex].firstElementChild);
  },

  up() {
    $.select($.noteElmt.parentElement.previousElementSibling?.firstElementChild);
  },

  down() {
    $.select($.noteElmt.parentElement.nextElementSibling?.firstElementChild);
  },

  nextNote() {
    $.select($.noteElmt.nextElementSibling ?? $.noteElmt.parentElement.firstElementChild);
  },

  previousNote() {
    $.select($.noteElmt.previousElementSibling ?? $.noteElmt.parentElement.lastElementChild);
  },

  toggleEventType(type) {
    const event = $.event();
    if (event.type === "normal") {
      event.type = { ";": "cadence", ":": "end" }[type];
    } else {
      event.type = "normal";
    }
    $.html();
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
          case ":": $.toggleEventType(":"); break;
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
          case ";": $.toggleEventType(";"); break;
        }
      }
    }
  },

  eventListeners() {
    document.getElementById("delete-bar")?.addEventListener("mousedown", $.deleteBar);
    document.getElementById("delete-event")?.addEventListener("mousedown", $.deleteEvent);
    document.getElementById("append-event")?.addEventListener("mousedown", $.appendEvent);
    document.getElementById("append-bar")?.addEventListener("mousedown", $.appendBar);
    document.addEventListener("keydown", $.keydown);
    document.getElementById("flatten")?.addEventListener("mousedown", $.flattenKey);
    $.keyElmt.addEventListener("mousedown", $.toggleTonality);
    document.getElementById("sharpen")?.addEventListener("mousedown", $.sharpenKey);
    document.getElementById("harmonise")?.addEventListener("mousedown", $.harmonise);
    $.autoElmt.addEventListener("mousedown", $.toggleAuto);
  },

  init() {
    $.eventListeners();
    $.html();
    $.harmonise();
    $.vexflow($.piece.bars);
  }
};

$.init();
