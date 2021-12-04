
// import React from "react";
// import ReactDOM from "react-dom";
import { JSB } from "./index.js";
import render from "./render.js";

class Piece extends React.Component<{ jsb: JSB.Piece }> {
    render() {
        return <div id="piece">
            {this.props.jsb.getInput().map((bar, i) => <Bar key={i} jsb={bar} bar={i} />)}
        </div>;
    }
}

class Bar extends React.Component<{ jsb: JSB.Util.Bar, bar: number }> {
    render() {
        return <span className="bar">
            {this.props.jsb.map((event, i) => <Event key={i} jsb={event} time={{ bar: this.props.bar, event: i }} />)}
        </span>;
    }
}

class Event extends React.Component<{ jsb: JSB.Event, time: JSB.Util.Time }> {
    render() {
        return <span className="event">
            <Group key="s" jsb={this.props.jsb.getS()} time={this.props.time} part="s" />
            <Group key="a" jsb={this.props.jsb.getA()} time={this.props.time} part="a" />
            <Group key="t" jsb={this.props.jsb.getT()} time={this.props.time} part="t" />
            <Group key="b" jsb={this.props.jsb.getB()} time={this.props.time} part="b" />
        </span>;
    }
}

class Group extends React.Component<{ jsb: JSB.Group, time: JSB.Util.Time, part: JSB.Util.Part }> {
    mirror = () => {
        ReactDOM.render(
            this.props.jsb.getNotes().map((note, i) => <Note key={i} jsb={note} selected={i === 0} time={this.props.time} part={this.props.part} note={i} />),
            document.getElementById("mirror")
        );
    }

    render() {
        return <div className="group" onMouseDown={this.mirror}>{this.props.jsb.main()?.string() ?? ""}</div>;
    }
}

class Note extends React.Component<{ jsb: JSB.Note, selected: boolean, time: JSB.Util.Time, part: JSB.Util.Part, note: number }> {
    render() {
        return <span className={"note".concat(this.props.selected ? " selected" : "")}>{this.props.jsb.string()}</span>;
    }
}

class Tonality extends React.Component<{}, { tonality: boolean }> {
    constructor(props: {}) {
        super(props);
        this.state = { tonality: true };
    }
    render() {
        return <span id="tonality-button" onMouseDown={() => this.setState({ tonality: !this.state.tonality })}>{this.state.tonality ? "Major" : "Minor"}</span>;
    }
}

export default function display(piece: JSB.Piece) {
    ReactDOM.render(<Piece jsb={piece} />, document.getElementById("piece-box"));
}

ReactDOM.render(<Tonality />, document.getElementById("tonality-box"));

let selected: Note;
const anthem = new JSB.Piece().setKey("G major").parse("[(G4/,F#4/) G4 A4|F#4. G4/ A4|B4@ B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.@]", "s").harmonise();
const bach = new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();

render(bach);
display(bach);
