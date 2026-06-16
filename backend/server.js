require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Kiongozi Connect API',
        version: '1.0.0',
        tagline: 'Jua Kiongozi Wako Amefanya Nini Leo',
        status: 'running'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Get feed
app.get('/api/feed', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaders
app.get('/api/leaders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaders')
            .select('*')
            .limit(10);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get projects
app.get('/api/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meetings
app.get('/api/meetings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('date', { ascending: true })
            .limit(10);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get groups
app.get('/api/groups', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .limit(10);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notifications
app.get('/api/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get analytics
app.get('/api/analytics/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create post
app.post('/api/posts', async (req, res) => {
    try {
        const { user_id, content, title } = req.body;
        
        if (!user_id || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                user_id,
                content,
                title: title || '',
                created_at: new Date().toISOString(),
            }]);
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get subscription plans
app.get('/api/subscriptions', (req, res) => {
    res.json([
        { plan: 'basic', price: 500, features: ['Standard visibility', 'Community posting'] },
        { plan: 'standard', price: 1500, features: ['Increased visibility', 'Better reach', 'Priority rankings'] },
        { plan: 'premium', price: 3000, features: ['Maximum visibility', 'Highest reach', 'Top rankings', 'Priority support'] }
    ]);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
    console.log(`🚀 Kiongozi Connect API running on port ${PORT}`);
    console.log('📱 Jua Kiongozi Wako Amefanya Nini Leo');
});
