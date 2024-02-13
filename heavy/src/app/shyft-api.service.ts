import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {map, of} from 'rxjs';

@Injectable({ providedIn: 'root'})
export class ShyftApiService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _header = {'x-api-key': 'my-api-key'};
    private readonly _mint = '7VcnUPSoYq9bcfCUhsxdVPdKEnkw8Rkf7Qc6BMcyg4JB';
    /*private readonly _mint = '7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs';*//*Dirección de prueba del token Silly Dragon*/

    getAccount({ publicKey }: { publicKey: string | null | undefined; }) {
        if (!publicKey) {
            return of(null);
        }

        const url = new URL(`https://api.shyft.to/sol/v1/wallet/token_balance`);
        url.searchParams.set('network', 'mainnet-beta');
        url.searchParams.set('wallet', publicKey);
        url.searchParams.set('token', this._mint);
        
        return this._httpClient.get<{ 
            result: { balance: number; info: { image: string}};
        }>(url.toString(), {headers: this._header})
            .pipe(map((response) => response.result));
    }
}