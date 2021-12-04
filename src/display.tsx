
// import React from "react";
import { JSB } from "./index.js";

class Piece extends React.Component<{ jsb: JSB.Piece }> {
    render() {
        return <div id="piece">
            {this.props.jsb.getInput().map(bar => <Bar jsb={bar} />)}
        </div>;
    }
}

class Bar extends React.Component<{ jsb: JSB.Util.Bar }> {
    render() {
        return <span className="bar">
            {this.props.jsb.map(event => <Event jsb={event} />)}
        </span>;
    }
}

class Event extends React.Component<{ jsb: JSB.Event }> {
    render() {
        return <span className="event">
            <Group jsb={this.props.jsb.getS()} />
            <Group jsb={this.props.jsb.getA()} />
            <Group jsb={this.props.jsb.getT()} />
            <Group jsb={this.props.jsb.getB()} />
        </span>;
    }
}

class Group extends React.Component<{ jsb: JSB.Group }> {
    render() {
        return <div className="group">
            {this.props.jsb.getNotes().map(note => <Note jsb={note} />)}
        </div>;
    }
}

class Note extends React.Component<{ jsb: JSB.Note }> {
    render() {
        return <span className="note">{this.props.jsb.string()}</span>;
    }
}

export default function display(piece: JSB.Piece) {
    ReactDOM.render(<Piece jsb={piece} />, document.getElementById("input"));
}