// import fs from 'fs';

// const fsPromise = fs.promises;

// async function log(logData) {
//     try{
//         logData = ` ${new Date().toString()} - ${logData} \n`;
//         await fsPromise.appendFile("log.txt", logData);
//     }catch(err) {
//         console.log(err);
//     }
// }

// const loggerMiddleware = async(req,res,next) => {
//     if (!req.url.includes('signin')) {
//     const logData = `${req.url} - ${JSON.stringify(req.body)}`;
//     await log(logData);
//     }
//     next();
// }

// export default loggerMiddleware;

/** Winston logger **/

import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'request-logging'},
    transports: [new winston.transports.File({filename: 'logs.txt'})]
});

const loggerMiddleware = async(req,res,next) => {
    if (!req.url.includes('signin')){
        const logData = `${req.url} - ${JSON.stringify(req.body)}`;
        logger.info(logData);
    }
    next();
}

export default loggerMiddleware;