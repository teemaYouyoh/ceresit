import React from 'react';

const ChangeBackgroundModal = (props) => {
  return (
    <>
      <div id="modal__bg" className="modal__ chat modal-style modal__bg">
        <div className="modal-style-wr">
          <div className="modal-style-cnt">

            <div className="modal-content f-c-c-s">

              <div className="modal_header w-100 f-r-c-s">

                <div className="modal_header_img f-r-c-c">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.39091 0L-2.16667 4.55758V3.02575L0.859078 0H2.39091Z" fill="white" />
                    <path
                      d="M9.97423 0L8.38823 1.586C8.0431 1.38744 7.66868 1.24483 7.2789 1.1635L8.4424 0H9.97423Z"
                      fill="white" />
                    <path
                      d="M8.79665 3.43741C8.5324 3.01384 8.15589 2.67185 7.70894 2.44943C7.262 2.22701 6.76213 2.13287 6.2649 2.17749C5.67679 2.2285 5.12145 2.47027 4.68341 2.86598C4.24537 3.2617 3.94861 3.7897 3.83831 4.36962C3.728 4.94954 3.81019 5.54962 4.07236 6.07852C4.33454 6.60742 4.76233 7.03619 5.29064 7.29955C5.81896 7.56291 6.41885 7.64645 6.99901 7.53746C7.57918 7.42846 8.10785 7.13289 8.50455 6.69574C8.90125 6.2586 9.14427 5.70381 9.19661 5.11582C9.24895 4.52782 9.10774 3.93883 8.79448 3.43849L8.79665 3.43741Z"
                      fill="white" />
                    <path
                      d="M9.57666 2.65742C9.79766 2.964 9.97424 3.30417 10.0967 3.67033L13.7529 0.0140833C13.6829 0.00485323 13.6123 0.000149013 13.5417 0H12.2341L9.57666 2.65742Z"
                      fill="white" />
                    <path
                      d="M3.79166 8.66669C3.36077 8.66698 2.94761 8.83827 2.64292 9.14296C2.33824 9.44764 2.16694 9.8608 2.16666 10.2917V13H10.8333V10.2917C10.8336 10.0782 10.7918 9.86677 10.7102 9.66949C10.6286 9.47221 10.509 9.29296 10.358 9.142C10.2071 8.99105 10.0278 8.87137 9.83052 8.7898C9.63324 8.70824 9.4218 8.6664 9.20832 8.66669H3.79166Z"
                      fill="white" />
                    <path
                      d="M9.20834 7.58331C9.44343 7.58331 9.67093 7.61364 9.88868 7.66998L15.1667 2.38981V1.62498C15.1667 1.39856 15.1201 1.18406 15.0367 0.987976L10.1617 5.86406C9.98528 6.51678 9.63741 7.1104 9.15417 7.58331H9.20834Z"
                      fill="white" />
                    <path
                      d="M11.2753 8.54203C11.5191 8.82911 11.7032 9.16711 11.8105 9.5387L15.1666 6.18253V4.6507L11.2753 8.54203Z"
                      fill="white" />
                    <path d="M11.9167 13V11.6924L15.1667 8.44238V9.97422L12.1409 13H11.9167Z"
                      fill="white" />
                    <path
                      d="M1.08332 12.6825V11.1507L-0.75293 12.9869C-0.683596 12.9956 -0.612096 12.9999 -0.54168 12.9999H0.765903L1.08332 12.6825Z"
                      fill="white" />
                    <path
                      d="M2.7885 5.65393C2.87083 6.04935 3.016 6.4231 3.211 6.76326L-2.03667 12.012C-2.12261 11.8106 -2.16684 11.594 -2.16667 11.375V10.6091L2.7885 5.65393Z"
                      fill="white" />
                    <path d="M6.18258 0L-2.16667 8.34925V6.81742L4.65074 0H6.18258Z" fill="white" />
                  </svg>
                </div>

                <h4>зміна фону</h4>
              </div>


              <div className="view_bg f-c-s-s w-100">

                <div className="user-bgs_title">
                  <p>Віртуальні фони:</p>
                </div>

                <div className="user-bgs_all f-r-str-sb w-100">

                  <div className="user-bg_itm" onClick={() => { props.setVirtualBackgroud("none") }}>
                    <label className="w-100 f-r-s-c">
                      <input className="this_user-bg" type="radio" name="user_bg"
                        data-user-bg="images/bg-1.png" />
                      <div className="user-bg_itm_img w-100 f-r-s-c">
                        <img src="images/bg-1.png" alt="bg" />
                      </div>
                    </label>
                  </div>

                  <div className="user-bg_itm" onClick={() => { props.setVirtualBackgroud("blur") }}>
                    <label className="w-100 f-r-s-c">
                      <input className="this_user-bg" type="radio" name="user_bg"
                        data-user-bg="images/bg-2.png" />
                      <div className="user-bg_itm_img w-100 f-r-s-c">
                        <img src="images/bg-2.png" alt="bg" />
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              <div className="sbmt w-100 sbmt_recall">
                <button id="agree_change_bg" className="w-100" onClick={() => { props.changeVirtualBackground() }}>Зберегти зміни</button>
              </div>


              <div className="btn-grey w-100">
                <button id="disagree_change_bg" className="w-100" onClick={() => { props.onChangeBgClick() }}>
                  Відміна
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeBackgroundModal;