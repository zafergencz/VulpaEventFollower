import { createContext, useContext } from "react";
import ActivitySore from "./activityStore";

interface Store {
    activityStore: ActivitySore
}

const store: Store = {
    activityStore: new ActivitySore()
} 

const StoreContext = createContext(store);

// react hook create
const useStore = () => {
    return useContext(StoreContext);
}

export {store, StoreContext, useStore}