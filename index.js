const express = require('express');
const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// secret key for JWT
const secretKey = 'abc';

let users = [];
let posts = [];

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Hash the password before storing in the database
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    email,
    hashedPassword
  };

  users.push(newUser);
  console.log(users)
  return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

  return res.status(200).json({ message: 'Login successful', token });
});

app.post('/forget-password', (req, res) => {
  const { email } = req.body;
  
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Here you would typically generate and send a password reset link to the user's email
  return res.status(200).json({ message: 'Password reset link sent to email' });
});

app.post('/posts', verifyToken, (req, res) => {
  console.log({"User Id":req.userId})
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: 'User ID and content are required' });
  }

  const newPost = {
    postId: posts.length + 1,
    userId,
    content,
    likes: 0,
    comments: []
  };

  posts.push(newPost);
  return res.status(201).json({ message: 'Post created successfully', post: newPost });
});

app.get('/posts',verifyToken, (req, res) => {
  return res.status(200).json(posts);
});

app.put('/posts/:postId/like', verifyToken, (req, res) => {
  const { postId } = req.params;

  const post = posts.find(p => p.postId === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.likes += 1;

  return res.status(200).json({ message: 'Post liked', post });
});

app.post('/posts/:postId/comments', verifyToken, (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  const post = posts.find(p => p.postId === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const newComment = {
    userId,
    comment
  };

  post.comments.push(newComment);

  return res.status(201).json({ message: 'Comment added', post });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
