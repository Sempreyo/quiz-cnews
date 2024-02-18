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

			checkFields.forEach((el) => {
				el.addEventListener("change", (e) => {
					if (e.currentTarget.checked) {
						reset.checked = false;
					}
				});
			});

			toggleFields.forEach((el, i, arr) => {
				el.addEventListener("click", (e) => {
					e.currentTarget.parentElement.classList.toggle("active");

					if (e.currentTarget.parentElement.classList.contains("active")) {
						reset.checked = false;
					}

					if (i > 1) {
						let isShowed = false;

						if (!isShowed && arr[i + 1]) {
							arr[i + 1].parentElement.classList.remove("closed");
							isShowed = true;
						}
					}
				});
			});

			if (reset) {
				reset.addEventListener("change", (e) => {
					const fields = quiz.querySelectorAll(".quiz__step--3 .field:not(.js-reset-fields) input");

					if (e.currentTarget.checked) {
						fields.forEach((el) => {
							if (el.getAttribute("type") === "text") {
								el.value = "";
							}

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
			const selectedValues = quiz.querySelectorAll(".quiz__step--2 .field:not(.js-reset-fields) input, .quiz__step--3 .field:not(.js-reset-fields) input");
			const selectedValuesCopy = quiz.querySelectorAll(".quiz__step--3 .field:not(.js-reset-fields) input");
			let isValid = false;

			if (stepCount < 11) {
				e.preventDefault();
			}

			if (stepCount < 12) {
				/* Проверяем, заполнено ли хотя бы одно значение на каждом шаге, если нет - показываем ошибку, если все норм, пускаем дальше */
				if (stepCount > 1) {
					const selectedValuesStep = quizFieldsWrapper[stepCount - 2].querySelectorAll(".field input");

					selectedValuesStep.forEach((input) => {
						if (input.checked || (input.getAttribute("type") === "text" && input.value !== "") || stepCount < 2 || stepCount > 3) {
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
				case 1:
					buttonNext.textContent = "Вперед";
					break;
				case 2:
					buttonNext.textContent = "Больше не знаю";
					break;
				case 3:
					buttonNext.textContent = "Вперед";
					break;
				case 4:
					selectedValuesCopy.forEach((input) => {
						if (input.checked || (input.getAttribute("type") === "text" && input.value != "")) {
							/* Перед каждым последним чекбоксом вставляем выбранные на предыдущих шагах */
							checkNothing.forEach((checkbox) => {
								checkbox.insertAdjacentHTML("beforebegin", `<label class="field field--checkbox">
									<input class="field__input" type="checkbox" name="${checkbox.closest(".quiz__step").dataset.name}" value="${input.value}" data-value="${input.value}" /><span class="field__label">${input.type === "checkbox" ? input.parentElement.querySelector(".field__label").textContent : input.value}</span><b></b>
								</label>`);

								/* Если был клик по последнему полю, все предыдущие сбрасываются */
								checkbox.querySelector("input").addEventListener("change", (e) => {
									const fields = e.currentTarget.closest(".quiz__step").querySelectorAll(".field:not(.js-check-nothing) input");

									if (e.currentTarget.checked) {
										fields.forEach((el) => {
											el.checked = false;
										});
									}
								});

								/* Если был клик по любому полю кроме последнего, последний сбрасывается */
								checkbox.parentElement.querySelectorAll(".field:not(.js-check-nothing) input").forEach((input) => {
									input.addEventListener("change", (e) => {
										checkbox.querySelector("input").checked = false;
									});
								});
							});
						}
					});
					break;
				case 11:
					buttonNext.setAttribute("type", "submit");
					break;
				case 12:
					quiz.addEventListener("submit", (e) => {
						e.preventDefault();

						let data = '{"form":{';

						for (let step = 2; step < 12; step++) {
							const fields = quiz.querySelectorAll(`.quiz__step--${step} .field input`);
							let selectedFields = [];
							let selectedNames = [];
							let arrCount = 0;

							/* Формируем массив выбранных полей на каждом шаге */
							fields.forEach((field) => {
								if (
									field.getAttribute("type") === "checkbox" &&
									field.checked ||
									field.getAttribute("type") === "text"
									&& field.value !== ""
								) {
									selectedFields.push(field);
								}
							});

							/* Формируем json */
							data += `"step${step}": {`;

							/* Проверяем количество массивов на каждом шаге */
							selectedFields.forEach((field) => {
								if (selectedNames.indexOf(field.getAttribute("name")) == -1) {
									selectedNames.push(field.getAttribute("name"));
									arrCount++;
								}
							});

							selectedNames = [];

							/* Формируем вложенную структуру */
							selectedFields.forEach((field, index, arr) => {
								/* Если выбрано несколько полей с одинаковым name, достаем только один name */
								if (selectedNames.indexOf(field.getAttribute("name")) == -1) {
									let values = [];

									selectedNames.push(field.getAttribute("name"));

									data += `"${field.getAttribute("name")}": [`;

									arr.forEach((innerField) => {
										if (innerField.getAttribute("name") == field.getAttribute("name")) {
											values.push(`"${innerField.value}"`);
										}
									});

									data += `${values.join(",")}`;

									data += `]${arrCount > 1 && index !== selectedFields.length - 1 ? "," : ""}`;
								}
							});

							data += (step === 11) ? '}' : '},';
						}

						data += '}}';

						$.ajax({
							type: "POST",
							url: window.location,
							data: JSON.parse(data),
							complete: function (response, textStatus) {
								if (response.status === 200 && response.responseText) {
								}
							}
						});
					});

					buttonNext.classList.add("d-none");

					/* Если есть скрытый заголовок, делаем ему анимированное появление */
					if (stepActive.nextElementSibling.querySelector(".hidden")) {
						setTimeout(() => {
							stepActive.nextElementSibling.querySelector(".hidden").classList.remove("hidden");
						}, 100);
					}
					break;
			}
		});
	}
});