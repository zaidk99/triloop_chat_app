const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';


export const tokenUtils = {
    setAuth : (token , user) => {
        localStorage.setItem(TOKEN_KEY , token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getToken : ()=>localStorage.getItem(TOKEN_KEY),

    getUser: ()=>{
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user): null;
    },

    clearAuth: ()=> {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    isAuthenticated : ()=> !!localStorage.getItem(TOKEN_KEY),

};