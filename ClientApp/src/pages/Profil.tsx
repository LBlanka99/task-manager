import { IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./Profil.css";
import { atOutline, atSharp, constructOutline, constructSharp, personCircleOutline, personCircleSharp, textOutline, textSharp, trophyOutline, trophySharp } from "ionicons/icons";
import { User } from "../theme/interfaces";

interface ProfilPageProps {
    user: User | undefined;
}

const ProfilPage: React.FC<ProfilPageProps> = ({ user }) => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Profilom</IonTitle>
                </IonToolbar>
            </IonHeader>

            {user &&
                <IonContent class="ion-padding" color="light">
                    <IonList inset style={{ margin: "auto", maxWidth: "500px", paddingTop: "10px", paddingBottom: "5px" }}>
                        <IonItem>
                            <IonIcon ios={personCircleOutline} md={personCircleSharp} slot="start" color="primary" />
                            <IonLabel color="primary">Felhasználónév</IonLabel>
                            <IonText>{user.userName}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonIcon ios={atOutline} md={atSharp} slot="start" color="primary" />
                            <IonLabel color="primary">E-mail</IonLabel>
                            <IonText>{user.email}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonIcon ios={trophyOutline} md={trophySharp} slot="start" color="primary" />
                            <IonLabel color="primary">Pontjaim</IonLabel>
                            <IonText>{user.points}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonIcon ios={constructOutline} md={constructSharp} slot="start" color="primary" />
                            <IonLabel color="primary">Szerepkör</IonLabel>
                            <IonText>{user.roles.includes("taskCreator") ? "felelős felnőtt" : "lelkes lurkó"}</IonText>
                        </IonItem>
                    </IonList>
                </IonContent>
            }
        </IonPage>
    );
};

export default ProfilPage;
