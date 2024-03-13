// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App, init } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("root"));
init()
	.then(({ accessToken, profile }) => {
		console.log(accessToken);
		root.render(
			<React.StrictMode>
				<Router>
					<App token={accessToken} profile={profile} />
				</Router>
			</React.StrictMode>,
		);
	})
	.catch((e) => {
		console.log(e);
	});

reportWebVitals();
