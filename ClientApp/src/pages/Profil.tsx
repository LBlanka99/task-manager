import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./Profil.css";
import { atOutline, atSharp, constructOutline, constructSharp, giftOutline, giftSharp, pencilOutline, pencilSharp, personCircleOutline, personCircleSharp, textOutline, textSharp, trophyOutline, trophySharp } from "ionicons/icons";
import { User } from "../theme/interfaces";
import { useEffect, useRef, useState } from "react";
import { getContrastColor } from "../theme/colorUtils";

interface ProfilPageProps {
    currentUser: User | undefined;
}

const ProfilPage: React.FC<ProfilPageProps> = ({ currentUser }) => {
    const [user, setUser] = useState(currentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    useEffect(() => {
        setUser(currentUser);
    }, [currentUser])

    const handleRedemption = async () => {
        if (pointsToRedeem > user!.points) {
            setErrorMessage("Sajnos még nincs ennyi pontod!");
            return;
        } else if (pointsToRedeem < 1 || pointsToRedeem % 1 != 0) {
            setErrorMessage("Egy pozitív egész számot adj meg, kérlek!");
            return;
        } else {
            setErrorMessage(undefined);
        }

        const apiAddress = `http://localhost:5180/api/v1/users/${user?.id}/reduce-points`;

        const init: RequestInit = {
            method: "PATCH",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(pointsToRedeem)
        }
        const response = await fetch(apiAddress, init);
        const responseUser = await response.json();
        setUser(responseUser);

        setShowPointsModal(false);
    }

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
                            <IonText>{user.roles.includes("taskCreator") ? "frankó felnőtt" : "lezser lurkó"}</IonText>
                        </IonItem>

                        <IonModal className="modal" isOpen={showPointsModal} backdropDismiss onDidDismiss={() => setShowPointsModal(false)}>
                            <IonContent scrollY={false}>
                                <IonToolbar>
                                    <IonButtons slot="start">
                                        <IonButton color="primary" onClick={() => {
                                            setShowPointsModal(false);
                                            setErrorMessage(undefined);
                                        }}>
                                            Vissza
                                        </IonButton>
                                    </IonButtons>
                                    <IonTitle>Pontbeváltás</IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton color="primary" onClick={() => handleRedemption()}>
                                            Bevált
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                                <IonItem lines="none">
                                    <IonGrid>
                                        <IonCol>
                                            <IonRow>
                                                <h3 className="ion-text-center">Mennyi pontot szeretnél beváltani?</h3>
                                            </IonRow>
                                            <IonRow >
                                                <IonInput
                                                    className="ion-text-center"
                                                    type="number"
                                                    inputmode="numeric"
                                                    aria-label="points"
                                                    min={1}
                                                    max={user.points}
                                                    value={pointsToRedeem}
                                                    onIonInput={(i) => setPointsToRedeem(Number(i.detail.value))}
                                                />
                                            </IonRow>
                                            <IonRow class="ion-text-center">
                                                <IonText style={{ width: "100%" }} color="danger">{errorMessage}</IonText>
                                            </IonRow>
                                        </IonCol>
                                    </IonGrid>


                                </IonItem>

                            </IonContent>
                        </IonModal>

                        <IonGrid style={{ paddingTop: "20px" }}>
                            <IonRow class="ion-justify-content-around">
                                <IonChip color="secondary" style={{ height: "39px" }} onClick={() => setShowPointsModal(true)}>
                                    <IonLabel class="edit-button">Pontbeváltás</IonLabel>
                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={giftOutline} md={giftSharp} />
                                </IonChip>
                                {/*
                                <IonChip color="primary" style={{ height: "39px" }} onClick={() => setIsEditing(true)}>
                                    <IonLabel class="edit-button">Szerkesztés</IonLabel>
                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={pencilOutline} md={pencilSharp} />
                                </IonChip>
                                */}                                
                            </IonRow>
                        </IonGrid>
                    </IonList>
                </IonContent>
            }
        </IonPage>
    );
};

export default ProfilPage;
