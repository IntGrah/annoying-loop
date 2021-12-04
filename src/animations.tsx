import * as JSB from "../node_modules/jsb-js/dist/index.js";
import render from "./render.js";
import display from "./display.js";

const piece = new JSB.Piece().setKey("A major");

const selected = {
  bar: 0,
  event: 0,
  part: 0,
  index: 0,
  click(bar: number, event: number, part: number) {
    this.bar = bar;
    this.event = event;
    this.part = part;
  }
};

$(document).ready(function () {
  $("#piece .bar table tr td").on("mousedown", function () {
    selected.click(
      $(this).parent().parent().parent().index(),
      $(this).index(),
      $(this).parent().index()
    );
  });

  $("#tonality").on("mousedown", function () {
    if ($(this).text() === "Major") {
      $(this).text("Minor");
    } else {
      $(this).text("Major");
    }
  });
});

const anthem = new JSB.Piece().setKey("G major").parse("[(G4/,F#4/) G4 A4|F#4. G4/ A4|B4@ B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.@]", "s").harmonise();
render(anthem);
display(anthem);