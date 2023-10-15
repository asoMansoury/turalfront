const SHOW_ADD = "SHOW_ADD";
const HIDE_ADD = "HIDE_ADD";
const SHOW_EDIT = "SHOW_EDIT";
const HIDE_EDIT = "HIDE_EDIT";
const IS_EDITED = "IS_EDITED";
const IS_NOT_EDITED = "IS_NOT_EDITED";
const IS_DELETED_ONE = "IS_DELETED_ONE";
const IS_NOT_DELETED_ONE = "IS_NOT_DELETED_ONE";
const IS_DELETED_GROUP = "IS_DELETED_GROUP";
const IS_NOT_DELETED_GROUP = "IS_NOT_DELETED_GROUP";
const IS_ADDED = "IS_ADDED";
const IS_NOT_ADDED = "IS_NOT_ADDED";

export function Show_add() {
  return {
    type: SHOW_ADD,
  };
}

export function Hide_add() {
  return {
    type: HIDE_ADD,
  };
}

export function Show_edit(obj) {
  return {
    type: SHOW_EDIT,
    payload: obj
  };
}

export function Hide_edit() {
  return {
    type: HIDE_EDIT,
  };
}

export function Is_edited(){
  return {
    type: IS_EDITED,
  }
}

export function Is_not_edited(){
  return {
    type: IS_NOT_EDITED,
  }
}

export function Is_deleted_one(){
  return {
    type: IS_DELETED_ONE,
  }
}

export function Is_not_deleted_one(){
  return {
    type: IS_NOT_DELETED_ONE,
  }
}

export function Is_deleted_group(){
  return {
    type: IS_DELETED_GROUP,
  }
}

export function Is_not_deleted_group(){
  return {
    type: IS_NOT_DELETED_GROUP,
  }
}

export function Is_added(){
  return {
    type: IS_ADDED,
  }
}

export function Is_not_added(){
  return {
    type: IS_NOT_ADDED,
  }
}