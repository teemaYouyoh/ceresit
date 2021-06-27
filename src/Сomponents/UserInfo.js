import React, { useEffect, useRef, useState } from "react"
import AudioDeviceSelect from './AudioDeviceSelect.js';
import VideoDeviceSelect from './VideoDeviceSelect.js';
import { useHistory } from 'react-router-dom';
import io from "socket.io-client"
import InputMask from 'react-input-mask';

const socket = io.connect('https://vps-touchit.space/')

const UserInfo = (props) => {
  const history = useHistory();

  const [me, setMe] = useState("")
  const [userId, setUserId] = useState(null)
  const [name, setName] = useState("admin")
  const [phone, setPhone] = useState("+380000000000")

  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [isAllowUsingDevices, setIsAllowUsingDevices] = useState(false);
  const [isPoliceAgree, setIsPoliceAgree] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const [stream, setStream] = useState("")


  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let consultant = localStorage.getItem('consultant');

    if (id !== null) {
      if (consultant === null) {
        history.push({
          pathname: '/login',
          id
        });
      }
    }


  }, [])

  useEffect(() => {

    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    setUserId(id);

    const platform = navigator.platform.toLowerCase();
    const iosPlatforms = ['iphone', 'ipad', 'ipod', 'ipod touch'];

    // Checking if device is IOS 
    if (iosPlatforms.includes(platform)) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then( async (stream) => {
          await setStream(stream)
          setIsAllowUsingDevices(true);
        } )
        .catch((err) => {
          setIsAllowUsingDevices(false);
        })

    } else {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true, audio: true }, async function (stream) {
          await setStream(stream)
          setIsAllowUsingDevices(true);
        }, function (err) {
          setIsAllowUsingDevices(false);
        })

      }
    }

    socket.on("me", (id) => {
      setMe(id);
    })
  }, [])

  useEffect(() => {
  }, [isAllowUsingDevices])


  const onButtonClick = async () => {
    let user = { name, phone, me }

    if (userId !== null) {
      user.id = userId;
    } else {
      localStorage.setItem('user', JSON.stringify({ name, phone }));
    }

    if (name === "" && userId == null) setIsValid(false);
    else if (phone === "" && userId == null) setIsValid(false);
    // else if ( selectedAudioDevice === null ) alert('Выберите аудио-устройство!');
    // else if ( selectedVideoDevice === null ) alert('Выберите видео-устройство!');
    else if (!isPoliceAgree && userId === null) setIsValid(false);
    else {


      history.push({
        pathname: '/chat',
        socket,
        selectedAudioDevice,
        selectedVideoDevice,
        user
      });
    }
  }

  const checkBoxHandleChange = (event) => {
    setIsPoliceAgree(event.target.checked);
  };


  return (
    <>
      <main className="main-cnt w-100">
        <div className="blck-cnt">

          <div id="step_0" className="blck-cnt_step-0 w-100 f-c-s-s">
            <h2 className="w-100">Вітаємо Вас!</h2>

            <form id="form_user" action="" className="w-100 f-c-s-s">

              {!userId ?
                (
                  <>
                    <div className={!isValid && name === "" ? "input w-100 error" : "input w-100"}>
                      <label className="w-100 f-r-str-s">
                        <div className="input_svg f-r-c-c">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 0C4.25534 0 2.83594 1.4194 2.83594 3.16406C2.83594 4.90873 4.25534 6.32812 6 6.32812C7.74466 6.32812 9.16406 4.90873 9.16406 3.16406C9.16406 1.4194 7.74466 0 6 0Z" fill="white"></path>
                            <path d="M9.9367 8.3952C9.07045 7.51563 7.92209 7.03125 6.70312 7.03125H5.29688C4.07794 7.03125 2.92955 7.51563 2.0633 8.3952C1.20129 9.27045 0.726562 10.4258 0.726562 11.6484C0.726562 11.8426 0.883969 12 1.07812 12H10.9219C11.116 12 11.2734 11.8426 11.2734 11.6484C11.2734 10.4258 10.7987 9.27045 9.9367 8.3952Z" fill="white"></path>
                          </svg>
                        </div>

                        <input
                          type="text"
                          placeholder="Ваше ім’я"
                          id="user_name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className={!isValid && phone === "" ? "input w-100 error" : "input w-100"}>
                      <label className="w-100 f-r-str-s">
                        <div className="input_svg f-r-c-c">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6734 8.80679L9.99876 7.13215C9.40068 6.53407 8.38393 6.77333 8.1447 7.55081C7.96527 8.08911 7.36719 8.38815 6.82891 8.26851C5.63275 7.96947 4.01792 6.41445 3.71888 5.15848C3.53945 4.62018 3.8983 4.02209 4.43658 3.84269C5.21409 3.60346 5.45332 2.58671 4.85524 1.98863L3.1806 0.313994C2.70213 -0.104665 1.98443 -0.104665 1.56577 0.313994L0.429413 1.45035C-0.706947 2.64652 0.54903 5.81637 3.36003 8.62737C6.17102 11.4384 9.34087 12.7542 10.537 11.558L11.6734 10.4216C12.0921 9.94315 12.0921 9.22545 11.6734 8.80679Z" fill="white"></path>
                          </svg>
                        </div>

                        <InputMask
                          {...props}
                          mask="+38 (099) 999 - 99 - 99"
                          placeholder="Ваш номер телефону"
                          id="user_phone"
                          className="js-mask-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />

                      </label>
                    </div>
                  </>
                )
                :
                null
              }

              <AudioDeviceSelect isAllowUsingDevices={isAllowUsingDevices} setSelectedAudioDevice={setSelectedAudioDevice} />
              <VideoDeviceSelect isAllowUsingDevices={isAllowUsingDevices} setSelectedVideoDevice={setSelectedVideoDevice} />

              {!userId ?
                (
                  <div className="input_rule w-100 f-r-c-s">
                    <label className="f-r-s-s">
                      <input id="rule" type="checkbox" name="rule" checked={isPoliceAgree} onChange={checkBoxHandleChange} />

                      <div className="stl-check f-r-c-c">
                        <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0)">
                            <path d="M3.88283 1.22804L1.77266 3.33806C1.6164 3.49435 1.36292 3.49435 1.20652 3.33806L0.117232 2.2487C-0.0390876 2.09241 -0.0390876 1.8389 0.117232 1.68258C0.273581 1.52623 0.527041 1.52623 0.683321 1.68252L1.48967 2.48889L3.31665 0.661895C3.473 0.505546 3.72648 0.505664 3.88277 0.661895C4.03906 0.818215 4.03906 1.07164 3.88283 1.22804Z" fill="white"></path>
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <rect width="4" height="4" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>

                      </div>
                      <p>Даю згоду на запис консультації та згоден з &nbsp; <a href="#">умовами</a> <a href="#">використання</a> <a href="#">сервiсу</a></p>

                    </label>
                  </div>
                )
                :
                null
              }

              {
                selectedAudioDevice !== null ?
                  (
                    <div className="sbmt w-100" onClick={onButtonClick}>
                      <label className="f-r-c-c" >
                        {/* <input type="submit" /> */}
                        <p >З'єднати</p>
                      </label>
                    </div>
                  )
                  :
                  null
              }


            </form>
          </div>

        </div>
      </main>
    </>
  );
}

export default UserInfo;