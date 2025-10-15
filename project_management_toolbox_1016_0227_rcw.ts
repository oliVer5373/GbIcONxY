// 代码生成时间: 2025-10-16 02:27:24
import { ApolloServer, gql } from 'apollo-server';
import { Project } from './models/Project'; // Assuming a Project model is defined elsewhere
import { ProjectInput } from './inputs/ProjectInput'; // Assuming a ProjectInput type is defined elsewhere

// Define GraphQL schema
const typeDefs = gql\`
  type Project {
    id: ID!
    title: String!
    description: String
    status: String
  }

  input ProjectInput {
    title: String!
    description: String
    status: String
  }

  type Query {
    getProject(id: ID!): Project
    getProjects: [Project]
  }

  type Mutation {
    addProject(input: ProjectInput!): Project
    updateProject(id: ID!, input: ProjectInput!): Project
    deleteProject(id: ID!): Boolean
  }
\`;

// Define resolvers for the schema
const resolvers = {
  Query: {
    getProject: async (_, { id }) => {
      // Fetch a project by ID from the database
      const project = await Project.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    },
    getProjects: async () => {
      // Fetch all projects from the database
      return await Project.findAll();
    },
  },
  Mutation: {
    addProject: async (_, { input }) => {
      // Create a new project and save it to the database
      const newProject = await Project.create(input);
      return newProject;
    },
    updateProject: async (_, { id, input }) => {
      // Update an existing project and save changes to the database
      const project = await Project.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      const updatedProject = await project.update(input);
      return updatedProject;
    },
    deleteProject: async (_, { id }) => {
      // Delete a project from the database
      const project = await Project.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      const deleted = await project.destroy();
      return deleted;
    },
  },
};

// Create an instance of Apollo Server with the schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
  console.log(`Project Management Tool is running at ${url}`);
});
