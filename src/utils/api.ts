import axios from "axios";
import logger from "./logger";

export const sendResponse = async (data: any, type: any, queryParam?: Record<string, string>) => {
  try {
    // Retrieve the base URL from the environment variable
    const baseUrl = `${process.env.API_SERVICE_LAYER}/api/${type}`;

    // Append query parameters if provided
    const url = queryParam
      ? `${baseUrl}?${new URLSearchParams(queryParam).toString()}`
      : baseUrl;

    // Send the POST request
    const response = await axios.post(url, data);

    // Log the response
    logger.info("response>", response.data);
  } catch (error:any) {
    // Handle errors
    logger.error("Error sending response at url:"+` ${process.env.API_SERVICE_LAYER}/api/${type}`, error);
  }
};
