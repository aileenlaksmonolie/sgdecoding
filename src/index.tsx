import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'semantic-ui-less/semantic.less';
import App from './App';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { persistor, store } from './state';

ReactDOM.render(
	// <React.StrictMode>
		// </React.StrictMode>, // Giving long warnings with React-Semantic-Ui
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</PersistGate>
		</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
