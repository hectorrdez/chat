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
let ajax = setInterval(() => {
    let lastId = Msg[Msg.length - 1].id.substring(3);
    let promise = "http://hectorrdez.es/chat/api.php?method=lastMsg&lastId=" + lastId;
    try {
        fetch(promise)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(new Date().toTimeString());
                let newMsgs = data.details;
                for (let i = 0; i < newMsgs.length; i++) {
                    let newMsg = document.createElement("div");
                    newMsg.id = "msg" + (Msg.length);
                    // let date = new Date(timestamp);
                    // let hours = date.getHours();
                    // let minutes = date.getMinutes();
                    if (localStorage.getItem('author') != newMsgs[i].author) {
                        newMsg.className = "msg recibied";
                        newMsg.innerHTML = `<div class="msg-content">
                        <div class="author">${newMsgs[i].author}</div>
                        <div class="text">${newMsgs[i].text}</div>
                        <div class="time">${new Date(newMsgs[i].time).getHours() + ":" + new Date(newMsgs[i].time).getMinutes()}</div>
                    </div>`;
                    } else {
                        newMsg.className = "msg sended";
                        newMsg.innerHTML = `<div class="msg-content">
                        <div class="text">${newMsgs[i].text}</div>
                        <div class="time">${new Date(newMsgs[i].time).getHours() + ":" + new Date(newMsgs[i].time).getMinutes()}</div>
                    </div>`;
                    }

                    displayMsg.appendChild(newMsg);
                    displayMsg.scrollTop = displayMsg.scrollHeight;
                    $loader.style.display = "none";
                }
            }).catch(error => { clearInterval(ajax) })
    } catch (error) {
        console.log(error);
        clearInterval(ajax);
    }
}, 1000);

let inputMsg = $("#msg");
const $loader = $("#msg0");

inputMsg.addEventListener('keydown', (e) => {
    if (e.key == 'Enter')
        if (inputMsg.value.length) {
            let now = new Date();
            let year = now.getFullYear();
            let month = ('0' + (now.getMonth() + 1)).slice(-2);
            let day = ('0' + now.getDate()).slice(-2);
            let hours = ('0' + now.getHours()).slice(-2);
            let minutes = ('0' + now.getMinutes()).slice(-2);
            let seconds = ('0' + now.getSeconds()).slice(-2);

            let formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

            let promise = "http://localhost/api.php?method=newMsg&text=" + inputMsg.value + "&author=" + localStorage.getItem('author') + "&time=" + formattedTime;
            fetch(promise)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error))
            inputMsg.value = ""
        }
});