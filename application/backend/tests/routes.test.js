const request = require('supertest');
const app = require('../testServer'); // Import the app instance from testServer.js
const pool = require('../Services/database');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../Services/emailService');
const { directusClient } = require('../Services/directus');

jest.mock('../Services/emailService');
jest.mock('../Services/directus');

describe('API Endpoints', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should return a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the Syntaxx Squad API!');
  });

  it('should handle forgot password request', async () => {
    pool.query = jest.fn().mockResolvedValue([[{ email: 'test@example.com' }]]);
    sendOtpEmail.mockResolvedValue();

    const response = await request(app)
      .post('/request-password-reset')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('If the email is registered, you will receive a password reset email.');
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    expect(sendOtpEmail).toHaveBeenCalled();
  });

  

  it('should register a new user', async () => {
    pool.query = jest.fn().mockResolvedValue([[]]);
    sendOtpEmail.mockResolvedValue();

    const response = await request(app)
      .post('/signup')
      .send({ firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Signup successful, please check your email for OTP');
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['johndoe@example.com']);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO users (first_name, last_name, email, password, is_authenticated, otp) VALUES (?, ?, ?, ?, ?, ?)',
      ['John', 'Doe', 'johndoe@example.com', 'password', false, expect.any(String)]
    );
    expect(sendOtpEmail).toHaveBeenCalled();
  });

  it('should verify OTP and add user to Directus', async () => {
    pool.query = jest.fn()
      .mockResolvedValueOnce([[{ password: 'hashedPassword', otp: 123456, first_name: 'John', last_name: 'Doe' }]])
      .mockResolvedValueOnce([]);

    directusClient.post.mockResolvedValue({ data: { id: 1 } });

    const response = await request(app)
      .post('/verify-otp')
      .send({ email: 'johndoe@example.com', otp: '123456', firstName: 'John', lastName: 'Doe', hashedPassword: 'hashedPassword' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('OTP verification successful, user added to Directus');
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['johndoe@example.com']);
    expect(pool.query).toHaveBeenCalledWith('UPDATE users SET is_authenticated = 1 WHERE email = ?', ['johndoe@example.com']);
    expect(directusClient.post).toHaveBeenCalledWith('/users', {
      email: 'johndoe@example.com',
      password: 'John123',
      first_name: 'John',
      last_name: 'Doe',
    });
  });

  it('should retrieve users', async () => {
    pool.query = jest.fn().mockResolvedValue([[]]);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(pool.query).toHaveBeenCalledWith('SELECT first_name, last_name, email, role FROM users');
  });

  it('should update user role', async () => {
    pool.query = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .post('/updateRole')
      .send({ role: 'admin', email: 'johndoe@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User role updated successfully.');
    expect(pool.query).toHaveBeenCalledWith('UPDATE users SET role = ? WHERE email = ?', ['admin', 'johndoe@example.com']);
  });

  it('should retrieve user role', async () => {
    pool.query = jest.fn().mockResolvedValue([[]]);

    const response = await request(app).get('/userRole/johndoe@example.com');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(pool.query).toHaveBeenCalledWith('SELECT role FROM users WHERE email = ?', ['johndoe@example.com']);
  });

  it('should retrieve user first name', async () => {
    pool.query = jest.fn().mockResolvedValue([[]]);

    const response = await request(app).get('/userFirstName/johndoe@example.com');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(pool.query).toHaveBeenCalledWith('SELECT first_name, last_name FROM users WHERE email = ?', ['johndoe@example.com']);
  });

  it('should create a discussion', async () => {
    pool.query = jest.fn().mockResolvedValue([{ insertId: 1 }]);

    const response = await request(app)
      .post('/discussions')
      .send({ title: 'Test Discussion', content: 'This is a test discussion.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Discussion created.');
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO discussions (title, content) VALUES (?, ?)', ['Test Discussion', 'This is a test discussion.']);
  });

  it('should add a reply to a discussion', async () => {
    pool.execute = jest.fn().mockResolvedValue([{ insertId: 1 }]);

    const response = await request(app)
      .post('/discussions/1/replies')
      .send({ content: 'This is a test reply.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Reply added successfully');
    expect(pool.execute).toHaveBeenCalledWith('INSERT INTO replies (discussion_id, content) VALUES (?, ?)', ['1', 'This is a test reply.']);
  });

  it('should fetch discussions', async () => {
    pool.execute = jest.fn().mockResolvedValue([[]]);

    const response = await request(app).get('/discussions');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(pool.execute).toHaveBeenCalledWith('SELECT id, title FROM discussions');
  });

  it('should fetch discussion details', async () => {
    pool.execute = jest.fn()
      .mockResolvedValueOnce([[{ id: 1, title: 'Test Discussion', content: 'This is a test discussion.' }]])
      .mockResolvedValueOnce([
        [
          { id: 1, discussion_id: 1, content: 'This is a test reply.' },
          { id: 2, discussion_id: 1, content: 'Another test reply.' },
        ],
      ]);

    const response = await request(app).get('/discussions/1');

    expect(response.body.discussion).toBeDefined();
    expect(Array.isArray(response.body.replies)).toBe(true);
    expect(pool.execute).toHaveBeenCalledWith('SELECT * FROM discussions WHERE id = ?', ['1']);
    expect(pool.execute).toHaveBeenCalledWith('SELECT * FROM replies WHERE discussion_id = ?', ['1']);
  });

  it('should like a discussion', async () => {
    pool.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app).post('/discussions/1/like');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Discussion liked successfully');
    expect(pool.execute).toHaveBeenCalledWith('UPDATE discussions SET likes = likes + 1 WHERE id = ?', ['1']);
  });
});

describe('Discussion Routes', () => {
  it('should create a new discussion', async () => {
    pool.query = jest.fn().mockResolvedValue([{ insertId: 1 }]);

    const response = await request(app)
      .post('/api/discussions')
      .send({ title: 'Test Discussion', content: 'This is a test discussion.', userEmail: 'test@example.com' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Discussion created.');
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO discussions (title, content, user_id) VALUES (?, ?, ?)', ['Test Discussion', 'This is a test discussion.', 'test@example.com']);
  });

  it('should add a reply to a discussion', async () => {
    pool.execute = jest.fn().mockResolvedValue([{ insertId: 1 }]);

    const response = await request(app)
      .post('/api/discussions/1/replies')
      .send({ content: 'This is a test reply.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Reply added successfully');
    expect(pool.execute).toHaveBeenCalledWith('INSERT INTO replies (discussion_id, content) VALUES (?, ?)', ['1', 'This is a test reply.']);
  });

  it('should fetch all discussions', async () => {
    pool.execute = jest.fn()
      .mockResolvedValueOnce([[{ id: 1, title: 'Test Discussion', content: 'This is a test discussion.', first_name: 'John', last_name: 'Doe', likes: 0, dislikes: 0, created_at: '2023-05-08' }]])
      .mockResolvedValueOnce([[{ id: 1, discussion_id: 1, content: 'Test reply' }]]);

    const response = await request(app).get('/api/discussions');

    expect(response.status).toBe(200);
    expect(response.body.discussion).toBeDefined();
    expect(Array.isArray(response.body.discussion)).toBe(true);
    expect(response.body.replies).toBeDefined();
    expect(Array.isArray(response.body.replies)).toBe(true);
    expect(pool.execute).toHaveBeenCalledWith('select d.id, d.title, d.content, u.first_name, u.last_name, d.likes, d.dislikes, d.created_at from  discussions d inner join users u  on d.user_id = u.email order by d.created_at desc;');
    expect(pool.execute).toHaveBeenCalledWith('SELECT * FROM replies');
  });

  it('should fetch discussion details', async () => {
    pool.execute = jest.fn()
      .mockResolvedValueOnce([[{ id: 1, title: 'Test Discussion', content: 'This is a test discussion.', likes: 0, dislikes: 0 }]])
      .mockResolvedValueOnce([
        [
          { id: 1, discussion_id: 1, content: 'This is a test reply.' },
          { id: 2, discussion_id: 1, content: 'Another test reply.' },
        ],
      ]);

    const response = await request(app).get('/api/discussions/1');

    expect(response.status).toBe(200);
    expect(response.body.discussion).toBeDefined();
    expect(Array.isArray(response.body.replies)).toBe(true);
    expect(pool.execute).toHaveBeenCalledWith('SELECT id, title, content, likes, dislikes FROM discussions WHERE id = ?', ['1']);
    expect(pool.execute).toHaveBeenCalledWith('SELECT * FROM replies WHERE discussion_id = ?', ['1']);
  });

  it('should delete a discussion', async () => {
    pool.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app).delete('/api/discussions/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Discussion deleted successfully');
    expect(pool.execute).toHaveBeenCalledWith('DELETE FROM discussions WHERE id = ?', ['1']);
  });

  it('should update a discussion', async () => {
    pool.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .put('/api/discussions/1')
      .send({ title: 'Updated Discussion', content: 'This is an updated discussion.', userEmail: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Discussion updated successfully');
    expect(pool.execute).toHaveBeenCalledWith('UPDATE discussions SET title = ?, content = ? WHERE id = ? AND user_id = ?', ['Updated Discussion', 'This is an updated discussion.', '1', 'test@example.com']);
  });

  it('should fetch a user\'s discussions', async () => {
    pool.execute = jest.fn()
      .mockResolvedValueOnce([[{ id: 1, title: 'Test Discussion', content: 'This is a test discussion.', likes: 0, dislikes: 0 }]])
      .mockResolvedValueOnce([[{ id: 1, discussion_id: 1, content: 'Test reply' }]]);

    const response = await request(app).get('/api/discussions/my/test@example.com');

    expect(response.status).toBe(200);
    expect(response.body.discussion).toBeDefined();
    expect(Array.isArray(response.body.discussion)).toBe(true);
    expect(response.body.replies).toBeDefined();
    expect(Array.isArray(response.body.replies)).toBe(true);
    expect(pool.execute).toHaveBeenCalledWith('SELECT id, title, content, likes, dislikes FROM discussions WHERE user_id = ?', ['test@example.com']);
    expect(pool.execute).toHaveBeenCalledWith('SELECT * FROM replies');
  });
});
