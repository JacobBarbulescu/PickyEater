const exportedMethods = {

  checkString(val, varName) {
    if (!val) throw `${varName} is required`;
    if (typeof val !== 'string') throw `${varName} must be a string`;
    val = val.trim();
    if (val.length === 0) throw `${varName} cannot be empty`;
    return val;
  },

  checkEmail(email) {
    email = this.checkString(email, 'Email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw 'Invalid email address';
    return email.toLowerCase();
  },

  checkUsername(username) {
    username = this.checkString(username, 'Username');
    if (username.length < 2 || username.length > 20) {
      throw 'Username must be between 2 and 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw 'Username can only contain letters, numbers, and underscores';
    }
    return username;
  },

  checkPassword(password) {
    if (!password) throw 'Password is required';
    if (typeof password !== 'string') throw 'Password must be a string';
    if (password.length < 6) throw 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(password)) throw 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) throw 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw 'Password must contain at least one special character';
    return password;
  }

};

export default exportedMethods;
