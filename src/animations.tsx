import render from "./app.js";
import * as JSB from "../node_modules/jsb-js/dist/index.js";

const piece = new JSB.Piece().setKey("A major");

function display(piece: JSB.Piece) {
  $("#piece").empty().append(piece.getInput().map((bar: JSB.Util.Bar) => `<span class="bar"><table>${(["s", "a", "t", "b"] as JSB.Util.Part[]).map(part => `<tr>${bar.map(event => `<td>${event[part].string}</td>`).join("")}</tr>`).join("")}</table></span>`).join(""));
  $("#piece").children().eq(selected.bar).children().children().children().eq(selected.part).children().eq(selected.event).addClass("selected");
}

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