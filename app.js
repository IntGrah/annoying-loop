const VF = Vex.Flow;
const factory = new Vex.Flow.Factory({ renderer: { elementId: "output" } });
const score = factory.EasyScore();

const $ = {
  piece: new JSB.Piece()
    .setKey(JSB.Key.parse("A major"))
    .parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s")
    .parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b"),
  barIndex: 0,
  eventIndex: 0,
  part: "s",
  noteIndex: 0,
  auto: true,
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

  table() {
    const barsHtml = $.piece.cache.map((bar, barIndex) => {
      const eventsHtml = bar.map((event, eventIndex) => {
        const group = $.group();

        const sHtml = document.createElement("div");
        sHtml.classList.add("group");
        if (event.s === group) {
          sHtml.classList.add("selected");
        }
        if (event.s.notes.length > 1) {
          sHtml.classList.add("multi");
        }
        sHtml.appendChild(
          document.createTextNode(event.s.main()?.string() ?? "")
        );
        sHtml.addEventListener("mousedown", () =>
          $.select(barIndex, eventIndex, "s", 0)
        );

        const aHtml = document.createElement("div");
        aHtml.classList.add("group");
        if (event.a === group) {
          aHtml.classList.add("selected");
        }
        if (event.a.notes.length > 1) {
          sHtml.classList.add("multi");
        }
        aHtml.appendChild(
          document.createTextNode(event.a.main()?.string() ?? "")
        );
        aHtml.addEventListener("mousedown", () =>
          $.select(barIndex, eventIndex, "a", 0)
        );

        const tHtml = document.createElement("div");
        tHtml.classList.add("group");
        if (event.t === group) {
          tHtml.classList.add("selected");
        }
        if (event.t.notes.length > 1) {
          sHtml.classList.add("multi");
        }
        tHtml.appendChild(
          document.createTextNode(event.t.main()?.string() ?? "")
        );
        tHtml.addEventListener("mousedown", () =>
          $.select(barIndex, eventIndex, "t", 0)
        );

        const bHtml = document.createElement("div");
        bHtml.classList.add("group");
        if (event.b === group) {
          bHtml.classList.add("selected");
        }
        if (event.b.notes.length > 1) {
          sHtml.classList.add("multi");
        }
        bHtml.appendChild(
          document.createTextNode(event.b.main()?.string() ?? "")
        );
        bHtml.addEventListener("mousedown", () =>
          $.select(barIndex, eventIndex, "b", 0)
        );

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
    const notesHtml = $.group().notes.map((note, noteIndex) => {
      const noteHtml = document.createElement("span");
      noteHtml.classList.add("note");
      if (note === $.note()) {
        noteHtml.classList.add("selected");
      }
      noteHtml.appendChild(document.createTextNode(note.string()));
      noteHtml.addEventListener("mousedown", () =>
        $.select($.barIndex, $.eventIndex, $.part, noteIndex)
      );
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

  render(bars) {
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

  select(barIndex, eventIndex, part, noteIndex) {
    $.barIndex = barIndex;
    $.eventIndex = eventIndex;
    $.part = part;
    $.noteIndex = noteIndex;
    $.update(false);
  },

  group() {
    return $.piece.cache[$.barIndex][$.eventIndex].get($.part);
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

  update(harmonise) {
    $.table();
    if (harmonise && $.auto) {
      $.harmonise();
    }
  },

  harmonise() {
    try {
      $.piece.harmonise();
      $.render($.piece.bars);
    } catch (error) {
      const piece = document.getElementById("piece");
      const time = $.piece.maxTime;
      const event = piece.children[time.barIndex].children[time.eventIndex];
      event.classList.add("error");
      $.render($.piece.cache);
      console.log(error);
    }
  },

  deleteEvent() {
    if ($.piece.cache[$.barIndex].length > 1) {
      $.piece.cache[$.barIndex].splice($.eventIndex, 1);
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
    $.update(true);
  },

  deleteBar() {
    if ($.piece.cache.length > 1) {
      $.piece.cache.splice($.barIndex, 1);
      if (--$.barIndex < 0) {
        $.barIndex = 0;
      }
      $.eventIndex = 0;
      $.noteIndex = 0;
      $.update(true);
    }
  },

  appendEvent() {
    $.piece.cache[$.barIndex].splice(
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
    $.update(true);
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
    $.update(true);
  },

  clearGroup() {
    $.group().index = 0;
    $.group().notes = [];
    $.update(true);
  },

  flatten() {
    if ($.piece.key.accidentals() > -7) {
      $.piece.key.tone = $.piece.key.degree(3);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.update(true);
  },

  toggleTonality() {
    if ($.piece.key.tonality) {
      $.piece.key = new JSB.Key($.piece.key.degree(5), false);
    } else {
      $.piece.key = new JSB.Key($.piece.key.degree(2), true);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.update(true);
  },

  sharpen() {
    if ($.piece.key.accidentals() < 7) {
      $.piece.key.tone = $.piece.key.degree(4);
    }
    $.keyElement.innerText = $.piece.key.string();
    $.update(true);
  },

  toggleAuto() {
    $.auto = !$.auto;
    $.autoElement.innerText = "Auto: " + ($.auto ? "on" : "off");
    if ($.auto) {
      $.update(true);
    }
  },

  setLetter(letter) {
    $.defaultNote().pitch.tone = JSB.Tone.parse(["C", "D", "E", "F", "G", "A", "B"][letter]).alterAccidental($.piece.key.signature()[letter]);
    $.update(true);
  },

  setOctave(octave) {
    $.defaultNote().pitch.octave = octave;
    $.update(true);
  },

  alterAccidental(accidental) {
    $.defaultNote().pitch.tone.alterAccidental(accidental);
    $.update(true);
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
    $.update(true);
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
    $.update(true);
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
    $.update(true);
  },

  left() {
    if ($.eventIndex-- === 0) {
      if ($.barIndex-- === 0) {
        $.barIndex = 0;
        $.eventIndex = 0;
      } else {
        $.eventIndex = $.piece.cache[$.barIndex].length - 1;
        $.noteIndex = 0;
      }
    } else {
      $.noteIndex = 0;
    }
    $.update(false);
  },

  right() {
    if (
      ++$.eventIndex === $.piece.cache[$.barIndex].length
    ) {
      if (++$.barIndex === $.piece.cache.length) {
        --$.barIndex;
        --$.eventIndex;
      } else {
        $.eventIndex = 0;
        $.noteIndex = 0;
      }
    } else {
      $.noteIndex = 0;
    }
    $.update(false);
  },

  up() {
    switch ($.part) {
      case "a":
        $.part = "s";
        break;
      case "t":
        $.part = "a";
        break;
      case "b":
        $.part = "t";
        break;
    }
    $.update(false);
  },

  down() {
    switch ($.part) {
      case "s":
        $.part = "a";
        break;
      case "a":
        $.part = "t";
        break;
      case "t":
        $.part = "b";
        break;
    }
    $.update(false);
  },

  nextNote() {
    const length = $.group().notes.length;
    ++$.noteIndex;
    $.noteIndex %= length;
    $.update(false);
  },

  previousNote() {
    const length = $.group().notes.length;
    $.noteIndex += length - 1;
    $.noteIndex %= length;
    $.update(false);
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
          case "ArrowLeft": $.left(); break;
          case "ArrowRight": $.right(); break;
          case "ArrowUp": $.up(); break;
          case "ArrowDown": $.down(); break;
          case "Tab": e.preventDefault(); $.nextNote(); break;
          case "Enter": $.appendEvent(); break;
          case "Backspace": $.deleteEvent(); break;
          case " ": $.clearGroup(); break;
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
    document.getElementById("flatten")?.addEventListener("mousedown", $.flatten);
    $.keyElement.addEventListener("mousedown", $.toggleTonality);
    document.getElementById("sharpen")?.addEventListener("mousedown", $.sharpen);
    document.getElementById("harmonise")?.addEventListener("mousedown", $.harmonise);
    $.autoElement.addEventListener("mousedown", $.toggleAuto);
  },

  init() {
    $.eventListeners();
    $.table();
    $.harmonise();
    $.render($.piece.bars);
  }
};

$.init();
