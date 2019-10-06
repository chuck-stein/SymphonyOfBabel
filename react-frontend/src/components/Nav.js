import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Excerpt from "./Excerpt";

const Nav = () => (
    <div>
        <nav>
        <ul>
            <Link to={'/'}>
                <li>About</li>
            </Link>
            <Link to={'/browse'}>
                <li>Browse</li>
            </Link>
            <Link to={'/search'}>
                <li>Search</li>
            </Link>
            <Link to={'/random'}>
                <li>Random</li>
            </Link>
        </ul>
        </nav>
    </div>
);

// const browseClicked = (event) => {
//     console.log("BROWSE...");
//     this.setState({view: this.views.BROWSE});
// };
//
// const searchClicked = (event) => {
//     console.log("SEARCH...");
//     const micData = this.getMicData();
//
// };
//
// const randomClicked = (event) => {
//     console.log("RANDOM...");
//     this.setState({view: this.views.RANDOM});
// };
//
// function pastFromClipboard() {
//     const dummyTextArea = document.createElement('textarea');
//     document.body.appendChild(dummyTextArea);
//     dummyTextArea.focus();
//     document.execCommand('paste');
//     const clipboardContents = dummyTextArea.value;
//     document.body.removeChild(dummyTextArea);
//     return clipboardContents;
// };
//
// async function getMicData() {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorder.start();
//     const micData = [];
//     mediaRecorder.addEventListener("dataavailable", event => {
//         micData.push(event.data);
//     });
//     mediaRecorder.addEventListener("onerror", event => {
//         //TODO
//     });
//
//     setTimeout(() => {
//       mediaRecorder.stop();
//     }, 1000);
//
//     return micData;
// }
//
//
// const views = {
//         HOME: "home",
//         BROWSE: "browse",
//         RANDOM: "random"
//     };
//
// const [view, setView] = useState(views.HOME);
//
// let body;
// switch(this.state.view) {
//     case this.views.BROWSE:
//         let excerptID = this.pasteFromClipboard();
//         body = (
//             <Excerpt id={excerptID} />
//         );
//         break;
//     case this.views.RANDOM:
//         body = (
//             <Excerpt random={true} />
//         );
//         break;
//     default: // HOME
//         body = (
//             <>
//             <MenuItem text={'Browse'} clickHandler={this.browseClicked} />
//             <MenuItem text={'Search'} clickHandler={this.searchClicked} />
//             <MenuItem text={'Random'} clickHandler={this.randomClicked} />
//             </>
//         );
// }

export default Nav;
