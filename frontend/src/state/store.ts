import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";
import reducers from "./reducers";

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['authReducer']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
    persistedReducer,
    {},
    applyMiddleware(thunk)
);


const persistor = persistStore(store);

export { persistor, store };

