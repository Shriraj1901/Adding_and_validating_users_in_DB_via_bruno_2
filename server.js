const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialMedia', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
     
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
