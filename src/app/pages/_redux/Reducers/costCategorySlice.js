const initialState = {
    Show_Hide_Add: 'Hide_add',
    Show_Hide_Edit: { type: 'Hide_edit', obj: {} },
    Is_Edited: false,
    Is_Deleted_One : false,
    Is_Deleted_Group : false,
    Is_Added: false
}

function balanceReducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_ADD': {
            return {
                ...state,
                Show_Hide_Add: 'Show_add'
            }
        }
        case 'HIDE_ADD': {
            return {
                ...state,
                Show_Hide_Add: 'Hide_add'
            }
        }
        case 'SHOW_EDIT': {
            return {
                ...state,
                Show_Hide_Edit: { type: 'Show_edit', obj: action.payload }
            }
        }
        case 'HIDE_EDIT': {
            return {
                ...state,
                Show_Hide_Edit: { type: 'Hide_edit', obj: {} }
            }
        }
        case 'IS_EDITED': {
            return {
                ...state,
                Is_Edited: true
            }
        }
        case 'IS_NOT_EDITED': {
            return {
                ...state,
                Is_Edited: false
            }
        }
        case 'IS_DELETED_ONE': {
            return {
                ...state,
                Is_Deleted_One: true
            }
        }
        case 'IS_NOT_DELETED_ONE': {
            return {
                ...state,
                Is_Deleted_One: false
            }
        }
        case 'IS_DELETED_GROUP': {
            return {
                ...state,
                Is_Deleted_Group: true
            }
        }
        case 'IS_NOT_DELETED_GROUP': {
            return {
                ...state,
                Is_Deleted_Group: false
            }
        }
        case 'IS_ADDED': {
            return {
                ...state,
                Is_Added: true
            }
        }
        case 'IS_NOT_ADDED': {
            return {
                ...state,
                Is_Added: false
            }
        }
        default:
            return state;
    }
}
export default balanceReducer;