package auth

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Email == HARDCODED_USER && req.Password == HARDCODED_PASSWORD {
		c.SetCookie(
			"Authorization",
			"Basic "+base64.StdEncoding.EncodeToString([]byte(req.Email+":"+req.Password)),
			0, "/", "", true, true,
		)

		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
			"user": gin.H{
				"email": req.Email,
			},
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}
