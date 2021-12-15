
export interface UserResetPassword{
	email: string,
	code: string,
	newPassword: string,
	confirmNewPassword: string
}

export interface UserResetPasswordResponse{
	message: string,
	statusCode: number,
	error: string
}