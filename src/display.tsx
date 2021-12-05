
// import React from "react";
// import ReactDOM from "react-dom";
import { JSB } from "./index.js";
import render from "./render.js";

class Piece extends React.Component {
    render() {
        return <div id="piece">
            {piece.getInput().map((bar, i) => <Bar key={i} bar={i} />)}
        </div>;
    }
}

interface BarProps {
    bar: number;
}

class Bar extends React.Component<BarProps> {
    render() {
        return <span className="bar">
            {piece.getInput()[this.props.bar].map((event, i) => <Event key={i} {...this.props} event={i} />)}
        </span>;
    }
}

interface EventProps extends BarProps {
    event: number;
}

class Event extends React.Component<EventProps> {
    render() {
        const parts: JSB.Util.Part[] = ["s", "a", "t", "b"];
        return <span className="event">
            {parts.map(part => <Group key={part}
                {...this.props}
                part={part}
                group={piece.getInput()[this.props.bar][this.props.event][part]}
                selected={this.props.bar === selected.bar && this.props.event === selected.event && selected.part === part} />)}
        </span>;
    }
}

interface Selectable {
    selected: boolean;
}

interface GroupProps extends EventProps, Selectable {
    part: JSB.Util.Part;
    group: JSB.Group;
}

class Group extends React.Component<GroupProps, Selectable> {
    constructor(props: GroupProps) {
        super(props);
        this.state = { selected: props.selected };
        if (props.selected) {
            selectedGroup = this;
        }
    }
    mouseDown = () => {
        selectedGroup.setState({ selected: false });
        this.setState({ selected: true });
        selectedGroup = this;
        selected.bar = this.props.bar;
        selected.event = this.props.event;
        selected.part = this.props.part;
        selected.index = 0;
        ReactDOM.render(
        this.props.group.getNotes().map((note, i) => <Note key={i} {...this.props} selected={
            this.props.bar === selected.bar && this.props.event === selected.event && this.props.part === selected.part && i === selected.index
        } index={i} />),
            document.getElementById("mirror")
        );
    }

render() {
    return <div className={"group".concat(this.state.selected ? " selected" : "")} onMouseDown={this.mouseDown}>{this.props.group.main()?.string() ?? ""}</div>;
}
}

interface NoteProps extends GroupProps {
    index: number;
}

class Note extends React.Component<NoteProps, Selectable> {
    constructor(props: NoteProps) {
        super(props);
        this.state = { selected: props.selected };
        if (props.selected) {
            selectedNote = this;
        }
    }

    mouseDown = () => {
        selectedNote.setState({ selected: false });
        this.setState({ selected: true });
        selectedNote = this;
        selected.index = this.props.index;
    }

    render() {
        return <span className={"note".concat(this.state.selected ? " selected" : "")} onMouseDown={this.mouseDown}>{selected.group().getNotes()[this.props.index].string()}</span>;
    }
}

const piece = new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();

let selectedGroup: Group;

let selected = {
    bar: 0,
    event: 0,
    part: "s" as JSB.Util.Part,
    index: 0,

    group() {
        return piece.getInput()[this.bar][this.event][this.part as JSB.Util.Part] as JSB.Group;
    },

    note() {
        return this.group().getNotes()[this.index];
    }
};
let selectedNote: Note;

class Tonality extends React.Component<{}, { tonality: boolean }> {
    constructor(props: {}) {
        super(props);
        this.state = { tonality: true };
    }

    onMouseDown = () => {
        piece.getKey().setTonality(!this.state.tonality);
        this.setState({ tonality: !this.state.tonality });
        display();
        render(piece.harmonise());
    }

    render() {
        return <span id="tonality-button" onMouseDown={this.onMouseDown}>{this.state.tonality ? "Major" : "Minor"}</ span>;
    }
}

document.addEventListener("keydown", e => {
    const note = selected.group().getNotes()[selected.index];
    if (note) {
        switch (e.key) {
            case "a": case "A": note.getPitch().getTone().setLetter(5); break;
            case "b": case "B": note.getPitch().getTone().setLetter(6); break;
            case "c": case "C": note.getPitch().getTone().setLetter(0); break;
            case "d": case "D": note.getPitch().getTone().setLetter(1); break;
            case "e": case "E": note.getPitch().getTone().setLetter(2); break;
            case "f": case "F": note.getPitch().getTone().setLetter(3); break;
            case "g": case "G": note.getPitch().getTone().setLetter(4); break;
            case "1": note.getPitch().setOctave(1); break;
            case "2": note.getPitch().setOctave(2); break;
            case "3": note.getPitch().setOctave(3); break;
            case "4": note.getPitch().setOctave(4); break;
            case "5": note.getPitch().setOctave(5); break;
            case "#": note.getPitch().getTone().alterAccidental(1); break;
            case "'": note.getPitch().getTone().alterAccidental(-1); break;
        }
    }
    switch (e.key) {
        case "Tab": e.preventDefault(); ++selected.bar; break;
    }
    console.log(selected);
    display();
    render(piece.harmonise());
});

display();
selectedGroup.mouseDown();
render(piece);

function display() {
    ReactDOM.render(<Piece />, document.getElementById("piece-box"));
}

ReactDOM.render(<Tonality />, document.getElementById("tonality-box"));
