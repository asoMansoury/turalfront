
const SaveToken = "Save_Token";
const getToken = "getToken";
const tokenObject ={
  token:''
}
export function Save_Token(token=tokenObject) {
  return {
    type: SaveToken,
    payload:token
  };
}

export function getTokenObject(){
  return {
    type: getToken,
  }
}


