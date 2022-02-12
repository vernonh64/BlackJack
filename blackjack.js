const prompt = require("prompt-sync")();

class Deck {
    constructor() {
        this.suits = ["Diamonds", "Clubs", "Hearts", "Spades"]
        this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
    }

    makeDeck() {
        let deck = [];

        for (let i = 0; i < this.suits.length; i++) {
            for (let rank = 0; rank < this.ranks.length; rank++) {
                deck.push(`${this.ranks[rank]} of ${this.suits[i]}`)
            }
        }
        deck = this.shuffle(deck)
        return deck;
    }

    shuffle(deck) {
        console.log("shuffling deck")
        let m = deck.length
        let i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }
        return deck
    }
}

class Player {
    constructor() {
        this.hand = []
        this.money = 1000
        this.playAgain = false
        this.wager = 0
        this.score = 0
        this.hitOrStay = "y"
    }
    makeWager() {
        while (true) {
            this.wager = Number(prompt("How much do you want to bet? "));
            if (isNaN(this.wager)) {
                console.log(`Please enter a digit less than less than ${this.money}`)
            } else if (this.wager > this.money) {
                console.log(`Please enter a digit less than less than ${this.money}`)
                continue
            } else {
                break
            }
        }

        console.log(`Player bet ${this.wager}.`)
        this.money -= this.wager
    }

    stay() {
    }

    hit(deck) {
        if (this.hand.length >= 2) {
            while (true) {
                //if score >21 or score == 21, break it, set hi/torstay to n
                
                if(this.score >=21){ break  }
                    this.hitOrStay = prompt("Do you want to hit (y/n)? ") 
                                 

                if (this.hitOrStay === "y") {
                    console.log("Player is dealt a card.!.")
                    let newCard = deck.pop()
                    this.addCardValue(newCard)
                    console.log(`Player was dealt a ${newCard}. Player score is now ${this.score}.`)
                    this.hand.push(newCard)
                } else if (this.hitOrStay !== "y" && this.hitOrStay !== "n") {
                    console.log("Please enter 'y' or 'n'")
                    continue
                } else {
                    break
                }
            }

        } else {
            
            console.log("Player is dealt a card...")
            let newCard = deck.pop()
            this.addCardValue(newCard)
            this.hand.push(newCard)

            //console.log(`Player hand: ${this.hand}`)
        }
    }
    dealOpeningHand(deck) {
        this.hit(deck)
        this.hit(deck)
    }
    showHand() {
        console.log("The players hand is the following: ")
        console.log(this.hand)
    }

    reset(deck) {
        for(let i = 0; i<this.hand.length; i++){
            deck.push(this.hand[i]);
            }

            this.hand =[];
        this.hitOrStay = "y"
        this.score = 0
    }

    addCardValue(card) {
        let cardRank = card.split(" ")[0]
        if (parseInt(cardRank) <= 10) {
            this.score += parseInt(cardRank)
        } else if (cardRank === 'Ace') {
            if (this.score + 11 <= 21) {
                this.score += 11
            } else {
                this.score += 1
            }
        } else {
            this.score += 10
        }
    }
}
class Dealer {
    constructor() {
        this.hand = []
        this.score = 0
    }

    hit(deck) {
        if (this.hand.length >= 2) {
            console.log("Dealer is dealt a card...")
            let newCard = deck.pop()
            this.addCardValue(newCard)
            console.log(`Dealer was dealt a ${newCard}. Dealer score is now ${this.score}.`)
            this.hand.push(newCard)
        } else {
            console.log("Dealer is dealt a card...")
            let newCard = deck.pop()
            this.addCardValue(newCard)
            this.hand.push(newCard)
        }
    }
    dealOpeningHand(deck) {
        this.hit(deck)
        this.hit(deck)
    }

    showHand() {
        console.log("The dealer is showing the following 1 card: ")
        console.log(this.hand[0])
    }

    showFullHand() {
        console.log("The dealer is showing the following: ")
        console.log(this.hand)
    }

    reset(deck) {
        //this.hand = [] put cards back in deck
       for(let i = 0; i<this.hand.length; i++){
       deck.push(this.hand[i]);
       }
       this.hand =[];
        this.score = 0
    }

    addCardValue(card) {
        let cardRank = card.split(" ")[0]
        if (parseInt(cardRank) <= 10) {
            this.score += parseInt(cardRank)
        } else if (cardRank === 'Ace') {
            if (this.score + 11 < 21) {
                this.score += 11

            } else {
                this.score += 1

            }
        } else {
            this.score += 10
        }
    }
}

function playGame() {
    console.log("Welcome to Jack Blacks BLACK JACK!")

    // Create deck of cards
    let deckObject = new Deck()
    let gameDeck = deckObject.makeDeck()
    let contuna = "y"
    // Create player & dealer
    let player = new Player()
    let dealer = new Dealer()
    console.log(`We're all ready to go. You currently have ${player.money}.`)
    let replay = false;
    while (player.money > 0) {///main game loop
        // Player needs to bet
      if(gameDeck.length <21){ gameDeck.shuffle() }

      if(replay == true){
      contuna = prompt("Do you want to play again (y/n)? ") 
      if( contuna != "y" ){
          console.log("thanks for playing")
         break
      }
    }
    replay = true;
      
        player.makeWager();

        // Deal the cards
        console.log("Dealing the players cards??.")
        player.dealOpeningHand(gameDeck)
        player.showHand();

        if (player.score == 21) {
            console.log("BLACKJACK!!!")
            console.log("Player WINS")
            player.money += player.wager * 2
            console.log(`Player has $${player.money}.`)
            player.reset(gameDeck)
            dealer.reset(gameDeck)
            continue
        }
        console.log("The player is showing the following: ")
        player.showHand()

        console.log("Dealing the dealers cards...")
        dealer.dealOpeningHand(gameDeck)
        //console.log("The dealer is showing the following: ")
        dealer.showHand()

        // Player plays game
        while (player.hitOrStay === "y") {
           
            if (player.score > 21) {
                console.log("BUST...YOU LOST...LOSER")
                console.log(`You have ${player.money} left.`)
                player.hitOrStay = "n";
                break
            }

            if (player.score == 21) {
                console.log("BLACKJACK!!! A WINNER IS YOU!!!")
                player.money += player.wager * 2
                console.log(`You have ${player.money} left.`)
                player.hitOrStay = "n";
                break
            }
            player.hit(gameDeck)
        }

        if (player.score > 21) {
            player.reset(gameDeck)
            dealer.reset(gameDeck)
            //console.log("game deck length endgame: " + gameDeck.length)
            continue
        }
        console.log(`Player stays with a score of ${player.score}.`)
        console.log("Dealers Turn!")

        // Dealer plays 
        console.log("Here comes the dealers Big Reveal!")
        dealer.showFullHand()

        while (dealer.score < 17) {
            dealer.hit(gameDeck)
        }
        if (dealer.score > 21) {
            console.log("Dealer BUSTS")
            console.log("Player WINS")
            player.money += player.wager * 2
            console.log(`Player has $${player.money}.`)
            player.reset(gameDeck)
            dealer.reset(gameDeck)
            continue
        }
        if (player.score > dealer.score) {
            console.log("Player WINS")
            player.money += player.wager * 2
            console.log(`Player now has $${player.money}.`)
        } else {
            console.log("Dealer WINS")
            console.log(`Player now has $${player.money}.`)
            
        }

        player.reset(gameDeck)
        dealer.reset(gameDeck)
     
         
    }
}///end of game function

playGame();


/* 

ok: Running out of cards
ok: Return all cards to the deck after each hand

When deck gets down to certain number of cards, restart/reshuffle deck

ok: Loops not breaking when they are supposed(When blackjack is recieved, game still continues)
*/