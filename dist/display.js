import { JSB } from "./index.js";
import render from "./render.js";
class Piece extends React.Component {
    render() {
        return React.createElement("div", { id: "piece" }, this.props.jsb.getInput().map((bar, i) => React.createElement(Bar, { key: i, jsb: bar, bar: i })));
    }
}
class Bar extends React.Component {
    render() {
        return React.createElement("span", { className: "bar" }, this.props.jsb.map((event, i) => React.createElement(Event, { key: i, jsb: event, time: { bar: this.props.bar, event: i } })));
    }
}
class Event extends React.Component {
    render() {
        return React.createElement("span", { className: "event" },
            React.createElement(Group, { key: "s", jsb: this.props.jsb.getS(), time: this.props.time, part: "s" }),
            React.createElement(Group, { key: "a", jsb: this.props.jsb.getA(), time: this.props.time, part: "a" }),
            React.createElement(Group, { key: "t", jsb: this.props.jsb.getT(), time: this.props.time, part: "t" }),
            React.createElement(Group, { key: "b", jsb: this.props.jsb.getB(), time: this.props.time, part: "b" }));
    }
}
class Group extends React.Component {
    constructor() {
        super(...arguments);
        this.mouseDown = () => {
            selectedGroup = this.props;
            ReactDOM.render(this.props.jsb.getNotes().map((note, i) => React.createElement(Note, { key: i, jsb: note, selected: i === 0, time: this.props.time, part: this.props.part, note: i })), document.getElementById("mirror"));
        };
    }
    render() {
        return React.createElement("div", { className: "group", onMouseDown: this.mouseDown }, this.props.jsb.main()?.string() ?? "");
    }
}
class Note extends React.Component {
    constructor(props) {
        super(props);
        selectedNote = props;
    }
    render() {
        return React.createElement("span", { className: "note".concat(this.props.selected ? " selected" : "") }, this.props.jsb.string());
    }
}
function display(piece) {
    ReactDOM.render(React.createElement(Piece, { jsb: piece }), document.getElementById("piece-box"));
}
let selectedGroup;
let selectedNote;
const anthem = new JSB.Piece().setKey("G major").parse("[(G4/,F#4/) G4 A4|F#4. G4/ A4|B4@ B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.@]", "s").harmonise();
const bach = new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();
class Tonality extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tonality: true };
    }
    render() {
        return React.createElement("span", { id: "tonality-button", onMouseDown: () => this.setState({ tonality: !this.state.tonality }) }, this.state.tonality ? "Major" : "Minor");
    }
}
ReactDOM.render(React.createElement(Tonality, null), document.getElementById("tonality-box"));
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "a":
        case "A":
            selectedNote.jsb.getPitch().getTone().setLetter(5);
            break;
        case "b":
        case "B":
            selectedNote.jsb.getPitch().getTone().setLetter(6);
            break;
        case "c":
        case "C":
            selectedNote.jsb.getPitch().getTone().setLetter(0);
            break;
        case "d":
        case "D":
            selectedNote.jsb.getPitch().getTone().setLetter(1);
            break;
        case "e":
        case "E":
            selectedNote.jsb.getPitch().getTone().setLetter(2);
            break;
        case "f":
        case "F":
            selectedNote.jsb.getPitch().getTone().setLetter(3);
            break;
        case "g":
        case "G":
            selectedNote.jsb.getPitch().getTone().setLetter(4);
            break;
        case "1":
            selectedNote.jsb.getPitch().setOctave(1);
            break;
        case "2":
            selectedNote.jsb.getPitch().setOctave(2);
            break;
        case "3":
            selectedNote.jsb.getPitch().setOctave(3);
            break;
        case "4":
            selectedNote.jsb.getPitch().setOctave(4);
            break;
        case "5":
            selectedNote.jsb.getPitch().setOctave(5);
            break;
        case "6":
            selectedNote.jsb.getPitch().setOctave(6);
            break;
        case "#":
            selectedNote.jsb.getPitch().getTone().alterAccidental(1);
            break;
        case "'":
            selectedNote.jsb.getPitch().getTone().alterAccidental(-1);
            break;
    }
    display(bach);
    render(bach.harmonise());
});
display(bach);
render(bach);
