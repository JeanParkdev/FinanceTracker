import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import cors from 'cors';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './resolvers/index.js';
import connectDB from './config/connection.js';
import authMiddleware from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const allowedOrigins = ['http://localhost:5173', 'https://financetracker-client.onrender.com'];
const startServer = async () => {
  await connectDB();
  await server.start();

app.use('/graphql', cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}), express.json(), expressMiddleware(server, {
  context: async ({ req }) => {
    const result = authMiddleware({ req });
    return result;
  }
}));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();