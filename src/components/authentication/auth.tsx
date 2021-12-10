class Auth{
	authenticated: boolean

	constructor(){
		this.authenticated = false
	}

	login(cb: Function): void{
		this.authenticated = true;
	}

	logout(cb:Function): void{
		this.authenticated = false;
	}

	isAuthenticated(): boolean{
		return this.authenticated;
	}

}

export default new Auth();