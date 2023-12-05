import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonRow, IonCol, IonGrid, IonHeader, IonButtons, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import './Login.css';

const LoginPage: React.FC = () => {
  const [groupname, setGroupname] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    const credentials = {
        "GroupName": groupname,
        "UserName": username,
        "Password": password
    };

    const apiAddress = "http://localhost:5180/api/v1/users/log-in";

    const init: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: new Headers([["content-type", "application/json"]]),
        body: JSON.stringify(credentials),
    };

    const response = await fetch(apiAddress, init);
    if (response.ok) {
        //navigate to the group's page
        console.log("sikeres belépés");
    } else if (response.status == 404) {
        setErrorMessage("Ilyen nevű csoport nem létezik!");
        setShowAlert(true);
    } else {
      setErrorMessage("Hibás jelszó vagy felhasználónév!");
      setShowAlert(true);
    }
    
  };

  return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bejelentkezés</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding" scrollY={false}>
        <IonGrid className="login-content">
            <form onSubmit={handleLogin}>
            <div className="login-container">
                <IonRow>
                    <IonCol size="12">
                    <IonInput
                        placeholder="Csoport neve"
                        value={groupname}
                        clearInput={true}
                        onIonInput={(e) => setGroupname(e.detail.value!)}
                        required
                        />
                    </IonCol>
                </IonRow>
            <IonRow>
                <IonCol size="12">
                <IonInput
                    placeholder="Felhasználónév"
                    value={username}
                    clearInput={true}
                    onIonInput={(e) => setUsername(e.detail.value!)}
                    required
                />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="12">
                <IonInput
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    clearInput={true}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    required
                />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="12">
                <IonButton expand="full" type="submit">
                    Belépés
                </IonButton>
                </IonCol>
            </IonRow>
          </div>
          </form>
        </IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Sikertelen bejelentkezés"}
          message={errorMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;



