import React, { useEffect, useRef, useState } from "react"
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};


export default function RatingConsultation(props) {
  const history = useHistory();

  const [consultationRating, setConsultationRating] = useState(5)
  const [videoRating, setVideoRating] = useState(5)
  const [review, setReview] = useState("")
  const [consultant, setConsultant] = useState(props.location.consultant)
  const [user, setUser] = useState({});

  useEffect(() => {

    let localUser = localStorage.getItem("user");

    if ( localUser !== undefined ) {
      localUser = JSON.parse(localUser);

      setUser(localUser);
    }

    // setTimeout(function () {
    //   document.getElementById('modal__').style.display = 'flex';
    //   document.getElementById('modal__').style.opacity = '1';
    // }, 1000);
  }, [])

  const sendReview = () => {
    if (consultationRating === 0) alert('Оцените качество консультации');
    else if (videoRating === 0) alert('Оцените качество связи');
    else {
      let message = "";
      let consult = props.location.consultant;

      if (consult !== undefined && consult !== null) {
        message = `<b>Отзыв</b> %0A%0AКонсультант: ${consult.nick} %0AКачество консультации: ${consultationRating} %0AКачество связи: ${videoRating} %0AОтзыв: %0A${review}`;
      } else {
        message = `<b>Отзыв</b> %0A%0AКачество консультации: ${consultationRating} %0AКачество связи: ${videoRating} %0AОтзыв: %0A${review}`;
      }

      fetch(`https://api.telegram.org/bot1752464306:AAGL94oQ4TE3WnKPQnNQHQyR2acdsd8CSTg/sendMessage?chat_id=-1001286130652&parse_mode=html&text=${message}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        if (!response.ok) {
          window.location.href = "/";
        } else {
          // alert('Спасибо за отзыв!');

          window.location.href = "/";
        }
      })
    }

  }

  const modalOnSubmit = () => {
    let message = "";
    let consult = props.location.consultant;

    if (consult !== undefined && consult !== null) {
      message = `<b>Запрос на видеозапись</b> %0A%0AКонсультант: ${consult.nick} %0AИмя пользователя: ${user.name} %0AНомер телефона: ${user.phone}`;
    } else {
      message = `<b>Запрос на видеозапись</b> %0AИмя пользователя: ${user.name} %0AНомер телефона: ${user.phone}`;
    }

    fetch(`https://api.telegram.org/bot1752464306:AAGL94oQ4TE3WnKPQnNQHQyR2acdsd8CSTg/sendMessage?chat_id=-1001286130652&parse_mode=html&text=${message}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      modalOnCancel();
      if (!response.ok) {
        // window.location.href = "/";
      } else {
        // alert('Спасибо за отзыв!');

        // window.location.href = "/";
      }
    })
  }

  const modalOnCancel= () => {
    // document.getElementById('modal__').style.display = 'none';
    // document.getElementById('modal__').style.opacity = '0';
  }

  const skipReview = () => {
    window.location.href = "/";
  }

  return (
    <>
      {/* <div id="modal__" className="modal__ modal-style">
        <div className="modal-style-wr">
          <div className="modal-style-cnt">

            <div className="modal-content f-c-c-s">

              <div className="modal_header w-100 f-r-c-s">

                <div className="modal_header_img f-r-c-c">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M29.9106 11.2228L32.8274 7.47162L28.5283 3.1725L24.7771 6.08934C23.7812 5.51974 22.7265 5.08205 21.6295 4.78027L21.0405 0H14.9595L14.3704 4.78034C13.2735 5.08212 12.2188 5.51988 11.2228 6.08941L7.47162 3.17257L3.1725 7.47169L6.08934 11.2229C5.51974 12.2188 5.08205 13.2735 4.78027 14.3705L0 14.9595V21.0405L4.78034 21.6296C5.08212 22.7265 5.51988 23.7812 6.08941 24.7772L3.17257 28.5284L7.47169 32.8275L11.2229 29.9107C12.2188 30.4803 13.2735 30.918 14.3705 31.2197L14.9595 36H21.0405L21.6296 31.2197C22.7265 30.9179 23.7812 30.4801 24.7772 29.9106L28.5284 32.8274L32.8275 28.5283L29.9107 24.7771C30.4803 23.7812 30.918 22.7265 31.2197 21.6295L36 21.0405V14.9595L31.2197 14.3704C30.9179 13.2735 30.4801 12.2188 29.9106 11.2228ZM18 27.4922C12.7657 27.4922 8.50781 23.2343 8.50781 18C8.50781 12.7657 12.7657 8.50781 18 8.50781C23.2343 8.50781 27.4922 12.7657 27.4922 18C27.4922 23.2343 23.2343 27.4922 18 27.4922Z"
                      fill="white" />
                    <path
                      d="M20.0569 14.8359C19.1742 14.8359 18.4965 15.1542 18.0001 15.5765C17.5036 15.1542 16.8259 14.8359 15.9432 14.8359C14.1985 14.8359 12.8317 16.1069 12.8317 17.7301C12.8317 19.4482 14.2983 20.4688 16.3274 21.8809L18.0001 23.0633L19.6727 21.881C21.7017 20.4689 23.1684 19.4482 23.1684 17.7302C23.1684 16.1069 21.8016 14.8359 20.0569 14.8359Z"
                      fill="white" />
                  </svg>
                </div>

                <h4>Бажаєте отримати запис консультації?</h4>
              </div>

              <form id="get-only-video" className="w-100">
                <div className="sbmt w-100 sbmt_recall" onClick={modalOnSubmit}>
                  <label className="f-r-c-c">
                    <p>Так, давайте</p>
                  </label>
                </div>

              </form>

              <div className="btn-grey w-100">
                <button id="disagree_save_video" className="w-100" onClick={modalOnCancel}>
                  Не потрібно, я все запам’ятав
                </button>
              </div>

            </div>
          </div>
        </div>
      </div> */}


      <main className="main-cnt w-100">
        <div className="blck-cnt">

          <div id="step_last" className="step_last f-c-s-s">
            <h2 className="w-100">Оцініть, сервіс</h2>

            <div className="ret-star w-100">
              <form id="form_send_recall">
                <div className="ttl_for_rating w-100 f-r-c-c">
                  <p>Якість консультації</p>
                </div>
                <div className="rating_f">
                  <span className="star-cb-group w-100">
                    <input type="radio" id="rating-4" name="rating" value="4" checked="checked" onChange={(e) => { return e.target.checked ? setConsultationRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating-4">4</label>
                    <input type="radio" id="rating-3" name="rating" value="3" onChange={(e) => { return e.target.checked ? setConsultationRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating-3">3</label>
                    <input type="radio" id="rating-2" name="rating" value="2" onChange={(e) => { return e.target.checked ? setConsultationRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating-2">2</label>
                    <input type="radio" id="rating-1" name="rating" value="1" onChange={(e) => { return e.target.checked ? setConsultationRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating-1">1</label>
                    <input type="radio" id="rating-0" name="rating" value="0" className="star-cb-clear" onChange={(e) => { return e.target.checked ? setConsultationRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating-0">0</label>
                  </span>
                </div>

                <div className="ttl_for_rating w-100 f-r-c-c">
                  <p>Якість відео</p>
                </div>

                <div className="rating_f">
                  <span className="star-cb-group w-100">
                    <input type="radio" id="rating_video-4" name="rating_video" value="4"
                      checked="checked" onChange={(e) => { return e.target.checked ? setVideoRating(+e.target.value + 1) : null; }} />
                    <label htmlFor="rating_video-4">4</label>
                    <input type="radio" id="rating_video-3" name="rating_video" value="3" onChange={(e) => { return e.target.checked ? setVideoRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating_video-3">3</label>
                    <input type="radio" id="rating_video-2" name="rating_video" value="2" onChange={(e) => { return e.target.checked ? setVideoRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating_video-2">2</label>
                    <input type="radio" id="rating_video-1" name="rating_video" value="1" onChange={(e) => { return e.target.checked ? setVideoRating(+e.target.value + 1) : null; }} /><label
                      htmlFor="rating_video-1">1</label>
                    <input type="radio" id="rating_video-0" name="rating_video" value="0"
                      className="star-cb-clear" onChange={(e) => { return e.target.checked ? setVideoRating(+e.target.value + 1) : null; }} /><label htmlFor="rating_video-0">0</label>
                  </span>
                </div>

                <div className="rat_textarea w-100">
                  <textarea 
                  name="write"
                  id="recall_textarea"
                  placeholder="Бажаєте щось добавити?"
                  onChange={(e) => { setReview(e.target.value) }}></textarea>
                </div>

                <div className="sbmt w-100 sbmt_recall" onClick={sendReview}>
                  <label className="f-r-c-c">
                    <p>Оцінити</p>
                  </label>
                </div>


              </form>

              <div className="btn-grey w-100" onClick={skipReview}>
                <button className="w-100">
                  Пропустити
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  );
}