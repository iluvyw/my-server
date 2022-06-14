import express, { Request, Response, Router } from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { users, posts } from "../data";

export const router: Router = express.Router();

const UserType = new GraphQLObjectType({
  name: "user",
  description: "Represent a user",
  fields: () => ({
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    posts: {
      type: GraphQLList(PostType),
      resolve: (user) => {
        return posts.filter((post) => post.username === user.username);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "post",
  description: "Represent a post",
  fields: () => ({
    username: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "query",
  description: "Root query",
  fields: () => ({
    users: {
      type: GraphQLNonNull(GraphQLList(UserType)),
      resolve: () => users,
    },
    posts: {
      type: GraphQLNonNull(GraphQLList(PostType)),
      resolve: () => posts,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "mutation",
  description: "Root mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      description: "Add a user",
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const user = {
          username: args.username,
          password: args.password,
          name: args.name,
          age: args.age,
        };
        if (!users.find((user) => user.username === args.username)) {
          users.push(user);
        }
        return user;
      },
    },
    addPost: {
      type: PostType,
      description: "Add a post",
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const post = {
          username: args.username,
          image: args.image,
          status: args.status,
        };
        if (users.find((user) => user.username === args.username)) {
          posts.push(post);
        }
        return post;
      },
    },
  }),
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

router.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

router.get("/", (req: Request, res: Response) => {
  res.status(200).json(users);
});
