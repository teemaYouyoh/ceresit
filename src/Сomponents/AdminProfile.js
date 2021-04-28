import React, { useEffect, useRef, useState } from "react"
import { useHistory } from 'react-router-dom';
import moment from "moment";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import md5 from 'md5';

import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

/*
 * MATERIAL UI TABS
 */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

/*
 * END MATERIAL UI TABS
 */

/*
 * MATERIAL UI TABLE
 */

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

/*
 * END MATERIAL UI TABLE
 */


/*
 * ADMIN PROFILE COMPONENT
 */

const AdminProfile = (props) => {
  const history = useHistory();

  const [newConsultantName, setNewConsultantName] = useState("")
  const [newConsultantTelegram, setNewConsultantTelegram] = useState("")
  const [newConsultantPassword, setNewConsultantPassword] = useState("")
  const [newConsultantConfirmPassword, setNewConsultantConfirmPassword] = useState("")

  const [admin, setAdmin] = useState(props.location.admin)
  const [registerConsultantNotification, setRegisterConsultantNotification] = useState("")
  const [updateConsultantNotification, setUpdateConsultantNotification] = useState("")
  const [callstNotification, setCallsNotification] = useState("")
  const [consultants, setConsultants] = useState([])
  const [calls, setCalls] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [isSort, setIsSort] = useState(false)

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadConsultants();
    getCalls();

    if (props.location.admin === undefined) {
      history.push({
        "pathname": "/login"
      })
    }
  }, [])

  useEffect(() => {
  }, [consultants])

  useEffect(() => {
  }, [calls])

  const getCalls = () => {
    fetch('https://fourth.touchit.space/get_calls.php', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      let data = await res.json();
      if (data !== null) {
        setCalls(data);
      } else {
        setCallsNotification("Произошла ошибка! Попробуйте позже.");
      }

    }).catch(() => {
      setCallsNotification("Произошла ошибка! Попробуйте позже.");
    })
  }
  const loadConsultants = () => {
    fetch('https://fourth.touchit.space/get_all_consultants.php', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      let data = await res.json();
      if (data !== null) {
        setConsultants(data);
      } else {
        setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
      }

    }).catch(() => {
      setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
    })
  }

  const convertDate = (value) => {
    let date = value;

    const days = Math.floor(date / 86400);
    date -= days * 86400;
    const hours = Math.floor(date / 3600) % 24;
    date -= hours * 3600;
    const minutes = Math.floor(date / 60) % 60;
    date -= minutes * 60;
    const seconds = Math.floor(date % 60);

    const time = `${hours}:${minutes}:${seconds}`;

    return time;
  }

  const changeInfo = async (index) => {
    setUpdateConsultantNotification("");


    let consultant = consultants[index];

    if (consultant.name === "") setUpdateConsultantNotification('Введите имя!');
    else if (consultant.nick === "") setUpdateConsultantNotification('Введите ник в телеграме!');
    else if (consultant.nick.indexOf('@') !== 0) setUpdateConsultantNotification('Введите корректный ник!');
    else if (consultant.newPassword !== "" && consultant.confirmPassword === "") setUpdateConsultantNotification('Подтвердите пароль!');
    else if (consultant.confirmPassword !== consultant.newPassword) setUpdateConsultantNotification('Пароли не совпадает!');
    else {
      let mb5pw = consultant.newPassword !== "" && consultant.newPassword !== undefined ? md5(consultant.newPassword) : consultant.password;
      let available = consultant.is_available ? "1" : "0"

      fetch('https://fourth.touchit.space/update_consultant.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: consultant.id,
          name: consultant.name,
          telegram: consultant.nick,
          password: mb5pw,
          isAvailable: available
        })
      }).then(async (res) => {
        let data = await res.json();
        if (data !== null) {
          setUpdateConsultantNotification("Данные успешно обновлены");
        } else {
          setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
        }
      }).catch((err) => {
        setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
      })
    }
  }

  const deleteConsultant = (index) => {
    fetch('https://fourth.touchit.space/delete_consultant.php', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: consultants[index].id,
      })
    }).then(async (res) => {
      let data = await res.text();
      if (data !== null) {
        setUpdateConsultantNotification("Консультант успешно удалён!");
        loadConsultants();
      } else {
        setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
      }

    }).catch(() => {
      setUpdateConsultantNotification("Произошла ошибка! Попробуйте позже.");
    })
  }

  const registerConsultant = async () => {

    if (newConsultantName === "") setRegisterConsultantNotification('Введите имя!');
    else if (newConsultantTelegram === "") setRegisterConsultantNotification('Введите ник в телеграме!');
    else if (newConsultantTelegram.indexOf('@') !== 0) setRegisterConsultantNotification('Введите корректный ник!');
    else if (newConsultantPassword === "") setRegisterConsultantNotification('Введите пароль!');
    else if (newConsultantConfirmPassword === "") setRegisterConsultantNotification('Подтвердите пароль!');
    else if (newConsultantConfirmPassword !== newConsultantPassword) setRegisterConsultantNotification('Пароль не совпадает!');
    else {

      let mb5pw = md5(newConsultantPassword);

      fetch('https://fourth.touchit.space/register_consultant.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newConsultantName,
          telegram: newConsultantTelegram,
          password: mb5pw
        })
      }).then(async (res) => {
        let resp = await res.text();
        setRegisterConsultantNotification(resp);
      }).catch(() => {
        setRegisterConsultantNotification("Произошла ошибка! Попробуйте зарегистрироваться позже.");
      })
    }

  }

  const sortByDate = () => {
    setIsSort(!isSort);

    
  }

  const setName = (data, index) => {
    let newConsultants = [...consultants];
    newConsultants[index].name = data;
    setConsultants(newConsultants);
  }
  const setTelegram = (data, index) => {
    let newConsultants = [...consultants];
    newConsultants[index].nick = data;
    setConsultants(newConsultants);
  }
  const setPassword = (data, index) => {
    let newConsultants = [...consultants];
    newConsultants[index].newPassword = data;
    setConsultants(newConsultants);
  }
  const setConfirmPassword = (data, index) => {
    let newConsultants = [...consultants];
    newConsultants[index].confirmPassword = data;
    setConsultants(newConsultants);
  }
  const setIsAvailable = (data, index) => {
    let newConsultants = [...consultants];
    newConsultants[index].is_available = data;
    setConsultants(newConsultants);
  }

  const renderConsultants = () => {
    if (consultants !== undefined) {
      return consultants.map((item, index) => {
        if (item.id !== "17") {
          return (
            <div className="consultant-card f-c-c-s" key={item.id}>
              <TextField
                label="Имя"
                value={item.name}
                style={{ "margin": "5px 0" }}
                onChange={(e) => { setName(e.target.value, index) }} />
              <TextField
                label="Телеграм"
                placeholder="@nickname"
                value={item.nick}
                style={{ "margin": "5px 0" }}
                onChange={(e) => { setTelegram(e.target.value, index) }} />
              <TextField
                label="Новый пароль"
                value={item.newPassword || ""}
                type="password"
                style={{ "margin": "5px 0" }}
                onChange={(e) => { setPassword(e.target.value, index) }} />
              <TextField
                label="Подтвердите пароль"
                value={item.confirmPassword || ""}
                type="password"
                style={{ "margin": "5px 0" }}
                onChange={(e) => { setConfirmPassword(e.target.value, index) }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.is_available == 1}
                    onChange={(e) => { setIsAvailable(e.target.checked, index) }}
                    name="available"
                    color="primary"
                  />
                }
                label="Доступен"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => { changeInfo(index) }}
                style={{ "margin": "5px 0" }}>
                Изменить
                </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => { deleteConsultant(index) }}
                style={{ "margin": "5px 0" }}>
                Удалить
                </Button>
            </div>
          )
        }
      })
    }
  }


  const renderCallsList = () => {
    return calls.sort(( a, b ) => {
      let date1 = new Date(a.time_start);
      let date2 = new Date(b.time_start);

      if ( isSort ) {
        if ( date1 > date2 ) return 1;
        if ( date1 < date2 ) return -1;
      } else {
        if ( date1 < date2 ) return 1;
        if ( date1 > date2 ) return -1;
      }

      return 0;

    }).map((row) => {
      if (searchValue === ""
        || row.consultant_nick.indexOf(searchValue) >= 0
        || row.user_name.indexOf(searchValue) >= 0
        || row.user_phone.replace(/[_()+ \-,]+/g, '').indexOf(searchValue.replace(/[_()+ \-,]+/g, '')) >= 0) {

        let startTime = new Date(row.time_start);
        let hours = startTime.getHours();
        let minutes = startTime.getMinutes();

        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;

        startTime = `${startTime.getDate()}/${startTime.getMonth() + 1}/${startTime.getFullYear()}  ${hours}:${minutes}`;

        return (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              {row.consultant_nick}
            </TableCell>
            <TableCell align="left">{row.user_name}</TableCell>
            <TableCell align="left">{row.user_phone}</TableCell>
            <TableCell align="left">{startTime}</TableCell>
            <TableCell align="left">{row.duration}</TableCell>
          </TableRow>
        )
      }

    })
  }

  return (
    <div className="w-100" style={{ "display": "flex", "flexDirection": "column" }}>

      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
            <Tab label="Добавить нового консультанта" {...a11yProps(0)} />
            <Tab label="Изменить данные консультанта" {...a11yProps(1)} />
            <Tab label="Список звонков" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <h3>{registerConsultantNotification}</h3>

          <div className="consultant-card f-c-c-s">
            <TextField
              label="Имя"
              value={newConsultantName}
              onChange={(e) => { setNewConsultantName(e.target.value) }} />
            <TextField
              label="Телеграм"
              placeholder="@nickname"
              value={newConsultantTelegram}
              onChange={(e) => { setNewConsultantTelegram(e.target.value) }} />
            <TextField
              label="Пароль"
              value={newConsultantPassword}
              type="password"
              onChange={(e) => { setNewConsultantPassword(e.target.value) }} />
            <TextField
              label="Подтвердите пароль"
              value={newConsultantConfirmPassword}
              type="password"
              onChange={(e) => { setNewConsultantConfirmPassword(e.target.value) }} />
            <Button
              variant="contained"
              color="primary"
              onClick={registerConsultant}
              style={{ "marginTop": "20px" }}>
              Добавить
          </Button>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h3 className="f-c-c-c">{updateConsultantNotification}</h3>

          <div className="consultants f-r-c-c">
            {renderConsultants()}
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h3 className="f-c-c-c">{callstNotification}</h3>

          <TextField
            label="Поиск"
            value={searchValue}
            style={{ "margin": "10px 0 30px" }}
            onChange={(e) => { setSearchValue(e.target.value) }} />

          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Консультант</StyledTableCell>
                  <StyledTableCell align="left">Имя пользователя</StyledTableCell>
                  <StyledTableCell align="left">Номер телефона</StyledTableCell>
                  <StyledTableCell
                    align="left"
                    onClick={sortByDate}
                    style={{"cursor" : "pointer"}}
                  >
                    Время начала консультации {isSort ? <ArrowDropUpIcon  style={{"position" : "absolute"}}/> : <ArrowDropDownIcon  style={{"position" : "absolute"}}/>}
                  </StyledTableCell>
                  <StyledTableCell align="left">Длительность консультации</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {renderCallsList()}

              </TableBody>
            </Table>
          </TableContainer>

        </TabPanel>
      </div>
    </div>
  );
}

export default AdminProfile;