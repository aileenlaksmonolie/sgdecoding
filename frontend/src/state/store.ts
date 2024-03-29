import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['authReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    {},
    applyMiddleware(thunk)
);


const persistor = persistStore(store);

export { persistor, store };

