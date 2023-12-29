export interface Music {
    id: number,
    name_music: string,
    post: string,
    icon_user: string,
    name_user: string,
    music: string
}

export interface hookMusic {
    music?: Music;
    setMusic: (music: Music) => void;
    removeMusic: () => void;
}