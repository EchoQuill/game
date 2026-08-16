// This file loads theme of user's preference from cache.

export class Theme {
    current_theme = $state("caramellatte");
    allotted_themes = ["caramellatte", "coffee", "strawberry"];

    public initTheme() {
        // Called during mount at layout file.
        if (typeof window === "undefined") return;

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme && this.allotted_themes.includes(savedTheme)) {
            // Set theme from local store.
            document.documentElement.dataset.theme = savedTheme;
        }
    }

    public setTheme(theme: string) {
        if (this.allotted_themes.includes(theme)) {
            localStorage.setItem("theme", theme);
            document.documentElement.dataset.theme = theme;
        } else {
            console.error("Failed to set theme - Not in allotted_themes.")
        }
    }
}

export const themeStore = new Theme();