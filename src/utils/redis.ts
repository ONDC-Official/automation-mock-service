import { RedisService } from "ondc-automation-cache-lib";
import { logError, logger, logInfo } from "../utils/logger";


export const getFromCache = async (key: string,db: number): Promise<any> => {
    try{
      logInfo({
        message: `Getting data from cache for key: ${key}`,
        meta: { key },
      });
      let cacheData = await RedisService.getKey(key);
      cacheData = cacheData && canBeParsed(cacheData) ? JSON.parse(cacheData) : cacheData ;
      return cacheData;
  }
    catch(e:any){
        // logger.error(`An error occurred while fetching data from cache, key -  ${key} , error -  ${e.message} stack - ${e.stack}`)
        logError({
            message: `An error occurred while fetching data from cache, key -  ${key} , error -  ${e.message} stack - ${e.stack}`,
            meta: { key },
        });
        throw Error(`Unable to fetch data from cache`)
    }
};

export const setToCache = async (key: string, value: object | any[] | string| number| boolean , db:number): Promise<any> => {
    try{
      logInfo({
        message: `Setting data to cache for key: ${key}`,
        meta: { key },
      });
      const cacheData : string = typeof value === 'string' ? value : JSON.stringify(value);
      await RedisService.setKey(key, cacheData);
    }
    catch(e:any){
      // logger.error(`An error occurred while setting data to cache, key -  ${key} , error -  ${e.message}`)
      logError({
        message: `An error occurred while setting data to cache, key -  ${key} , error -  ${e.message}`,
        meta: { key },
      });
      throw Error(`unable to set data to cache`)
    }
};

function canBeParsed(str : any) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  