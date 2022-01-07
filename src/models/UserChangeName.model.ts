export interface UserChangeName{
	token: string,
    newName: string
}

export interface UserChangeNameResponse{
	message: string,
	statusCode: number,
	error: string
}