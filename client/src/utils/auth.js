import decode from 'jwt-decode';

// create a new class to instantiate for a user
class AuthService {
  // get user data from the token
  getProfile() {
    return decode(this.getToken());
  }

  // check if the user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // Returns true if logged in and token is valid
  }

  // check if the token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // Compare expiration with current time
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error decoding token:', err);
      return true; // If decoding fails, consider the token expired
    }
  }

  // get the token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // save the token and redirect to the home page
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // remove the token and redirect to the home page
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
