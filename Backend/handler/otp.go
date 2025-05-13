package handler

import (
	"OTPBackend/dbase"
	"OTPBackend/models"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

func Numberhandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "bad request", http.StatusBadRequest) //w as we are writing back
	}

	fmt.Println("number")
	var userinp models.UserNumber

	err := json.NewDecoder(r.Body).Decode(&userinp)
	if err != nil {
		log.Fatal("error while fetching number", err)
		return
	}

	dbase.CheckDB(userinp.Number) //this checks in db if user is present update this to be ran as in channel along side other proccess
	otp := otpGenerator()
	models.OtpStore[userinp.Number] = otp

	// Send a response back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "OTP sent successfully",
	})
}

func otpGenerator() int {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	sotp := fmt.Sprintf("%06d", r.Intn(1000000)) // 6 digit OTP
	otp, err := strconv.Atoi(sotp)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(otp)
	return otp
}
