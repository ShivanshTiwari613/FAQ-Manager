//Depiting how it will work in my enviorment

import request from 'supertest';
import app from '../src/index.js';
import mongoose from 'mongoose';
import FAQ from '../src/models/faqModel.js'; // Correct path to your model
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
    process.env.ORIGINAL_NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    process.env.NODE_ENV = process.env.ORIGINAL_NODE_ENV;
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    await FAQ.deleteMany({}); // Clear the collection before each test
});

describe('POST /api/faq', () => {
    it('should create a new FAQ', async () => {
        const faqData = {
            question: 'What is your name?',
            answer: 'My name is GitHub Copilot.',
            answerHtml: '<p>My name is GitHub Copilot.</p>',
            languages: [] // Important: Initialize languages as an empty array
        };

        const createResponse = await request(app)
            .post('/api/faq')
            .send(faqData)
            .expect(201);

        const createdFaq = await FAQ.findById(createResponse.body._id);
        expect(createdFaq).not.toBeNull();
        expect(createdFaq.question).toBe('What is your name?');
        expect(createdFaq.answer).toBe('My name is GitHub Copilot.');
        expect(createdFaq.answerHtml).toBe('<p>My name is GitHub Copilot.</p>');
    });
});

// ... other test cases if you have them

import { v2 as Translate } from '@google-cloud/translate';

jest.mock('@google-cloud/translate');

describe('Translation Functionality', () => {
    // ... (Your existing translation tests - keep these as they are)
});