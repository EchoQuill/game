const API_URL = "https://script.google.com/macros/s/AKfycbynLAhVYP-MJTtyOsn9U1moPBIa3xF4PAB9qCboKftj4V5SXlDrVY6z-v0Db8yXwQ/exec";

export class Shop {
    clown: boolean = false;
    cooler_glasses: boolean = false;
    cowboy: boolean = false;
    fire: boolean = false;
    glasses: boolean = false;
    idk: boolean = false;
    newbie: boolean = true;
    [key: string]: boolean;
}

export class Cnf {
    loggedIn = $state(false);
    username = $state("");
    password = $state("");
    avatar = $state("");
    points = $state(0);

    inventory = $state<Shop>(new Shop());

    private itemCosts: Record<string, number> = {
        clown: 100,
        cooler_glasses: 50,
        cowboy: 150,
        fire: 200,
        glasses: 20,
        newbie: 0,
    };

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
            this.avatar = res.user.avatar;

            if (res.user.inventory) {
                for (const key in res.user.inventory) {
                    this.inventory[key] = res.user.inventory[key];
                }
            }
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
            this.avatar = res.avatar;

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
