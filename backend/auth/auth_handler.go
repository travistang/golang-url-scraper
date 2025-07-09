package auth

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Username == HARDCODED_USER && req.Password == HARDCODED_PASSWORD {
		token := "Basic " + base64.StdEncoding.EncodeToString([]byte(req.Username+":"+req.Password))
		c.Header("Authorization", token)

		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
			"token":   token,
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}
