const express = require('express');
const cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path')

const prisma = new PrismaClient()


const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      return await context.prisma.users.findMany()
    },
    user: async (parent , args, context, info) => {
      const user = await context.prisma.users.findUnique({
        where: {
          id:args.id
        }
      });
      return user;
    }
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const user = await context.prisma.users.create({
        data: {
          name: args.name,
          age: args.age,
          avatar: args.avatar
        },
      })
      console.log(args);
      console.log(args.name);
      return user;
    },
    updateUser: async (parent, args, context, info) => {
      const user = await prisma.users.update({
        where: {
          id: args.id
        },
        data: {
          name: args.name,
          age: args.age,
          avatar: args.avatar
        }
      });
      return user;
    },
    deleteUser: async (parent, args, context, info) => {
      const user = await context.prisma.users.delete({
        where: {
          id: args.id
        }
      });
      console.log(user);
      return user;
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, '..', '/graphql/schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
});

const app = express();
app.use(cors());
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);