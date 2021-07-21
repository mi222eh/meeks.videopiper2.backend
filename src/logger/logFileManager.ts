import formatDate from 'date-fns/format'
import path from 'path';
import fs from 'fs-extra';


const LoggerFolder = path.resolve('./Logs');

function getCurrentDateText(){
    return formatDate(new Date(), 'yyyy-MM-dd')
}

function getTime(){
    return formatDate(new Date(), 'HH:mm:ss')
}

export function logErrorToFile(message:string){
    message = `[ERROR]${message}`
    writeToLogFile(message);
}

export function logWarningToFile(message:string){
    message = `[WARNING]${message}`
    writeToLogFile(message);
}

export function logInfoToFile(message:string){
    message = `[INFO]${message}`
    writeToLogFile(message);
}


async function writeToLogFile(message:string){
    message = `[${getTime()}]${message}`
    
    if(! await fs.pathExists(LoggerFolder)){
        await fs.mkdirp(LoggerFolder);
    }

    const logFile = path.join(LoggerFolder, `${getCurrentDateText()}.log.txt`);

    if(! await fs.pathExists(logFile)){
        await fs.createFile(logFile);
    }

    fs.appendFile(logFile, '\n' + message)
}