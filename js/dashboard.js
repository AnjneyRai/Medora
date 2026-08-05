const input = document.querySelector(".ai-panel input");
const button = document.querySelector(".ask-btn");
const chat = document.querySelector(".chat-box");

button.addEventListener("click", askAI);

input.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        askAI();

    }

});

function askAI(){

    const question = input.value.trim();

    if(question==="") return;

    // User message
    chat.innerHTML += `
        <div class="user-message">
            👤 ${question}
        </div>
    `;

    input.value="";

    chat.scrollTop = chat.scrollHeight;

    // AI typing
    chat.innerHTML += `
        <div class="typing" id="typing">
            🤖 Medora is thinking...
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

    setTimeout(function(){

        document.getElementById("typing").remove();

        chat.innerHTML += `
            <div class="ai-message">
                🤖 This is a demo response. Later I'll answer using AI.
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    },1500);

}

// Highlight current page in sidebar

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {

    if(link.getAttribute("href") === currentPage){

        link.classList.add("active");

    }

});