import { HttpException, HttpStatus } from "@nestjs/common";

export async function handleErrors<T>(operation: Promise<T>, context = ''): Promise<T> {
    try {
      return await operation;
    } catch (error) {
      console.error(`Error in ${context}:`, error);
  
      // Handle specific error cases
      if (error.response) {
        throw new HttpException(
          error.response.data?.message || 'API Request Failed',
          HttpStatus.BAD_GATEWAY,
        );
      }
      throw new HttpException(
        `Internal server error during ${context}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  