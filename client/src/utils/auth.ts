import { TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {

  getProfile(): JwtPayload | null {
    const token =localStorage.getItem('id_token');

    if(!token) {
      return null;
    }

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Invalid token.', error);
      return null;
    }
  }

  loggedIn() {
    const token = localStorage.getItem('id_token')
    if(!token) {
    return false;
  }

  try {
   const decoded = jwtDecode<JwtPayload>(token);

   if (decoded.exp && decoded.exp * 1000 <Date.now()) {
    return false
  };
    return true;
  } catch (error) {
    console.error('Error decoding token.', error);
    return false;
  }
}
  
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
    
    if(!decoded.exp) {
      return true;
    }

    const currentTime = Date.now();
    return decoded.exp * 1000 <currentTime;
  } catch (error) {
    console.error('Expired token', error);
   
    throw new TokenExpiredError('JWT expired', new Date());
  } 
}

  getToken(): string {
    const token = localStorage.getItem('id_token');
    return token || '';
    // TODO: return the token
  }


  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.href ='/home';
    // TODO: set the token to localStorage
    // TODO: redirect to the home page
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href ='/login';
    // TODO: remove the token from localStorage
    // TODO: redirect to the login page
  }
}

export default new AuthService();


