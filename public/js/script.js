import { swordsman, archer, mage, barbarian } from "./objects/classes.js";
import { signInLayout } from "./layouts/signIn.js";
import { signUpLayout } from "./layouts/signUp.js";

const about = document.getElementsByClassName("container");

document.getElementById("singnUp").addEventListener("click", () => {
	console.log("click!!");

	const signUpForm = signUpLayout();

	console.log(signUpForm);
});

document.getElementById("singnIn").addEventListener("click", () => {
	console.log("click!!");

	const signInForm = signInLayout();

	console.log(signInForm);
});
