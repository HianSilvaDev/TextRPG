import { createInput } from "../components/input.js";
import { createButton } from "../components/button.js";

export function signInLayout(callback = (form) => {}) {
	const form = document.createElement("form");
	form.className = "formControl";
	form.id = "signInForm";
	form.appendChild(createInput("email", "Insira seu email", "emailInput"));
	form.appendChild(createInput("password", "Insira sua senha", "passwordInput"));
	form.appendChild(createButton("Entrar", "signInButton", "submit"));

	callback(form);

	return form;
}
