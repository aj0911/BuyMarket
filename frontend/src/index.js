import ReactDOM from "react-dom/client"
import App from './App.js'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from "react-redux"
import store from "./store.js"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                <App/>
            </PersistGate>
        </Provider>
    </BrowserRouter>
)