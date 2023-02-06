import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import sound from "./send.mp3";
import soundRecieved from "./sendRecieved.mp3";
import { Howl } from "howler";
import Picker from 'emoji-picker-react';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [roomCalled] = useState(room);
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setCurrentMessage(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };

    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
                pageLanguage: "en",
                autoDisplay: false
            },
            "google_translate_element"
        );
    };


    const sendMessage = async() => {
        var soundC = new Howl({
            src: [sound]
        });


        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            soundC.play();
        }
    };

    const reload = () => {
        window.location.reload(true);
    }

    useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
            "src",
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;


        var soundR = new Howl({
            src: [soundRecieved]
        });
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            soundR.play();
        });


    }, [socket]);

    return ( <
            div className = "chat-window" >
            <
            div id = "google_translate_element" > < /div> <
            div className = "chat-footer" >
            <
            button onClick = { reload } > Return < /button>  <
            /div> <
            br / >

            <
            div className = "chat-header" >
            <
            p > Secodi in the < strong > room: { roomCalled } < /strong></p >
            <
            /div> <
            div className = "chat-body" >
            <
            ScrollToBottom className = "message-container" > {
                messageList.map((messageContent) => {
                    return ( <
                        div className = "message"
                        id = { username === messageContent.author ? "you" : "other" } >
                        <
                        div >
                        <
                        div className = "message-content" >
                        <
                        p > { messageContent.message } < /p> <
                        /div> <
                        div className = "message-meta" >
                        <
                        p id = "time" > { messageContent.time } < /p> <
                        p id = "author" > { messageContent.author } < /p> <
                        /div> <
                        /div> <
                        /div>
                    );
                })
            } <
            /ScrollToBottom> <
            /div> <
            div className = "chat-footer"
            id = "chat-text" >
            <
            input className = "input-style"
            type = "text"
            value = { currentMessage }
            placeholder = "Hey..."
            onChange = {
                (event) => {
                    setCurrentMessage(event.target.value);
                }
            }
            onKeyPress = {
                (event) => {
                    event.key === "Enter" && sendMessage();
                }
            }
            /> <
            img className = "emoji-icon"
            src = "https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick = {
                () => setShowPicker(val => !val) }
            /> {
                showPicker && < Picker
                pickerStyle = {
                    { width: '100%' } }
                onEmojiClick = { onEmojiClick }
                />} <
                button onClick = { sendMessage } > & #9658;</button>

      </div>

      

    </div>

  );

}



export default Chat;