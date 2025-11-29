import { createInput } from "../components/input";
import { createButton } from "../components/button";

export function signUpLayout(callback: (form: HTMLElement) => void): HTMLElement {
	const form = document.createElement("form");
	form.className = "formControl";
	form.id = "signUpForm";
	form.appendChild(createInput("text", "Insira seu nome de usuário", "usernameInput"));
	form.appendChild(createInput("email", "Insira seu email", "emailInput"));
	form.appendChild(createInput("email", "confirme seu email", "emailConfirmInput"));
	form.appendChild(createInput("password", "Insira sua senha", "passwordInput"));
	form.appendChild(createInput("password", "Insira sua senha novamente", "passwordConfirmInput"));
	form.appendChild(createButton("Cadastrar", "signUpButton", "submit"));

	// callback(form);

	return form;
}
