
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from "react-router-dom"
import * as monaco from 'monaco-editor';
import { Provider } from 'react-redux';
import store from './store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <Router>
    <App />
  </Router>
  </Provider>
)


// Define the worker environment
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        // Adjust the URL according to your project's structure
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
                baseUrl: '${window.location.origin}/monaco-editor/'
            };
            importScripts('${window.location.origin}/monaco-editor/min/vs/base/worker/workerMain.js');
        `)}`;
    }
};
