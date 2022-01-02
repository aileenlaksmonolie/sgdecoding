export interface UserChangePassword{
	email: string,
	currentPassword: string,
	newPassword: string,
	confirmNewPassword: string
}

export interface UserChangePasswordResponse{
	message: string,
	statusCode: number,
	error: string
}