import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import {
  SEED_BRANDS,
  SEED_MODELS,
  SEED_REPLACEMENT_GUIDES,
  SEED_TECHNIQUE_GUIDES,
  SEED_PROBLEM_CATEGORIES,
  SEED_SYMPTOMS,
  SEED_NODES,
  SEED_COMMUNITY_POSTS,
  DEMO_USERS
} from './src/data/seedData';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent store setup
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DbSchema {
  brands: typeof SEED_BRANDS;
  models: typeof SEED_MODELS;
  replacementGuides: typeof SEED_REPLACEMENT_GUIDES;
  techniqueGuides: typeof SEED_TECHNIQUE_GUIDES;
  problemCategories: typeof SEED_PROBLEM_CATEGORIES;
  symptoms: typeof SEED_SYMPTOMS;
  nodes: typeof SEED_NODES;
  posts: typeof SEED_COMMUNITY_POSTS;
  comments: any[];
  users: typeof DEMO_USERS;
}

let db: DbSchema = {
  brands: [...SEED_BRANDS],
  models: [...SEED_MODELS],
  replacementGuides: [...SEED_REPLACEMENT_GUIDES],
  techniqueGuides: [...SEED_TECHNIQUE_GUIDES],
  problemCategories: [...SEED_PROBLEM_CATEGORIES],
  symptoms: [...SEED_SYMPTOMS],
  nodes: { ...SEED_NODES },
  posts: [...SEED_COMMUNITY_POSTS],
  comments: [],
  users: [...DEMO_USERS]
};

// Load DB from file if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
  } else {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
  // Ensure seed admin users are guaranteed admin role
  DEMO_USERS.forEach(seedUser => {
    if (seedUser.role === 'admin') {
      const idx = db.users.findIndex(u => u.email.toLowerCase() === seedUser.email.toLowerCase());
      if (idx >= 0) {
        db.users[idx].role = 'admin';
      } else {
        db.users.push(seedUser);
      }
    }
  });
  saveDb();
} catch (err) {
  console.warn('Failed to initialize db file, using seed data in memory', err);
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error writing to DB file', err);
  }
}

// REST API Endpoints

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Motorel Diag', time: new Date().toISOString() });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'User not found with this email' });
  }
  // In demo app, password123 or any password works for demo
  res.json({ user, token: `demo-token-${user.id}` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    role: role || 'rider',
    favoriteMotorcycleIds: ['m_click125'],
    savedGuideIds: [],
    savedTroubleshootingIds: [],
    completedGuideIds: [],
    learningProgress: {},
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDb();
  res.status(201).json({ user: newUser, token: `demo-token-${newUser.id}` });
});

// Brands & Models
app.get('/api/brands', (req, res) => {
  res.json(db.brands);
});

app.post('/api/brands', (req, res) => {
  const newBrand = { id: `b_${Date.now()}`, ...req.body };
  db.brands.push(newBrand);
  saveDb();
  res.status(201).json(newBrand);
});

app.put('/api/brands/:id', (req, res) => {
  const idx = db.brands.findIndex((b) => b.id === req.params.id);
  if (idx === -1) {
    const created = { id: req.params.id, ...req.body };
    db.brands.push(created);
    saveDb();
    return res.json(created);
  }
  db.brands[idx] = { ...db.brands[idx], ...req.body };
  saveDb();
  res.json(db.brands[idx]);
});

app.delete('/api/brands/:id', (req, res) => {
  db.brands = db.brands.filter((b) => b.id !== req.params.id);
  // Also optionally clear models associated if needed, or leave as is
  saveDb();
  res.json({ success: true });
});

app.get('/api/motorcycles', (req, res) => {
  res.json(db.models);
});

app.post('/api/motorcycles', (req, res) => {
  const newModel = { id: `m_${Date.now()}`, ...req.body };
  db.models.push(newModel);
  saveDb();
  res.status(201).json(newModel);
});

app.put('/api/motorcycles/:id', (req, res) => {
  const idx = db.models.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    const created = { id: req.params.id, ...req.body };
    db.models.push(created);
    saveDb();
    return res.json(created);
  }
  db.models[idx] = { ...db.models[idx], ...req.body };
  saveDb();
  res.json(db.models[idx]);
});

app.delete('/api/motorcycles/:id', (req, res) => {
  db.models = db.models.filter((m) => m.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// Guides
app.get('/api/guides/replacement', (req, res) => {
  res.json(db.replacementGuides);
});

app.post('/api/guides/replacement', (req, res) => {
  const newGuide = { id: `rg_${Date.now()}`, ...req.body };
  db.replacementGuides.push(newGuide);
  saveDb();
  res.status(201).json(newGuide);
});

app.put('/api/guides/replacement/:id', (req, res) => {
  const idx = db.replacementGuides.findIndex((g) => g.id === req.params.id);
  if (idx === -1) {
    const created = { id: req.params.id, ...req.body };
    db.replacementGuides.push(created);
    saveDb();
    return res.json(created);
  }
  db.replacementGuides[idx] = { ...db.replacementGuides[idx], ...req.body };
  saveDb();
  res.json(db.replacementGuides[idx]);
});

app.delete('/api/guides/replacement/:id', (req, res) => {
  db.replacementGuides = db.replacementGuides.filter((g) => g.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

app.get('/api/guides/techniques', (req, res) => {
  res.json(db.techniqueGuides);
});

app.post('/api/guides/techniques', (req, res) => {
  const newGuide = { id: `tg_${Date.now()}`, ...req.body };
  db.techniqueGuides.push(newGuide);
  saveDb();
  res.status(201).json(newGuide);
});

// Troubleshooting
app.get('/api/troubleshooting/categories', (req, res) => {
  res.json(db.problemCategories);
});

app.post('/api/troubleshooting/categories', (req, res) => {
  const newCat = { id: `cat_${Date.now()}`, ...req.body };
  db.problemCategories.push(newCat);
  saveDb();
  res.status(201).json(newCat);
});

app.put('/api/troubleshooting/categories/:id', (req, res) => {
  const idx = db.problemCategories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Problem category not found' });
  db.problemCategories[idx] = { ...db.problemCategories[idx], ...req.body };
  saveDb();
  res.json(db.problemCategories[idx]);
});

app.delete('/api/troubleshooting/categories/:id', (req, res) => {
  db.problemCategories = db.problemCategories.filter((c) => c.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

app.get('/api/troubleshooting/symptoms', (req, res) => {
  const { categoryId } = req.query;
  if (categoryId) {
    const filtered = db.symptoms.filter((s) => s.categoryId === categoryId);
    return res.json(filtered);
  }
  res.json(db.symptoms);
});

app.post('/api/troubleshooting/symptoms', (req, res) => {
  const newSym = { id: `sym_${Date.now()}`, ...req.body };
  db.symptoms.push(newSym);
  saveDb();
  res.status(201).json(newSym);
});

app.put('/api/troubleshooting/symptoms/:id', (req, res) => {
  const idx = db.symptoms.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Symptom not found' });
  db.symptoms[idx] = { ...db.symptoms[idx], ...req.body };
  saveDb();
  res.json(db.symptoms[idx]);
});

app.delete('/api/troubleshooting/symptoms/:id', (req, res) => {
  db.symptoms = db.symptoms.filter((s) => s.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

app.get('/api/troubleshooting/nodes', (req, res) => {
  res.json(db.nodes);
});

app.get('/api/troubleshooting/nodes/:id', (req, res) => {
  const node = db.nodes[req.params.id];
  if (!node) return res.status(404).json({ error: 'Troubleshooting step node not found' });
  res.json(node);
});

app.post('/api/troubleshooting/nodes', (req, res) => {
  const nodeId = req.body.id || `node_${Date.now()}`;
  const newNode = { ...req.body, id: nodeId };
  db.nodes[nodeId] = newNode;
  saveDb();
  res.status(201).json(newNode);
});

app.put('/api/troubleshooting/nodes/:id', (req, res) => {
  const id = req.params.id;
  if (!db.nodes[id]) {
    // create if not existing
    db.nodes[id] = { id, ...req.body };
  } else {
    db.nodes[id] = { ...db.nodes[id], ...req.body };
  }
  saveDb();
  res.json(db.nodes[id]);
});

app.delete('/api/troubleshooting/nodes/:id', (req, res) => {
  delete db.nodes[req.params.id];
  saveDb();
  res.json({ success: true });
});

// Helper function for anti-spam check
function checkSpam(title: string, content: string): { isSpam: boolean; reason?: string } {
  const text = (title + ' ' + content).toLowerCase();
  const spamKeywords = [
    'http://', 'https://', 'www.', '.biz', '.xyz', '.club',
    'crypto', 'casino', 'earn money', 'free money', 'slot', 'poker',
    'telegram', 'whatsapp', 'buy now', 'cheap pills', 'viagra', 'investment'
  ];
  for (const kw of spamKeywords) {
    if (text.includes(kw)) {
      return { isSpam: true, reason: `Contains spam keyword or external URL: "${kw}"` };
    }
  }
  // Check for excessive repetitive characters or uppercase
  if (title.length > 10 && title === title.toUpperCase() && /[A-Z]{8,}/.test(title)) {
    return { isSpam: true, reason: 'Excessive all-caps title' };
  }
  return { isSpam: false };
}

// Community
app.get('/api/community/posts', (req, res) => {
  res.json(db.posts);
});

app.post('/api/community/posts', (req, res) => {
  const { title = '', content = '', authorRole } = req.body;
  const spamResult = checkSpam(title, content);

  // Default initial status for standard user questions & tips is 'pending' for review
  let initialStatus: 'approved' | 'pending' | 'rejected' = authorRole === 'admin' ? 'approved' : 'pending';
  let spamFlagged = false;
  let spamReason: string | undefined = undefined;

  if (spamResult.isSpam) {
    initialStatus = 'pending';
    spamFlagged = true;
    spamReason = spamResult.reason;
  }

  const newPost = {
    id: `post_${Date.now()}`,
    likes: 0,
    likedBy: [],
    commentsCount: 0,
    isSolved: false,
    status: initialStatus,
    spamFlagged,
    spamReason,
    ratings: {},
    averageRating: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  db.posts.unshift(newPost);
  saveDb();
  res.status(201).json(newPost);
});

app.put('/api/community/posts/:id', (req, res) => {
  const postIndex = db.posts.findIndex((p) => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });

  const updated = {
    ...db.posts[postIndex],
    ...req.body,
    id: db.posts[postIndex].id // keep original ID
  };

  db.posts[postIndex] = updated;
  saveDb();
  res.json(updated);
});

app.delete('/api/community/posts/:id', (req, res) => {
  const postIndex = db.posts.findIndex((p) => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });

  db.posts.splice(postIndex, 1);
  // Remove related comments
  db.comments = db.comments.filter((c) => c.postId !== req.params.id);
  saveDb();
  res.json({ success: true, id: req.params.id });
});

app.post('/api/community/posts/:id/rate', (req, res) => {
  const { userId, rating } = req.body;
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (!post.ratings) post.ratings = {};
  const numRating = Math.min(5, Math.max(1, Number(rating) || 5));
  post.ratings[userId] = numRating;

  const ratingValues = Object.values(post.ratings);
  post.ratingCount = ratingValues.length;
  const sum = ratingValues.reduce((acc, curr) => acc + curr, 0);
  post.averageRating = Number((sum / ratingValues.length).toFixed(1));

  saveDb();
  res.json(post);
});

app.post('/api/community/posts/:id/moderate', (req, res) => {
  const { action } = req.body; // 'approve', 'reject', 'delete'
  const postIndex = db.posts.findIndex((p) => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });

  if (action === 'delete') {
    db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((c) => c.postId !== req.params.id);
  } else if (action === 'approve') {
    db.posts[postIndex].status = 'approved';
    db.posts[postIndex].spamFlagged = false;
  } else if (action === 'reject' || action === 'dismiss') {
    db.posts[postIndex].status = 'rejected';
  }

  saveDb();
  res.json({ success: true, post: db.posts[postIndex] || null });
});

app.post('/api/community/posts/:id/like', (req, res) => {
  const { userId } = req.body;
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const likedIdx = post.likedBy.indexOf(userId);
  if (likedIdx > -1) {
    post.likedBy.splice(likedIdx, 1);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(userId);
    post.likes += 1;
  }
  saveDb();
  res.json(post);
});

app.get('/api/community/posts/:id/comments', (req, res) => {
  const postComments = db.comments.filter((c) => c.postId === req.params.id);
  res.json(postComments);
});

app.post('/api/community/posts/:id/comments', (req, res) => {
  const newComment = {
    id: `c_${Date.now()}`,
    postId: req.params.id,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.comments.push(newComment);
  const post = db.posts.find((p) => p.id === req.params.id);
  if (post) {
    post.commentsCount = (post.commentsCount || 0) + 1;
  }
  saveDb();
  res.status(201).json(newComment);
});

// User profile & updates
app.put('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx] = { ...db.users[idx], ...req.body };
  saveDb();
  res.json(db.users[idx]);
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: db.users.length,
    totalModels: db.models.length,
    totalGuides: db.replacementGuides.length + db.techniqueGuides.length,
    totalTroubleshootingTrees: Object.keys(db.nodes).length,
    totalCommunityPosts: db.posts.length
  });
});

// Express global error handler to handle URI decoding or invalid path errors gracefully
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error('Express request error:', err.message || err);
    return res.status(err.status || 400).json({ error: err.message || 'Invalid request' });
  }
  next();
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Motorel Diag Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
