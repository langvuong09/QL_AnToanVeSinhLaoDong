export type Ward = {
    name: string;
    code: number;
    division_type: string;
    short_codename: string;
}

export type Province = {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    phone_code: number;
    wards: Ward[];
}

export class OpenAdress {
    public provinces: Province[];

    constructor() {
        this.provinces = require("./json/address.json");
        console.log(this.provinces)
    }

    public filterProvinces(name: string): Province[] {
        return this.provinces.filter(province => {
            return province.name.includes(name) || province.codename.includes(name) || province.division_type.includes(name);
        })
    }

    public filterWards(idProvince: number): Ward[] {
        return this.provinces.filter(province => province.code === idProvince)[0].wards || [];
    }
}
