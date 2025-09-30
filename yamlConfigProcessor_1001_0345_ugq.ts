// 代码生成时间: 2025-10-01 03:45:22
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { load } from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

// 定义一个接口，用于定义配置文件的结构
interface Config {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  server: {
    port: number;
  };
}

// 定义一个类来处理YAML配置文件
class YamlConfigProcessor {
  // 构造函数，接收配置文件路径
  constructor(private configPath: string) {}

  // 加载配置文件
  public async loadConfig(): Promise<Config> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.configPath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const config: Config = load(data) as Config;
          resolve(config);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  // 创建GraphQL schema
  public createGraphQLSchema(): GraphQLSchema {
    // 定义Query对象类型
    const queryType = new GraphQLObjectType({
      name: 'Query',
      fields: {
        getConfig: {
          type: new GraphQLObjectType({
            name: 'Config',
            fields: {
              database: {
                type: new GraphQLObjectType({
                  name: 'Database',
                  fields: {
                    host: { type: GraphQLString },
                    port: { type: GraphQLInt },
                    username: { type: GraphQLString },
                    password: { type: GraphQLString },
                  },
                }),
              server: {
                type: new GraphQLObjectType({
                  name: 'Server',
                  fields: {
                    port: { type: GraphQLInt },
                  },
                }),
              },
            },
          }),
          resolve: () => this.loadConfig(),
        },
      },
    });

    // 创建GraphQL schema
    return new GraphQLSchema({
      query: queryType,
    });
  }
}

// 使用示例
const configPath = path.join(__dirname, 'config.yaml');
const processor = new YamlConfigProcessor(configPath);

processor.loadConfig()
  .then(config => console.log('Loaded config:', config))
  .catch(err => console.error('Error loading config:', err));

const schema = processor.createGraphQLSchema();
console.log('GraphQL schema:', schema);