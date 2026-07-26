// I have no idea how it works, but if it works - don't touch it!

export class DeviceInfo {
    deviceType = $state("Unknown");
    os = $state("Unknown");
    isTouch = $state(false);

    constructor() {
        // Only run browser checks if window/navigator exist (safe for SSR)
        if (typeof window !== "undefined") {
            this.detect();
        }
    }

    private detect() {
        const ua = navigator.userAgent;

        // OS Detection
        if (/android/i.test(ua)) this.os = "Android";
        else if (/iphone|ipad|ipod/i.test(ua)) this.os = "iOS";
        else if (/windows/i.test(ua)) this.os = "Windows";
        else if (/macintosh|mac os x/i.test(ua)) this.os = "macOS";
        else if (/linux/i.test(ua)) this.os = "Linux";

        // Device Type Detection
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            this.deviceType = "Tablet";
        } else if (
            /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|webOS)|Opera Mobi/i.test(
                ua,
            )
        ) {
            this.deviceType = "Mobile";
        } else {
            this.deviceType = "Desktop";
        }

        // Touch Check
        this.isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
}

export const device = new DeviceInfo();