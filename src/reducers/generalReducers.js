import { createReducer } from '@reduxjs/toolkit'

export const changeActivity = createReducer("server", {
    "builder": (state, action) => { return "builder" },
    "stats": (state, action) => { return "stats" },
    "server": (state, action) => { return "server" },
    "settings": (state, action) => { return "settings" },
})