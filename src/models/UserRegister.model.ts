
export interface NewUserRegistration{
	name: string,
	email: string,
	password: string
}

export interface NewUserRegistrationResponse{
	createdAt: string,
	email: string,
	name: string,
	role:string,
	_id: string
}