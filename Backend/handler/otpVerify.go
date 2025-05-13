package handler

import (
	"OTPBackend/models"
	"encoding/json"
	"log"
	"net/http"
)

func VerifyOtp(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "bad Method", http.StatusMethodNotAllowed)
	}
	var recivedOtp models.UserOtpRecieved
	err := json.NewDecoder(r.Body).Decode(&recivedOtp)
	if err != nil {
		log.Fatal("error Decoding")
	}

	result := validator(recivedOtp)
	w.Header().Set("Content-Type", "application/json")
	if result {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "OTP verified successfully",
		})
	} else {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Invalid OTP",
		})
	}
}

func validator(otp models.UserOtpRecieved) bool {
	expectedOtp, exists := models.OtpStore[otp.UserNumber]
	if !exists {
		return false
	}
	return expectedOtp == otp.GenOtp
}
