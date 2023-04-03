let displayMsg = document.getElementById("display-msg");
let Msg = document.getElementsByClassName("msg");
function $(selector) {
    return document.querySelector(selector);
}
function $all(selector) {
    return document.querySelectorAll(selector);
}

const $author = $("#set-author");

if (localStorage.getItem('author') == undefined) {
    $author.style.display = 'flex';
    let $authorInput = $("#user");
    $authorInput.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            if ($authorInput.value.length) {
                localStorage.setItem('author', $authorInput.value);
                $author.style.display = 'none';
            }
        }
    });
} else {
    $author.style.display = 'none';
}
let ayax = setInterval(() => {
    let lastId = Msg[Msg.length - 1].id.substring(3);
    let promise = "https://www.hectorrdez.es/chat/api?method=lastMsg&lastId=" + lastId;
    try {
        fetch(promise)
            .then(response => response.json())
            .then(data => {
                let newMsgs = data.details;
                for (let i = 0; i < newMsgs.length; i++) {
                    let newMsg = document.createElement("div");
                    if(localStorage.getItem('author') != newMsgs[i].author){
                        newMsg.className = "msg recibied";
                    }else{
                        newMsg.className = "msg sended";
                    }
                    newMsg.id = "msg" + (Msg.length + i);
                    newMsg.innerHTML = `<div class="msg-content">
                        <div class="author">${newMsgs[i].author}</div>
                        <div class="text">${newMsgs[i].text}</div>
                    </div>`;
                    displayMsg.appendChild(newMsg);
                }
            })
            .catch(error => clearInterval(ayax))
    } catch (error) {
        console.log(error);
        clearInterval(ayax);
    }
}, 1000);

const $button = $("button");
let inputMsg = $("#msg");


$button.addEventListener('click', () => {
    if (inputMsg.value.length) {
        let promise = "https://www.hectorrdez.es/chat/api?method=lastMsg&text=" + inputMsg.value + "&author=" + localStorage.getItem('author');
        fetch(promise)
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.log(error))
        inputMsg.value = ""
    }
});


