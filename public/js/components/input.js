export function createInput(type, placeholder, id, required = true, className = "formInput") {
	const input = document.createElement("input");
	input.type = type;
	input.placeholder = placeholder;
	input.className = className;
	input.id = id;
	input.required = required;

	return input;
}
