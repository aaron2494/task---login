import { inject, Injectable } from "@angular/core";
import {  Auth, authState, signOut, User} from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthStateService { 
    private _auth=inject(Auth);
  

    get authState$():Observable <any>{
        return authState(this._auth)
    }
    logOut(){
        return signOut(this._auth)
    }
    get currentUser(): User | null {
        return this._auth.currentUser;
      }
}