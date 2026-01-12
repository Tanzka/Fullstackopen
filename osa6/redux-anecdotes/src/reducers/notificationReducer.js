import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        set(state, action) {
            return action.payload
        },
        clear() {
            return ''
        }
    }
})

export const { set, clear } = notificationSlice.actions

export const setNotification = (message, seconds) => {
    return dispatch => {
        dispatch(set(message))
        setTimeout(() => {
            dispatch(clear())
        }, seconds * 1000)
    }
}
export default notificationSlice.reducer
