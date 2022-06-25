// import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import React from "react";
import "./Login.css";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { userActions } from "../actions";
import { Toast } from "primereact/toast";

const userListSelector = (state) => state.user.usersList;

function Login(props) {
  const clientId =
    "434716652166-ppknk86m7bblshij8q1ooejioch6vuo6.apps.googleusercontent.com";
  const { utilizator, onUserChange } = props;


  const [numeUtilizator, setUsername] = useState([]);
  const [parola, setPassword] = useState([]);
  const [existingEmail, setExistingEmail] = useState([]);
  const [existingPassword, setExistingPassword] = useState([]);
  const [correctUser, setCorrectUser] = useState([]);
  const [email, setEmail] = useState([]);
  const history = useHistory();
  const toast = useRef(null);
  const userList = useSelector(userListSelector, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getUsers());
    console.log(userList);
  }, [dispatch]);

  const handleRegister = () => {
    let v = true;
    userList.map((us) => {
      if (us.email === existingEmail) {
        v = false;
        toast.current.show({
          severity: "error",
          summary: "Eroare",
          detail: "Alege alt nume de utilizator!",
          life: 3000,
        });
      }
    });
    if (v === true)
      dispatch(userActions.addUser({ numeUtilizator, parola, email }));
    userList.push({ numeUtilizator, parola, email });
    toast.current.show({
      severity: "success",
      summary: "Succes",
      detail: "Utilizatorul a fost creat!",
      life: 3000,
    });
    setUsername("");
    setPassword("");
    setEmail("");
  };
  const handleLogin = () => {
    setCorrectUser(false);
    if (existingEmail && existingPassword) {
      userList.map((us) => {
        if (us.parola === existingPassword && us.email === existingEmail) {
          setCorrectUser(true);
          onUserChange({ numeUtilizator, parola, email });
        }
      });
      console.log("utilizatorii:");
      console.log(userList);
      if (correctUser === true) {
        history.push("/dashboard");
        setCorrectUser(false);
      } else {
        console.log("Datele de conectare nu se potrivesc!");
        toast.current.show({
          severity: "error",
          summary: "Date gresite",
          detail: "Parola sau email gresite",
          life: 3000,
        });
      }
    }
  };

  const handleEnterWithoutAccount = () => {
    history.push("/frontpage");
  };
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const onLoginSuccess = (res) => {
    console.log(" Autentificare cu succes:", res.profileObj);
    setShowloginButton(false);
    setShowlogoutButton(true);
    history.push("/dashboard");
  };

  const onLoginFailure = (res) => {
    console.log("Autentificarea a esuat:", res);
  };

  const onSignoutSuccess = () => {
    alert("Bine ai venit!");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
  };

  return (
    <div className="root">
      <Toast ref={toast} />
      <link rel="stylesheet" href="Login.css"></link>
      <div className="form" id="loginForm">
        <div className="p-mb-3 p-text-center p-text-capitalize p-text-bold centerText">
          <p className="formTitle">Autentificare</p>
        </div>
        <br />
        <br />
        <div>
          <span className="p-float-label input">
            <InputText
              id="existingEmail"
              value={existingEmail}
              onChange={(e) => setExistingEmail(e.target.value)}
            />
            <label htmlFor="existingEmail" className="input">
              Email
            </label>
          </span>
          <span className="p-float-label input">
            <Password
              value={existingPassword}
              onChange={(e) => setExistingPassword(e.target.value)}
              toggleMask
            />
          </span>
        </div>
        <br />
        <br />
        <div className="centerText">
          <Button
            label="Autentificare"
            className="p-button-outlined centerText"
            onClick={handleLogin}
          />
        </div>

        <div className="externLogin">
          {showloginButton ? (
            <GoogleLogin
              clientId={clientId}
              buttonText="Inregistrare"
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          ) : null}

          {showlogoutButton ? (
            <GoogleLogout
              clientId={clientId}
              buttonText="Deconectare"
              onLogoutSuccess={onSignoutSuccess}
              className="externLogin"
            ></GoogleLogout>
          ) : null}
        </div>
      </div>
      <div className="form">
        <div className="p-mb-3 p-text-center p-text-capitalize p-text-bold centerText">
          <p className="formTitle">Creare cont</p>
        </div>
        <br />
        <br />
        <div>
          <span className="p-float-label input">
            <InputText
              id="Nume utilizator"
              value={numeUtilizator}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="newUsername">Nume de utilizator</label>
          </span>
          <span className="p-float-label input">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          
          </span>

          <span className="p-float-label input">
            <Password
              value={parola}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
            />
          </span>
        </div>
        <br />
        <br />
        <div className="centerText">
          <Button
            label="Inregistrare"
            className="p-button-outlined"
            onClick={handleRegister}
          />
        </div>
        <div className="centerText footer">
          <Button
            label="Continua fara autentificare.."
            className="p-button-outlined"
            onClick={handleEnterWithoutAccount}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
