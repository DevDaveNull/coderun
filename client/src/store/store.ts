import { configureStore } from "@reduxjs/toolkit";
import CodeSlice from "./CodeSlice";
import ProblemSlice from "./ProblemSlice";
import authSlice from "./authSlice";
import { problemStatusApi } from "./services/ProblemStatus";
import submissionSlice from "./submissionSlice";

const store = configureStore({
  reducer: {
    problem: ProblemSlice,
    code: CodeSlice,
    auth: authSlice,
    submission: submissionSlice,
    [problemStatusApi.reducerPath]: problemStatusApi.reducer,
  },
  // TODO: раскомментируйте devTools: false перед развертыванием
  // devTools: false,

  // добавление промежуточного программного обеспечения API включает кэширование, аннулирование, опрос и другие функции `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(problemStatusApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
