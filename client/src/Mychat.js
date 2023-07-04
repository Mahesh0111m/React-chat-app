import { List } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

/*rsfp*/

function Mychat({socket,room}) {
    const [currentMessage , setcurrentMessage]=useState("");
    const [messageList , setMessageList]=useState([])

    const send=async ()=>{
        if(currentMessage!==""){
            const randomUsername = user_list[Math.floor(Math.random() * user_list.length)];

            const chatdata={
                room:room,
                author:randomUsername,
                message:currentMessage,
                time: new Date(Date.now()).getHours() +
                 ":"  
                + new Date(Date.now()).getMinutes(),
                likes:0,
                
            };

            await socket.emit("send_message",chatdata);
            setMessageList((list)=>[...list, chatdata]);
            setcurrentMessage("");
        }
    };

    const handleLike = (index) => {
        setMessageList((list) =>
          list.map((message, i) => {
            if (i === index) {
              return { ...message, likes: message.likes + 1 };
            }
            return message;
          })
        );
      };


    useEffect(()=>{
        socket.on("receive_message",(data)=> {
           setMessageList((list)=>[...list, data]);
        });
    },[socket]);     

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Message App</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                {messageList.map((messageContent,index)=>{
                    return <div className='message' key={index}>
                        <div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p>{messageContent.time}</p>
                                <p>{messageContent.author}</p>
                                <button className="like-button" onClick={()=>handleLike(index)}>&#x1F44D;</button>
                                <span className="likes-count">{messageContent.likes}</span>
                                
                            </div>
                        </div>
                        
                        </div>
                })}
                </ScrollToBottom>
            </div>

            <div className='chat-footer'>
                <input type='text' value={currentMessage}  placeholder='Type a Message'
                onChange={(event)=>{
                    setcurrentMessage(event.target.value);
                }}
                onKeyPress={(event)=>{
                    event.key === "Enter" && send();
                }}

                />

                <button onClick={send}>&#9658;</button>
            </div>
        </div>
    );
}

export default Mychat;