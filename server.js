const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Simple file-based storage (replace with database in production)
const USERS_FILE = 'users.json';
const EXPENSES_FILE = 'expenses.json';

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({}));
    }
    if (!fs.existsSync(EXPENSES_FILE)) {
        fs.writeFileSync(EXPENSES_FILE, JSON.stringify({}));
    }
}

function readUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (error) {
        return {};
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readExpenses() {
    try {
        return JSON.parse(fs.readFileSync(EXPENSES_FILE, 'utf8'));
    } catch (error) {
        return {};
    }
}

function writeExpenses(expenses) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const users = readUsers();
        
        // Check if user already exists
        if (users[username] || Object.values(users).find(u => u.email === email)) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        users[username] = {
            username,
            email,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            createdAt: new Date().toISOString(),
            profile: {
                monthlyBudget: 0,
                currency: 'USD',
                theme: 'light'
            }
        };
        
        writeUsers(users);
        
        // Auto-login after registration
        req.session.userId = username;
        
        res.json({ 
            success: true, 
            message: 'Registration successful',
            user: {
                username,
                email,
                firstName: users[username].firstName,
                lastName: users[username].lastName,
                profile: users[username].profile
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const users = readUsers();
        const user = users[username];
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        req.session.userId = username;
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profile: user.profile
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logout successful' });
});

// Get current user
app.get('/api/user', requireAuth, (req, res) => {
    const users = readUsers();
    const user = users[req.session.userId];
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile
    });
});

// Update user profile
app.put('/api/user/profile', requireAuth, (req, res) => {
    try {
        const { firstName, lastName, monthlyBudget, currency, theme } = req.body;
        const users = readUsers();
        const user = users[req.session.userId];
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update user data
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (monthlyBudget !== undefined) user.profile.monthlyBudget = monthlyBudget;
        if (currency !== undefined) user.profile.currency = currency;
        if (theme !== undefined) user.profile.theme = theme;
        
        writeUsers(users);
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profile: user.profile
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user expenses
app.get('/api/expenses', requireAuth, (req, res) => {
    const expenses = readExpenses();
    const userExpenses = expenses[req.session.userId] || {};
    res.json(userExpenses);
});

// Add expense
app.post('/api/expenses', requireAuth, (req, res) => {
    try {
        const { amount, date, category } = req.body;
        
        if (!amount || !date || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const expenses = readExpenses();
        
        if (!expenses[req.session.userId]) {
            expenses[req.session.userId] = {};
        }
        
        const month = date.substring(0, 7); // YYYY-MM format
        
        if (!expenses[req.session.userId][month]) {
            expenses[req.session.userId][month] = {};
        }
        
        if (!expenses[req.session.userId][month][category]) {
            expenses[req.session.userId][month][category] = 0;
        }
        
        expenses[req.session.userId][month][category] += parseFloat(amount);
        
        writeExpenses(expenses);
        
        res.json({ 
            success: true, 
            message: 'Expense added successfully',
            expenses: expenses[req.session.userId]
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Initialize data files
initializeDataFiles();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 