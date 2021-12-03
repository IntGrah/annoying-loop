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

const input = [];

$("#piece .bar table tr td").on("mousedown", function () {
  selected.click(
    $(this),
    $(this).parent().parent().parent().index(),
    $(this).index(),
    $(this).parent().index()
  );
});

$(document).on("keydown", e => {
  switch (e.key) {
    case "a":
      break;
    case "b":
      break;
    case "c":
      break;
    case "d":
      break;
    case "e":
      break;
    case "f":
      break;
    case "g":
      break;
    case "Tab":
      e.preventDefault();
      selected.click();
      break;
    case "Enter":
      break;
  }
});