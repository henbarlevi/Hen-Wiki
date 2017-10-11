export interface iFighter{
    name: string,
    weapon:iWeapon,

}

export interface iWeapon{
    type:string //name of weapon
    power:number
}