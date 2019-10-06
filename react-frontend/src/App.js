import React, {Component, useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import Nav from "./components/Nav";
import About from "./components/About";
import Browse from "./components/Browse";
import Search from "./components/Search";
import Random from "./components/Random";
import IdForm from "./components/IdForm";
import Excerpt from "./components/Excerpt";

function App() {
    return (
        <Router>
            <div className="App">
                <Nav />
                <Switch>
                    <Route exact path='/' component={About} />
                    <Route path='/browse' component={IdForm} />
                    <Route path='/search' component={Search} />
                    <Route path='/random' component={Random} />
                    <Route path='/excerpt/:id' component={Excerpt} />
                </Switch>
            </div>
        </Router>
    );
}



// function App() {
// class App extends Component {
//
//     views = {
//         HOME: "home",
//         BROWSE: "browse",
//         RANDOM: "random"
//     };
//
//     state = {
//         view: this.views.HOME
//     };
//
//     // const [excerptBuffer, setBuffer] = useState([]);
//     //
//     // useEffect(() => {
//     //     fetch('/excerpt').then(response => response.json().then(data => setBuffer(data)));
//     //     }, []
//     // );
//     render() {
//         let body;
//         switch(this.state.view) {
//             case this.views.BROWSE:
//                 let excerptID = this.pasteFromClipboard();
//                 body = (
//                     <Excerpt id={excerptID} />
//                 );
//                 break;
//             case this.views.RANDOM:
//                 body = (
//                     <Excerpt random={true} />
//                 );
//                 break;
//             default: // HOME
//                 body = (
//                     <>
//                     <MenuItem text={'Browse'} clickHandler={this.browseClicked} />
//                     <MenuItem text={'Search'} clickHandler={this.searchClicked} />
//                     <MenuItem text={'Random'} clickHandler={this.randomClicked} />
//                     </>
//                 );
//         }
//         return (
//             <div className="App">{body}</div>
//         );
//     }
//
//     browseClicked = (event) => {
//         console.log("BROWSE...");
//         this.setState({view: this.views.BROWSE});
//     };
//
//     searchClicked = (event) => {
//         console.log("SEARCH...");
//         const micData = this.getMicData();
//
//     };
//
//     randomClicked = (event) => {
//         console.log("RANDOM...");
//         this.setState({view: this.views.RANDOM});
//     };
//
//     pasteFromClipboard() {
//         const dummyTextArea = document.createElement('textarea');
//         document.body.appendChild(dummyTextArea);
//         dummyTextArea.focus();
//         document.execCommand('paste');
//         const clipboardContents = dummyTextArea.value;
//         document.body.removeChild(dummyTextArea);
//         return clipboardContents;
//     };
//
//     async getMicData() {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorder.start();
//         const micData = [];
//         mediaRecorder.addEventListener("dataavailable", event => {
//             micData.push(event.data);
//         });
//         mediaRecorder.addEventListener("onerror", event => {
//             //TODO
//         });
//
//         setTimeout(() => {
//           mediaRecorder.stop();
//         }, 1000);
//
//         return micData;
//     }
//
// }

export default App;
