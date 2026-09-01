// Helper for Coinflip game.

// 

import { userStore } from "$lib/store.svelte";
import { coinImages } from "$lib/images";

export class Coinflip {
    betAmount = $state<number>(10);
    selectedChoice = $state<"heads" | "tails">("heads");
    isFlipping = $state(false);
    resultMessage = $state<string | null>(null);
    lastOutcome = $state<"win" | "lose" | null>(null);
    displayedCoin = $state<string>(coinImages.heads_coin);

    public setBet(amount: number) {
        // The UI does prevent anything more than 250 being placed as a bet, but
        // just in case! better be safe than never!
        if (amount > 250) {
            amount = 250;
        }
        if (amount < 1) {
            amount = 1;
        }
        this.betAmount = amount;
    }

    public async playCoinflip() {
        // Validations
        if (!userStore.loggedIn) {
            this.resultMessage = "You must be logged in to gamble!";
            return;
        }
        if (!Number.isFinite(this.betAmount) || this.betAmount <= 0) {
            this.resultMessage = "Please enter a valid bet amount.";
            console.log(this.resultMessage);
            return;
        }
        if (this.betAmount > 250) {
            this.resultMessage = "Maximum bet is 250 coins!";
            return;
        }
        if (userStore.points < this.betAmount) {
            this.resultMessage = "You don't have enough coins!";
            return;
        }

        this.isFlipping = true;
        this.resultMessage = null;
        this.lastOutcome = null;

        // Reduce bet amount
        console.log(this.betAmount)
        await userStore.reduce_balance(this.betAmount);

        // Change Icon to spin gif
        this.displayedCoin = coinImages.spin_coin;

        // Simulate flip delay (1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const winningSide: "heads" | "tails" =
            Math.random() < 0.5 ? "heads" : "tails";

        if (winningSide === "heads") {
            this.displayedCoin = coinImages.heads_coin;
        } else {
            this.displayedCoin = coinImages.tails_coin;
        }

        const won = this.selectedChoice === winningSide;

        if (won) {
            const payout = this.betAmount * 2;
            await userStore.add_balance(payout);

            this.lastOutcome = "win";
            this.resultMessage = `🎉 You won ${payout} coins! It was ${winningSide.toUpperCase()}.`;
        } else {
            this.lastOutcome = "lose";
            this.resultMessage = `😢 You lost ${this.betAmount} coins. It was ${winningSide.toUpperCase()}.`;
        }

        this.isFlipping = false;
    }
}

export const game = $state(new Coinflip());


