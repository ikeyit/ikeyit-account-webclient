import React, {useContext} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './main.css'
function Entry() {
    if (!window._serverData)
        return "No Server Data Available";
    return <App/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
            <Entry/>
   // </React.StrictMode>,
)
