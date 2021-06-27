import React, { useEffect, useRef, useState } from "react"
import Select from 'react-select'


const VideoDeviceSelect = (props) => {

  const [availableDevices, setAvailableDevices] = useState([]);

  const colourStyles = {
    control: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        marginTop: "-13px",
        backgroundColor: 'transparent',
        paddingTop: "9px",
        backgroundColor: 'transparent',
        border: "none",
        borderColor: isFocused ? null : null,
        boxShadow: isFocused ? null : null,
        cursor: 'pointer',
        '&:hover': {
          borderColor: isFocused ? null : null,
          boxShadow: isFocused ? null : null,

        },
      }
    },
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected && isFocused
            ? "rgba(4, 2, 4, 0.6)"
            : isFocused
              ? "rgba(4, 2, 4, 0.6)"
              : null,
        color: isDisabled
          ? "black"
          : isSelected && isFocused
            ? "white"
            : isFocused
              ? "white"
              : "black",
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      };
    },
  };

  useEffect(() => {

    navigator.mediaDevices.enumerateDevices().then(devices => {
      let options = [];

      devices.forEach((device) => {
        if (device.kind == 'videoinput') {
          options.push({ "value": device.deviceId, "label": device.label });
        }
      })

      if (options[0] !== undefined) {
        setAvailableDevices(options);
        props.setSelectedVideoDevice(options[0].value);
      }

    }).catch(err => console.log("err", err));

  }, [props.isAllowUsingDevices])

  useEffect(() => {
  }, [availableDevices])

  const handleMenuItemClick = (value) => {
    props.setSelectedVideoDevice(value);
  };

  return (
    <>
      {
        availableDevices.length > 0 ?
          (
            <>
              <div className="input w-100">
                <label className="w-100 f-r-str-s">
                  <div className="input_svg f-r-c-c">
                    <svg width="15" height="13" viewBox="0 0 15 13" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14.0625 5.57143L11.25 7.42857C11.25 6.86492 10.9913 6.36629 10.5909 6.02549C11.5439 5.45675 12.1875 4.43207 12.1875 3.25C12.1875 1.45505 10.7184 0 8.90625 0C7.09407 0 5.625 1.45508 5.625 3.25C5.625 4.16046 6.00515 4.98132 6.61453 5.57143H4.89515C5.34422 5.07789 5.625 4.43114 5.625 3.71429C5.625 2.17565 4.36593 0.928571 2.8125 0.928571C1.25907 0.928571 0 2.17565 0 3.71429C0 4.55371 0.382966 5.29749 0.975931 5.80822C0.397034 6.1244 0 6.72749 0 7.42857V11.1429C0 12.1685 0.839534 13 1.875 13H9.375C10.4105 13 11.25 12.1685 11.25 11.1429L14.0625 13C14.5805 13 15 12.5845 15 12.0714V6.5C15 5.98697 14.5805 5.57143 14.0625 5.57143ZM2.8125 5.57143C1.77703 5.57143 0.9375 4.73989 0.9375 3.71429C0.9375 2.68868 1.77703 1.85714 2.8125 1.85714C3.84797 1.85714 4.6875 2.68868 4.6875 3.71429C4.6875 4.73989 3.84797 5.57143 2.8125 5.57143ZM8.90625 5.57653C7.60875 5.57653 6.55735 4.53466 6.55735 3.25C6.55735 1.96486 7.60924 0.923473 8.90625 0.923473C10.2033 0.923473 11.2551 1.96486 11.2551 3.25C11.2551 4.53514 10.2037 5.57653 8.90625 5.57653Z"
                        fill="white" />
                    </svg>
                  </div>

                  <div className="select2_container">

                    <Select
                      options={availableDevices}
                      defaultValue={availableDevices[0]}
                      onChange={(e) => { handleMenuItemClick(e.value) }}
                      styles={colourStyles}
                      isSearchable={false}
                    />

                  </div>
                </label>
              </div>
            </>
          )
          :
          null
      }
    </>
  );
}

export default VideoDeviceSelect;