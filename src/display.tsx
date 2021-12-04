
import { JSB, React } from "./index.js";

export default function display(piece: JSB.Piece) {
    let html = "";
    for (const bar of piece.getInput()) {
        html;
    } piece.getInput().map((bar: JSB.Util.Bar) => `${(["s", "a", "t", "b"] as JSB.Util.Part[]).map(part => `<tr>${bar.map(event => `<td>${event[part].string}</td>`).join("")}</tr>`).join("")}</table></span>`).join("");
}

class Piece extends React.Component {
    jsb(piece: JSB.Piece) {
        this.setState({jsb: piece});
    }

    render() {
        return <div id="piece"></div>;
    }
}

class Bar extends React.Component {
    render() {
        return <span className="bar"><table></table></span>;
    }
}

class Note extends React.Component<{}, any> {
    setNote(note: JSB.Note) {
        this.setState({ note: note });
    }
    render() {
        return <span className="note"></span>;
    }
}
