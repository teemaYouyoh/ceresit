import React, { useEffect, useRef, useState } from "react"
import $ from "jquery"
import Peer from "simple-peer"
import { useHistory, Redirect } from 'react-router-dom';

import { BodyPixReactView } from 'body-pix-react-render';
import 'body-pix-react-render/dist/index.css';

import ChangeBackgroundModal from './VideoChatComponents/ChangeBackgroundModal';
import WaitingConsultant from './VideoChatComponents/WaitingConsultant.js';
import HeaderButtons from './VideoChatComponents/HeaderButtons';
import VideoControllButtons from './VideoChatComponents/VideoControllButtons';

function VideoChat(props) {
  const history = useHistory();

  if ((props.location.user === undefined || props.location.socket === undefined)) {
    window.location.href = "/";
  }

  $("#login_button").hide();
  const [socket, setSocket] = useState(props.location.socket)
  const [me, setMe] = useState(props.location.user.me)
  const [name, setName] = useState(props.location.user.name)
  const [phone, setPhone] = useState(props.location.user.phone)
  const [userId, setUserId] = useState(props.location.user.id)
  const [stream, setStream] = useState("")
  const [blurredStream, setBlurredStream] = useState("")
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [peer, setPeer] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [isWaiting, setIsWaiting] = useState(true)
  const [timer, setTimer] = useState(100);
  const [recorder, setRecorder] = useState(null);
  const [isMessageSended, setIsMessageSended] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [consultant, setConsultant] = useState(null);
  const [volume, setVolume] = useState(100);
  const [isMutedMicro, setIsMutedMicro] = useState(false);
  const [isMutedVideo, setIsMutedVideo] = useState(false);
  const [isReverseVideo, setIsReverseVideo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(false);
  const [virtualBackgroud, setVirtualBackgroud] = useState("none");
  const timerId = useRef(null);
  const myVideo = useRef()
  const userVideo = useRef()
  const userVideoBg = useRef()
  const connectionRef = useRef()

  const options = {
    //your custom options
    flipHorizontal: false,
    showFps: false,
    mediaOptions: {
      audio: false
    },
    segmentation: {
      segmentationThreshold: 0.7,
      effect: 'bokeh',
      backgroundBlurAmount: 5,
      maskBlurAmount: 5,
      edgeBlurAmount: 9
    },
  }

  useEffect(() => {

    window.addEventListener("beforeunload", async (ev) => {
      ev.preventDefault();
      socket.emit("disconnection", { to: caller })
      connectionRef.current.destroy()
    });

    if (userId === undefined) {
      if (socket.id !== undefined) {
        timerId.current = window.setInterval(() => {
          setTimer((time) => time - 1)
        }, 1000)
        return () => clear();
      }
    } else {
      getUserMedia();
    }

    const localConsultant = JSON.parse(localStorage.getItem('consultant'));

    if (localConsultant !== null && userId !== null) {
      setConsultant(localConsultant);
    }

  }, [])

  useEffect(() => {

    if (timer === 0) {

      clear();
      window.location.href = "/";
    }

  }, [timer])

  useEffect(async () => {
    await sokectOnCall();
  }, [])

  useEffect(() => {
    checkCall(stream);
  }, [stream])

  useEffect(() => {
    if (myVideo.current !== null && myVideo.current !== undefined) {
      myVideo.current.srcObject = stream;
    }

    if (callAccepted) {
      $(".only_video_block").each(function () {
        $(this).show();
      })
    }
  }, [callAccepted])

  useEffect(() => {
    socket.on("disconRes", async () => {

      $(".only_video_block").each(function () {
        $(this).hide();
      })

      // if consultant leave call
      if (userId !== undefined) {
        saveCall();

        // if user leave call
      } else {
        connectionRef.current.destroy()

        history.push({
          pathname: "/rating",
          consultant: consultant,
        })
      }
    })

    socket.on("changeBackground", (data) => {
      setCallerSignal(data.signal)


      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      })
      peer.on("signal", (data) => {
        socket.emit("answerBackgroundChange", { signal: data, to: caller })
      })
      peer.on("stream", (stream) => {
        console.log("bgStream", stream);
        console.log("userVideoBg", userVideoBg);

        if (userVideo.current !== undefined) {
          let video = document.getElementById("main_video");

          if (video !== null) {
            video.srcObject = stream;
            video.play();
          }

          // userVideo.current.srcObject = stream
          console.log(userVideo);
        }

      })

      peer.signal(data.signal)
      connectionRef.current = peer

      // changeBackground(data)
      // setVirtualBackgroudStream(data);
    })
  }, [startTime])

  useEffect(() => {
    $("#small_video, #main_video").toggleClass("main_video");
    $("#small_video, #main_video").toggleClass("small_video");
  }, [isReverseVideo])


  const getUserMedia = async () => {
    await navigator.mediaDevices.getUserMedia({ video: { deviceId: props.location.selectedVideoDevice }, audio: { deviceId: props.location.selectedAudioDevice } }).then(async (stream_res) => {
      await setStream(stream_res)
      let recorder = new MediaRecorder(stream_res);
      setRecorder(recorder);
    })
  }

  const sendLinkToConsultant = async (id) => {
    fetch('https://fourth.touchit.space/', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      let data = await res.json();
      let consultant = data;

      if (consultant !== null) {
        setConsultant(consultant);

        // let message = `http://localhost:3000/?id=${id}`;
        let href = `${window.location.origin}/?id=${id}`;
        let message = `<b>Консультант:</b> ${consultant.nick} %0A%0AПолзователь: ${name} %0AТелефон: ${phone} %0A%0A<a href="${href}">${href}</a>`;

        let url = `https://api.telegram.org/bot1752464306:AAGL94oQ4TE3WnKPQnNQHQyR2acdsd8CSTg/sendMessage?chat_id=-1001286130652&parse_mode=html&text=${message}`;

        fetch(`https://api.telegram.org/bot1752464306:AAGL94oQ4TE3WnKPQnNQHQyR2acdsd8CSTg/sendMessage?chat_id=-1001286130652&parse_mode=html&text=${message}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          if (!response.ok) {
            alert('Произошла ошибка! Попробуйте ещё раз.');
            history.push({
              pathname: "/"
            })
          }
        })

      } else {
        alert('В данный момент нет свободных консультантов. Попробуйте позже.');
        history.push({
          pathname: "/"
        })
      }
    })
  }

  const setConsultantAvailable = () => {
    fetch('https://fourth.touchit.space/set_consultant_available.php', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "consultant_id": consultant.id
      })
    }).then(async (res) => {
      let data = await res.text();
    })
  }

  const setConsultantUnavailable = (id) => {
    fetch('https://fourth.touchit.space/set_consultant_unavailable.php', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "consultant_id": consultant.id
      })
    }).then(async (res) => {
      let data = await res.text();
    })
  }

  const clear = () => {
    window.clearInterval(timerId.current)
  }



  const checkCall = (stream) => {
    if (props.location.user.id) {
      if (stream !== undefined) {
        callUser(props.location.user.id);
      }
    } else if (socket.id !== undefined && !isMessageSended) {
      sendLinkToConsultant(socket.id);
      setIsMessageSended(true);
    }
  }

  const sokectOnCall = () => {
    socket.on("callUser", async (data) => {
      await setReceivingCall(true)
      setCaller(data.from)
      await setCallerSignal(data.signal)

      await getUserMedia();
      setIsWaiting(false);
      clear();
    })
  }

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      })
    })
    peer.on("stream", (stream) => {
      console.log("call", stream);
      console.log("callStream", stream);
      userVideo.current.srcObject = stream
    })
    socket.on("callAccepted", (data) => {
      setCallAccepted(true)
      peer.signal(data.signal)

      const today = new Date();

      setStartTime(today);
      setName(data.user.name);
      setPhone(data.user.phone);
    })

    setPeer(peer);

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller, user: { name: name, phone: phone } })
    })
    peer.on("stream", (stream) => {
      console.log("answer", stream);
      if (userVideo.current !== undefined) {
        userVideo.current.srcObject = stream
      }
    })

    peer.signal(callerSignal)
    connectionRef.current = peer

    setPeer(peer);

    setConsultantUnavailable();
  }

  const leaveCall = async () => {
    setCallEnded(true)
    await setConsultantAvailable();

    $(".only_video_block").each(function () {
      $(this).hide();
    })

    // if consultant leave call
    if (userId !== undefined) {
      socket.emit("disconnection", { to: userId })
      saveCall();

      // if user leave call
    } else {
      socket.emit("disconnection", { to: caller })
      connectionRef.current.destroy()

      history.push({
        pathname: "/rating",
        consultant,
      })
    }
  }

  const saveCall = () => {
    const endTime = new Date();
    let delta = Math.abs(endTime - startTime) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = Math.floor(delta % 60);

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    const time = `${hours}:${minutes}:${seconds}`;

    if (startTime !== null && name !== "" && phone !== "") {

      fetch('https://fourth.touchit.space/add_call.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'consultant_id': consultant.id,
          'consultant_nick': consultant.nick,
          'user_id': userId,
          'user_name': name,
          'user_phone': phone,
          'time_start': startTime.toString(),
          'duration': time
        })
      }).then(() => {
        connectionRef.current.destroy()

        history.push({
          pathname: "/profile"
        })
      })
    }
  }

  const muteMicro = () => {
    setIsMutedMicro(!isMutedMicro);
    recorder.stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    })
  }

  const muteVideo = () => {
    setIsMutedVideo(!isMutedVideo);
    recorder.stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    })
  }

  const launchFullScreen = (element) => {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  const onFullSceen = () => {
    launchFullScreen(document.getElementById('main_video'));
  }


  const showVolumeChanger = () => {
    if (document.body.classList.contains('show_volume') === false) {
      document.body.classList.add('show_volume');
    } else {
      document.body.classList.remove('show_volume');
    }
  }

  const changeVolume = (value) => {
    setVolume(value);
    $("#main_video").prop("volume", value / 100);
  }


  // Вывод обработанного видео с BG
  const setVirtualBackgroudStream = (value) => {
    let video;

    if (userId !== undefined) {
      video = document.getElementById("small_video");
    } else {
      video = document.getElementById("main_video");
    }

    if (video !== null) {
      video.srcObject = value;
      video.play();
    }
  }

  // Отправка видео с новым BG пользователю через сокет 
  const socketEmitChangeBackground = (stream) => {

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })

    peer.on("signal", (data) => {
      console.log("signal", stream);
      socket.emit("changeBackground", {
        userToCall: userId,
        signalData: data,
        from: me,
        name: name
      })
    })
    peer.on("stream", (stream) => {
      console.log("stream", stream);
      userVideo.current.srcObject = stream
    })
    socket.on("backgroundChangeAccepted", (data) => {
      peer.signal(data.signal)
    })

    connectionRef.current = peer
  }

  // Функция, которая подвязывается к модулю смены BG 
  const onEvent = (event) => {
    setBlurredStream(event.stream);

    if (event.event === "READY") {
      setVirtualBackgroudStream(event.stream);
      socketEmitChangeBackground(event.stream);

    }
  }

  // Смена BG
  const changeVirtualBackground = () => {
    if (virtualBackgroud === "none") {
      setVirtualBackgroudStream(stream);
      // socketEmitChangeBackground(stream);

    } else if (virtualBackgroud === "blur") {
      if (start) {
        setVirtualBackgroudStream(blurredStream);
        socketEmitChangeBackground(blurredStream);

      }
      setStart(true);
    }

    onChangeBgClick();
  }

  // Открытие\закрытие модального окна со сменой BG
  const onChangeBgClick = () => {
    if (document.body.classList.contains('active_dublicate') === false) {
      document.getElementById('modal__bg').style.display = 'flex';
      document.body.classList.add('active_dublicate');
    } else {
      document.getElementById('modal__bg').style.display = 'none';
      document.body.classList.remove('active_dublicate');
    }
  }


  return (
    <>

      <ChangeBackgroundModal
        setVirtualBackgroud={setVirtualBackgroud}
        changeVirtualBackground={changeVirtualBackground}
        onChangeBgClick={onChangeBgClick}
        ChangeBackgroundModal={ChangeBackgroundModal}
      />

      {
        !callAccepted ?
          (
            <WaitingConsultant
              timer={timer}
              userId={userId}
              isWaiting={isWaiting}
              answerCall={answerCall}
            />
          )
          :
          <>
            <HeaderButtons
              isMutedMicro={isMutedMicro}
              isMutedVideo={isMutedVideo}
              isReverseVideo={isReverseVideo}
              muteVideo={muteVideo}
              muteMicro={muteMicro}
              onFullSceen={onFullSceen}
              setIsReverseVideo={setIsReverseVideo}
              leaveCall={leaveCall}
            />

            <div className="step_video w-100 f-r-str-sb">

              <VideoControllButtons
                consultant={consultant}
                volume={volume}
                showVolumeChanger={showVolumeChanger}
                changeVolume={changeVolume}
              />

              {userId !== undefined ?
                (
                  <div id="btn_change-bg" onClick={onChangeBgClick}>
                    <button>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.67832 0L-3.33334 7.01167V4.655L1.32166 0H3.67832Z" fill="white" />
                        <path d="M15.345 0L12.905 2.44C12.374 2.13452 11.798 1.91513 11.1983 1.79L12.9883 0H15.345Z"
                          fill="white" />
                        <path
                          d="M13.5333 5.28833C13.1268 4.63669 12.5475 4.11055 11.8599 3.76836C11.1723 3.42618 10.4033 3.28136 9.63831 3.35C8.73352 3.42848 7.87916 3.80042 7.20525 4.40921C6.53134 5.01801 6.07479 5.83032 5.90509 6.7225C5.73539 7.61468 5.86183 8.53788 6.26517 9.35158C6.66851 10.1653 7.32666 10.8249 8.13945 11.2301C8.95224 11.6353 9.87515 11.7638 10.7677 11.5961C11.6603 11.4284 12.4736 10.9737 13.0839 10.3012C13.6942 9.62862 14.0681 8.7751 14.1486 7.8705C14.2291 6.96589 14.0119 6.05975 13.53 5.28999L13.5333 5.28833Z"
                          fill="white" />
                        <path
                          d="M14.7333 4.08833C15.0733 4.56 15.345 5.08333 15.5333 5.64667L21.1583 0.0216667C21.0506 0.00746651 20.942 0.00022925 20.8333 0H18.8216L14.7333 4.08833Z"
                          fill="white" />
                        <path
                          d="M5.83331 13.3334C5.17041 13.3338 4.53478 13.5974 4.06603 14.0661C3.59729 14.5348 3.33375 15.1705 3.33331 15.8334V20H16.6666V15.8334C16.6671 15.5049 16.6027 15.1797 16.4772 14.8761C16.3518 14.5726 16.1676 14.2969 15.9354 14.0646C15.7032 13.8324 15.4274 13.6483 15.1239 13.5228C14.8204 13.3973 14.4951 13.3329 14.1666 13.3334H5.83331Z"
                          fill="white" />
                        <path
                          d="M14.1667 11.6667C14.5283 11.6667 14.8783 11.7134 15.2133 11.8L23.3333 3.67669V2.50002C23.3333 2.15169 23.2617 1.82169 23.1333 1.52002L15.6333 9.02169C15.362 10.0259 14.8268 10.9391 14.0833 11.6667H14.1667Z"
                          fill="white" />
                        <path
                          d="M17.3466 13.1416C17.7216 13.5832 18.005 14.1032 18.17 14.6749L23.3333 9.51157V7.15491L17.3466 13.1416Z"
                          fill="white" />
                        <path d="M18.3333 19.9999V17.9883L23.3333 12.9883V15.3449L18.6783 19.9999H18.3333Z" fill="white" />
                        <path
                          d="M1.66664 19.5116V17.1549L-1.15836 19.9799C-1.05169 19.9932 -0.941689 19.9999 -0.833356 19.9999H1.17831L1.66664 19.5116Z"
                          fill="white" />
                        <path
                          d="M4.28999 8.69836C4.41666 9.3067 4.63999 9.8817 4.93999 10.405L-3.13334 18.48C-3.26556 18.1702 -3.3336 17.8369 -3.33334 17.5V16.3217L4.28999 8.69836Z"
                          fill="white" />
                        <path d="M9.51166 0L-3.33334 12.845V10.4883L7.15499 0H9.51166Z" fill="white" />
                      </svg>
                    </button>
                  </div>
                )
                :
                null
              }

              {/* Тестовое видео */}
              <video style={{ "display": "none" }} className={"triple-slide__carousel-item video_slider main_video"} ref={userVideoBg} playsInline autoPlay />

              {/* Видео собеседника */}
              <video id="main_video" className={"triple-slide__carousel-item video_slider main_video"} ref={userVideo} playsInline autoPlay />

              {/* Моё видео */}
              {stream && <video id="small_video" className="triple-slide__carousel-item video_slider small_video" ref={myVideo} playsInline autoPlay muted />}

              {/* <video className="triple-slide__carousel-item video_slider main_video" ref={userVideoBg} playsInline autoPlay muted /> */}

              {/* Модуль, который захватывает видео при включении размытия, обрабатывает и прокидывет готовое видео через onEvent */}
              <BodyPixReactView options={options} visible={visible} start={start} onEvent={onEvent} style={{ "height": "0px" }} />


              <div className="video-right"></div>
            </div>
          </>
      }
    </>
  )
}

export default VideoChat