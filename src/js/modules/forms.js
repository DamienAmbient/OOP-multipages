export default class Form {
    constructor(form) {
        this.forms = document.querySelectorAll(form);
        this.inputs = document.querySelectorAll("input");
        this.message = {
            loading: "Loading",
            success: "Thank you! Soon we will contact with you",
            failure: "SOmething is wrong",
        };
        this.path = "assets/question.php";
    }

    clearInputs() {
        this.inputs.forEach((item) => {
            item.value = "";
        });
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');

        mailInputs.forEach((input) => {
            input.addEventListener("keypress", function (e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/gi)) {
                    e.preventDefault();
                }
            });
        });
    }

    initMAsk() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();

            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();
            }
        };

        function createMask(event) {
            let matrix = "+1 (___) ___-____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");

            if (def.length >= val.length) {
                val = def;
            }

            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length
                    ? val.charAt(i++)
                    : i >= val.length
                    ? ""
                    : a;
            });

            if (event.type === "blur") {
                if (this.value.length == 2) {
                    this.value = "";
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }

        let inputs = document.querySelectorAll('[name="phone"]');

        inputs.forEach((input) => {
            input.addEventListener("input", createMask);
            input.addEventListener("focus", createMask);
            input.addEventListener("blur", createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data,
        });

        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMAsk();

        this.forms.forEach((item) => {
            item.addEventListener("submit", (e) => {
                e.preventDefault();

                let statusMEssage = document.createElement("div");
                statusMEssage.style.cssText = `
                    margin-top:15px;
                    font-size:18px;
                    color:white;
                `;
                item.parentNode.appendChild(statusMEssage);

                statusMEssage.textContent = this.message.loading;

                const formData = new FormData(item);

                this.postData(this.path, formData)
                    .then((res) => {
                        console.log(res);
                        statusMEssage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMEssage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMEssage.remove();
                        }, 6000);
                    });
            });
        });
    }
}
