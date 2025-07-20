import type { ILocation } from "./ILocation";
import type { ITypeHouse } from "./ITypeHouse";
import type { IUnRead } from "./IUnRead";

export default interface IMone{
    id          : string;
    number      : string;
    number4      : string;
    len         : number;
    moneType    : string;
    name        : string;
    address     : string;
    city        : string;
    street      : string;
    streetNumber: number;
    house       : number;
    floor       : number;
    entry       : number;
    phone1      : string;
    phone2      : string;
    read        : boolean;
    readNumber  : string;
    typeHouse   : ITypeHouse;
    unRead      : IUnRead
    location    : ILocation;
    message     : string;
    images      : any[];
    GPS         : any[];
    date        : any;
}





export interface FirstItem {
  value: string;
  moneId: string;
  read: boolean;
}





export interface IData{
    [key: string]: [FirstItem[], ...IMone[]];
}
