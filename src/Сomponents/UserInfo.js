import React, { useEffect, useRef, useState } from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import io from "socket.io-client"

const socket = io.connect('https://vps-touchit.space/')

const UserInfo = (props) => {
  const history = useHistory();

  const [me, setMe] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    socket.on("me", async (id) => {
      setMe(id);
    })
  }, [])

  const onButtonClick = async () => {

    let user = { name, me }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
      user.id = userId;
    }

    history.push({
      pathname: '/chat',
      socket,
      user
    });

    // socket.on("me", async (id) => {
    //   let message = `<a href="http://localhost:3000/?id=${id}">http://localhost:3000/?id=${id}</a> `;

    //   let userId = props.location.search;

    //   if (userId) {

    //     let idPos = userId.indexOf('=') + 1;
    //     userId = userId.slice(idPos);

    //     history.push({
    //       pathname: '/chat',
    //       user: { id: userId, name },
    //       socket
    //     });

    //   } else {

    //     const response = await fetch(`https://api.telegram.org/bot1752464306:AAGL94oQ4TE3WnKPQnNQHQyR2acdsd8CSTg/sendMessage?chat_id=-1001286130652&parse_mode=html&text=${message}`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (response.ok) {
    //       let json = await response.json();


    //     } else {
    //       alert("Ошибка HTTP: " + response.status);
    //     }

    //   }
    // })
  }

  return (
    <>
      <TextField
        id="filled-basic"
        label="Name"
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={onButtonClick}>
        {/* <Link to={{ pathname: "/chat", name: name }}  >Далее</Link> */}
        Далее
      </Button>
    </>
  );
}

export default UserInfo;