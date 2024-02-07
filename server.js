const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const rawData = fs.readFileSync('store.json');
let data = JSON.parse(rawData);

// Add new post to the database
app.post('/api/posts', (req, res) => {
    try {
        const { title, author, views, reviews } = req.body;
        let comments = [];

        let postID = 0;
        if (data.post.length > 0) {
            postID = data.post[data.post.length - 1].id + 1;
        }

        data.posts[data.posts.length] = { id: postID, title, author, views, reviews, comments };
        fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Post added successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add new author to the database
app.post('/api/authors', (req, res) => {
    try {
        const { first_name, last_name, posts } = req.body;

        let authorId = 0;
        if (data.authors.length > 0) {
            authorId = data.authors[data.authors.length - 1].id + 1;
        }

        data.authors[data.authors.length] = { id: authorId, first_name, last_name, posts };
        fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Author added successfully' });
    } catch (error) {
        console.error('Error updating Author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update post from the database based on the ID
app.put('/api/posts/:id', (req, res) => {
    try {
        const { id: bodyID, title, author, views, reviews } = req.body;

        if (bodyID) {
            res.status(404).json({ message: "ID is immutable, hence can't be changed" });
        }

        const postId = parseInt(req.params.id);

        const postIndex = data.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key) && data.posts[postIndex].hasOwnProperty(key)) {
                    data.posts[postIndex][key] = req.body[key];
                }
            }
            fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
            res.status(200).json({ message: 'Post updated successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update author from the database based on the ID
app.put('/api/authors/:id', (req, res) => {
    try {
        const { id: bodyID, first_name, last_name, posts } = req.body;

        if (bodyID) {
            res.status(404).json({ message: "ID is immutable, hence can't be changed" });
        }

        const authorId = parseInt(req.params.id);

        const authorIndex = data.authors.findIndex(authors => authors.id === authorId);
        if (authorIndex !== -1) {
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key) && data.authors[authorIndex].hasOwnProperty(key)) {
                    data.authors[authorIndex][key] = req.body[key];
                }
            }
            fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
            res.status(200).json({ message: 'Author updated successfully' });
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        console.error('Error updating Author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all posts from the database
app.get('/api/posts', (req, res) => {
    res.status(200).json(data.posts);
});

// Get all authors from the database
app.get('/api/authors', (req, res) => {
    res.status(200).json(data.authors);
});

// Get post from the database based on the param ID
app.get('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = data.posts.find(post => post.id === postId);
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Get author from the database based on the param ID
app.get('/api/authors/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const author = data.authors.find(author => author.id === authorId);
    if (author) {
        res.status(200).json(author);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

// Delete post from the database based on the param ID
app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = data.posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        data.posts.splice(index, 1);
        fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Delete author from the database based on the param ID
app.delete('/api/authors/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const index = data.authors.findIndex(author => author.id === authorId);
    if (index !== -1) {
        data.authors.splice(index, 1);
        fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Author deleted successfully' });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

app.post('/api/comments', (req, res) => {
    try {
        const { id, submittedBy, text } = req.body;

        const postIndex = data.posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            data.posts[postIndex].comments[data.posts[postIndex].comments.length] = { submittedBy, text };
            fs.writeFileSync('store.json', JSON.stringify(data, null, 2));
            res.status(200).json({ message: 'Comment added successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
