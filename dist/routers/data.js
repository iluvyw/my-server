"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const data_1 = require("../data");
exports.router = express_1.default.Router();
const UserType = new graphql_1.GraphQLObjectType({
    name: "user",
    description: "Represent a user",
    fields: () => ({
        username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        age: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        posts: {
            type: (0, graphql_1.GraphQLList)(PostType),
            resolve: (user) => {
                return data_1.posts.filter((post) => post.username === user.username);
            },
        },
    }),
});
const PostType = new graphql_1.GraphQLObjectType({
    name: "post",
    description: "Represent a post",
    fields: () => ({
        username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        image: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        status: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
    }),
});
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: "query",
    description: "Root query",
    fields: () => ({
        users: {
            type: (0, graphql_1.GraphQLNonNull)((0, graphql_1.GraphQLList)(UserType)),
            resolve: () => data_1.users,
        },
        posts: {
            type: (0, graphql_1.GraphQLNonNull)((0, graphql_1.GraphQLList)(PostType)),
            resolve: () => data_1.posts,
        },
    }),
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: "mutation",
    description: "Root mutation",
    fields: () => ({
        addUser: {
            type: UserType,
            description: "Add a user",
            args: {
                username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                age: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
            },
            resolve: (parent, args) => {
                const user = {
                    username: args.username,
                    password: args.password,
                    name: args.name,
                    age: args.age,
                };
                if (!data_1.users.find((user) => user.username === args.username)) {
                    data_1.users.push(user);
                }
                return user;
            },
        },
        addPost: {
            type: PostType,
            description: "Add a post",
            args: {
                username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                image: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                status: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve: (parent, args) => {
                const post = {
                    username: args.username,
                    image: args.image,
                    status: args.status,
                };
                if (data_1.users.find((user) => user.username === args.username)) {
                    data_1.posts.push(post);
                }
                return post;
            },
        },
    }),
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});
exports.router.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    graphiql: true,
}));
exports.router.get("/", (req, res) => {
    res.status(200).json(data_1.users);
});
