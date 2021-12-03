import {
  JSB,
  render
} from "./app.js";

const piece = new JSB.Piece("A major");

function display(piece) {
  $("#piece").empty().append(piece.cache.map(bar => `<span class="bar"><table>${["s", "a", "t", "b"].map(part => `<tr>${bar.map(event => `<td>${event[part].string}</td>`).join("")}</tr>`).join("")}</table></span>`).join(""));
  $("#piece").children().eq(selected.bar).children().children().children().eq(selected.part).children().eq(selected.event).addClass("selected");
}

const selected = {
  bar: 0,
  event: 0,
  part: 0,
  index: 0,
  click(bar, event, part) {
    this.bar = bar;
    this.event = event;
    this.part = part;
  }
};

$(document).ready(function () {
  $("#piece .bar table tr td").on("mousedown", function () {
    selected.click(
      $(this),
      $(this).parent().parent().parent().index(),
      $(this).index(),
      $(this).parent().index()
    );
  });

  // $(this).on("keydown", e => {
  //   const jsbNote = JSB.Note.parse(selected.element.text());
  //   switch (e.key) {
  //     case "a":
  //       jsbNote.letter = 5;
  //       break;
  //     case "b":
  //       jsbNote.letter = 6;
  //       break;
  //     case "c":
  //       jsbNote.letter = 0;
  //       break;
  //     case "d":
  //       jsbNote.letter = 1;
  //       break;
  //     case "e":
  //       jsbNote.letter = 2;
  //       break;
  //     case "f":
  //       jsbNote.letter = 3;
  //       break;
  //     case "g":
  //       jsbNote.letter = 4;
  //       break;
  //     case "#":
  //       jsbNote.accidental < 2 && ++jsbNote.accidental;
  //       break;
  //     case "'":
  //       jsbNote.accidental > -2 && --jsbNote.accidental;
  //       break;
  //     case "1":
  //       jsbNote.octave = 1;
  //       break;
  //     case "2":
  //       jsbNote.octave = 2;
  //       break;
  //     case "3":
  //       jsbNote.octave = 3;
  //       break;
  //     case "4":
  //       jsbNote.octave = 4;
  //       break;
  //     case "5":
  //       jsbNote.octave = 5;
  //       break;
  //     case "6":
  //       jsbNote.octave = 6;
  //       break;
  //     case "Tab":
  //       e.preventDefault();
  //       selected.click();
  //       break;
  //     case "Enter":
  //       break;
  //     case "ArrowRight":
  //       break;
  //   }
  //   selected.element.text(jsbNote.string);
  // });

  $("#tonality").on("mousedown", function () {
    if ($(this).text() === "Major") {
      $(this).text("Minor");
    } else {
      $(this).text("Major");
    }
  });
});

const anthem = new JSB.Piece("G major").parse("[(G4/,F#/) G A|F#. G/ A|B@ B C A|B. A/ G|A G F#|G_.@]", "s").harmonise();
render(anthem);
display(anthem);