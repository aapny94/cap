export const setTokenWithExpiration = (key, token, expirationInHours) => {
    const now = new Date();
    const expirationTime = now.getTime() + expirationInHours * 60 * 60 * 1000;
    const tokenData = {
      token,
      expirationTime,
    };
    localStorage.setItem(key, JSON.stringify(tokenData));
  };
  
  export const getTokenWithExpiration = (key) => {
    const tokenData = JSON.parse(localStorage.getItem(key));
    if (!tokenData) {
      return null;
    }
  
    const now = new Date();
    if (now.getTime() > tokenData.expirationTime) {
      localStorage.removeItem(key);
      return null;
    }
  
    return tokenData.token;
  };
  
  export const removeToken = (key) => {
    localStorage.removeItem(key);
  };
  
  export const checkTokenExpirationAndRefresh = (key) => {
    const tokenData = JSON.parse(localStorage.getItem(key));
    if (!tokenData) {
      return;
    }
  
    const now = new Date();
    const timeUntilExpiration = tokenData.expirationTime - now.getTime();
    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        window.location.reload();
      }, timeUntilExpiration + 5000); // Refresh the page 5 seconds after the expiration time
    } else {
      window.location.reload();
    }
  };