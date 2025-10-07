// 代码生成时间: 2025-10-07 18:46:53
import { watch } from 'chokidar';
import { PubSub } from 'graphql-subscriptions';
import { getDirectoryPaths } from './utils'; // Assuming a utilities module for file paths

// PubSub instance for notification
const pubsub = new PubSub();

interface WatchOptions {
  // Options for the file watcher
  ignored: string[];
  persistent: boolean;
  followSymlinks: boolean;
}

interface FileChange {
  // Structure for file change events
  filePath: string;
  event: 'add' | 'change' | 'unlink';
}

class FileWatcherService {
  private watcher: any;
  private options: WatchOptions;

  /*
   * Constructor for the FileWatcherService
   * @param {WatchOptions} options - Options for the file watcher
   */
  constructor(options: WatchOptions) {
    this.options = options;
  }

  /*
   * Starts the file watching process
   * @param {string[]} directories - An array of directories to watch
   */
  startWatching(directories: string[]): void {
    this.watcher = watch(directories, { ...this.options });

    this.watcher
      .on('add', (filePath: string) => this.handleFileChange('add', filePath))
      .on('change', (filePath: string) => this.handleFileChange('change', filePath))
      .on('unlink', (filePath: string) => this.handleFileChange('unlink', filePath))
      .on('error', (error: Error) => this.handleError(error));
  }

  /*
   * Handles file change events and notifies subscribers
   * @param {string} event - The file event type (add, change, unlink)
   * @param {string} filePath - The path of the changed file
   */
  private handleFileChange(event: 'add' | 'change' | 'unlink', filePath: string): void {
    const fileChange: FileChange = { filePath, event };
    // Publish the file change event to subscribers
    pubsub.publish('FILE_CHANGE', fileChange);
    console.log(`File changed: ${fileChange.filePath}, Event: ${fileChange.event}`);
  }

  /*
   * Handles errors that occur during file watching
   * @param {Error} error - The error that occurred
   */
  private handleError(error: Error): void {
    console.error('File watching error:', error);
  }

  /*
   * Stops the file watching process
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

// Export the service and the pubsub instance
export { FileWatcherService, pubsub };
