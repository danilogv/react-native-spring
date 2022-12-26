export function reducer(state,action) {
    switch(action.type) {
        case "menuAtivo":
            return {...state,menuVisivel: true};
        case "menuInativo":
            return {...state,menuVisivel: false};
        default:
            return state;
    }
}
