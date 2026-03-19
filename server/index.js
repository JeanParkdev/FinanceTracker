import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './resolvers/index.js';
import connectDB from './config/connection.js';
import authMiddleware from './middleware/auth.js';
import cors from 'cors'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await connectDB();
  await server.start();

  app.use(express.json());
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
   return { req };
  }
  }));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();