import React from 'react';

const VideoControllButtons = (props) => {
  return (
    <>
      <div className="video-left"></div>

      <div className="video_user f-r-c-c">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="#E74B38" />
        </svg>

        <p>Оператор: <span>{props.consultant.name}</span></p>
      </div>

      <div className="video_volume" onClick={props.showVolumeChanger}>
        <div className="video_volume_wr">
          <button className="f-r-c-c">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.347778 7.18814V12.2451C0.347778 12.9436 0.913525 13.5093 1.61202 13.5093H3.50839V5.9239H1.61202C0.913525 5.9239 0.347778 6.48965 0.347778 7.18814ZM16.1508 9.71666C16.1508 7.4897 14.4997 5.66477 12.3581 5.35566V6.6199C13.8006 6.91259 14.8866 8.18756 14.8866 9.71666C14.8866 11.2458 13.8006 12.5207 12.3581 12.8134V14.0776C14.4997 13.7685 16.1508 11.9436 16.1508 9.71666ZM9.19745 2.1312L4.7726 5.08068V14.352L9.19745 17.3021C9.89595 17.3021 10.4617 16.7357 10.4617 16.0378V3.39544C10.4617 2.69695 9.89595 2.1312 9.19745 2.1312ZM12.3581 0.875793V2.17417C16.0699 2.88909 18.6793 5.91631 18.6793 9.71602C18.6793 13.4948 16.1508 16.4221 12.3581 17.2578V18.5562C16.6413 17.9297 19.9435 14.2306 19.9435 9.71535C19.9435 5.20139 16.6413 1.50225 12.3581 0.875793Z"
                fill="white" />
            </svg>
          </button>

          <div className="change_voice">
            <input type="range" min="0" max="100" value={props.volume} onChange={(e) => { props.changeVolume(e.target.value) }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoControllButtons;