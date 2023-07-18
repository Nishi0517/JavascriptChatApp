

 const chatInput = document.querySelector(".chat-input textarea");

 const sendChatBtn = document.querySelector(".chat-input span");
 const chatbox = document.querySelector(".chatbox");
 const chatbotToggler = document.querySelector(".chatbot-toggler");
 const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const API_KEY="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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    //Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incoingChatLI) =>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement = incoingChatLI.querySelector("p");

    const requestOptions ={
        method:'POST',
        headers :{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:userMessage}]
        })
    }

    //send POST request to API, get response

    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
        console.log(data)
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent = "OOPS!! Something went wrong, please try again later";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () =>{
    userMessage = chatInput.value.trim();
    // console.log(userMessage);
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //append the uers's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(()=>{
        //Display typing...."message while waiting for the response"
        const incoingChatLI =createChatLi("Typing...","incoming"); 
        chatbox.appendChild(incoingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incoingChatLI);
    },6000);
}

chatInput.addEventListener("input",()=>{
    //adjust the height of the input textarea based on its contnet
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown",(e)=>{
    //if Enter key is pressed w/o shift key and window  
    //width is greater than 800px , handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));