// // features/auth/authAPI.js
// import axios from "axios";

// const API_URL = "http://localhost:5000/api";


// //   try {
// //     // Use fetch instead of axios interceptor for login (no token needed)
// //     const response = await fetch(`${API_URL}/auth/login`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ email, password }),
// //     });
    
// //     const data = await response.json();
    
// //     if (!response.ok) {
// //       throw new Error(data.message || "Login failed");
// //     }
    
// //     // Log what backend returns for debugging
// //     console.log("✅ Login API Response:", data);
    
// //     // Ensure response has the correct structure
// //     // Backend should return: { user: {...}, token: "..." }
// //     if (!data.token || !data.user) {
// //       console.error("❌ Invalid response structure:", data);
// //       throw new Error("Invalid response from server");
// //     }
    
// //     return data;
// //   } catch (error) {
// //     console.error("❌ Login API Error:", error);
// //     throw error;
// //   }
// // };


// export const loginRequest = async (emailOrPhone, password) => {
//   try {
//     // Determine if input is email or phone
//     const isEmail = emailOrPhone.includes('@');
    
//     const payload = isEmail 
//       ? { email: emailOrPhone, password }
//       : { phone: emailOrPhone, password };
    
//     console.log(`📡 Login attempt with ${isEmail ? 'email' : 'phone'}`);
    
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });
    
//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || "Login failed");
//     }
    
//     console.log("✅ Login API Response:", data);
    
//     if (!data.token || !data.user) {
//       console.error("❌ Invalid response structure:", data);
//       throw new Error("Invalid response from server");
//     }
    
//     return data;
//   } catch (error) {
//     console.error("❌ Login API Error:", error);
//     throw error;
//   }
// };




// src/features/auth/authAPI.js
import API from "../../app/axios";

export const loginRequest = async (emailOrPhone, password) => {
  try {
    // Determine if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    
    const payload = isEmail 
      ? { email: emailOrPhone, password }
      : { phone: emailOrPhone, password };
    
    console.log(`📡 Login attempt with ${isEmail ? 'email' : 'phone'}`);
    
    // Use the configured axios instance instead of fetch
    const response = await API.post("/auth/login", payload);
    
    console.log("✅ Login API Response:", response.data);
    
    // Ensure response has the correct structure
    if (!response.data.token || !response.data.user) {
      console.error("❌ Invalid response structure:", response.data);
      throw new Error("Invalid response from server");
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Login API Error:", error);
    
    // Handle axios error response format
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || "Login failed");
    }
  }
};

// Optional: Add register function if needed
export const registerRequest = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    
    console.log("✅ Register API Response:", response.data);
    
    if (!response.data.token || !response.data.user) {
      console.error("❌ Invalid response structure:", response.data);
      throw new Error("Invalid response from server");
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Register API Error:", error);
    
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(error.message || "Registration failed");
    }
  }
};

// Optional: Add logout function
export const logoutRequest = async () => {
  try {
    const response = await API.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("❌ Logout API Error:", error);
    // Don't throw on logout - just return success even if API fails
    return { success: true };
  }
};

// Optional: Add get current user function
export const getCurrentUserRequest = async () => {
  try {
    const response = await API.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("❌ Get Current User API Error:", error);
    throw error;
  }
};

// Optional: Add forgot password function
export const forgotPasswordRequest = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("❌ Forgot Password API Error:", error);
    
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to send reset email");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(error.message || "Failed to send reset email");
    }
  }
};

// Optional: Add reset password function
export const resetPasswordRequest = async (token, password) => {
  try {
    const response = await API.post("/auth/reset-password", { token, password });
    return response.data;
  } catch (error) {
    console.error("❌ Reset Password API Error:", error);
    
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to reset password");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(error.message || "Failed to reset password");
    }
  }
};