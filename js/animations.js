import Note from "./app.js";

class Selected {
  constructor() {
    this.element = $(".selected");
    this.bar = 0;
    this.event = 0;
    this.part = 0;
    this.index = 0;
  }
  click(element, bar, event, part) {
    this.element.removeClass("selected");
    this.element = element.addClass("selected");
    this.bar = bar;
    this.event = event;
    this.part = part;
    this.index = 0;
  }
};

const selected = new Selected();

$(document).ready(function () {
  $("#piece .bar table tr td").on("mousedown", function () {
    selected.click(
      $(this),
      $(this).parent().parent().parent().index(),
      $(this).index(),
      $(this).parent().index()
    );
  });

  $(this).on("keydown", e => {
    const jsbNote = Note.parse(selected.element.text());
    switch (e.key) {
      case "a":
        jsbNote.letter = 5;
        break;
      case "b":
        jsbNote.letter = 6;
        break;
      case "c":
        jsbNote.letter = 0;
        break;
      case "d":
        jsbNote.letter = 1;
        break;
      case "e":
        jsbNote.letter = 2;
        break;
      case "f":
        jsbNote.letter = 3;
        break;
      case "g":
        jsbNote.letter = 4;
        break;
      case "#":
        jsbNote.accidental < 2 && ++jsbNote.accidental;
        break;
      case "'":
        jsbNote.accidental > -2 && --jsbNote.accidental;
        break;
      case "1":
        jsbNote.octave = 1;
        break;
      case "2":
        jsbNote.octave = 2;
        break;
      case "3":
        jsbNote.octave = 3;
        break;
      case "4":
        jsbNote.octave = 4;
        break;
      case "5":
        jsbNote.octave = 5;
        break;
      case "6":
        jsbNote.octave = 6;
        break;
      case "Tab":
        e.preventDefault();
        selected.click();
        break;
      case "Enter":
        break;
      case "ArrowRight":
        break;
    }
    selected.element.text(jsbNote.string);
  });

  $("#tonality").on("mousedown", function () {
    if ($(this).text() === "Major") {
      $(this).text("Minor");
    } else {
      $(this).text("Major");
    }
  });
});