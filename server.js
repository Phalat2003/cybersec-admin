const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/user', async (req, res) => {
    const data = await prisma.$queryRaw`SELECT * FROM User`;
    data.map(record => {
        console.log('record', record)
        delete record.password;
        return record;
    });
    res.json({
        message: 'ok',
        data
    });
});

app.post('/user', async (req, res) => {
    console.log(req.body);
    //  const response = await prisma.user.create(req.body);
    const response = await prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        }
    })
    res.json({
        message: 'add data successfully',
        data: response
    });
});

// Create new user
app.post('/user', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.create({ data: { username, password } });
    res.json({ message: 'User created successfully', data: user });
});

// Update user
app.post('/user/:id', async (req, res) => {
    const { username, password } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: +req.params.id },
            data: { username, password },
        });
        res.json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete user
app.delete('/user/:id', async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: +req.params.id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});