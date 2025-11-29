export type Stream = {
    id: number;
    user: User;
    game: Game;
    thumbnail: string;
    title: string;
    viewersnumber: number;
    viewersid: User[];
    messagelist: Message[]
};

export type Message = {
    texto: string
    hora: string
    user: User
    level?: number
    levelName?: string
}

export type GameTag = {
    id: number;
    name: string;
}

export type Game = {
    name: string;
    photo: string;
    spectators: number;
    followers: number;
    tags: GameTag[];
}

export type Pack = {
    id: string | number;
    name: string;
    value: number;
    initialprice: number;
    finalprice: number;
    discount: number;
}
export type Point = {
    id: number;
    quantity: number;
}
export type Medal = {
    id: number;
    level: string;
    min_messages: number;
    max_messages: number;
}
export type Level = {
    id: number;
    level: string;
    min_followers: number;
    max_followers: number;
    min_hours: number;
    max_hours: number
}
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    coins: number;
    pfp: string;
    online: boolean;

    bio: string;
    followed: User[];
    followers: User[];

    friends: User[];

    pointsrecieved: [Point, User][];
    messagessent: [number, User][];
    medalsrecieved: [Medal, User][];

    streaminghours: number;
    streamerlevel: Level;
    medalsforviewers: Medal[];
    clips: string[];

    xlink: string;
    youtubelink: string;
    instagramlink: string;
    tiktoklink: string;
    discordlink: string
}



