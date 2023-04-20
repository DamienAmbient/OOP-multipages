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

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data,
        });

        return await res.text();
    }

    init() {
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
                    });
            });
        });
    }
}
