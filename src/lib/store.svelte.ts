// All avatars:
import profile_newbie from "$lib/assets/shop/profile_newbie.png"
import profile_clown from "$lib/assets/shop/profile_clown.png"
import profile_cooler_glasses from "$lib/assets/shop/profile_cooler_glasses.png"
import profile_cowboy from "$lib/assets/shop/profile_cowboy.png"
import profile_fire from "$lib/assets/shop/profile_fire.png"
import profile_glasses from "$lib/assets/shop/profile_glasses.png"
import profile_idk from "$lib/assets/shop/profile_idk.png"
import profile_ribbon from "$lib/assets/shop/profile_ribbon.png"
// Shop coin
import point_coin from "$lib/assets/shop/point_coin.png"

const API_URL = "https://script.google.com/macros/s/AKfycbynLAhVYP-MJTtyOsn9U1moPBIa3xF4PAB9qCboKftj4V5SXlDrVY6z-v0Db8yXwQ/exec";

export const avatarImages: Record<string, string> = {
    newbie: profile_newbie,
    clown: profile_clown,
    cooler_glasses: profile_cooler_glasses,
    cowboy: profile_cowboy,
    fire: profile_fire,
    glasses: profile_glasses,
    idk: profile_idk,
    ribbon: profile_ribbon,
};

export class Shop {
    clown: boolean = false;
    cooler_glasses: boolean = false;
    cowboy: boolean = false;
    fire: boolean = false;
    glasses: boolean = false;
    idk: boolean = false;
    ribbon: boolean = false; // Added missing item
    newbie: boolean = true;
    [key: string]: boolean;
}

export class Cnf {
    loggedIn = $state(false);
    username = $state("");
    password = $state("");
    avatar = $state("newbie"); // Defaulted to newbie for safety
    points = $state(0);
    isLoaded = $state(false)

    inventory = $state<Shop>(new Shop());

    // Exported the coin image so you can use it in UI easily
    public coinImage = point_coin; 

    constructor() {
        this.username = ""
        this.password = ""
        this.isLoaded = false
    }

    public async initAutoLogin() {
        if (typeof window === "undefined") return;

        const savedUser = localStorage.getItem("username");
        const savedPass = localStorage.getItem("password");

        if (savedUser && savedPass) {
            await this.login(savedUser, savedPass);
        }

        this.isLoaded = true;
    }


    private itemCosts: Record<string, number> = {
        clown: 100,
        cooler_glasses: 50,
        cowboy: 150,
        fire: 200,
        glasses: 20,
        newbie: 0,
        idk: 75,
        ribbon: 75
    };

    public getShopItems() {
        return Object.keys(this.itemCosts).map((key) => ({
            id: key,
            image: avatarImages[key] || avatarImages.newbie,
            cost: this.itemCosts[key],
            isOwned: this.inventory[key] || false,
            isEquipped: this.avatar === key
        }));
    }

    public getCurrentAvatarImage() {
        return avatarImages[this.avatar] || avatarImages.newbie;
    }

    public async equipAvatar(item: string) {
        if (!this.inventory[item]) {
            console.log(`Cannot equip ${item}, user does not own it.`);
            return;
        }

        this.avatar = item;
        
        await this.api("updateAvatar", { avatar: this.avatar });
    }

    private async api(action: string, payload: any = {}) {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                    action,
                    username: this.username,
                    password: this.password,
                    ...payload,
                }),
            });
            return await res.json();
        } catch (e) {
            console.error("API Error:", e);
            return { status: "error" };
        }
    }

    public async login(user: string, pass: string) {
        this.username = user;
        this.password = pass;

        const res = await this.api("login");
        if (res.status === "success") {
            this.loggedIn = true;
            this.points = res.user.currency;
            this.avatar = res.user.avatar || "newbie"; // Fallback added

            if (res.user.inventory) {
                for (const key in res.user.inventory) {
                    this.inventory[key] = res.user.inventory[key];
                }
            }
            // Save it to cache
            localStorage.setItem("username", this.username);
            localStorage.setItem("password", this.password);
            return true;
        }

        // Reset Password if invalid
        this.username = "";
        this.password = "";
        return false;
    }

    public async signup(user: string, pass: string) {
        this.username = user;
        this.password = pass;

        const res = await this.api("signup");
        if (res.status === "success") {
            this.loggedIn = true;
            this.points = res.currency;
            this.avatar = res.avatar || "newbie";

            if (res.inventory) {
                for (const key in res.inventory) {
                    this.inventory[key] = res.inventory[key];
                }
            }

            console.log(this.username, this.password, this.points, this.inventory)
            return true;
        }


        // Reset Password if invalid
        this.username = "";
        this.password = "";
        return false;
    }

    public async purchase(item: string) {
        if (!(item in this.itemCosts)) {
            console.log(
                `User attempted to purchase ${item}, but it doesn't exist!`,
            );
            return;
        }

        if (this.inventory[item]) {
            console.log(`User already owns ${item}!`);
            return;
        }

        const cost = this.itemCosts[item];
        if (this.points < cost) {
            console.log("Not enough points!");
            return;
        }

        // I don't know if its a good idea to just update these here before confirming with Google Scripts
        // But this is just a fun little project, so doesn't matter even if something goes wrong anyways..
        // Totally not being lazy to re-validated api change ;>
        this.points -= cost;
        this.inventory[item] = true;
        console.log(`User purchased ${item}`);

        // Sync changes
        await this.api("updateCurrency", { amount: cost, type: "reduce" });
        await this.api("updateInventory", { inventory: this.inventory });
    }

    public async add_balance(num: number) {
        // Add respective balance for game wins
        if (num <= 0) {
            console.log(
                "Attempted to reduce balance on `add` balance function.",
            );
            return;
        }
        if (num > 250) {
            console.log("No game should be providing more than 250P ;;");
            return;
        }

        this.points += num;
        await this.api("updateCurrency", { amount: num, type: "add" });
    }

    public async reduce_balance(num: number) {
        // We will be reducing some balance as a part of `gambling`
        if (num <= 0) {
            console.log("Reduce function takes positive integers as well!");
            return;
        }

        if (this.points < num) return;

        this.points -= num;
        await this.api("updateCurrency", { amount: num, type: "reduce" });
    }
}

// Export configuration so that it may be used across the site.
export const userStore = new Cnf();