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
import tails_coin from "$lib/assets/coinflip/tails_coin.png"
import heads_coin from "$lib/assets/coinflip/heads_coin.png"
import spin_coin from "$lib/assets/coinflip/spin_coin.gif"
// Grab Game
import bomb_image from "$lib/assets/guess_game_icons/bomb.png"


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

export const coinImages: Record<string, string> = {
    point_coin: point_coin,
    tails_coin: tails_coin,
    heads_coin: heads_coin,
    spin_coin: spin_coin
}

export const grabImages: Record<string, string> = {
    point_coin: point_coin,
    bomb: bomb_image,
}