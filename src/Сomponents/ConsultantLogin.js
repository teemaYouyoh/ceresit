import React, { useEffect, useRef, useState } from "react"
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import md5 from 'md5';

const ConsultantLogin = (props) => {
  const history = useHistory();

  const [name, setName] = useState("")
  const [telegram, setTelegram] = useState("")
  const [password, setPassword] = useState("")
  const [notification, setNnotification] = useState("")
  const [userId, setUserId] = useState(props.location.id)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    autoLogin();
  }, [])

  const autoLogin = () => {
    const consultant = JSON.parse(localStorage.getItem('consultant'));

    if (consultant !== null) {
      fetch('https://fourth.touchit.space/login_consultant.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram: consultant.nick,
          password: consultant.password
        })
      }).then(async (res) => {
        let data = await res.json();

        if (data !== null) {

          localStorage.setItem("consultant", JSON.stringify(data));

          history.push({
            "pathname": "/profile",
            consultant: data
          })
        }
      })
    }
  }

  const onButtonClick = async () => {
    setNnotification("");

    if (isAdmin) {
      if ( name === "" ) setNnotification('Введите имя!');
      else if ( password === "" ) setNnotification('Введите пароль!');
      else {
        let mb5pw = md5(password);
  
        fetch('https://fourth.touchit.space/login_admin.php', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            password: mb5pw
          })
  
        }).then(async (res) => {
          let data = await res.json();
          
          if ( data !== null ) {
  
            history.push({
              "pathname": "/admin",
              admin: data
            })
          
          } else {
            setNnotification("Неверный пароль!");
          }
         
        }).catch(() => {
          setNnotification("Произошла ошибка! Попробуйте ещё раз.");
        })
      }

    } else {
      if (telegram === "") setNnotification('Введите ник в телеграме!');
      else if (telegram.indexOf('@') !== 0) setNnotification('Введите корректный ник!');
      else if (password === "") setNnotification('Введите пароль!');
      else {
        let mb5pw = md5(password);

        fetch('https://fourth.touchit.space/login_consultant.php', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegram,
            password: mb5pw
          })

        }).then(async (res) => {
          let data = await res.json();

          if (data !== null) {

            localStorage.setItem("consultant", JSON.stringify(data));

            if (userId !== undefined) {
              window.location.href = `/?id=${userId}`;
            } else {
              history.push({
                "pathname": "/profile",
                consultant: data
              })
            }

          } else {
            setNnotification("Неверный пароль!");
          }

        }).catch(() => {
          setNnotification("Произошла ошибка! Попробуйте ещё раз.");
        })
      }
    }
  }

  return (
    <div className="" style={{ "display": "flex", "flexDirection": "column" }}>

      <FormControlLabel
        control={
          <Switch
            checked={isAdmin}
            onChange={(e) => { setIsAdmin(e.target.checked) }}
            name="available"
            color="primary"
          />
        }
        label={isAdmin ? "Администратор" : "Консультант"}
      />
      {isAdmin ?
        (
          <TextField
            id="input-name"
            label="Имя"
            value={name}
            onChange={(e) => { setName(e.target.value) }} />
        )
        :
        (
          <TextField
            id="input-telegram"
            label="Телеграм"
            placeholder="@nickname"
            value={telegram}
            onChange={(e) => { setTelegram(e.target.value) }} />
        )}

      <TextField
        id="input-password"
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value) }} />
      <Button
        variant="contained"
        color="primary"
        onClick={onButtonClick}
        style={{ "marginTop": "20px" }}>
        Далее
      </Button>


      { notification}

    </div>
  );
}

export default ConsultantLogin;