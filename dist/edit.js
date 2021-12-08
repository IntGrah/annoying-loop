"use strict";
document.getElementById("prepend-bar")?.addEventListener("mousedown", () => {
    state.piece.getInput().splice(state.barIndex, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
    state.eventIndex = 0;
    state.noteIndex = 0;
    update();
});
document.getElementById("prepend-event")?.addEventListener("mousedown", () => {
    state.piece.getInput()[state.barIndex].splice(state.eventIndex, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
    state.noteIndex = 0;
    update();
});
document.getElementById("delete-event")?.addEventListener("mousedown", () => {
    if (state.piece.getInput()[state.barIndex].length > 1) {
        state.piece.getInput()[state.barIndex].splice(state.eventIndex, 1);
        if (--state.eventIndex < 0) {
            state.eventIndex = 0;
        }
        state.noteIndex = 0;
        update();
    }
    else if (state.piece.getInput().length > 1) {
        state.piece.getInput().splice(state.barIndex, 1);
        if (--state.barIndex < 0) {
            state.barIndex = 0;
        }
        state.eventIndex = 0;
        state.noteIndex = 0;
        update();
    }
});
document.getElementById("append-event")?.addEventListener("mousedown", () => {
    state.piece.getInput()[state.barIndex].splice(state.eventIndex + 1, 0, new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false));
    update();
});
document.getElementById("append-bar")?.addEventListener("mousedown", () => {
    state.piece.getInput().splice(state.barIndex + 1, 0, [new JSB.Event(JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), JSB.Group.empty(), false)]);
    ++state.barIndex;
    state.eventIndex = 0;
    state.noteIndex = 0;
    update();
});
