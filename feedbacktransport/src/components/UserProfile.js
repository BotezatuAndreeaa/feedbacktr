// import './App.css';
import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import "./UserProfile.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { userActions } from "../actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

const userListSelector = (state) => state.user.usersList;

function UserProfile(props) {
  const utilizator = props;
  const [userEmail, setUserEmail] = useState(utilizator.email);
  const [userUsername, setUserUsername] = useState(utilizator.numeUtilizator);
  const [userPassword, setUserPassword] = useState(utilizator.parolad);
  const dispatch = useDispatch();

  const history = useHistory();
  useEffect(() => {
    setUserEmail(utilizator.email);
    setUserUsername(utilizator.numeUtilizator);
    setUserPassword(utilizator.password);
    console.log(userUsername);
  }, [dispatch]);

  const updateUser = () => {
    console.clear();
  };
  const deleteUser = () => {
    console.clear();
  };
  const goBack = () => {
    console.clear();
    history.push("/dashboard");
  };

  return (
    <>
      <Button
        label="Go back to dashboard"
        className="p-button-outlined back"
        onClick={goBack}
      />
      <p className="title">Profilul tau</p>
      <div className="lablesDiv">
        <span className="p-float-label input">
          <p className="labels">Nume utilizator</p>
          <InputText
            value={userUsername.user}
            onChange={(e) => setUserUsername(e.target.value)}
            placeholder={userUsername.numeUtilizator}
          />
        </span>

        <span className="p-float-label input">
          <p className="labels">Email</p>
          <InputText
            value={userUsername.email}
            onChange={(e) => setUserUsername(e.target.value)}
            placeholder={userUsername.numeUtilizator}
          />
        </span>

        <span className="p-float-label input">
          <p className="labels"> Parola</p>
          <InputText
            value={userUsername.parola}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder={userUsername.password}
          />
        </span>
      </div>
      <div className="button footer">
        <Button
          label="Update your profile"
          className="p-button-outlined"
          onClick={updateUser}
        />
        <Button
          label="Delete your account"
          className="p-button-outlined"
          onClick={deleteUser}
        />
      </div>
    </>
  );
}

export default UserProfile;
