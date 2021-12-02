import * as JSB from "https://unpkg.com/jsb-js";
import Vex from "https://unpkg.com/vexflow";

const VF = Vex.Flow;

console.clear();

const piece = new JSB.Piece("A major", "[A4|A A (F#/,G#/) A|(B/,A/) G# F#_@|G# A B E4/ F#/|(G#/,A/) F# E@]").load("[A3|A2 C# D F#|D# E B_@|G# F# E G#/ A/|B B2 E@]", "b").harmonise();

var div = document.getElementById("output")
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

renderer.resize(500, 500);

var context = renderer.getContext();

var stave = new VF.Stave(10, 40, 400);

stave.addClef("treble").addTimeSignature("4/4");

stave.setContext(context).draw();

var notes = [
  new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q" }),
  new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),
  new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),
  new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
];

var notes2 = [
  new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "w" })
];

var voices = [
  new VF.Voice({num_beats: 4,  beat_value: 4}).addTickables(notes),
  new VF.Voice({num_beats: 4,  beat_value: 4}).addTickables(notes2)
];

var formatter = new VF.Formatter().joinVoices(voices).format(voices, 400);

voices.forEach(voice => voice.draw(context, stave));