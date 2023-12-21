import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonLabel, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./NewGroup.css";
import { useState } from "react";
import { baseUrl } from "../theme/variables";

const NewGroupPage: React.FC = () => {
    const [groupname, setGroupname] = useState("");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function createNewGroup(e: any) {
        e.preventDefault();

        if (password != passwordAgain) {
            setErrorMessage("A megadott jelszavak nem egyeznek!");
            setShowAlert(true);
            return;
        }

        const credentials = {
            "GroupName": groupname,
            "UserName": username,
            "Password": password
        };

        const apiAddress = `${baseUrl}groups`;

        const init: RequestInit = {
            method: "POST",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(credentials),
        };

        const response = await fetch(apiAddress, init);
        if (response.ok) {
            //navigate to the login page
            console.log("sikeres létrehozás");
        } else if (response.status == 400) {
            setErrorMessage("Ez a csoport név már foglalt! Kérlek, válassz egy másikat!");
            setShowAlert(true);
        } else {
            setErrorMessage("Ismeretlen hiba lépett fel.");
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
                    <IonTitle>Új csoport létrehozása</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" scrollY={false} fullscreen>
                <IonGrid className="page-container">
                    <IonRow className="information-container">
                        <IonCol>
                            <IonText className="information">
                                <p>Itt tudsz új csoportot létrehozni.</p>
                                <p>Te leszel az újonnan létrehozott csoport adminja.</p>
                                <p>Ehhez meg kell adnod egy felhasználónevet és egy jelszót, amivel később be tudsz majd lépni a csoportba.</p>
                            </IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow className="signup-container">
                        <IonCol size="12">
                            <form onSubmit={createNewGroup}>
                                <IonInput
                                    placeholder="Csoport neve"
                                    value={groupname}
                                    clearInput={true}
                                    onIonInput={(e) => setGroupname(e.detail.value!)}
                                    required
                                />
                                <IonInput
                                    placeholder="Felhasználónév"
                                    value={username}
                                    clearInput={true}
                                    onIonInput={(e) => setUsername(e.detail.value!)}
                                    required
                                />
                                <IonInput
                                    type="password"
                                    placeholder="Jelszó"
                                    value={password}
                                    clearInput={true}
                                    onIonInput={(e) => setPassword(e.detail.value!)}
                                    required
                                />
                                <IonInput
                                    type="password"
                                    placeholder="Jelszó újra"
                                    value={passwordAgain}
                                    clearInput={true}
                                    onIonInput={(e) => setPasswordAgain(e.detail.value!)}
                                    required
                                />
                                <IonButton expand="full" type="submit">
                                    Csoport létrehozása
                                </IonButton>
                            </form>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={"Sikertelen csoportlétrehozás"}
                    message={errorMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default NewGroupPage;