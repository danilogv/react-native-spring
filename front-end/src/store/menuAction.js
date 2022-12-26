export function menuAtivo(dispatch,value) {
    dispatch({type: 'menuAtivo',payload: value});
}

export function menuInativo(dispatch,value) {
    dispatch({type: 'menuInativo',payload: value});
}
