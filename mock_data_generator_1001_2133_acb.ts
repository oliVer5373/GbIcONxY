// 代码生成时间: 2025-10-01 21:33:41
import { faker } from '@faker-js/faker';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

// Define the structure of the mock data
interface MockUserType {
  id: string;
  name: string;
  email: string;
}

// Generate a single mock user
function generateMockUser(): MockUserType {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email()
  };
}

// Mock data generator function
function generateMockData(count: number): MockUserType[] {
  if (count < 1) {
    throw new Error('Count must be greater than 0');
  }
  return Array.from({ length: count }, generateMockUser);
}

// GraphQL type definitions
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// GraphQL schema definition
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      mockUsers: {
        type: new GraphQLObjectType({
          name: 'MockUsers',
          fields: {
            users: { type: new GraphQLList(UserType) },
          }),
          args: {
            count: { type: GraphQLString },
          },
          resolve: (_, args) => {
            const count = parseInt(args.count, 10);
            if (isNaN(count)) {
              throw new Error('Invalid count argument');
            }
            return { users: generateMockData(count) };
          },
        },
      }),
    },
  }),
});

// Example usage
const users = generateMockData(5);
console.log(users);
