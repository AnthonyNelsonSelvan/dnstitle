import {Filter} from 'bad-words';
import { blockedNames } from './blockedBrandNames.js';

const filter = new Filter();
const badWords = filter.list;  // List of bad words from bad-words library

function profanityCheck(word) {
    const lower = word.toLowerCase();  // Convert to lowercase for easy matching

    // Loop through each bad word in the list
    for (let bad of badWords) {
        // Check if the word exactly matches a bad word
        if (lower === bad) {
            return true;  // Bad word found
        }

        // Check if the bad word is at the start or end of the input word
        if (lower.startsWith(bad) || lower.endsWith(bad)) {
            return true;  // Bad word is at the start or end
        }
    }
    for(let blocked of blockedNames){
        if(lower.includes(blocked)){
            return true;
        } 
    }

    return false;  // No bad word found
}

export default profanityCheck;