import { combineReducers, configureStore } from "@reduxjs/toolkit";
import global from "./slices/global";
import clients from "./slices/clients";
import vendors from "./slices/vendors";
import employee from "./slices/employee";
import items from "./slices/items";
import projects from "./slices/projects";
import purchases from "./slices/purchases";
import challans from "./slices/challans";
import bills from "./slices/bills";
import attendance from "./slices/attendance";
import dashboard from "./slices/dashboard";

const reducers = combineReducers({
  global: global,
  clients: clients,
  vendors: vendors,
  employee: employee,
  items: items,
  projects: projects,
  purchases: purchases,
  challans: challans,
  bills: bills,
  attendance: attendance,
  dashboard: dashboard,
});

export const makeStore = () => {
  return configureStore({
    reducer: reducers,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
