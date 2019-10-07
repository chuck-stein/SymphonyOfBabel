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
import axios from "axios";

function App() {

    useEffect(() => {
        async function getRandomExcerpt() {
            console.log("fetching random excerpt...");
            const response = await axios.get('/random');
            const data = await response.data;
            console.log("response data: " + data);
            setID(data.excerptID);
            setBufferData(data.excerptData);
            setLoading(false);
        }
        getRandomExcerpt();
    }, []);

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

export default App;
