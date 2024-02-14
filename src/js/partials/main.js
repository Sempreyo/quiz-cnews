document.addEventListener('DOMContentLoaded', () => {
	const quiz = document.querySelector(".quiz");

	if (quiz) {
		const quizFieldsWrapper = quiz.querySelectorAll(".quiz__fields");
		const buttonNext = quiz.querySelector(".quiz__next");
		const error = quiz.querySelector(".quiz__error");
		let stepCount = 1;

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

		buttonNext.addEventListener("click", (e) => {
			const stepActive = quiz.querySelector(".quiz__step.open");
			const checkNothing = quiz.querySelectorAll(".js-check-nothing");
			const selectedValues = quiz.querySelectorAll(".field:not(.js-reset-fields) input");

			if (stepCount < 10) {
				e.preventDefault();
			}

			if (stepCount < 11) {
				/* Проверяем, заполнено ли хотя бы одно значение на каждом шаге, если нет - показываем ошибку, если все норм, пускаем дальше */
				const selectedValuesStep = quizFieldsWrapper[stepCount - 1].querySelectorAll(".field input");

				console.log(selectedValuesStep)

				selectedValuesStep.forEach((input) => {
					if (input.checked || (input.getAttribute("type") === "text" && input.value !== "")) {
						console.log("Поля выбраны, го дальше")
						stepActive.classList.remove("open");
						stepActive.nextElementSibling.classList.add("open");
						stepCount++;
						error.classList.add("d-none");
					} else {
						error.classList.remove("d-none");
						console.log("Выберите поле!")
					}
				});
			}

			switch (stepCount) {
				case 2:
					buttonNext.textContent = "Вперед";

					selectedValues.forEach((input) => {
						if (input.checked || (input.getAttribute("type") === "text" && input.value != "")) {
							/* Перед каждым последним чекбоксом вставляем выбранные на предыдущих шагах */
							checkNothing.forEach((checkbox) => {
								checkbox.insertAdjacentHTML("beforebegin", `<label class="field field--checkbox">
								<input class="field__input" type="checkbox" name="${input.getAttribute("name")}" /><span class="field__label">${input.value}</span><b></b>
							</label>`);
							});
						}
					});
					break;
				case 10:
					buttonNext.setAttribute("type", "submit");
					break;
				case 11:
					quiz.addEventListener("submit", (e) => {
						e.preventDefault();

						const formData = new FormData(quiz);

						fetch("path-to-ajax", {
							method: "POST",
							body: formData,
						})
							.then((response) => {
								console.log(response);
							})
							.catch((error) => {
								console.error(error);
							});
						buttonNext.classList.add("d-none");
					});

					/* На последнем сообщении скрываем форму после 3 секунд */
					setTimeout(() => {
						quiz.classList.add("d-none");
					}, 3000);
					break;
			}
		});
	}
});