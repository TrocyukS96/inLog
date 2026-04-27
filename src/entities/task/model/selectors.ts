import { createSelector } from "@reduxjs/toolkit";
import { taskApi } from "./taskSlice";

export const makeSelectTaskStatuses = (projectId: number) => 
    createSelector(
      [taskApi.endpoints.getStatuses.select({ projectId })],
      (statusesResult) => statusesResult?.data ?? []
    );