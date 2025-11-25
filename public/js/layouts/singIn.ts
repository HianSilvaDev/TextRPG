import { createInput } from "../components/input";
import { createButton } from "../components/button";

export function signInLayout(callback: (form: HTMLElement) => void): HTMLElement {
	const form = document.createElement("form");
	form.className = "formControl";
	form.id = "signInForm";
	form.appendchild(createInput("email", "Insira seu email", "emailInput"));
	form.appendchild(createInput("password", "Insira sua senha", "passwordInput"));
	form.appendChild(createButton("Entrar", "signInButton", "submit"));

	callback(form);

	return form;
}
