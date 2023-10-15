const initialState = {
    Show_Hide_Add: 'Hide_add',
    Show_Hide_Edit: { type: 'Hide_edit', obj: {} },
    Is_Edited: false,
    Is_Deleted_One : false,
    Is_Deleted_Group : false,
    Is_Added: false,
    Rows_Product:[],
    Selected_Products:[]
}

function processSliceReducer(state = initialState, action) {
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

        case 'ADD_ROWS_PRODCUTS':{
            state.Rows_Product = null;
            state.Rows_Product =action.payload
            return state;
        }
        case 'Confirm_ROWS_PRODCUTS':{
            debugger;
            let rowID = action.payload[0].initialBalanceEntitiesFK_ID;
            var selectedRow = state.Selected_Products.flat().findIndex(z=>z.rowID==rowID);
            if(selectedRow==-1){
                state.Selected_Products.push({rowID:rowID,Rows_Product:action.payload});
            }else{
                var selectedRow = state.Selected_Products.flat().findIndex(z=>z.rowID==rowID);
                if(selectedRow===-1){
                    state.Selected_Products.push({rowID:rowID,Rows_Product:action.payload});
                }else{
                    state.Selected_Products[selectedRow] = {rowID:rowID,Rows_Product:action.payload};
                }
            }


            return state;
        }

        case 'REMOVE_ROWS_PRODCUTS':{
            let rowID = action.rowID;
            debugger;
            var selectedRow = state.Selected_Products.flat().findIndex(z=>z.rowID==rowID);
            if(selectedRow!==-1)
                state.Selected_Products.splice(selectedRow,1);
            return state;
        }
        default:
            return state;
    }
}
export default processSliceReducer;