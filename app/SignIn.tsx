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
import { FontFamily, FontSize, Color, Border } from "./GlobalStyles";
import { useRouter } from "expo-router";
import { auth } from "./config/firebaseConfig"; // Import auth from firebaseConfig
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase v9+ imports

const SignIn = () => {
  const router = useRouter();

  // State variables for input fields
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignIn = async () => {
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/(tabs)/BCalendarPage"); // Navigate to CalendarPage on success
    } catch (error) {
      const e = error as Error;
      Alert.alert("Wrong Email or Password", e.message); // Show error message if sign-in fails
    }
  };

  return (
    <View style={styles.signIn}>
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

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn} // Call the handleSignIn function
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Don't have an account link */}
      <Text style={styles.dontHaveAn}>Don't have an account?</Text>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push("/SignUp")}
      >
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Welcome Text */}
      <Text style={styles.welcome}>Welcome!</Text>

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
  signIn: {
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
    top: "50%",
    marginTop: -24,
  },
  passwordprompt: {
    top: "50%",
    marginTop: 27,
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
    fontFamily: "InterMedium",
    fontWeight: "500",
    fontSize: FontSize.size_sm,
    color: "#333",
  },
  signInButton: {
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
    marginTop: 102,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "InterMedium",
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  dontHaveAn: {
    position: "absolute",
    left: "50%",
    marginLeft: -77.5,
    top: "50%",
    marginTop: 238,
    width: 157,
    height: 20,
    color: Color.colorGray,
    fontFamily: "InterBold",
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  signUpButton: {
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
    marginTop: 267,
  },
  signUpButtonText: {
    color: Color.colorGray,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  welcome: {
    position: "absolute",
    left: "50%",
    marginLeft: -65.5,
    top: "50%",
    marginTop: -82,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "InterBold",
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
    marginTop: 165,
  },
  socialIcon: {
    width: 48,
    height: 48,
  },
});

export default SignIn;
