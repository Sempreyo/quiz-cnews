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
					const fields = quiz.querySelectorAll(".quiz__step--4 .field:not(.js-reset-fields) input");

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
			const selectedValues = quiz.querySelectorAll(".quiz__step--3 .field:not(.js-reset-fields) input, .quiz__step--4 .field:not(.js-reset-fields) input");
			let isValid = false;

			if (stepCount < 12) {
				e.preventDefault();
			}

			if (stepCount < 13) {
				/* Проверяем, заполнено ли хотя бы одно значение на каждом шаге, если нет - показываем ошибку, если все норм, пускаем дальше */
				if (stepCount > 2) {
					const selectedValuesStep = quizFieldsWrapper[stepCount - 3].querySelectorAll(".field input");

					selectedValuesStep.forEach((input) => {
						if (input.checked || (input.getAttribute("type") === "text" && input.value !== "") || stepCount < 3 || stepCount > 4) {
							isValid = true;
						}
					});

					if (isValid) {
						stepActive.classList.remove("open");
						stepActive.nextElementSibling.classList.add("open");
						stepCount++;
						error.classList.add("d-none");
					} else {
						error.classList.remove("d-none");
					}
				} else {
					stepActive.classList.remove("open");
					stepActive.nextElementSibling.classList.add("open");
					stepCount++;

					/* Если есть скрытый заголовок, делаем ему анимированное появление */
					if (stepActive.nextElementSibling.querySelector(".hidden")) {
						setTimeout(() => {
							stepActive.nextElementSibling.querySelector(".hidden").classList.remove("hidden");
						}, 100);
					}
				}
			}

			switch (stepCount) {
				case 2:
					buttonNext.textContent = "Вперед";
					break;
				case 3:
					buttonNext.textContent = "Больше не знаю";
					break;
				case 4:
					buttonNext.textContent = "Вперед";
					break;
				case 5:
					selectedValues.forEach((input) => {
						if (input.checked || (input.getAttribute("type") === "text" && input.value != "")) {
							/* Перед каждым последним чекбоксом вставляем выбранные на предыдущих шагах */
							checkNothing.forEach((checkbox) => {
								checkbox.insertAdjacentHTML("beforebegin", `<label class="field field--checkbox">
									<input class="field__input" type="checkbox" name="${checkbox.closest(".quiz__step").getAttribute("data-name")}_${input.getAttribute("name")}" /><span class="field__label">${input.value}</span><b></b>
								</label>`);

								checkbox.querySelector("input").addEventListener("change", (e) => {
									const fields = e.currentTarget.closest(".quiz__step").querySelectorAll(".field:not(.js-check-nothing) input");
	
									if (e.currentTarget.checked) {
										fields.forEach((el) => {
											el.value = "";
											el.checked = false;
										});
									}
								});
							});
						}
					});
					break;
				case 12:
					buttonNext.setAttribute("type", "submit");
					break;
				case 13:
					quiz.addEventListener("submit", (e) => {
						e.preventDefault();

						const fields = quiz.querySelectorAll(".field input");
						const data = [];

						fields.forEach((el) => {
							const name = el.getAttribute("name");
							const value = el.value;
							

							if ((el.getAttribute("type") === "checkbox" && el.checked) || (el.getAttribute("type") === "text" && el.value!= "")) {
								data.push([name, value]);
							}
						});

						fetch("path-to-ajax", {
							method: "POST",
							body: data,
						})
							.then((response) => {
								console.log(response);
							})
							.catch((error) => {
								console.error(error);
							});
						buttonNext.classList.add("d-none");
					});

					/* Если есть скрытый заголовок, делаем ему анимированное появление */
					if (stepActive.nextElementSibling.querySelector(".hidden")) {
						setTimeout(() => {
							stepActive.nextElementSibling.querySelector(".hidden").classList.remove("hidden");
						}, 100);
					}

					/* На последнем сообщении скрываем форму после 3 секунд */
					setTimeout(() => {
						quiz.classList.add("d-none");
					}, 3000);
					break;
			}
		});
	}
});