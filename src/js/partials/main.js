document.addEventListener('DOMContentLoaded', () => {
	const quiz = document.querySelector(".quiz");

	if (quiz) {
		const quizFieldsWrapper = quiz.querySelectorAll(".quiz__fields");
		const buttonNext = quiz.querySelector(".quiz__next");
		let stepCount = 1;
	
		if (quizFieldsWrapper && quizFieldsWrapper.length > 0) {
			quizFieldsWrapper.forEach((wrapper) => {
				const toggleFields = wrapper.querySelectorAll(".js-toggle-field .field__label");
				const reset = quiz.querySelector(".js-reset-fields input");
				const checkFields = wrapper.querySelectorAll('.field:not(.js-reset-fields) input[type="checkbox"]');
				const textFields = wrapper.querySelectorAll('.field:not(.js-reset-fields) input[type="text"]');

				checkFields.forEach((el) => {
					el.addEventListener("change", (e) => {
						if (e.currentTarget.checked) {
							reset.checked = false;
						}
					});
				});

				textFields.forEach((el) => {
					el.addEventListener("change", (e) => {
						if (e.currentTarget.checked) {
							reset.checked = false;
						}
					});
				});
	
				toggleFields.forEach((el, i, arr) => {
					el.addEventListener("click", (e) => {
						e.currentTarget.parentElement.classList.toggle("active");
	
						if (i > 1) {
							let isShowed = false;
	
							if (!isShowed) {
								arr[i+1].parentElement.classList.remove("closed");
								isShowed = true;
							}
						}
					});
				});

				if (reset) {
					reset.addEventListener("change", (e) => {
						const fields = wrapper.querySelectorAll(".field:not(.js-reset-fields) input");

						if (e.currentTarget.checked) {
							fields.forEach((el) => {
								el.value = "";
								el.checked = false;
								el.parentElement.classList.remove("active");
							});
						}
					});
				}
			});
		}
	
		buttonNext.addEventListener("click", (e) => {
			const stepActive = quiz.querySelector(".quiz__step.open");
			const selectedWrapper = quiz.querySelectorAll(".js-selected-fields");
			let selectedFields = [];

			e.preventDefault();

			stepActive.classList.remove("open");
			stepActive.nextElementSibling.classList.add("open");
			stepCount++;

			if (stepCount === 3) {
				quizFieldsWrapper[1].querySelectorAll('.field input').forEach((input) => {
					if (input.checked || (input.getAttribute("type") === "text" && input.value != "")) {
						selectedFields.push(input);
					}
				});

				selectedWrapper.forEach((wrapper) => {
					wrapper.append(selectedFields[0]);
				});
			}
		});
	}
});