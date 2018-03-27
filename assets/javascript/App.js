
//===============ITEM CONTROLLER==================
const ItemCtrl = (function(){
    

    //Public Methods
    return {
        wordMap: function(puzzleWord){
                 
            puzzleWord = puzzleWord.split('');
            
            let puzzleWordMap = puzzleWord.map(l => {
                return l.charCodeAt(0);
            });
            
        return puzzleWordMap;
            
        },

        checkGuessLetter: function(selectedLetters, puzzleWordMap) {
            console.log(selectedLetters, puzzleWordMap);
            let incorrectAnswers = [],
                correctLetter = document.createElement("p"),
                letterPosition,
                letterBoxArray;


            selectedLetters.forEach((letter, index, arr) => {

                if(puzzleWordMap.indexOf(letter) !== -1) {

                    correctLetter.className = 'text-center';

                    correctLetter.innerHTML = String.fromCharCode(arr[index]);

                    letterPosition = puzzleWordMap.indexOf(letter);

                    letterBoxArray = Array.from(document.querySelectorAll(".letterBox"));

                        letterBoxArray.forEach((box, index) => {
                            if(letterPosition === index) {
                                box.appendChild(correctLetter);
                            }
                        });

                    puzzleWordMap[letterPosition] = 0;

                    ItemCtrl.checkGuessLetter(selectedLetters, puzzleWordMap);

                } else {

                    // if the letter has an index of -1 populate incorrectAnswers
                    incorrectAnswers.push(arr[index]);

                }
            });
        }
    }

})();

//================UI CONTROLLER==================
const UICtrl = (function(){
    
    const UISelectors = {
        hangManWord: '#hangManWord',
        guessInput: '#guessInput',
        letterBox: '.letterBox'
        
        
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
        
        getSelectors: () => {
            return UISelectors;
        }
    }

})();


//==============APP CONTROLLER=================
const AppCtrl = (function(ItemCtrl, UICtrl){
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();
    
    const loadEventListeners = ()=>{
        /*----------------keypress event-----------------*/
        document.querySelector(UISelectors.guessInput).addEventListener("keypress", getGuessInput);
  
    }
      
    let selectedLetters = [],
        puzzleWordMap;
    
    const getGuessInput = function(e) {
        
        selectedLetters.push(e.charCode);
        
        ItemCtrl.checkGuessLetter(selectedLetters, puzzleWordMap);
    }
    
    const loadRandomWord = function(){
        http.get('https://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
            .then(data => {
            puzzleWordMap = ItemCtrl.wordMap(data[0].word);
            UICtrl.createLetterBoxes(puzzleWordMap.length);
            })
            .catch(err => console.log(err));
    }

    //Public Methods
    return {
        init: () => {
           loadEventListeners();
            
            loadRandomWord();
        }
    }

})(ItemCtrl, UICtrl);

AppCtrl.init();
