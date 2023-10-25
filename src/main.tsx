import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css";
import "./fonts/Louis George Cafe.ttf";
import "./fonts/Rounded_Elegance.ttf";
import App from "./App";

declare global {
	interface Window {
		ipcApi: {
			send: (channel: string, ...arg: any) => void;
			receive: (channel: string, func: (...arg: any) => void) => void;
		};
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
	  <App />
	</React.StrictMode>,
  )