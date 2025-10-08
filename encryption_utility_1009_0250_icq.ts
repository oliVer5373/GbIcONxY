// 代码生成时间: 2025-10-09 02:50:25
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import crypto from 'crypto';

// Define the GraphQL schema for our encryption utility
const schema: GraphQLSchema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      encrypt: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          file: { type: new GraphQLNonNull(GraphQLString) },
          key: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (parent, args) => {
          return encryptFile(args.file, args.key);
        },
      },
      decrypt: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          file: { type: new GraphQLNonNull(GraphQLString) },
          key: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (parent, args) => {
          return decryptFile(args.file, args.key);
        },
      },
    },
  }),
});

// Function to encrypt a file
async function encryptFile(filePath: string, encryptionKey: string): Promise<string> {
  try {
    const data = readFileSync(filePath);
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedFilePath = filePath + '.enc';
    writeFileSync(encryptedFilePath, encrypted);
    return encryptedFilePath;
  } catch (error) {
    throw new Error(`Failed to encrypt file: ${error.message}`);
  }
}

// Function to decrypt a file
async function decryptFile(filePath: string, encryptionKey: string): Promise<string> {
  try {
    const data = readFileSync(filePath);
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const decryptedFilePath = filePath.replace('.enc', '');
    writeFileSync(decryptedFilePath, decrypted);
    return decryptedFilePath;
  } catch (error) {
    throw new Error(`Failed to decrypt file: ${error.message}`);
  }
}

// GraphQL query handler for the encryption utility
async function handleQuery(query: string): Promise<string> {
  return graphql(schema, query).then((response) => {
    if (response.errors) {
      throw new Error(response.errors.map((error) => error.message).join(', '));
    }
    return JSON.stringify(response.data);
  }).catch((error) => {
    throw error;
  });
}

// Example usage of the encryption utility
const exampleQuery = `mutation {
  encrypt(file: "example.txt", key: "secret-key")
}
`;

handleQuery(exampleQuery)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));