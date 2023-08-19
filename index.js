const express = require('express');
const app = express();
app.use(express.json());

let users = [];

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password
  };

  users.push(newUser);
  console.log(users);
  return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({ message: 'Login successful', user });
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

let posts = [];

app.post('/posts', (req, res) => {
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

app.get('/posts', (req, res) => {
  return res.status(200).json(posts);
});

app.put('/posts/:postId/like', (req, res) => {
  const { postId } = req.params;

  const post = posts.find(p => p.postId === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.likes += 1;

  return res.status(200).json({ message: 'Post liked', post });
});

app.post('/posts/:postId/comments', (req, res) => {
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
