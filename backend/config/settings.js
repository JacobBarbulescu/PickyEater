//YOU WILL NEED TO CHANGE THE DB NAME TO MATCH THE REQUIRED DB NAME IN THE ASSIGNMENT SPECS!!!
export const mongoConfig = {
  serverUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/',
  database: process.env.MONGODB_DATABASE || 'PickyEaterDB',
};
