// ✅ YOUR COMPUTER'S IP ADDRESS
const BASE_URL = "http://10.226.62.94:5000/users";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error(
        "Cannot connect to server. Make sure backend is running and phone is on same WiFi.",
      );
    }
    throw error;
  }
};

export const registerUser = async ({ name, email, password }) => {
  const [firstname, ...lastnameParts] = name.trim().split(" ");
  const lastname = lastnameParts.join(" ") || "";

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        fullname: {
          firstname,
          lastname,
        },
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error(
        "Cannot connect to server. Make sure backend is running and phone is on same WiFi.",
      );
    }
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ✅ NEW: Update user profile
export const updateUserProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error("Cannot connect to server. Check your network.");
    }
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Logout API error:", error);
  }
};
