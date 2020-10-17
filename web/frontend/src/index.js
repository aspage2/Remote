import React from 'react';

import {createStore} from 'redux';
import {pullPlaybackInfo, pullQueueInfo, startMpdWatcher} from "./mpd";

import App from "./App";
import ReactDOM from 'react-dom';
import {Provider as StoreProvider} from "react-redux";
import reducer from "./Ducks";
import {Actions as PlaybackActions} from "./PlaybackControls"
import {Actions as QueueActions} from "./Queue";
import {BrowserRouter} from "react-router-dom";


const root = document.getElementById("root");

let initial = {};
// Pull current status, then render site
Promise.all([
    pullPlaybackInfo().then(res => {
        initial.playback = res
    }),
    pullQueueInfo().then(res => {
        initial.queue = res
    }),
]).then(
    () => {
        const store = createStore(reducer(initial));
        startMpdWatcher(
            status => {
                store.dispatch(PlaybackActions.setPlayback(status))
            },
            queue => {
                store.dispatch(QueueActions.setQueue(queue))
            },
        );
        ReactDOM.render(
            <StoreProvider store={store}>
                <App/>
            </StoreProvider>
            , root);
    }
).catch(err => {
    ReactDOM.render(<><h1>Congrats, it's broken.</h1><p>Error: {JSON.stringify(err)}</p></>, root)
})


