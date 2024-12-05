import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "./config/firebaseConfig"; // Import auth from firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase v9+ imports
import { Border, FontFamily, FontSize, Color } from "./GlobalStyles";

const SignUp = () => {
  const router = useRouter(); // Hook from Expo Router for navigation

  // State variables for input fields
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSignUp = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      // Sign up with email and password using the `auth` object
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created:", userCredential.user);

      // Navigate to the next page (you can modify this path)
      router.push("/(tabs)/BCalendarPage");
    } catch (error) {
      // Type assertion to treat 'error' as an instance of Error
      const e = error as Error;
      Alert.alert("Error", e.message); // Show error message if sign-up fails
    }
  };

  return (
    <View style={styles.signUp}>
      {/* Email Input Field */}
      <View style={[styles.emailprompt, styles.inputField]}>
        <View style={styles.inputBackground} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#606A73"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input Field */}
      <View style={[styles.passwordprompt, styles.inputField]}>
        <View style={styles.inputBackground} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#606A73"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Confirm Password Input Field */}
      <View style={[styles.confirmpasswordprompt, styles.inputField]}>
        <View style={styles.inputBackground} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor="#606A73"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp} // Call the handleSignUp function here
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Link to Sign In */}
      <Text style={styles.alreadyHaveAn}>Already have an account?</Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push("/SignIn")}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Welcome Text */}
      <View style={styles.container}>
        <Text style={styles.welcome}>Create an account!</Text>
      </View>
      {/* Logo */}
      <Image
        style={styles.logo}
        resizeMode="cover"
        source={require("./images/logo.png")}
      />

      {/* Social Media Icons */}
      <View style={styles.socialIconsContainer}>
        <Image
          style={styles.socialIcon}
          resizeMode="cover"
          source={require("./images/google2.png")}
        />
        <Image
          style={styles.socialIcon}
          resizeMode="cover"
          source={require("./images/facebook2.png")}
        />
        <Image
          style={styles.socialIcon}
          resizeMode="cover"
          source={require("./images/apple2.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signUp: {
    backgroundColor: "#f3ede4",
    flex: 1,
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
  inputField: {
    height: 40,
    width: 250,
    position: "absolute",
    left: "50%",
    marginLeft: -125,
  },
  emailprompt: {
    top: "40%",
    marginTop: 65,
  },
  passwordprompt: {
    top: "40%",
    marginTop: 115,
  },
  confirmpasswordprompt: {
    top: "40%",
    marginTop: 165,
  },
  inputBackground: {
    backgroundColor: Color.colorLightsteelblue,
    borderRadius: Border.br_3xs,
    height: "100%",
    width: "100%",
  },
  textInput: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    paddingLeft: 11,
    paddingRight: 11,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
    color: "#333",
  },
  signUpButton: {
    position: "absolute",
    backgroundColor: "#1a3b5d",
    borderRadius: 100,
    height: 39,
    width: 83,
    justifyContent: "center",
    alignItems: "center",
    left: "50%",
    marginLeft: -41.5,
    top: "50%",
    marginTop: 140,
  },
  buttonText: {
    color: "#fff",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  alreadyHaveAn: {
    position: "absolute",
    left: "50%",
    marginLeft: -85,
    top: "50%",
    marginTop: 265,
    width: 200,
    height: 20,
    color: Color.colorGray,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  signInButton: {
    position: "absolute",
    backgroundColor: "#90b766",
    borderRadius: Border.br_3xs,
    height: 34,
    width: 88,
    justifyContent: "center",
    alignItems: "center",
    left: "50%",
    marginLeft: -43.5,
    top: "50%",
    marginTop: 300,
  },
  signInButtonText: {
    color: Color.colorGray,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }],
    marginTop: -82,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.colorGray,
    textAlign: "center",
  },
  logo: {
    position: "absolute",
    left: "50%",
    marginLeft: -160.5,
    top: "50%",
    marginTop: -358,
    width: 309,
    height: 244,
  },
  socialIconsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    left: "50%",
    marginLeft: -103,
    top: "50%",
    marginTop: 200,
  },
  socialIcon: {
    width: 48,
    height: 48,
  },
});

export default SignUp;
