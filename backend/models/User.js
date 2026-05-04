import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';
import validation from '../validation.js';

const exportedMethods = {
    async createUser(email, username, password) {
        email = validation.checkEmail(email);
        username = validation.checkUsername(username);
        password = validation.checkPassword(password);
        const userCollection = await users();
        const existingUser = await userCollection.findOne({ email: email });
        if (existingUser) throw 'Email is already in use';
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email: email,
            username: username,
            password: hashedPassword,
            role: 'user',
            score: 0,
            bestScore: 0,
            createdAt: new Date()
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not create user';
        return { registrationSuccess: true };
    },
    
    async login(email, password) {
        email = validation.checkEmail(email);
        password = validation.checkString(password, 'Password');
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
            score: user.score,
            bestScore: user.bestScore
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