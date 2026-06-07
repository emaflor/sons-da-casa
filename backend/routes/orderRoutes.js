const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Continue without user for public endpoints
        }
    }
    next();
};

// Mock orders database
const mockOrders = [
    {
        id: 1,
        clientName: 'João Silva',
        email: 'joao@example.com',
        occasion: 'Aniversário',
        style: 'Pop',
        description: 'Uma canção feliz para o meu aniversário',
        duration: 3,
        budget: 100,
        status: 'pending',
        createdAt: new Date('2026-06-01')
    },
    {
        id: 2,
        clientName: 'Maria Costa',
        email: 'maria@example.com',
        occasion: 'Casamento',
        style: 'Romântica',
        description: 'Canção para a primeira dança',
        duration: 4,
        budget: 200,
        status: 'in_progress',
        createdAt: new Date('2026-05-28')
    }
];

// Create order (public)
router.post('/', (req, res) => {
    const { name, email, phone, occasion, style, description, duration, budget, notes } = req.body;

    const newOrder = {
        id: mockOrders.length + 1,
        clientName: name,
        email,
        phone,
        occasion,
        style,
        description,
        duration: parseInt(duration),
        budget: parseFloat(budget),
        notes,
        status: 'pending',
        createdAt: new Date()
    };

    mockOrders.push(newOrder);

    // Send confirmation email (mock)
    console.log(`📧 Email de confirmação enviado para ${email}`);

    res.status(201).json({ message: 'Pedido enviado com sucesso', order: newOrder });
});

// Get orders (admin only)
router.get('/', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    let orders = mockOrders;

    // Filter by status
    if (req.query.status) {
        orders = orders.filter(o => o.status === req.query.status);
    }

    res.json(orders);
});

// Get single order (admin only)
router.get('/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
});

// Update order status (admin only)
router.put('/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (req.body.status) {
        order.status = req.body.status;
    }

    Object.assign(order, req.body);
    res.json(order);
});

module.exports = router;
