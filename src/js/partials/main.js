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
									<input class="field__input" type="checkbox" name="${checkbox.closest(".quiz__step").dataset.name}" value="${input.value}" data-value="${input.value}" /><span class="field__label">${input.type === "checkbox" ? input.parentElement.querySelector(".field__label").textContent : input.value}</span><b></b>
								</label>`);

								/* Если был клик по последнему полю, все предыдущие сбрасываются */
								checkbox.querySelector("input").addEventListener("change", (e) => {
									const fields = e.currentTarget.closest(".quiz__step").querySelectorAll(".field:not(.js-check-nothing) input");

									if (e.currentTarget.checked) {
										fields.forEach((el) => {
											el.value = "";
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
				case 12:
					buttonNext.setAttribute("type", "submit");
					break;
				case 13:
					quiz.addEventListener("submit", (e) => {
						e.preventDefault();

						let arrMass = [];
						let data = `{"form":{`;

						for (let step = 3; step < 13; step++) {
							const fields = quiz.querySelectorAll(`.quiz__step--${step} .field input`);

							fields.forEach((x) => {
								console.log("name " + x.getAttribute("name"))
								console.log("value " + x.value)
							})
							

							data += `"step${step}": {`;
							arrMass = [];
							arrIndex = [];
							arrMemory = [];

							for (let i = 0; i < fields.length; i++) {
								if (fields[i].value != '') {
									arrMass.push('"' + fields[i].value + '"');
									arrIndex.push(fields[i].getAttribute("name"));
									console.log('Filled' + fields[i].value);
								} else {
									console.log('Empty' + fields[i].value);
								}
							}

							let arr = [];
							let flag = 0;
							//let isEmpty = true;
							for (let name = 0; name < fields.length; name++) {
								if ((fields[name].getAttribute("type") === "checkbox" && fields[name].checked) || (fields[name].getAttribute("type") === "text" && fields[name].value!= "")) {
									while (arrIndex.length > 0) {
										let ind = arrIndex.indexOf(fields[name].getAttribute("name"));
										if (ind != -1) {
											arrMemory.push(arrMass[ind]);
											delete arrIndex[ind];// = 'deleted';
											delete arrMass[ind];// = 'deleted';
										}
									}

									if (arr.indexOf(fields[name].getAttribute("name")) == -1) {
										arr.push(fields[name].getAttribute("name"));
										data += fields[name].getAttribute("name") + ': ';
										

										flag = 1;
										//isEmpty = false;
									}

									if (name == fields[fields.length - 1] || flag == 1) {
										arrMemory = [];
										data += '[' + arrMemory.join(",") + ']';

										if (flag == 1 && name != fields[fields.length - 1]) {
											data += ',';
										}
										arrMass = [];
										flag = 0;
									}

									if (fields[name].getAttribute("name") != "rus-company") {
										// data += `"${fields[name].value}"`;
									}

									if (
										fields[name].getAttribute("name").startsWith("company-") && 
										fields[name+1].getAttribute("name").startsWith("company-")
									) {
										//data += "]";
									}

									// if (step > 3) {
									// 	data += ",";
									// } else {
									// 	if (
									// 		step == 3 && 
									// 		fields[name].getAttribute("name").startsWith("company-") && 
									// 		name !== arrChecked.length - 1
									// 	) {
									// 		data += ",";
									// 	}
									// }

									// if(fields[name+1])
									// {
									// 	data += `
									// 	"${fields[name].value || fields[name].dataset.value}"
									// 	${fields[name].getAttribute("name").startsWith("company-") && fields[name+1].getAttribute("name").startsWith("company-") ? "]" : ""}
									// 	${step > 3 ? "," : ""}
									// 	${step == 3 && fields[name].getAttribute("name").startsWith("company-") && name !== arrChecked.length - 1 ? "," : ""}`;
									// }
									// else
									// {
									// 	data += `
									// 	"${fields[name].value || fields[name].dataset.value}"
									// 	${fields[name].getAttribute("name").startsWith("company-") && fields[name+1].getAttribute("name").startsWith("company-") ? "]" : ""}
									// 	${step > 3 ? "" : ""}
									// 	${step == 3 && fields[name].getAttribute("name").startsWith("company-") && name !== arrChecked.length - 1 ? "" : ""}`;
									// }
								}
							}
							
							//data += fields[name].getAttribute("name") + ': [' + arrMass.join(",") + ']';

							// if (isEmpty || step === 3) {
							// 	data += ``;
							// } else {
							// 	data += `[]]`;
							// }

							data += (step === 12) ? '}' : '},';
						}

						data += '}}';

						console.log(data)
			
						$.ajax({
							type: "POST",
							url: window.location,
							data: JSON.parse(data),
							complete: function(response, textStatus) {
								if (response.status === 200 && response.responseText) {}
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