package models

type UserNumber struct {
	Number int
}

type UserOtpRecieved struct {
	UserNumber int
	GenOtp     int
}

var OtpStore = make(map[int]int)
