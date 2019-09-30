import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Excerpt from "./components/Excerpt";

function App() {

    const [excerptBuffer, setBuffer] = useState([]);

    useEffect(() => {
        fetch('/excerpt').then(response => response.json().then(data => setBuffer(data)));
        }, []
    );

    return(
      <div className="App">
        <Excerpt id={4}/>
      </div>
    );
      // return (
      //   <div className="App">
      //     <header className="App-header">
      //       {/*TODO: change logo*/}
      //       <img src={logo} className="App-logo" alt="logo" />
      //       <p>
      //         Edit <code>src/App.js</code> and save to reload.
      //       </p>
      //         {/*<p>My Token = {window.token}</p>*/}
      //       <a
      //         className="App-link"
      //         href="https://reactjs.org"
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       >
      //         Learn React
      //       </a>
      //     </header>
      //   </div>
      // );
}

export default App;
