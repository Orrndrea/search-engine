const { gql } = require('apollo-server-express');

// Import resolvers
const userResolvers = require('./resolvers/userResolvers');
const bookResolvers = require('./resolvers/bookResolvers');

// Type definitions
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getUser(id: ID!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, authors: [String], description: String!, title: String!, image: String, link: String): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = {
  typeDefs,
  resolvers: {
    Query: {
      ...userResolvers.Query,
      ...bookResolvers.Query,
    },
    Mutation: {
      ...userResolvers.Mutation,
      ...bookResolvers.Mutation,
    },
  },
};
