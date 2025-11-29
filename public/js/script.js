import { swordsman, archer, mage, barbarian } from "./objects/classes.js";
import { signUpLayout } from "./layouts/singnUp.ts";
import { signUpLayout } from "./layouts/singnUp.ts";

const about = document.getElementsByClassName("container");

document.getElementById("singnUp").addEventListener("click", () => {
	console.log("click!!");
	const signUpForm = signUpLayout();
});

document.getElementById("singnIn").addEventListener("click", () => {
	console.log("click!!");

	const signInForm = signInLayout();
});
