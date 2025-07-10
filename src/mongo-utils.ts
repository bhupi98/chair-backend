export async function handleMongoOperation<T>(
    operation: Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await operation;
    } catch (error) {
      // Check for MongoDB-specific errors
      if (error.name === 'ValidationError') {
        console.error('MongoDB Validation Error:', error.message);
      } else if (error.name === 'CastError') {
        console.error('MongoDB Cast Error:', error.message);
      } else {
        console.error(`${errorMessage}:`, error.message);
      }
  
      // Re-throw the error for higher-level handling
      throw new Error(errorMessage);
    }
  }
  