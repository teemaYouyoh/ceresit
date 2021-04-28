import React, { useEffect, useRef, useState } from "react"
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import md5 from 'md5';

const ConsultantRegister = (props) => {
  const history = useHistory();

  const [consultant, setConsultant] = useState("")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [telegram, setTelegram] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAvailable, setIsAvailable] = useState(false)
  const [notification, setNnotification] = useState("")

  $("#login_button").show();

  useEffect(() => {
      const localConsultant = JSON.parse(localStorage.getItem('consultant'));

      if ( props.location.consultant !== undefined ) {
      setConsultant(props.location.consultant);
      setId(props.location.consultant.id);
      setName(props.location.consultant.name);
      setTelegram(props.location.consultant.nick);
      props.location.consultant.is_available == 1 ? setIsAvailable(true) : setIsAvailable(false);

    } else if ( localConsultant !== null ) {
      setConsultant(localConsultant);
      setId(localConsultant.id);
      setName(localConsultant.name);
      setTelegram(localConsultant.nick);
      localConsultant.is_available == 1 ? setIsAvailable(true) : setIsAvailable(false);
      
    } else {
      history.push({
        pathname: "/login",
        consultant,
      })
    }

  }, [])

  const changeInfo = async () => {
    setNnotification("");

    if (name === "") setNnotification('Введите имя!');
    else if (telegram === "") setNnotification('Введите ник в телеграме!');
    else if (telegram.indexOf('@') !== 0) setNnotification('Введите корректный ник!');
    else if (password !== "" && confirmPassword === "") setNnotification('Подтвердите пароль!');
    else if (confirmPassword !== password) setNnotification('Пароли не совпадает!');
    else {
      let mb5pw = password !== "" ? md5(password) : password;
      let available = isAvailable ? "1" : "0"

      fetch('https://fourth.touchit.space/update_consultant.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          telegram,
          password: mb5pw,
          isAvailable: available
        })
      }).then(async (res) => {
        let data = await res.json();
        if (data !== null) {
          localStorage.setItem("consultant", JSON.stringify(data));
          setNnotification("Данные успешно обновлены");
        } else {
          setNnotification("Произошла ошибка! Попробуйте позже.");
        }

      }).catch(() => {
        setNnotification("Произошла ошибка! Попробуйте позже.");
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('consultant');

    history.push({
      "pathname": "/login"
    })

  }

  return (
    <div className="" style={{ "display": "flex", "flexDirection": "column" }}>

      <TextField
        id="input-name"
        label="Имя"
        value={name}
        style={{ "margin": "5px 0" }}
        onChange={(e) => { setName(e.target.value) }} />
      <TextField
        id="input-telegram"
        label="Телеграм"
        placeholder="@nickname"
        value={telegram}
        style={{ "margin": "5px 0" }}
        onChange={(e) => { setTelegram(e.target.value) }} />
      <TextField
        id="input-password"
        label="Новый пароль"
        value={password}
        type="password"
        style={{ "margin": "5px 0" }}
        onChange={(e) => { setPassword(e.target.value) }} />
      <TextField
        id="input-confitm-password"
        label="Подтвердите пароль"
        value={confirmPassword}
        type="password"
        style={{ "margin": "5px 0" }}
        onChange={(e) => { setConfirmPassword(e.target.value) }} />
      <FormControlLabel
        control={
          <Switch
            checked={isAvailable}
            onChange={(e) => { setIsAvailable(e.target.checked) }}
            name="available"
            color="primary"
          />
        }
        label={isAvailable ? "Доступен" : "Не доступен"}
        style={{ "margin": "5px 0" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={changeInfo}
        style={{ "marginTop": "10px" }}>
        Изменить
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={logout}
        style={{ "marginTop": "10px" }}>
        Выход
      </Button>

      { notification }

    </div>
  );
}

export default ConsultantRegister;