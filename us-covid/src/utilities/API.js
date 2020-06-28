const api = (() => {
    const BASE_URL = "/api";

    // TECH DEBT: Refactor returns to no longer use GET prefix
    return {
        GET_REQUEST: `${BASE_URL}/Request/Get`,
        SAVE_REQUEST_DETAIL: `${BASE_URL}/Request/Save`
    };
})();

export default api;