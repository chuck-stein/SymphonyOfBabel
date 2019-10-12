import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import axios from "axios";
import {AudioSettingsProvider} from "./AudioSettingsContext";
import './App.css';
import Nav from "./components/Nav";
import About from "./components/About";
import Browse from "./components/Browse";
import Search from "./components/Search";
import Random from "./components/Random";
import ExcerptFetch from "./components/ExcerptFetch";

const App = () => {

    const [audioContext, setAudioContext] = useState({
        sampleRate: 24000,
        excerptDuration: 5
    });

    useEffect(() => {
        const getAudioSettings = async () => {
            const response = await axios.get('/audioSettings');
            const data = await response.data;
            setAudioContext({
                sampleRate: data.sampleRate,
                excerptDuration: data.excerptDuration
            });
        };
        getAudioSettings();
    }, []);

    return (
        <AudioSettingsProvider value={audioContext}>
           <Router>
                <div className="App">
                    <Nav />
                    <Switch>
                        <Route exact path='/' component={About} />
                        <Route path='/browse' component={Browse} />
                        <Route path='/search' component={Search} />
                        <Route path='/random' component={Random} />
                        <Route path='/excerpt/:id' component={ExcerptFetch} />
                    </Switch>
                </div>
            </Router>
        </AudioSettingsProvider>
    );
};

export default App;
