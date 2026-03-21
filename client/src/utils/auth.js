const getToken = () => 
    localStorage.getItem('token');

const saveToken = (token) => 
    localStorage.setItem('token', token);

const removeToken = () => 
    localStorage.removeItem('token');

const isLoggedIn = () => 
    !!getToken();

export { getToken, saveToken, removeToken, isLoggedIn };