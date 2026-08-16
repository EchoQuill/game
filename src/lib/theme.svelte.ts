// This file loads theme of user's preference from cache.

export class Theme {
    current_theme = $state("black");
    allotted_themes = ["caramellatte", "coffee", "strawberry", "black"];

    public initTheme() {
        // Called during mount at layout file.
        if (typeof window === "undefined") return;

        let savedTheme: any = localStorage.getItem("theme");

        if (!savedTheme && !this.allotted_themes.includes(savedTheme)) {
            savedTheme = "black";
        }
        // Set theme from local store.
        document.documentElement.dataset.theme = savedTheme;
        this.current_theme = savedTheme;
    }

    public setTheme(theme: string) {
        if (this.allotted_themes.includes(theme)) {
            localStorage.setItem("theme", theme);
            document.documentElement.dataset.theme = theme;
            this.current_theme = theme;
        } else {
            console.error("Failed to set theme - Not in allotted_themes.")
        }
    }
}

export const themeStore = new Theme();