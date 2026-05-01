//template
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';

const exportedMethods = {
    async createUser(email, username, password) {
        if (!email || !username || !password) throw 'All fields need to have valid values';
        email = email.trim().toLowerCase();
        username = username.trim();

        if (password.length < 6) throw 'Password must be at least 6 characters long';
        const userCollection = await users();
        const existingUser = await userCollection.findOne({ email: email });
        if (existingUser) throw 'Email is already in use';
        
        const hashedPassword = await bcrypt.hash(password, 16);

        const newUser = {
            email: email,
            username: username,
            password: hashedPassword,
            role: 'user',
            score: 0,
            createdAt: new Date()
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not create user';
        return { registrationSuccess: true };
    },
    
    async login(email, password) {
        if (!email || !password) throw 'Email and password are required';
        email = email.trim().toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        if (!user) throw 'Invalid email or password';

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw 'Invalid email or password';
        return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
            score: user.score
        }
    },
    async getUserById(id) {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) throw 'User not found';
        return user;
    }
};

export default exportedMethods;