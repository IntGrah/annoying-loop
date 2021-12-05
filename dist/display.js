import { JSB } from "./index.js";
import render from "./render.js";
class Piece extends React.Component {
    render() {
        return React.createElement("div", { id: "piece" }, bach.getInput().map((bar, i) => React.createElement(Bar, { key: i, bar: i })));
    }
}
class Bar extends React.Component {
    render() {
        return React.createElement("span", { className: "bar" }, bach.getInput()[this.props.bar].map((event, i) => React.createElement(Event, { key: i, ...this.props, event: i })));
    }
}
class Event extends React.Component {
    render() {
        const parts = ["s", "a", "t", "b"];
        return React.createElement("span", { className: "event" }, parts.map(part => React.createElement(Group, { key: part, ...this.props, part: part, group: bach.getInput()[this.props.bar][this.props.event][part], selected: this.props.bar === selectedGroupProps.bar && this.props.event === selectedGroupProps.event && selectedGroupProps.part === part })));
    }
}
class Group extends React.Component {
    constructor(props) {
        super(props);
        this.mouseDown = () => {
            selectedGroup.setState({ selected: false });
            this.setState({ selected: true });
            selectedGroup = this;
            selectedGroupProps = { ...this.props };
            selectedNoteIndex = 0;
            ReactDOM.render(this.props.group.getNotes().map((note, i) => React.createElement(Note, { key: i, ...this.props, selected: this.props.bar === selectedGroupProps.bar && this.props.event === selectedGroupProps.event && this.props.part === selectedGroupProps.part && i === selectedNoteIndex, index: i })), document.getElementById("mirror"));
        };
        this.state = { selected: props.selected };
        if (props.selected) {
            selectedGroup = this;
        }
    }
    render() {
        return React.createElement("div", { className: "group".concat(this.state.selected ? " selected" : ""), onMouseDown: this.mouseDown }, this.props.group.main()?.string() ?? "");
    }
}
class Note extends React.Component {
    constructor(props) {
        super(props);
        this.mouseDown = () => {
            selectedNote.setState({ selected: false });
            this.setState({ selected: true });
            selectedNote = this;
            selectedNoteIndex = this.props.index;
        };
        this.state = { selected: props.selected };
        if (props.selected) {
            selectedNote = this;
        }
    }
    render() {
        return React.createElement("span", { className: "note".concat(this.state.selected ? " selected" : ""), onMouseDown: this.mouseDown }, selectedGroupProps.group.getNotes()[this.props.index].string());
    }
}
function display() {
    ReactDOM.render(React.createElement(Piece, null), document.getElementById("piece-box"));
}
const anthem = new JSB.Piece().setKey("G major").parse("[(G4/,F#4/) G4 A4|F#4. G4/ A4|B4@ B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.@]", "s").harmonise();
const bach = new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();
let selectedGroup;
let selectedGroupProps = {
    bar: 0,
    event: 0,
    part: "s",
    group: bach.getInput()[0][0].getS(),
    selected: false
};
let selectedNote;
let selectedNoteIndex;
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
    const note = selectedGroupProps.group.getNotes()[selectedNoteIndex];
    if (note) {
        switch (e.key) {
            case "a":
            case "A":
                note.getPitch().getTone().setLetter(5);
                break;
            case "b":
            case "B":
                note.getPitch().getTone().setLetter(6);
                break;
            case "c":
            case "C":
                note.getPitch().getTone().setLetter(0);
                break;
            case "d":
            case "D":
                note.getPitch().getTone().setLetter(1);
                break;
            case "e":
            case "E":
                note.getPitch().getTone().setLetter(2);
                break;
            case "f":
            case "F":
                note.getPitch().getTone().setLetter(3);
                break;
            case "g":
            case "G":
                note.getPitch().getTone().setLetter(4);
                break;
            case "1":
                note.getPitch().setOctave(1);
                break;
            case "2":
                note.getPitch().setOctave(2);
                break;
            case "3":
                note.getPitch().setOctave(3);
                break;
            case "4":
                note.getPitch().setOctave(4);
                break;
            case "5":
                note.getPitch().setOctave(5);
                break;
            case "#":
                note.getPitch().getTone().alterAccidental(1);
                break;
            case "'":
                note.getPitch().getTone().alterAccidental(-1);
                break;
        }
    }
    switch (e.key) {
        case "Tab":
            e.preventDefault();
            ++selectedGroupProps.bar;
            break;
    }
    console.log(selectedGroupProps);
    display();
    render(bach.harmonise());
});
display();
render(bach);
