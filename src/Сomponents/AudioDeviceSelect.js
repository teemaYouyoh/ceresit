import React, { useEffect, useRef, useState } from "react"
import Select from 'react-select'

const AudioDeviceSelect = (props) => {

  const [availableDevices, setAvailableDevices] = useState([]);

  const colourStyles = {
    control: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        marginTop: "-13px",
        backgroundColor: 'transparent',
        paddingTop: "9px",
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
  }, [availableDevices])


  useEffect(() => {

    navigator.mediaDevices.enumerateDevices().then(devices => {
      let options = [];

      devices.forEach((device) => {
        if (device.kind == 'audioinput') {
          options.push({ value: device.deviceId, label: device.label });
        }
      })

      if (options[0].id !== "") {
        setAvailableDevices(options);
        props.setSelectedAudioDevice(options[0].value);
      }
    }).catch(err => console.log("err", err));

  }, [props.isAllowUsingDevices])


  const handleMenuItemClick = (value) => {
    props.setSelectedAudioDevice(value);
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
                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.5 9.81818C6.08155 9.81818 7.36364 8.5361 7.36364 6.95455V2.86364C7.36364 1.28208 6.08155 0 4.5 0C2.91845 0 1.63636 1.28208 1.63636 2.86364V6.95455C1.63636 8.5361 2.91845 9.81818 4.5 9.81818ZM9 7.77273H8.18182C7.80955 9.41195 6.25172 10.6364 4.5 10.6364C2.74828 10.6364 1.19045 9.41195 0.818182 7.77273H0C0.361223 9.73595 2.07122 11.2541 4.09091 11.4361V12.2727H3.68182C3.456 12.2727 3.27273 12.456 3.27273 12.6818C3.27273 12.9076 3.456 13.0909 3.68182 13.0909H5.31818C5.544 13.0909 5.72727 12.9076 5.72727 12.6818C5.72727 12.456 5.544 12.2727 5.31818 12.2727H4.90909V11.4361C6.92876 11.2541 8.63878 9.73595 9 7.77273Z"
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

export default AudioDeviceSelect;