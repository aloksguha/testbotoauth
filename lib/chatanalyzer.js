/**
 * Created by Alok Guha (aloksguha@gmail.com)
 * Intial draft on March 6, 2018
 */
var sentiment = require('sentiment');
 'use strict';

 module.exports = {
    chatanalyzer: function () {
        var analyzer = {}, sentimentResult;
        analyzer.setSentense = function(chatInput){
            if(chatInput){
                sentense = chatInput;
                sentimentResult = sentiment(sentense)
                for(index in sentimentResult.tokens){
                    sentimentResult.tokens[index] = sentimentResult.tokens[index].toUpperCase();
                }
                return true;

            }else{
                return 'Enter a valid chat statement';
            }
        }

        analyzer.getSentiment = function(){
            return sentimentResult;
        }

        analyzer.getPossibleReply = function(){
            
            var reply = '';
          

            // Neutral
            if(sentimentResult.score === 0){
                console.log('here')
                if(module.exports.identifyHelloHi(sentimentResult.tokens)){
                    reply+='Hey there, warm Welcome !! '
                }else{
                    reply+='Fine, '
                }
                
            }
            //positive
            if(sentimentResult.score === 1){
                if(module.exports.identifyHelloHi(sentimentResult.tokens)){
                    reply+='Hey there, warm Welcome !! '
                }else{
                    reply+='wonderful, '
                }
            }
            // very positive
            if(sentimentResult.score === 2){
                if(module.exports.identifyHelloHi(sentimentResult.tokens)){
                    reply+='Hey there, warm Welcome !! '
                }else{
                    reply+='Awesome, '
                }
            }  
            //extremely Positive
            if(sentimentResult.score > 2){
                reply +='Awesome, I am very happy to know about it :), ' 
            }
            //Negative
            if(sentimentResult.score === -1){
                reply+='Ohh '
            }
            // very negative
            if(sentimentResult.score === -2){
                reply+='Aww '
            }
            //extreme negative
            if(sentimentResult.score < -2){
                reply +='Its sad, I am so sorry about it :(' 
            }
            if(module.exports.findIfUserIsAskingHelp(sentimentResult.tokens)){
                var product = module.exports.identifyProduct(sentimentResult.tokens);
                if(product){
                    reply+=', As you are talking to a bot, I sense you need to know more about our product '+product+', could you please be more specific ?';
                }
            }
            return reply;
        }
        
        return analyzer;

    } // End of chatanalyzer
} // End of module.export

module.exports.findIfUserIsAskingHelp = function(tokens){
    var helpfulwords = ['HELP', 'WANT TO KNOW', 'ASSIST']
    if(tokens && tokens.length > 0)
    for(index in helpfulwords){
        if(tokens.indexOf(helpfulwords[index]) != -1){
            return true;
        }
    }
    return false;
}


module.exports.identifyProduct = function(tokens){
    var helpfulwords = ['TCI', 'MOCK', 'MODELER', 'WEB INTEGRATOR', 'FLOGO']
    if(tokens && tokens.length > 0)
    for(index in helpfulwords){
        if(tokens.indexOf(helpfulwords[index]) != -1){
            return helpfulwords[index];
        }
    }
    return false;
}


module.exports.identifyHelloHi = function(tokens){
    console.log(tokens)
    var helpfulwords = ['HI', 'HELLO', 'HEY', 'HOWDY']
    if(tokens && tokens.length > 0)
    for(index in helpfulwords){
        if(tokens.indexOf(helpfulwords[index]) != -1){
            return helpfulwords[index];
        }
    }
    return false;
}
/**
 * 
Score: Score calculated by adding the sentiment values of recongnized words.
Comparative: Comparative score of the input string.
Token: All the tokens like words or emojis found in the input string.
Words: List of words from input string that were found in AFINN list.
Positive: List of postive words in input string that were found in AFINN list.
Negative: List of negative words in input string that were found in AFINN list.




 * 
 */