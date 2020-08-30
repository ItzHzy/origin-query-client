import { createReducer } from '@reduxjs/toolkit'

export const changeActivity = createReducer({ activityName: "SERVER", activityID: null }, {
    "CHANGE_ACTIVITY": (state, action) => {
        state = action.payload.activityID
            ? { activityName: action.payload.activityName, activityID: action.payload.activityID }
            : { activityName: action.payload.activityName, activityID: null }
        return state
    }
})
