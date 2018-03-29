
//===============ITEM CONTROLLER==================
const ItemCtrl = (function(){
    
    
    let wordList = [
	"afterthought","agonizing","alluring","amuse","avoid","ball","border","cagey","coach","compare","complex","concerned","deserted","fork","freezing","hand","helpless","hook","hop","innocent","interesting","irritate","motionless","muscle","nappy","note","noxious","plain","precede","rainstorm","report","scared","scattered","secret","settle","silent","society","soothe","spark","stone","tacit","tickle","torpid","undress","used","visit","youthful"
];

    let correctCharsArr = [],
            wrongCharsArr = [],
            guessesRemaining = 10;
 
    //Public Methods
    return {
        loadRandomWord: function(){        
          
            //Slice out random word from wordlist array then map over the hangmanword and convert each letter into its unicode
            return wordList.splice(Math.floor(Math.random() * wordList.length), 1)[0]
                .split('')
                .map(letter => letter.charCodeAt(0));
            
        },
        checkUserInput: function(letterInputs, charCodeMap) {
            let charPosition,
                wrong = 'wrong',
                correct = 'correct';

            
            //for each letter charCode in the letterInputs array
            letterInputs.forEach((letter, index, arr) => {
                
                //check if the index of the letter is not -1
                if(charCodeMap.indexOf(letter) !== -1) {
                   
                    //Note the position of the char in the array
                    charPosition = charCodeMap.indexOf(letter);
                
                    //Append UI with the new found character
                    UICtrl.appendCorrectLetter(arr, index, charPosition);
                      
                    //set the character in the charCodeMap(randomWrod) to null in case there is more then on occurance of the letter
                    charCodeMap[charPosition] = null;
                    
                    /*check if the index of random word is not equal to -1. This is done just in case there is a second occurance or more of a letter
                    in the word. The index of finds the the first occurrance but since we just found the first one and nulled it out we can now find the second occurrance*/
                    if(charCodeMap.indexOf(letter) !== -1 ){
                        
                        //recursively call the checkuserInput passing the letterInputs and New charcodemap. This will continue to fire until the condition wrapping it is no longer met.
                        ItemCtrl.checkUserInput(letterInputs, charCodeMap);
                        
                    }
                    //pass the correct letter off to the scorekeeper function
                    ItemCtrl.keepScore(letter, correct, charCodeMap);
                    
                } else {
                   //check the correctChars array and wrongChars array to ensure there is none in existence 
                    if(correctCharsArr.indexOf(letter) === -1 && wrongCharsArr.indexOf(letter) === -1){
                        
                        //pass the wrong answer off to the keepScore function
                        ItemCtrl.keepScore(letter, wrong);
                        
                    }                   
                
                }
            });
            
        },
        keepScore: function(letter, answer, charCodeMap){
            
             //Push correct and incorrect scores off into their respective arrays     
            if(answer === 'correct'){
                
                correctCharsArr.push(letter);
                
                UICtrl.colorKeys(correctCharsArr, answer);
                if(correctCharsArr.length === charCodeMap.length){
                    $('#gameOver').modal('show');
                    document.querySelector('#gameOverText').innerHTML = 'Winner! Winner!<br> Chicken Dinner!';
                }
                
            }else if(answer === 'wrong'){
                
                wrongCharsArr.push(letter);
                
                guessesRemaining--;
                
                //The drawhangMan function is what determines the end of the game. The guessess remaining is passed to this function.
                UICtrl.drawHangMan(guessesRemaining);
                
                document.querySelector('.guessesRemaining').innerHTML = guessesRemaining;
                
                //pass the wrongCharsArr off to the colorKeys function. 
                UICtrl.colorKeys(wrongCharsArr, answer);
                
            }
        }
        
    }

})();

//================UI CONTROLLER==================
const UICtrl = (function(){
    
    const UISelectors = {
        hangManWord: '#hangManWord',
        guessInput: '#guessInput',
        letterBox: '.letterBox',
        letterKeys: '.letterKeys'
    }
    
    //Public Methods
    return {
        createLetterBoxes: (wordLength)=>{
            let i = 0;
            while(i < wordLength) {

                let letterBox = document.createElement("div");

                letterBox.className = "letterBox";

                document.querySelector(UISelectors.hangManWord).appendChild(letterBox);

                i++;
            }  
        },
        appendCorrectLetter: (arr, index, charPosition)=>{
           let letterBox = document.createElement("p"),
                boxesArr;
            
            letterBox.className = 'text-center';

            letterBox.innerHTML = String.fromCharCode(arr[index]); 
            
            boxesArr = Array.from(document.querySelectorAll(".letterBox"));
               
             boxesArr.forEach((box, index) => {
                if(charPosition === index) {
                    box.appendChild(letterBox);
                }
            });    
        },
        colorKeys: (ansArr, answer)=> {
            console.log(ansArr);
            if(answer === 'correct'){
                ansArr.forEach(ans=>{
                    document.getElementById(`${ans}`).style.backgroundColor = '#00800094'; 
                });
            }else if (answer === 'wrong'){
                ansArr.forEach(ans=>{
                    document.getElementById(`${ans}`).style.backgroundColor = '#ff00008c'; 
                });
            }
        },
        drawHangMan: (guessesRemaining)=>{
            let canvas = document.querySelector('#hangMan'),
                context = canvas.getContext('2d');
            context.strokeStyle = '#0D47A1';
            
            /*A switch statement is used compare the inbound guessesRemaining aginst the various cases to determine which part of the hangman should be drawn. 
            When case 0 is reached the game is over and it activates a modal window alerting the user the game is over asking them if they would like to play again.*/
            switch (guessesRemaining) {
                case 9:
                    //Draw Gallows
                    context.beginPath();
                    context.lineWidth = 4;
                    context.moveTo(200, 250);
                    context.lineTo(70, 250);
                    context.lineTo(70, 250);
                    context.stroke();
                    break;
                case 8:
                    //Draw Gallows
                    context.beginPath();
                    context.lineWidth = 4;
                    context.moveTo(70, 250);
                    context.lineTo(70, 10);
                    context.stroke();
                    break;
                case 7:
                    //Draw Gallows
                    context.beginPath();
                    context.lineWidth = 4;
                    context.moveTo(70, 10);
                    context.lineTo(200, 10);
                    context.stroke();
                    break;
                case 6:
                    //Draw Gallows
                    context.beginPath();
                    context.lineWidth = 4;
                    context.moveTo(200, 10);
                    context.lineTo(200, 50);
                    context.stroke();
                    break;
                    
                case 5:
                    //Draw Head
                    context.beginPath();
                    context.arc(200, 70, 20, 0, Math.PI*2, true);
                    context.closePath();
                    context.lineWidth = 4;
                    context.stroke();
                    break;
                case 4:
                    //Draw Body
                    context.beginPath();
                    context.moveTo(200, 90);
                    context.lineTo(200, 175);
                    context.stroke();
                    break;
                case 3:
                    //Draw right Arm
                    context.beginPath();
                    context.moveTo(200, 100);
                    context.lineTo(235, 140);
                    context.stroke();
                    break;
                case 2:
                    //Draw left Arm
                    context.beginPath();
                    context.moveTo(200, 100);
                    context.lineTo(165, 140);
                    context.stroke();
                    break;
                case 1:
                    //Draw right leg
                    context.beginPath();
                    context.moveTo(200, 175);
                    context.lineTo(150, 225);
                    context.stroke();
                    break;
                case 0:
                    context.beginPath();
                    context.moveTo(200, 175);
                    context.lineTo(250, 225);
                    context.stroke();
                    $('#gameOver').modal('show');
            }
            
        },
        getSelectors: () => {
            return UISelectors;
        }
    }

})();


//==============APP CONTROLLER=================
const AppCtrl = (function(ItemCtrl, UICtrl){
    //Get UI selectors
    let UISelectors = UICtrl.getSelectors();
          
    const loadEventListeners = (charCodeMap, letterInputs)=>{


        /*----------------keypress event-----------------*/
        document.querySelector(UISelectors.guessInput).addEventListener("keypress", function(e) {
            //push users e.charCode into letterInputs array
            letterInputs.push(e.charCode);

            //Pass the userinput array and randomword array to the checkuserinput function in hte item controller
            ItemCtrl.checkUserInput(letterInputs, charCodeMap);
        });
        
        
        let letterKeysArr = Array.from(document.querySelectorAll(UISelectors.letterKeys));
        
        //Click events that are fired on each the displayed keyboards keys. The id of each key displayed has been coded to match its corresponding charCode
        letterKeysArr.forEach((key)=>{
           key.addEventListener('click', function(e){
                
               letterInputs.push(parseInt(e.path[0].id));

               ItemCtrl.checkUserInput(letterInputs, charCodeMap);
               
           }); 
        });
        
        document.querySelector('.newGame').addEventListener('click', ()=>{
            $('#gameOver').modal('hide');
            location.reload();
        });
  
    }

    //Public Methods
    return {
        init: () => {
           let charCodeMap = ItemCtrl.loadRandomWord(),//invoke the loadRandomWord to return a word split into its charcodes 
               wordLength = charCodeMap.length,
               letterInputs = [];
            UICtrl.createLetterBoxes(wordLength);
            loadEventListeners(charCodeMap, letterInputs);

        }
    }

})(ItemCtrl, UICtrl, $);

AppCtrl.init();
