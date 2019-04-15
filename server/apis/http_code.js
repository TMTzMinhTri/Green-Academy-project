const express = require('express')

var httpCode = {
    authStatus: function(status) {
        let jsonData = {}

        switch (status) {
          case 'auth/user-not-found':
            return { 
                statusCode: 500, 
                message: 'User not found' 
            }

          case 'auth/wrong-password':
            return {
                statusCode: 401, 
                message: 'Wrong password' 
            }
          case 'auth/invalid-email':
            return {
                statusCode: 402, 
                message: 'Invalid email' 
            }
          case 'auth/user-disabled':
              return {
                statusCode: 403, 
                message: 'Account disable' 
            }
        }
        
        return {
            statusCode: 200,
            message: 'success'
        }
    
    }
}

module.exports = httpCode;