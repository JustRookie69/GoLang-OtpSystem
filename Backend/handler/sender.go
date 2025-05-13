package handler

// import (
// 	"OTPBackend/models"
// 	"log"
// 	"net/smtp"
// )

// func Otpsender() {
// 	from := "shivanshy60@gmail.com"
// 	password := "your_app_password" // not your actual Gmail password
// 	to := []string{"shivanshy24.5@gmai.com"}
// 	smtpHost := "smtp.gmail.com"
// 	smtpPort := "587"

// 	message := models.UserOtpRecieved.GenOtp

// 	auth := smtp.PlainAuth("", from, password, smtpHost)

// 	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	log.Println("Email sent successfully.")
// }
