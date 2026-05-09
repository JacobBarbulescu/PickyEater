const exportedMethods = {

  checkString(val, varName, min = -1, max = -1) {
    if (!val) throw `${varName} is required`;
    if (typeof val !== 'string') throw `${varName} must be a string`;
    val = val.trim();
    if (val.length === 0) throw `${varName} cannot be empty`;

    if ((min !== -1) && (val.length < min)) throw `${varName} must be at least ${min} characters`;
    if ((max !== -1) && (val.length > max)) throw `${varName} must be at most ${max} characters`;

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
  },

  checkInt(val, varName) {
    if (val === undefined || val === null) throw `${varName} is required`;
    if (typeof val !== 'number') throw `${varName} must be a number`;
    if (!Number.isInteger(val)) throw `${varName} must be an integer`;
    if (val < 0) throw `${varName} cannot be negative`;
    return val;
  },

  checkFoodName(name) {
    name = this.checkString(name, 'Food name', 1, 30);
    name = name.trim();
    
    // only allow letters, numbers, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z0-9\s\-']+$/.test(name)) 
        throw 'Food Name Can Only Contain Letters, Numbers, Spaces, Hyphens, and Apostrophes';
    
    // capitalize first letter of each word, lowercase the rest
    name = name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    
    return name;
  },

};


export default exportedMethods;
